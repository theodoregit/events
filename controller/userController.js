const { validationResult, matchedData } = require('express-validator');
const User = require('../model/User');
const Event = require('../model/Event');
const upload = require("../middleware/upload");

//home
exports.home = function(req, res){
    // res.render('user-dashboard')

    // Check admin authorization and render admin_dashboard
    if(req.session.user.role == 'admin'){
        console.log('This is admin');
      
        let user = new User(req.body)

        user.counter().then((count)=>{
            res.render('admin-dashboard', {
                title: 'Admin dashboard Page',
                fullname: req.session.user.fullname,
                phoneNumber: req.session.user.phoneNumber,
                role: req.session.user.role,
                count: count,
            })
        }).catch((error)=>{
            res.render('404')
        })
        
        
    }else if(req.session.user.role == 'organizer'){
        // Check user authorization and render user home page
        console.log('This is organizer ' + req.session.user.fullname);

        let event = new Event(req.body)
        let name = req.session.user.fullname;
        event.countEventForOrganizer(name).then((count)=>{
            res.render('organizer-dashboard', {
                title: 'organizer dashboard Page',
                fullname: req.session.user.fullname,
                // organizerName: req.session.user.organizerName,
                email:req.session.user.email,
                phoneNumber: req.session.user.phoneNumber,
                role: req.session.user.role,
                count: count
            })
        })
        .catch((error)=>{
                res.render(error)
        })  
    }else if(req.session.user.role == 'user'){
        // Check user authorization and render user home page
        console.log('This is user');

        let event = new Event(req.body)
        event.readUpcomingEvents().then((upcomingEventList)=>{
            res.render('user-dashboard', {
                title: 'User dashboard Page',
                fullname: req.session.user.fullname,
                phoneNumber: req.session.user.phoneNumber,
                email: req.session.user.email,
                role: req.session.user.role,
                upcomingEventList: upcomingEventList
            }) 
            // console.log(upcomingEventList)
        }).catch((error)=>{
            res.render('404')
        })
    }else{ 
        // if user not authorized as admin, user end request and send response
        var message = 'You are not authorized. Access prohibited';
        // console.log(message)
        res.status(400).redirect('/400badRequest?message='+message);
    }
}

//user register 
exports.displayRegisterPage = function(req, res){
    res.render('register')
}
exports.register = async(req, res)=>{
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        var errMsg= errors.mapped();
        var inputData = matchedData(req); 
        console.log(errMsg)
        console.log(inputData)
        res.render('register', {errors:errMsg, inputData:inputData});
    }else{
        var inputData = matchedData(req);  
        console.log(matchedData)
        // insert to the database
        let user = new User(req.body)
        await user.register().then(()=>{
            console.log("user added")
            // req.session.user = {phoneNumber: user.data.username}    
            req.session.save(function(){
                console.log("going to login page")
                res.redirect('/login')
            
            })
        }).catch((e)=>{
            req.flash('regErrors', e)
            req.session.save(function(){
                // res.send("error")
                res.redirect('/register')
            })
        })
    }
    
}

//login
exports.displayLoginPage = function(req, res){
    res.render('login', {
        errors: req.flash('errors'),
        event_id: 0,
    })//this will display the page 
}
exports.login = async(req, res)=>{
    let user = new User(req.body);
    // console.log(user)
    await user.login().then(function(result){
        // console.log(user.data.email)
        req.session.user = {
            title: "login session",
            id: user.data.ID,
            fullname: user.data.FullName,
            email: user.data.Email,
            phoneNumber: user.data.PhoneNumber,
            role:user.data.Role,
        }
        req.session.save(function(){
            let event_id = req.body.event_id;
            if(event_id != 0){
                res.redirect(`/event/${event_id}`);
                console.log("going to home page =>")
            }else{
                res.redirect('/');
                console.log("going to home page =>")
            }
        })
    }).catch(function(e){
        req.flash('errors', e);
        req.session.save(function(){
            res.redirect('/login');
            console.log("login page")
        });
    });
}

//LOGOUT
exports.logout = function(req, res){
    req.session.destroy(function(){
        res.redirect('/')
    })
}

//forgot password
exports.forgotPasswordPage = function(req, res){
    res.render('forgot-password');
}

exports.forgotPassword = function(req, res){
    let user = new User(req.body);
    user.forgotPassword().then((result) =>{
        res.render('link-sent-page');

    }).catch((e) =>{
        res.send(e);
    })

    
}

//Organizer registration 
exports.viewRegisterOrganizer = function(req, res){
    res.render('register-organizer',  {
        title: 'User dashboard Page',
        fullname: req.session.user.fullname,
        phoneNumber: req.session.user.phoneNumber,
        role: req.session.user.role,
        regErrors: req.flash('regErrors')
    })
} 
exports.registerOrganizerBasicInfo = function(req, res){
    let user = new User(req.body)
    user.organizerRegistration().then((organizerName)=>{
        req.flash("success", "Organizer Successfully Registered")
        req.session.save(function(){
            res.render('register_details_of_organizers', {
                title: 'registration detail',
                fullname: req.session.user.fullname,
                phoneNumber: req.session.user.phoneNumber,
                role: req.session.user.role,
                organizerName: organizerName,
                regErrors: req.flash('regErrors'),
            })
            console.log("organizer successfully added")
        })
    }).catch((error)=>{
        // req.flash('regErrors', e)
        // req.session.save(function(){
            // res.send("error")
        res.redirect('register-organizer')
        // })
    })
} 

exports.registerOrganizerDetailInfo = async(req, res)=>{
    try {
        await upload(req, res); 
        console.log(req.files);
    
        if (req.files.length <= 0) {
          return res
            .status(400)
            .send({ message: "You must select at least 1 file." });

        }else{
            let user = new User(req.body, req.files)
            user.organizerRegistrationDetail().then(()=>{
                req.flash("success", "Organizer Successfully Registered")
                req.session.save(function(){
                    res.redirect('/')
                    // res.redirect('/register-organizer-detail')
                    console.log("organizer successfully added")
                })
            }).catch((error)=>{
                // req.flash('regErrors', e)
                // req.session.save(function(){
                    // res.send("error")
                res.redirect('register-organizer')
                // })
            })

        }

    } catch (error) {
        console.log(error);
    
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).send({
            message: "Too many files to upload.",
          });
        }
        return res.status(500).send({
          message: `Error when trying upload many files: ${error}`,
        });

    }
}  

// read ll organizers
exports.readAllOrganizers = function(req, res){
    let user = new User(req.body)
    user.readOrganizers().then((organizersList)=>{
        res.render('all-organizers',  {
            title: 'All Organizers Page',
            fullname: req.session.user.fullname,
            // organizerName: req.session.user.organizerName,
            phoneNumber: req.session.user.phoneNumber,
            role: req.session.user.role,
            organizersList: organizersList,
        })
        // console.log(organizersList)
    }).catch((error)=>{
        res.send(error)
    }) 
}

//delete organizer
exports.delete = function(req, res){
    let user = new User(req.body)
    user.deleteOrganizer(req.params.id).then(()=> {
        req.flash("success", "Event successfully deleted")
        req.session.save(()=>res.redirect('/all-events'))
    }).catch(()=>{
        req.flash("failure", "Failed to Delete")
        req.session.save(()=>res.redirect("/all-events"))
    }) 
} 


//user dashboad my account 
exports.myAccount = function(req, res){
    let user =  new User(req.body)
    user.userInfo(req.session.user.phoneNumber).then((user)=>{
        res.render('my_account', {
            title: 'my account Page',
            fullname: req.session.user.fullname,
            // organizerName: req.session.user.organizerName,
            phoneNumber: req.session.user.phoneNumber,
            role: req.session.user.role,
            user:user
        }) 
    }).catch((error)=>{
        res.render('404')
    })
  
}

//organizer Profile
exports.organizerProfile = function(req, res){
    let user =  new User(req.body)
    user.organizerInfo(req.params.id).then((organizerDetail)=>{
        res.render('organizer_profile', {
            title: 'Organizer Profile',
            fullname: req.session.user.fullname,
            // organizerName: req.session.user.organizerName,
            phoneNumber: req.session.user.phoneNumber,
            role: req.session.user.role,
            organizerDetail:organizerDetail
        })
    }).catch((error)=>{
        res.render('404')
    })
  
}


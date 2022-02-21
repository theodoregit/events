const Event = require('../model/Event')
const User = require('../model/User')
const upload = require("../middleware/upload");

//display add-event page
exports.viewAddEventPage = function(req, res){
    let user = new User(req.body)
    user.readOrganizers().then((organizersList)=>{
            res.render('add-event', {
            title: 'Add event Page',
            fullname: req.session.user.fullname,
            // organizerName: req.session.user.organizerName,
            phoneNumber: req.session.user.phoneNumber,
            role: req.session.user.role,
            organizersList: organizersList,
        })
    }).catch((error)=>{
        res.render('404')
    })
}
//create an event 
exports.addEventDetail = async (req, res)=>{
    try {
        await upload(req, res); 
        // console.log(req.files);
    
        if (req.files.length <= 0) {
          return res
            .status(400)
            .send({ message: "You must select at least 1 file." });

        }else{
            let event = new Event(req.body, req.files)
            event.createEvent().then((status)=>{
                if(status){
                     req.flash("success", "Event Successfully Added")
                    req.session.save(function(){
                        res.redirect('/')
                        // console.log("event successfully added")
                    })
                }
                
            }).catch((e)=>{
                // req.flash('regErrors', e)
                // req.session.save(function(){
                    // res.send("error")
                    res.redirect('/add-event') 
                    // console.log("event is not added")
                // })
            })

        }

    } catch (error) {
        // console.log(error);
    
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

//read all events- module. only admin can do that
exports.readAllEvents = function(req, res){
    let event = new Event(req.body)
    event.readEvent().then((eventList)=>{
       
        res.render('all-events',  { 
            title: 'All Events Page',
            fullname: req.session.user.fullname,
            // organizerName: req.session.user.organizerName,
            phoneNumber: req.session.user.phoneNumber,
            role: req.session.user.role,
            eventsList: eventList
        }) 
        
    }).catch((error)=>{
        res.send(error)
    })
}

//read all event of specific organizer
exports.readAllEventsOfOrganizer = function(req, res){
    let event = new Event(req.body)
    event.readOrganizerEvent(req.session.user.fullname).then((eventList)=>{

        res.render('all-events', {
            title: 'All Events of Organizer Page',
            fullname: req.session.user.fullname, 
            // organizerName: req.session.user.organizerName,
            email: req.session.user.email,
            phoneNumber: req.session.user.phoneNumber,
            role: req.session.user.role,
            eventsList: eventList
        })
    }).catch((error)=>{
        res.send(error)
    })
}

//read upcoming events 
exports.upcomingEvents = function(req, res){
    let event = new Event(req.body)
    event.readUpcomingEvents().then((upcomingEventList)=>{
        if(req.session.user){
            res.render('upcomingEvents', {
                title: 'Upcoming Event Page',
                fullname: req.session.user.fullname,
                // organizerName: req.session.user.organizerName,
                email: req.session.user.Email,
                phoneNumber: req.session.user.phoneNumber,
                role: req.session.user.role,
                upcomingEventList: upcomingEventList
            })
        }else{
            res.render('upcomingEvents', {
                title: 'Upcoming Event Page',
                upcomingEventList: upcomingEventList
            })
        } 
    })
}

//read single event
exports.readSingleEvent = async(req, res)=>{
    let event = new Event(req.body)
    await event.readSingleById(req.params.id).then((eventDetail)=>{
    //    console.log(eventDetail)
        // let allImages = eventDetail.images
        // let imageArr = allImages.split(',')
        if(req.session.user){
            res.render('singleEvent', { 
                title: 'Single Event Page',
                fullname: req.session.user.fullname,
                // organizerName: req.session.user.organizerName,
                phoneNumber: req.session.user.phoneNumber,
                role: req.session.user.role,
                eventDetail: eventDetail,
            
            }) 
        }else{
            res.render('singleEvent', { 
                title: 'Single Event Page',
                eventDetail: eventDetail
            })
        }
        // console.log(eventDetail)
    })
    
}
 
//read active events for admin
exports.activeEventsforAdmin = function(req, res){
    let event = new Event(req.body)
    event.readUpcomingEvents().then((activeEvents)=>{
        res.render('active-events', {
            title: 'Active events',
            fullname: req.session.user.fullname,
            // organizerName: req.session.user.organizerName,
            email: req.session.user.email,
            phoneNumber: req.session.user.phoneNumber,
            role: req.session.user.role,
            activeEvents: activeEvents
        })
        // console.log(activeEvents)
    }).catch((error)=>{
        res.render("404")
    })
}

//read active events for organizer
exports.activeEventsforOrg = function(req, res){
    let event = new Event(req.body)
    event.readActiveEvents(req.session.user.fullname).then((activeEvents)=>{
        res.render('active-events', {
            title: 'Active events',
            fullname: req.session.user.fullname,
            // organizerName: req.session.user.organizerName,
            email: req.session.user.email,
            phoneNumber: req.session.user.phoneNumber,
            role: req.session.user.role,
            activeEvents: activeEvents
        })
        // console.log("Active envet list " + activeEvents)
    }).catch((error)=>{
        res.send(error)
    }) 
}

//edit event
exports.viewEditScreen = async function(req, res){
    try{   
        let event = new Event(req.body)
         event.readSingleById(req.params.id).then((eventData)=>{
            res.render('edit-event', {
                fullname: req.session.user.fullname,
                // organizerName: req.session.user.organizerName,
                phoneNumber: req.session.user.phoneNumber,
                role: req.session.user.role,
                eventData : eventData, 
            })
            // console.log(eventData)
         }).catch((errors)=>{
              req.flash(errors, "No event found")
            req.session.save(()=> res.redirect("/all-events"))
         })
        // console.log(event)
         
    }catch{
        res.render('404')
    } 
}


//update an event 
exports.edit = async(req, res)=>{
    try {
        await upload(req, res); 
        // console.log(req.files);
    
        if (req.files.length <= 0) {
          return res
            .status(400) 
            .send({ message: "You must select at least 1 file." });

        }else{
            let event = new Event(req.body, req.files)
            event.update(req.params.id).then((status)=>{
                //the event was successfully updated in the databse 
                //or user did have permission, but there were validation errors
                if(status == "success"){
                    //post was updated in db
                    req.flash("success", "Event Successfully updated")
                    req.session.save(function(){
                        res.redirect('/') 
                    })
                }else{
                    post.errors.forEach(function(error){
                        req.flash("errors", error)
                    }) 
                    req.session.save(function(){
                        res.redirect(`/event/${req.params.id}/edit`)
                    })
                }
            }).catch(()=>{ 
                // if the requested id doesn't exit
                //or if the current visitor is not th owner of the requested post
                req.flash("errors", "You do not have permission to perform this action")
                res.redirect("/")
            })    
        }
    } catch (error) {
        // console.log(error);
    
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

//delete
exports.delete = function(req, res){
    let event = new Event(req.body)
    event.deleteEvent(req.params.id).then(()=> {
        req.flash("success", "Event successfully deleted")
        req.session.save(()=>res.redirect('/all-events'))
    }).catch(()=>{
        req.flash("failure", "Failed to Delete")
        req.session.save(()=>res.redirect("/all-events"))
    }) 
} 
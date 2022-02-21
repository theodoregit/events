const Event = require('../model/Event')

// Authorizations
// Redirect GET requests from not authenticated users to login
exports.redirectLogin = (req, res, next) => {
  if(!req.session.user) {
      let event = new Event(req.body)
      event.readUpcomingEvents().then((upcomingEventList)=>{
          res.render('user-dashboard', {upcomingEventList: upcomingEventList})
      }).catch((error)=>{
          res.send(error)
      })
  } else {
      next()

  }
}

// force user to login
exports.mustLogin = (req, res, next) => {
  if (!req.session.user) {
    const event_id = req.body.id;
    if(event_id.length != 0){
      res.render('login', {event_id: event_id})

    }else{
      res.render('login')

    }

  } else {
      next()

  }
  
}

// Authorize requests only for not authenticated users
exports.verifyAnonym = (req, res, next) => {
    if (!req.session.user) {
      next()
  
    } else {
      var message = 'You are already logged-in. You are not authorized to perform this request !';
      console.log(message)
      res.status(400).redirect('/400badRequest?message='+message);
  
    }
}

// Authorize requests only for anonym and admin users
exports.verifyAnonymAndAdmin = (req, res, next) => {
    if (!req.session.user) {
      next()
  
    } else {
  
      if (req.session.user.role == 'admin') {
        next()
  
      } else {
        var message = 'You are no Admin. You are not authorized to perform this request !';
        console.log(message)
        res.status(400).redirect('/400badRequest?message='+message);
  
      }
  
    }
}

//usercase ==> for update email and password for both Organizer and admin
// Authorize requests only for admin and Organizer 
exports.verifyAdminAndOrganizer = (req, res, next) => {
    if (req.session.user) {
      if (req.session.user.role == 'admin') {
        next()
  
      } else if (req.session.user.role == 'organizer') {
        next()
  
      } else {
        var message = 'You are no Admin, no loged in user. You are not authorized to perform this request !';
        res.status(400).redirect('/400badRequest?message='+message);
      }
  
    } else {
      var message = 'You are not logged-in. You are not authorized to perform this request !';
      res.status(400).redirect('/400badRequest?message='+message);
    }
}

//Authorize request only for admin
exports.verifyAdmin = (req, res, next)=>{
  if(req.session.user){

    if(req.session.user.role == "admin"){
      next()
      
    }else{
      var message = 'You are no admin, You are not authorized to perform this action'
      res.status(400).render("400badRequest?message=" + message)
    }

  }else{
    var message = 'You are not logged-in. You are not authorized to perform this  request !'
    res.status(400).render("400badRequest?message=" + message)
  }
}

//Authorize request only for Organizer
exports.verifyOrganizer = (req, res, next)=>{
  if(req.session.user){

    if(req.session.user.role == "organizer"){
      next()
      
    }else{
      var message = 'You are no organizer, You are not authorized to perform this action'
      res.status(400).render("400badRequest?message=" + message)
    }

  }else{
    var message = 'You are not logged-in. You are not authorized to perform this  request !'
    res.status(400).render("400badRequest?message=" + message)
  }
}

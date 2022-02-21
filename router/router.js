const express = require('express');
const router = express.Router()
const userController = require('../controller/userController')
const middlewares = require('../middleware/userMiddleware')
const eventController = require('../controller/eventController')
const bookingController = require('../controller/bookingController')
const otherController = require('../controller/otherController')
const validationRule= require('../middleware/validationRule');


//@user related routes
router
    .route('/')
    .get(middlewares.redirectLogin, userController.home);   
router
    .route('/register')
    .get(userController.displayRegisterPage)
    .post( middlewares.verifyAnonymAndAdmin, validationRule.form, userController.register)
router
    .route('/login')
    .get(userController.displayLoginPage)
    .post( middlewares.verifyAnonym, userController.login)
router.
    route('/logout')
    .post(userController.logout);

router
    .route('/forgot-password')
    .get(userController.forgotPasswordPage)
    .post(userController.forgotPassword)

router
    .route('/register-organizer')
    .get(middlewares.verifyAdmin, userController.viewRegisterOrganizer)
    .post(middlewares.verifyAdmin, userController.registerOrganizerBasicInfo)

router
    .route('/register-organizer-detail')
    .post(middlewares.verifyAdmin, userController.registerOrganizerDetailInfo)

router
    .route('/all-organizers')
    .get(middlewares.verifyAdmin, userController.readAllOrganizers)

router 
    .route('/my-account')
    .get(middlewares.redirectLogin, userController.myAccount)
    
router
    .route('/organizer-profile/:id')
    .get(middlewares.verifyAdmin, userController.organizerProfile)


//@event realated routs
router
    .route('/add-event')
    .get(middlewares.verifyAdminAndOrganizer, eventController.viewAddEventPage)
    .post(middlewares.verifyAdminAndOrganizer, eventController.addEventDetail)

router
    .route('/all-events')
    .get(middlewares.verifyAdmin, eventController.readAllEvents)

router
    .route('/all-organizer-events')
    .get(middlewares.verifyAdminAndOrganizer, eventController.readAllEventsOfOrganizer)

router
    .route('/upcoming-Event')
    .get(eventController.upcomingEvents);

router
    .route('/event/:id')
    .get(eventController.readSingleEvent)

router
    .route('/event/:id/edit')
    .get(middlewares.verifyAdminAndOrganizer, eventController.viewEditScreen)
    .post(middlewares.verifyAdminAndOrganizer, eventController.edit)

router
    .route('/event/:id/delete')
    .get(middlewares.verifyAdminAndOrganizer, eventController.delete)

router
    .route('/active-events')
    .get(middlewares.verifyAdminAndOrganizer, eventController.activeEventsforAdmin);

router
    .route('/active-events-organizer')
    .get(middlewares.verifyAdminAndOrganizer, eventController.activeEventsforOrg);

//@BOOKING RELATED ROUTES
router
    .route('/call-bookEvent')
    .post(middlewares.mustLogin, bookingController.callBookingEvent)

router   
    .route('/book-event')
    .post(middlewares.mustLogin, bookingController.bookEvent)
 
router
    .route('/all-bookings')
    .get(middlewares.verifyAdminAndOrganizer, bookingController.readBooking)

router
    .route('/my-booking')
    .get(middlewares.mustLogin, bookingController.myBooking)

router
    .route('/payment-options')
    .post(bookingController.displayPaymentOptions)



//@Other ROUTES
// contact page 

router
    .route('/contact-us')
    .get(otherController.viewContactUsPage)


module.exports = router 
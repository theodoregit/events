const User = require('../model/User')
const Event = require('../model/Event')
const Booking = require("../model/Booking")


exports.callBookingEvent = async (req, res)=>{
    const event_id = req.body.id
    const quantity = req.body.quantity
    let booking = new Booking(req.body)
    // const booked =
     await booking.checkBooking(req.session.user.id, event_id, quantity).then(async(quantity)=>{
        let event = new Event(req.body)
        // console.log("selected event id " + event_id)
        // console.log(" user id " + req.session.user.id)
        const result = await event.readSingleById(event_id)
        // console.log(result)
        if(result){
            res.render('book-event',{ 
                title: 'Book Event Pags',
                fullname: req.session.user.fullname,
                // organizerName: req.session.user.organizerName,
                phoneNumber: req.session.user.phoneNumber,
                email: req.session.user.email,
                role: req.session.user.role,
                eventDetail: result,
                quantity:quantity
            })
            // console.log("selected event"+eventDetail)
        }else{
            res.render('404', {error})

        }
    }).catch((err)=>{
        req.flash("errors", "This Event has already been booked, is rejected or is already in the past. Booking not possible")
        req.session.save(()=>res.redirect(`/event/${event_id}`))
    })
} 
//payment options
exports.displayPaymentOptions = async(req, res)=>{
    const event_id = req.body.id
    const quantity = req.body.quantity
    let booking = new Booking(req.body)
    await booking.checkBooking(req.session.user.id, event_id, quantity).then(async(quantity)=>{
        let event = new Event(req.body)
        // console.log("selected event id " + event_id)
        // console.log(" user id " + req.session.user.id)
        const result = await event.readSingleById(event_id)
        // console.log(result)
        if(result){
            res.render('payment-options',{ 
                title: 'payment options Pags',
                fullname: req.session.user.fullname,
                // organizerName: req.session.user.organizerName,
                phoneNumber: req.session.user.phoneNumber,
                email: req.session.user.email,
                role: req.session.user.role,
                eventDetail: result,
                quantity:quantity
            })
            // console.log("selected event"+eventDetail)
        }else{
            res.render('404', {error})

        }
    }).catch((err)=>{
        req.flash("errors", "This Event has already been booked, is rejected or is already in the past. Booking not possible")
        req.session.save(()=>res.redirect(`/event/${event_id}`))
    })
}
//book an event 
exports.bookEvent = function(req, res, next){
    const event_id = req.body.id
    const quantity = req.body.quantity
    const paymentMethod = req.body.formOfPayment
    let booking = new Booking(req.body);

    booking.bookAnEvent(req.session.user.id, event_id, quantity, paymentMethod).then((message)=>{

        // res.status(200).render('200success' + message);
        res.status(200).send(message);
    }).catch((message)=>{
        res.status(400).redirect('/400badRequest?message=' + message)
    })   
} 

//read all booked events
exports.readBooking = function(req, res, next){
    let booking = new Booking(req.body)
    booking.readAllBooking(req.session.user.fullname, req.session.user.role).then((bookingList)=>{

        res.render('all-booking', {  
            title: 'All Booking Page',
            fullname: req.session.user.fullname,
            // organizerName: req.session.user.organizerName,
            email: req.session.user.email,
            phoneNumber: req.session.user.phoneNumber,
            role: req.session.user.role,
            bookingList: bookingList
        })
    }).catch((error)=>{
        res.send(error)
    })
}

//booking profile
exports.myBooking = function(req, res){
    let booking = new Booking(req.body)
    booking.readMyBooking(req.session.user.phoneNumber).then((bookingList)=>{
        res.render('my-booking',{
            fullname: req.session.user.fullname,
            // organizerName: req.session.user.organizerName,
            email: req.session.user.email,
            phoneNumber: req.session.user.phoneNumber,
            role: req.session.user.role,
            bookingList: bookingList
        })
    }).catch(()=>{

    })

}


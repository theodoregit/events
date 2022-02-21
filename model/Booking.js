const db = require('../config/db')
const Event = require("../model/Event")
const User = require("../model/User")
const sanitizeHTML = require('sanitize-html');


let Booking = function(data){
    this.data = data
    this.errors= []
}

//cleanup 

Booking.prototype.cleanup = function(){

}


//validation
Event.prototype.validation = function(){
    
}

Booking.prototype.checkBooking = function(user_id, event_id, quantity){
    return new Promise((resolve, reject)=>{
        // cleanup
        if(typeof(user_id) != "number"){user_id = ""}
        if(typeof(event_id) != "string"){event_id = ""}
        if(typeof(quantity) != "string"){quantity = ""}
        user_id = sanitizeHTML(user_id, {allowedTags: [], allowedAttributes: {}})
        event_id = sanitizeHTML(event_id, {allowedTags: [], allowedAttributes: {}})
        quantity = sanitizeHTML(this.data.quantity, {allowedTags: [], allowedAttributes: {}})
        // console.log(user_id)
        // console.log(event_id)
        console.log("quantity = "+ quantity)

        let sql = `SELECT * FROM booking WHERE user_id = ? AND event_id = ? `
        db.query(sql,[user_id, event_id], (err, result)=>{
            if(result.length != 0 ){
                // throw err
                reject()
            }else{
                // console.log("i am here")
                resolve(quantity) 
            }         
        })
    })
}

//Book event 
Booking.prototype.bookAnEvent = function(user_id, event_id, quantity, paymentMethod){
    return new Promise(async(resolve, reject)=>{
        //cleanup 
        if(typeof(user_id) != "number"){user_id = ""}
        if(typeof(event_id) != "string"){event_id = ""}
        if(typeof(quantity) != "string"){quantity = ""}
        if(typeof(paymentMethod) != "string"){paymentMethod = ""}
       this.user_id = sanitizeHTML(user_id, {allowedTags: [], allowedAttributes: {}})
        this.event_id = sanitizeHTML(event_id, {allowedTags: [], allowedAttributes: {}})
        this.quantity = sanitizeHTML(quantity, {allowedTags: [], allowedAttributes: {}})
        this.quantity = parseInt(quantity)
        this.paymentMethod = sanitizeHTML(paymentMethod, {allowedTags: [], allowedAttributes: {}})

        const payment = "pending";

        console.log("user id = " + this.user_id)
        console.log("event id = " + this.event_id)
        console.log("quantity = " + this.quantity)
        console.log("payment method = " + this.paymentMethod)

        // formating current date in dd-mm-yyyy     
        let d = new Date();
        let dd = d.getDate();
        let mm = d.getMonth() + 1;
        let yyyy = d.getFullYear();
        let createdDate = `${dd}-${mm}-${yyyy}`; 

        // check payment options

        
        if(!this.errors.length && this.user_id != 0 && this.event_id != 0 && this.quantity > 0){
            //insert the necessary data to databse 
            let sql = `INSERT INTO booking(
                user_id,
                event_id,
                quantity,
                paymentMethod,
                payment,
                createdDate
            )VALUES(?,?,?,?,?,?)` 
            db.query(sql, [this.user_id, this.event_id, this.quantity, this.paymentMethod, payment, createdDate], (err, result)=>{  
                if(err){
                    throw err;
                    // reject();
                }else{
                    //update user balance
                    // console.log("user id no "+ user_id)
                    let userQuery = `SELECT * FROM users WHERE ID = ?`;
                    db.query(userQuery,[this.user_id], (err, [user,_])=>{
                        if(err){
                            // throw err
                            var message = 'user not found';
                            reject(message)
                        }else{  
                            let eventQuery = `SELECT * FROM events WHERE id = ?`
                            db.query(eventQuery, [this.event_id], (err, [event, _])=>{
                                if(err){
                                    // throw err
                                    reject();
                                }else{
                                    // console.log("user and event")
                                    // console.log(user)
                                    // console.log(event) 
                                    var balaceFloat = parseFloat(user.Balance)
                                    var priceFloat = parseFloat(event.eventPrice)  * this.quantity;
                                    var newBalanceFloat = balaceFloat + priceFloat;
                                    var newBalance = newBalanceFloat.toFixed(2)

                                    console.log("new balance = "+ newBalance)
                                    let updateQuery = `UPDATE users SET balance = ? WHERE PhoneNumber = ?`;
                                    db.query(updateQuery, [newBalance, user.PhoneNumber], (err, result)=>{
                                        if(err){
                                            // throw err;
                                            var message = 'validation error';
                                            reject(message)
                                        }else{
                                            var message = 'Event successfully booked';
                                            resolve(message)
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })

        }else{
            reject(this.errors)
        }
        
    })
}

//read all booking
Booking.prototype.readAllBooking = function(organizer, role){
    return new Promise((resolve, reject)=>{
        // this.cleanup() 
        // this.validation()
        if(role == "admin"){
            let sql = `SELECT b.payment, b.createdDate, e.eventName, e.organizer, e.eventPrice, u.FullName
            FROM booking AS b
            JOIN events e ON b.event_id = e.id
            JOIN users u ON b.user_id = u.ID
            GROUP BY b.id`
            db.query(sql, (err, result)=>{
                if(err){
                    // throw err
                    reject("Error occurred while loading ")
                }else{
                    resolve(result)
                }
            })
        }else{
            let sql = `SELECT b.quantity, b.payment, b.createdDate, e.eventName, e.organizer, e.eventPrice, u.FullName
            FROM booking AS b
            JOIN events e ON b.event_id = e.id
            JOIN users u ON b.user_id = u.ID
            WHERE e.organizer = ?
            GROUP BY b.id` 
            db.query(sql,[organizer], (err, result)=>{
                if(err){
                    throw err
                    // reject("Error occurred while loading ")
                }else{ 
                    console.log(result)
                    resolve(result)
                }
            })
        }
    }) 
}

Booking.prototype.readMyBooking = function (phoneNumber){
    return new Promise((resolve, reject)=>{ 

        let sql = `SELECT b.quantity, b.payment, e.id, e.eventName, e.eventPrice, e.thumbnail
        FROM booking AS b
        JOIN users AS u ON b.user_id = u.ID
        JOIN events AS e ON b.event_id = e.id
        WHERE u.PhoneNumber = ?
        GROUP BY b.id`
        db.query(sql, [phoneNumber], (err, result)=>{
            if(err){
                // throw err
                reject()
            }else{
                resolve(result)
                console.log(result)
            }
        })
    })
}


module.exports = Booking
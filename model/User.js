const bcrypt = require('bcryptjs');
const db = require('../config/db')
const crypto = require('crypto');
const nodeMailer = require('nodemailer');

let User = function(data, files){
    this.data = data;
    this.errors = [];
    this.files = files;
}

//cleanup
User.prototype.cleanup = function(){
    if(typeof(this.data.fullname) != "string"){this.data.fullname = ""}
    if(typeof(this.data.phoneNumber) != "string"){this.data.phoneNumber = ""}
    if(typeof(this.data.password) != "string"){this.data.password = ""}

    //get rid of bouges properties 
    let d = new Date();
    let dd = d.getDate();
    let mm = d.getMonth() + 1;
    let yyyy = d.getFullYear();

    let createdDate = `${dd}-${mm}-${yyyy}`;
    this.data = {
        fullname: this.data.fullname.toUpperCase(),
        phoneNumber: this.data.phoneNumber.trim(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password,
        role: 'user',
        balance: '0.00',
        token: "",
        createdDate: createdDate,
    } 
}

//validator
User.prototype.validate = function(){
    
}

//Register
User.prototype.register = function(){
    return new Promise((resolve, reject)=>{
        //validate user data
        this.cleanup();
        // this.validate();

        //save to the database
        if(!this.errors.length){
            let salt = bcrypt.genSaltSync(10);
            this.data.password = bcrypt.hashSync(this.data.password, salt)
            let sql = `INSERT INTO users(
                    FullName,
                    Email, 
                    PhoneNumber, 
                    Password, 
                    Balance, 
                    Role, 
                    Token, 
                    CreatedDate)
            VALUES(?,?,?,?,?,?,?,?)`
            db.query(sql, [
                this.data.fullname,
                this.data.email,
                this.data.phoneNumber,
                this.data.password,
                this.data.balance,
                this.data.role,
                this.data.token,
                this.data.createdDate
            ], (err, result)=>{
                if(err)throw err
                resolve();
                console.log("added")
           })
            
        }else{
            reject(this.errors)
        }
    }) 
}

//login
User.prototype.login = function(){
    return new Promise((resolve, reject) => {
        // this.cleanUp();
        // this.validate();
        
        let sql = 'SELECT * FROM users WHERE PhoneNumber = ? ';
        const phoneNumber = this.data.phoneNumber;
        db.query(sql, phoneNumber, (err, [result, _], fields)=>{
            if(err){
                reject("Invalid Username/Password");
            }else{
               
                // console.log(result)
                const password_hash = result.Password;
                const verifyed = bcrypt.compareSync(this.data.password, password_hash)
                if(verifyed){
                    this.data =  result;
                     
                    resolve("Login successfull");
                }else{
                    reject("Invalid Username/Password");
                }
            }
        
        })
      
    })
}

//forgot password

User.prototype.forgotPassword = function(){
    return new Promise((resolve, reject) =>{

        usersCollection.findOne({email: this.data.email}).then((user)=> {
            // console.log(attemptedUser);
            if(user && this.data.email === user.email){

            // Generating link for user using token
            // let tokenSchema = usersCollection.findOne({token: user.token});

            
            // token = new user.tokenSchema({token: crypto.randomBytes(32).toString("hex")}).save();
            // token =  new user.token({token: crypto.randomBytes(32).toString("hex")}).save();
            let value = crypto.randomBytes(32).toString("hex");
            
               let newValues = { $set: {token: value}}
            //    console.log(this.data.email)
                usersCollection.updateOne({email: this.data.email}, newValues, (err, res)=>{
                    if(err){
                    console.log(err);
                    };
                })
            const link = `${process.env.BASE_URL}/resetPassword/${value}`;

                //********* Sending the link **************/
                let transporter = nodeMailer.createTransport({
                    service: process.env.SERVICE,
                    port: 587,
                    secure: false,
                    auth: {
                    user: process.env.USER,
                    pass: process.env.PASS
                    },
                    tls: {
                        rejectUnauthorized:false
                    }
                    
                });
            
                let message = {
                    from: 'projectsis226@gmail.com', // sender address
                    to: `${user.email}`, // list of receivers
                    subject: "Reset password link", // Subject line
                    text: `Here's your password reset link: ${link} Go to this link to reset your password.` // plain text body
            
                }
                // send mail with defined transport object
                transporter.sendMail(message, function (err, data){
                    if(err){
                        console.log("error occurred", err);
                    }else{
                        console.log("mail sent");
                    }
                })
                
            
                resolve("<h1>Link has been sent to the email</h1>");
            }else{
                reject("User with this email doesn't exist")
            }
        }).catch(function(){
            reject("Error occurred, try again")
        });
    
    })

}

//organizer registration
User.prototype.organizerRegistration = function(){
    return new Promise(async(resolve, reject)=>{

        let d = new Date();
        let dd = d.getDate();
        let mm = d.getMonth() + 1;
        let yyyy = d.getFullYear();
    
        let createdDate = `${dd}-${mm}-${yyyy}`;
        this.data = {
            organizerName: this.data.organizerName.toUpperCase(),
            phoneNumber: this.data.phoneNumber.trim(),
            email: this.data.email.trim().toLowerCase(),
            password: this.data.password,
            role: 'organizer',
            balance: '0.00',
            token: "",
            createdDate: createdDate,
        }
        // cleanup the data that come from the body

        // validate the data that come from the body
        //save to the database
        if(!this.errors.length){
            let salt = bcrypt.genSaltSync(10);
            this.data.password = bcrypt.hashSync(this.data.password, salt)
            let sql = `INSERT INTO users(
                FullName,
                Email, 
                PhoneNumber, 
                Password, 
                Balance, 
                Role, 
                Token, 
                CreatedDate)
             VALUES(?,?,?,?,?,?,?,?)`
            db.query(sql,[
                this.data.organizerName,
                this.data.email,
                this.data.phoneNumber,
                this.data.password,
                this.data.balance,
                this.data.role,
                this.data.token,
                this.data.createdDate
            ], (err, result)=>{ 
                if(err)throw err
                resolve(this.data.organizerName);
                console.log("Organizer added")
           })
            
        }else{
            reject(this.errors)
        }
    })
}

User.prototype.organizerRegistrationDetail = function(){
    return new Promise(async(resolve, reject)=>{

        let d = new Date();
        let dd = d.getDate(); 
        let mm = d.getMonth() + 1;
        let yyyy = d.getFullYear();
    
        let createdDate = `${dd}-${mm}-${yyyy}`;
           //storing an image filename in an array
        // let imagesName = [] 
        const imageFiles = this.files.thumbnail
        console.log(imageFiles)
        imageFiles.forEach((image, index, arr)=>{
            imagesName = image.filename
        })
        console.log(imagesName)
        this.data = {
            organizerName :  this.data.organizerName.toUpperCase(),
            altPhoneNumber :  this.data.altPhoneNumber.trim(),
            image: imagesName,
            address :  this.data.address,
            PICName :  this.data.PICName,
            PICEmail :  this.data.PICEmail.trim().toLowerCase(),
            PICPhoneNumber :  this.data.PICPhoneNumber.trim(),
            createdDate: createdDate,
        }
        // cleanup the data that come from the body

        // validate the data that come from the body
        //save to the database
        if(!this.errors.length){
           
            let sql = `INSERT INTO organizerDetail(
                organizerName,
                altPhoneNumber,  
                image, 
                address, 
                PICName, 
                PICEmail, 
                PICPhoneNumber,
                CreatedDate)
            VALUES(?,?,?,?,?,?,?,?)`
            db.query(sql, [
                this.data.organizerName,
                this.data.altPhoneNumber,
                this.data.image,
                this.data.address,
                this.data.PICName,
                this.data.PICEmail,
                this.data.PICPhoneNumber,
                this.data.createdDate
            ], (err, result)=>{
                if(err)throw err
                resolve();
                console.log("Organizer added")
           })
            
        }else{
            reject(this.errors)
        }
    })
}

//read all organizers
User.prototype.readOrganizers = function(organizerName){
    return new Promise((resolve, reject)=>{
        // this.cleanup()
        // this.validation()

        let sql = `SELECT  u.ID, u.FullName, u.Email, u.PhoneNumber, od.image
        FROM users AS u
        JOIN  organizerDetail AS od ON od.organizerName = u.FullName
        WHERE role = ?
        GROUP BY u.ID`

        db.query(sql, ['organizer'], (err, result)=>{
            if(err){
                // throw err
                reject("Error occurred while loading event ")
            }else{
                resolve(result)
            }
        })
    })
} 

// read user data 
User.prototype.userInfo = function(phone){
    return new Promise((resolve, reject)=>{
        let sql = `SELECT * FROM users WHERE PhoneNumber = ?`
        let phoneNumber = phone;
        db.query(sql, phoneNumber, (err, [result, _])=>{
            if(err){
                // throw err
                reject()
            }else{
                resolve(result);
            }
        })
    })
}

// read organizer data 
User.prototype.organizerInfo = function(id){
    return new Promise((resolve, reject)=>{
        let sql = `SELECT  u.ID, u.FullName, u.Email, u.PhoneNumber, od.altPhoneNumber, od.image, od.address, od.PICName, od.PICEmail, od.PICPhoneNumber
        FROM users AS u
        JOIN  organizerDetail AS od ON od.organizerName = u.FullName
        WHERE u.ID = ?
        GROUP BY u.ID `
        // let phoneNumber = phone;
        db.query(sql, [id], (err, [result, _])=>{
            if(err){
                throw err
                // reject()
            }else{
                // console.log(result)
                resolve(result);
            }
        })
    })
}

//count all Organizers
User.prototype.counter = function(){
    return new Promise(async(resolve, reject)=>{

        // set current Date dd-mm-yyy format 
        let d = new Date();
        let dd = d.getDate();
        let mm = d.getMonth() + 1;
        let yyyy = d.getFullYear(); 
        let currentDate = `${dd}-${mm}-${yyyy}`;
        
        let sql = `SELECT COUNT(*) AS count from users UNION ALL
        SELECT COUNT(*) AS count from events UNION ALL
        SELECT COUNT(*) AS count from users WHERE role = 'organizer' UNION ALL
        SELECT COUNT(*) AS count from events WHERE startingDate >= '${currentDate}' `
 
        db.query(sql, (err, result)=>{
            if(err){
                // throw err 
                reject()
            }else{
                // console.log(result)
                resolve(result)
            }
        })
 
    })
}   

module.exports = User
const { json } = require('express');
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const router = require("./router/router")
const flash = require('connect-flash');
const dotenv = require('dotenv')
dotenv.config();

const db = require('./config/db')

const sessionStore = new MySQLStore({}, db);

app.use(
    session({
        secret: 'engida ethirek is the secret',
        resave: false,
        saveUninitialized: false,
        store: sessionStore,   // assigning sessionStore to the session
        cookie: {maxAge: 1000 * 60 *60 *24, httpOnly: true}   
    })
);

app.use(flash())

app.use(function(req, res, next) {
    // make all error and success flash messages available from all templates
    res.locals.errors = req.flash("errors")
    res.locals.success = req.flash("success")

    // make user session data available from within view templates
    res.locals.user = req.session.user
    next()
})

app.use(express.urlencoded({extended:false}))
app.use(json())

app.use(express.static('public'))

app.set('views', 'views')
app.set('view engine', 'ejs')

app.use('/', router)

const PORT = process.env.PORT || 6000
app.listen(PORT, ()=>{console.log(`server running on ${PORT}`)})


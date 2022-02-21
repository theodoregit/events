const dotenv = require('dotenv')
dotenv.config();
const mysql = require("mysql")

const conn = mysql.createConnection({
    host:  process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
})

conn.connect(function(err, result){
    if(err)throw err;
    console.log("DB connected")
   
}) 

module.exports = conn;



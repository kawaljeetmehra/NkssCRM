const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    database:"nkss_management_sys",
    user:"root",
    password:""
})

db.connect((err) => {
      if(err){
          console.error('error connecting: '+ err.stack)
      }

      console.log('connected as id '+ db.threadId)
})

module.exports = db;
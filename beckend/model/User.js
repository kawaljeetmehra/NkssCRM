const db = require("../database/db");

const User = {

    register: (data, callback) => {
          const query = `INSERT INTO users(name, username, password,  email, image, role_id, salary, doj, bank_name, designation, ifsc, bank_account_number)
                         VALUES (?, ?, ?, ?, ?, 2, ?, ?, ?, ?, ?, ?)`;
          
          let values = [
              data.name,
              data.username,
              data.password,
              data.email,
              data.image,
              data.salary,
              data.doj,
              data.bank_name,
              data.designation,
              data.ifsc,
              data.bank_account_number
          ]

          db.query(query, values, (err, data) => {
               if(err){
                   callback(err, null);
               }

               callback(null, err)
          })
    },


    login: (data, callback) => {
        const query = `select * from users WHERE username = ? AND passowrd = ? LIMIT 1`;
        
        let values = [
            data.username,
            data.password,
        ]

        db.query(query, values, (err, data) => {
             if(err){
                 callback(err, null);
             }

             callback(null, data)
        })
    },

    fetch: (callback) => {
        const query = `select * from users`;
  
        db.query(query, (err, data) => {
             if(err){
                 callback(err, null);
             }

             callback(null, data)
        })
    },

    fetchAll: (callback) => {
        const query = `select * from users`;
  
        db.query(query, (err, data) => {
             if(err){
                 callback(err, null);
             }

             callback(null, data)
        })
    },


    update: (data, callback) => {

        let sql = "";
        let imageValue = null;

        if (data.image && !data.image.includes("undefined")) {
            sql = ", image = ?";
            imageValue = data.image; // Store the image value for validation and addition to the values array
        }

        console.log(sql);
        const query = `UPDATE users
                        SET 
                            name = ?,
                            username = ?,
                            password = ?,
                            email = ?,
                            salary = ?,
                            bank_name = ?,
                            designation = ?,
                            ifsc = ?,
                            bank_account_number = ?,
                            email_key = ?
                            ${sql} 
                        WHERE 
                            RecordID = ?;`;
                
        let values = [
            data.name,
            data.username,
            data.password,
            data.email,
            data.salary,
            data.bank_name,
            data.designation,
            data.ifsc,
            data.bank_account_number,
            data.email_key
        ];

        // If the image value is valid, add it to the values array
        if (imageValue !== null) {
            values.push(imageValue);
        }

        // Add the user_id to the values array
        values.push(data.user_id);

        db.query(query, values, (err, data) => {
            console.log(data);
            if (err) {
                callback(err, null);
            }

            callback(null, err);
        });

    },


    delete: (user_id, callback) => {

        let query = "DELETE FROM users WHERE RecordID = "+user_id;
        db.query(query, (err, data) => {
            if(err){
                callback(err, null);
            }

            callback(null, data)
        })
    },

    finUserbyID: (user_id, callback) => {

        let query = "select * from users WHERE RecordID = "+user_id;
        db.query(query, (err, data) => {
            if(err){
                callback(err, null);
            }

            callback(null, data)
        })
    },
}

module.exports = User;
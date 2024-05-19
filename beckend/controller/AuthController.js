const User = require("../model/User");

const AuthController = {
     
    register: (data, img, callback) => {
          
          const formData = {
              name: data.body.name,
              password: data.body.password,
              username: data.body.username,
              email: data.body.email,
              salary: data.body.salary,
              doj: data.body.doj,
              image: img,
              bank_name: data.body.bank_name,
              designation: data.body.designation,
              ifsc: data.body.ifsc,
              bank_account_number: data.body.bank_account_number
          }
          User.register(formData, (err, data) => {
               if(err){
                    callback(err, null)
               }
               callback(null, data)
          })
    },


    login: (data, img, callback) => {
        let formData = {
            username: data.body.username,
            password: data.body.password
        }
        
        User.login(formData, (err, data) => {
             if(err){
                  callback(err, null)
             }
             callback(null, data)
        })
    },

    fetch: () => { 
        return new Promise((resolve, reject) => {
            User.fetch((err, data) => {
                if(data){
                     resolve(data)
                }
                reject(err)
           })
        })
    },

    edit: (data, img, callback) => {
            
            const formData = {
                user_id: data.user.RecordID,
                name: data.body.name,
                password: data.body.password,
                username: data.body.username,
                email: data.body.email,
                salary: data.body.salary,
                image: img,
                bank_name: data.body.bank_name,
                designation: data.body.designation,
                ifsc: data.body.ifsc,
                bank_account_number: data.body.bank_account_number,
                email_key: data.body.email_key
            }

            console.log(formData)
            User.update(formData, (err, data) => {
                if(err){
                    callback(err, null)
                }
                callback(null, data)
            })
    },

    delete: (req, callback) => {
            User.delete(req.body.user_id, (err, data) => {
                if(err){
                    callback(err, null)
                }
                callback(null, data)
            })
    },
}

module.exports = AuthController;
const nodemailer = require('nodemailer');
const User = require("../model/User");
const db = require("../database/db");

const Email = {
     async sendEmail(fromUserID, toUserID, subject, description){  
            
            let fromUserData = await new Promise((resolve, reject) => {
                User.finUserbyID(fromUserID, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });

            let toUserData = await new Promise((resolve, reject) => {
                User.finUserbyID(toUserID, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });

            let from = fromUserData[0].email;
            let to = toUserData[0].email;
            let from_key = fromUserData[0].email_key

            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user:  from,
                    pass: from_key // If you have 2-step verification enabled, you need to use an app password
                }
            });

            let mailOptions = {
                from: from,
                to: to, 
                subject: subject, 
                text: description
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }

                db.query(`INSERT INTO communication(messageID, from_user_id, to_user_id, subject, description, created_at)
                          VALUES ('${info.messageId}','${fromUserID}', '${toUserID}', '${subject}', '${description}', CURRENT_TIMESTAMP)`)
                console.log('Message sent: %s', info.messageId);
            });
     },


     async replyMail(request_leave_id){
        let data = await new Promise((resolve, reject) => {
            db.query(`select * from leaves WHERE RecordID='${request_leave_id}'`, (err, data) => {
                  if(data){
                       resolve(data)
                  }
            })
        });


        let subject = data[0].subject;
        let description = data[0].description;
        let from_user_id = data[0].user_id;
        let to_user_id = data[0].to_user_id;

        let getLastMsgData = await new Promise((resolve, reject) => {
            db.query(`select * from communication WHERE subject='${subject}' AND description='${description}' AND 
                      from_user_id='${from_user_id}' AND to_user_id='${to_user_id}' ORDER BY RecordID DESC LIMIT 1`, (err, data) => {
                  if(data){
                       resolve(data)
                  }
            })
        });
        
        let fromUserData = await new Promise((resolve, reject) => {
            User.finUserbyID(from_user_id, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });

        let toUserData = await new Promise((resolve, reject) => {
            User.finUserbyID(to_user_id, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
        let MessageID = getLastMsgData[0].messageID;
        let from = fromUserData[0].email;
        let to = toUserData[0].email;
        let from_key = fromUserData[0].email_key;
        let to_key = toUserData[0].email_key;

         
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user:  to,
                pass: to_key // If you have 2-step verification enabled, you need to use an app password
            }
        });
        
        const originalEmailContent = {
            from: from,
            to: to,
            subject: subject,
            text: description,
            messageId: MessageID
          };
          
          // Compose the reply
          const replyEmailContent = {
            from: originalEmailContent.to, // Reverse the recipient and sender
            to: originalEmailContent.from,
            subject: `Re: ${originalEmailContent.subject}`, // Prefix the subject with "Re:"
            text: 'Approved',
            inReplyTo: originalEmailContent.messageId,
            references: originalEmailContent.messageId // Use original message ID in References header
          };
          
          // Send the reply email
          transporter.sendMail(replyEmailContent, (error, info) => {
            if (error) {
              console.error('Error while sending reply:', error);
            } else {
              console.log('Reply sent:', info.response);
            }
          });
     }
}

process.on('message', (emailData) => {
    // Call sendEmail function with data received from parent process
    Email.sendEmail(emailData.from, emailData.to, emailData.subject, emailData.description)
});

module.exports = Email;
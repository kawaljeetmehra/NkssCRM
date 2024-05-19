const db = require("../database/db");
const Attendance = require("../model/Attendance");
const User = require("../model/User");
const Helper = require("../helper/email");
const { fork } = require("child_process");
const Email = fork('beckend/helper/email');

const AttendanceController = {
        markAttendance: (userData, PostData, callback) => {
            const start = new Date().toLocaleString();
            const data = {
                user_id: userData.RecordID,
                attendance: {start},
                month: PostData.body.month,
                year: PostData.body.year,
                date: new Date().getDate()
            };
        
            Attendance.insert(data, 0, (err, data) => {
                   if(err){
                       callback(err, null)
                   }

                   callback(null, data)
            })
        },


        applyLeave(userData, PostData, callback){
              const data = {
                  user_id: userData.RecordID,
                  from_leave_date: PostData.body.from_leave_date,
                  to_leave_date: PostData.body.to_leave_date,
                  leave_count: PostData.body.leave_count,
                  subject: PostData.body.subject,
                  description: PostData.body.description,
                  to_user_id: PostData.body.to_user_id
              }

              Email.send({from:userData.RecordID, to:PostData.body.to_user_id, subject: PostData.body.subject, description:PostData.body.description})
              
              Attendance.applyLeave(data, (err, data) => {
                    if(err){
                        return callback(err, null)
                    }

                    return callback(null, data)
              })
        }, 
        
        
        approveleave(request_leave_id, callback){
            Helper.replyMail(request_leave_id)
            Attendance.approveleave(request_leave_id, (err, data) => {
                    if(err){
                        return callback(err, null)
                    }

                    return callback(null, data)
            })
        },


        fetchtodayleave(callback){
            Attendance.fetchtodayleave((err, data) => {
                    if(err){
                        return callback(err, null)
                    }

                    return callback(null, data)
            })
        },

        fetchAssingedleave(user_id, callback){
            Attendance.fetchAssingedleave(user_id, (err, data) => {
                    if(err){
                        return callback(err, null)
                    }

                    return callback(null, data)
            })
        }, 

        fetchleaves(req, callback){
            let whr = '';
            if(req.user.role_id == 2){
                   whr = " WHERE user_id = "+req.user.RecordID
            }
            Attendance.fetchleaves(whr, (err, data) => {
                    if(err){
                        return callback(err, null)
                    }

                    return callback(null, data)
            })
        },

        fetchAll: (cb) => { 
            try{
                const query = `select * from users`;
    
                db.query(query, (err, data) => {
                    if(err){
                        cb(err, null);
                    }
        
                    cb(null, data)
                })
            }catch(e){
                  
            }
        },

        fetchAttendance(req, callback){
              let data = {
                  month: req.body.month,
                  year: req.body.year
              }

              Attendance.fetchAttendance(data, (err, data) => {
                    if(err){
                          callback(err, null)
                    }

                    callback(null, data)
              })
        },

        userStatus(req, callback){
            
            let DateObj = new Date();
            const data = {
                date: DateObj.getDate(),
                month: req.body.month,
                year: DateObj.getFullYear(),
            }

              Attendance.userStatus(data, (err, data) => {
                    if(err){
                            callback(err, null)
                    }
                    
                    User.fetch((err, user) => {
                          
                        let users_id = [];
                        for(let item of user){
                               users_id.push(item.RecordID)
                        }

                        let key = 0;
                        let Leave = 0;
                        let attd_user_id = [];
                        for(let item of data){
                               let punch = "";
                               if(JSON.parse(item.Attendance) == "L"){
                                     Leave++;
                               }
                               attd_user_id.push(item.user_id)

                               const parsedAttendance = JSON.parse(item.Attendance);
                               if (parsedAttendance?.endDate && JSON.parse(item.Attendance) != "L") {
                                   punch = "Punch-Out";
                               }else if(parsedAttendance?.start){
                                   punch = "Punch-In";
                               }

                               data[key].punch = punch
                               key++;
                        }

                        let active = 0;
                        let InActive = 0;
                        let Present = 0;
                        for(let users of users_id){
                               if(attd_user_id.filter(item => item == users).length == 0){
                                     InActive++;
                               }else{
                                     active++;
                                     Present++;
                               }
                        }

                        Present = Present - Leave;

                        callback(null, data, {active, InActive, Present, Leave})

                     })
              })
        },


        userSalary(req, callback){
            let salary = req.user.salary;
            let presentDays = 0;
            let absentDate = [];
            let absentDays = 0;
            let leaveDate = [];
            let leaveDays = 0;
            let totalDays = 0;
            let workingDays = 0;
            let data = {
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
                user_id: req.user.RecordID
            }

            Attendance.fetchAttendance(data, (err, data) => {
                console.log(data)
                    if(data){
                        const date = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
                        date.setMonth(date.getMonth() + 1);
                        date.setDate(date.getDate() - 1);
                        totalDays = date.getDate();
                        for (let i = 1; i < date.getDate() + 1; i++) {
                            const currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), i);
                            const dayOfWeek = currentDate.getDay();

                            if (dayOfWeek === 0) continue;

                            workingDays++;
                            if (data && data[0] && data[0][i]) { // Check if data is defined and has the expected structure
                                if (JSON.parse(data[0][i]) === "L") {
                                    leaveDays++;
                                    leaveDate.push(i);
                                } else {
                                    presentDays++;
                                }
                            } else {
                                if (i < new Date().getDate()) {
                                    absentDays++;
                                    absentDate.push(i);
                                }
                            }
                        }

                        const postData = {totalDays, workingDays, presentDays,  absentDays, absentDate, leaveDays, leaveDate};
                        const monthlySalary = (presentDays / workingDays) * salary;
                        postData.monthlySalary = salary;
                        postData.calculatedSalary = Math.floor(monthlySalary);
                        callback(null, postData);

                    }
            })
        },


        userSalarySlip(posted, callback){
            User.fetchAll((err, data) => {
                  let month = posted.month;
                  let year = posted.year;
                 
                  let user_id = [];
                  data.forEach(item => {
                       user_id.push(item.RecordID);
                  })

                  let ids;
                  if(posted.user_id){
                       ids = posted.user_id;  
                  }else{
                       ids = user_id.join(",")
                  }
                  //let ids = user_id.join(",");
                  let form = {
                        month: posted.month,
                        year: posted.year,
                        user_id: ids
                  }
                  
                  Attendance.fetchInUserAttendance(form, (err, attddata) => {
                       let newPostData = [];
                       data.forEach(user => {
                            let salary = user.salary;
                            let presentDays = 0;
                            let absentDate = [];
                            let absentDays = 0;
                            let leaveDate = [];
                            let leaveDays = 0;
                            let totalDays = 0;
                            let workingDays = 0;
                            let userID = user.RecordID;
                            
                            attddata
                               .filter(a => a.user_id == userID)
                               .forEach(data => {
                                            const lastDayOfMonth = new Date(year, month , 0);
                                            totalDays = lastDayOfMonth.getDate();
                                            for(let i = 1; i < totalDays; i++){
                                                        const currentDate = new Date(year, month - 1, i);
                                                        const dayOfWeek = currentDate.getDay();

                                                        if(dayOfWeek == 0) continue;
                        
                                                        workingDays++;
                                                        if(data[i]){
                                                            if(JSON.parse(data[i]) == "L"){
                                                                leaveDays++;
                                                                leaveDate.push(i)
                                                            }else{
                                                                presentDays++;
                                                            }
                                                        }else{
                                                            if(i < new Date().getDate()){
                                                                absentDays++;
                                                                absentDate.push(i)
                                                            }
                                                        }
                                                }
                                        const postData = {totalDays, workingDays, presentDays,  absentDays, absentDate, leaveDays, leaveDate};
                                        const monthlySalary = (presentDays / 30) * salary;
                                        postData.monthlySalary = salary;
                                        postData.calculatedSalary = Math.floor(monthlySalary)
                                        postData.deductedSalary = Math.floor(salary - monthlySalary);
                                        postData.user_id = user.RecordID;
                                        postData.designation = user.designation;
                                        postData.bank_name = user.bank_name;
                                        postData.bank_account_number = user.bank_account_number;
                                        postData.ifsc = user.ifsc;
                                        postData.name = user.name;
                                        newPostData.push(postData);

                                        console.log(postData)
                               })
                       })

                       callback(null, newPostData);                    
                  })
            })
        },

        publish(body, callback){
              const formData = {
                   month: body.body.month,
                   year: body.body.year,
                   user_id: body.user.RecordID
              }

              Attendance.publish(formData, (err, data) => {
                   if(err){
                        return callback(err, null);
                   }

                   return callback(null, data);
              })

        },

        verifyPublish(body, callback){
                const formData = {
                    month: body.body.month,
                    year: body.body.year,
                    user_id: body.user.RecordID
                }

                Attendance.verifyPublish(formData, (err, data) => {
                    if(err){
                        return callback(err, null);
                    }

                    return callback(null, data);
                })

        },
}

module.exports = AttendanceController;
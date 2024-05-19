const db = require("../database/db");

const Attendance = {

    insert: (data, isLeave, callback) => {
           
            const select = `select v${data.date} from attendance WHERE user_id=${data.user_id} AND month=${data.month} AND year=${data.year}`;
 
            db.query(select, (err, result) => {
                    if(result){ 
                           const date = data.date;
                           const end = new Date().toLocaleString();
                           if(result.length != 0){
                                        let exisDate = result["v"+date]; 
                                        let dateJson = {};
                                        if(result[0]['v'+date]){
                                                dateJson = JSON.parse(result[0]['v'+date] ?? "");
                                                const endDate = new Date().toLocaleString();
                                                dateJson.endDate = endDate;
                                        }else{
                                                dateJson.start = new Date().toLocaleString();
                                        }
                                        
                                        if(isLeave == 1) dateJson = "L";
                                        const query = `UPDATE attendance SET v${date} = '${JSON.stringify(dateJson)}' WHERE user_id='${data.user_id}' AND month='${data.month}' AND year = '${data.year}'`;
                                        db.query(query, (err, data) => {
                                            if(err){
                                                callback(err, null);
                                            }
        
                                            callback(null, err)
                                        })
                           }else{
                                        const query = `INSERT INTO attendance(user_id, month, year, v${data.date})
                                        VALUES (?, ?, ?, ?)`;

                                        if(isLeave == 1) data.attendance = "L";
                                        let values = [
                                            data.user_id,
                                            data.month,
                                            data.year,
                                            JSON.stringify(data.attendance)
                                        ]

                                        db.query(query, values, (err, data) => {
                                            if(err){
                                                callback(err, null);
                                            }

                                            callback(null, err)
                                        })
                           }  
                    }
                })
    },


    applyLeave(data, callback){
            const query = `INSERT INTO leaves(user_id, from_leave_date, to_leave_date, to_user_id, leave_count, subject, description)
                           VALUES (?, ?, ?, ?, ?, ?, ?)`;

            let values = [
                data.user_id,
                data.from_leave_date,
                data.to_leave_date,
                data.to_user_id,
                data.leave_count,
                data.subject,
                data.description
            ]
            
            db.query(query, values, (err, data) => {
                   if(err){
                      return callback(err, null)
                   }

                   return callback(null, data)
            })
    },


    approveleave(request_leave_id, callback){
            let query = `UPDATE leaves SET IsApproved='1', approved_at=CURRENT_TIMESTAMP WHERE RecordID = ${request_leave_id}`;

            let attd_query = `select * from leaves WHERE RecordID = ${request_leave_id}`;
            db.query(attd_query, async (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                
                    let from_leave_date = new Date(data[0].from_leave_date);
                    let to_leave_date = new Date(data[0].to_leave_date);
                    let user_id = data[0].user_id;
                
                    try {
                        for (let current_date = from_leave_date; current_date <= to_leave_date; current_date.setDate(current_date.getDate() + 1)) {
                            let form = {
                                user_id,
                                attendance: "L",
                                month: current_date.getMonth() + 1,
                                year: current_date.getFullYear(),
                                date: current_date.getDate()
                            };
                
                            await new Promise((resolve, reject) => {
                                this.insert(form, 1, (err, data) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        console.log(data);
                                        resolve();
                                    }
                                });
                            });
                        }
                    } catch (error) {
                        console.error(error);
                    }
                });            

            db.query(query, (err, data) => {
                    if(err){
                    return callback(err, null)
                    }

                    return callback(null, data)
            })
    },

    fetchtodayleave(callback){
          let query = `select leaves.*, users.name AS LeaveRequester, users.image, 
                       (select name from users WHERE users.RecordID = leaves.to_user_id) AS AssignedUser  
                       from leaves
                       INNER JOIN users ON users.RecordID = leaves.user_id 
                       WHERE DATE(leaves.created_at) = CURRENT_DATE()
                        ORDER BY leaves.RecordID DESC`;

          db.query(query, (err, data) => {
                if(err){
                   return callback(err, null)
                }

                   return callback(null, data)
          })
    },
    
    fetchAssingedleave(user_id, callback){
            let query = `select leaves.*, users.name AS LeaveRequester, 
                        (select name from users WHERE users.RecordID = leaves.to_user_id) AS AssignedUser  
                        from leaves
                        INNER JOIN users ON users.RecordID = leaves.user_id 
                        WHERE leaves.to_user_id = '${user_id}' 
                        ORDER BY leaves.RecordID DESC`;

            db.query(query, (err, data) => {
                if(err){
                    return callback(err, null)
                }

                    return callback(null, data)
            })
    },


    fetchleaves(whr, callback){
            let query = `select leaves.*, users.name AS LeaveRequester, users.image, 
                        (select name from users WHERE users.RecordID = leaves.to_user_id) AS AssignedUser  
                        from leaves
                        INNER JOIN users ON users.RecordID = leaves.user_id  ${whr} 
                        ORDER BY leaves.RecordID DESC`;

            db.query(query, (err, data) => {
                console.log(err)
                if(err){
                    return callback(err, null)
                }

                return callback(null, data)
            })
    },

    fetchAttendance(data, callback){

        let sql="";
        if(data.user_id){
               sql=" AND attendance.user_id ="+data.user_id;
        }
        let query = `
        SELECT 
            attendance.month,
            attendance.year,
            attendance.user_id,
            users.name,
            v1 AS \`1\`, v2 AS \`2\`, v3 AS \`3\`, v4 AS \`4\`, v5 AS \`5\`, v6 AS \`6\`, v7 AS \`7\`, v8 AS \`8\`, v9 AS \`9\`, v10 AS \`10\`,
            v11 AS \`11\`, v12 AS \`12\`, v13 AS \`13\`, v14 AS \`14\`, v15 AS \`15\`, v16 AS \`16\`, v17 AS \`17\`, v18 AS \`18\`, v19 AS \`19\`, v20 AS \`20\`,
            v21 AS \`21\`, v22 AS \`22\`, v23 AS \`23\`, v24 AS \`24\`, v25 AS \`25\`, v26 AS \`26\`, v27 AS \`27\`, v28 AS \`28\`, v29 AS \`29\`, v30 AS \`30\`, v31 AS \`31\`
        FROM 
            attendance
        INNER JOIN 
            users ON users.RecordID = attendance.user_id
        WHERE 
            attendance.month = '${data.month}'
            AND attendance.year = '${data.year}' 
             ${sql}`;
        
             console.log(query)
        
         
        db.query(query, [data.month, data.year] ,(err, data) => {
            if(err){
                return callback(err, null)
            }

            return callback(null, data)
        })
    },

    fetchInUserAttendance(data, callback){

        let query = `
        SELECT 
            attendance.month,
            attendance.year,
            attendance.user_id,
            users.name,
            v1 AS \`1\`, v2 AS \`2\`, v3 AS \`3\`, v4 AS \`4\`, v5 AS \`5\`, v6 AS \`6\`, v7 AS \`7\`, v8 AS \`8\`, v9 AS \`9\`, v10 AS \`10\`,
            v11 AS \`11\`, v12 AS \`12\`, v13 AS \`13\`, v14 AS \`14\`, v15 AS \`15\`, v16 AS \`16\`, v17 AS \`17\`, v18 AS \`18\`, v19 AS \`19\`, v20 AS \`20\`,
            v21 AS \`21\`, v22 AS \`22\`, v23 AS \`23\`, v24 AS \`24\`, v25 AS \`25\`, v26 AS \`26\`, v27 AS \`27\`, v28 AS \`28\`, v29 AS \`29\`, v30 AS \`30\`, v31 AS \`31\`
        FROM 
            attendance
        INNER JOIN 
            users ON users.RecordID = attendance.user_id
        WHERE 
            attendance.month = ${data.month} 
            AND attendance.year = ${data.year}
            AND attendance.user_id IN(${data.user_id})`;
        
         
        db.query(query, [data.month, data.year, data.user_id] ,(err, data) => {
            if(err){
                return callback(err, null)
            }

            return callback(null, data)
        })
    },

    userStatus(data, callback){
        let query = `select attendance.v${data.date} AS Attendance, users.name, users.image,attendance.user_id 
                     from attendance
                     INNER JOIN users ON users.RecordID = attendance.user_id
                     WHERE attendance.month='${data.month}' AND attendance.year='${data.year}' AND attendance.v${data.date} != 'NULL'`;
                     console.log(query)
        db.query(query, [data.month, data.year] ,(err, data) => {
            if(err){
                return callback(err, null)
            }

            return callback(null, data)
        })
    },

    publish(data, callback){
        let query = `INSERT INTO publish_salary_slip(month, year, user_id)
                        VALUES (?, ?, ?)`;
        
        db.query(query, [data.month, data.year, data.user_id], (err, data) => {
              if(err){
                   return callback(err, null);
              }

              return callback(null, data);
        })
    },


    verifyPublish(data, callback){
        let query = `select * from publish_salary_slip WHERE month = ? AND year = ?`;

        db.query(query, [data.month, data.year, data.user_id], (err, data) => {
                if(err){
                    return callback(err, null);
                }

                return callback(null, data);
        })
    }
}

module.exports = Attendance;
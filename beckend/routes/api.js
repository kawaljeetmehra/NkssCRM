const express = require("express");
const app = express.Router();
const VerifyToken =  require("../middleware/auth");
const AttendanceController = require("../controller/AttendanceController");
const bodyParser = require('body-parser');
const upload = require('../config/multer');
const AuthController = require("../controller/AuthController");
app.use(bodyParser.json());

app.post("/profile", [VerifyToken], (req, res) => {
        const userData = req.user;
        return res.json({ user: userData });
    }
);


app.post("/users", (req, res) => {
        try{
            AttendanceController.fetchAll((err, data) => {
                res.send({message:"success", data:data})
            })
        }catch(e){

        }
});


app.post("/attendance", [VerifyToken], (req, res) => {
        const userData = req.user;
        AttendanceController.markAttendance(userData, req, (err, data) => {
              if(err){                
                    return res.status(500).json({ status: 500, message:"Internal Server Error : "+err.message });
              }
              return res.status(200).json({status:200, message:"success"})
        })
    }
);

app.post("/requestleave", [VerifyToken], (req, res) => {
        const userData = req.user;
        AttendanceController.applyLeave(userData, req, (err, data) => {
            if(err){                
                    return res.status(500).json({ status: 500, message:"Internal Server Error : "+err.message });
            }
            return res.status(200).json({status:200, message:"success"})
        })
    }
);


app.post("/approveleave", [VerifyToken], (req, res) => {
        AttendanceController.approveleave(req.body.request_leave_id, (err, data) => {
            if(err){                
                    return res.status(500).json({ status: 500, message:"Internal Server Error : "+err.message });
            }
            return res.status(200).json({status:200, message:"success"})
        })
    }
);


app.post("/fetchtodayleave", [VerifyToken], (req, res) => {
    AttendanceController.fetchtodayleave((err, data) => {
            if(err){                
                    return res.status(500).json({ status: 500, message:"Internal Server Error : "+err.message });
            }
            return res.status(200).json({status:200, message:"success", data: data})
        })
    }
);


app.post("/fetchassignedleave", [VerifyToken], (req, res) => {
    AttendanceController.fetchAssingedleave(req.body.user_id, (err, data) => {
            if(err){                
                    return res.status(500).json({ status: 500, message:"Internal Server Error : "+err.message });
            }
            return res.status(200).json({status:200, message:"success", data: data})
        })
    }
);


app.post("/fetchleaves", [VerifyToken], (req, res) => {
    AttendanceController.fetchleaves(req, (err, data) => {
            if(err){                
                    return res.status(500).json({ status: 500, message:"Internal Server Error : "+err.message });
            }
            return res.status(200).json({status:200, message:"success", data: data})
        })
    }
);


app.post("/fetchattendance", [VerifyToken], (req, res) => {
    AttendanceController.fetchAttendance(req, (err, data) => {
            if(err){                
                    return res.status(500).json({ status: 500, message:"Internal Server Error : "+err.message });
            }
            return res.status(200).json({status:200, message:"success", data: data})
        })
    }
);


app.post("/status", [VerifyToken], (req, res) => {
    AttendanceController.userStatus(req, (err, data, status) => {
            if(err){                
                    return res.status(500).json({ status: 500, message:"Internal Server Error : "+err.message });
            }
            return res.status(200).json({status:200, message:"success", data: data, Attdstatus:status})
        })
    }
);


app.post("/salary", [VerifyToken], (req, res) => {
    AttendanceController.userSalary(req, (err, data, status) => {
            if(err){                
                    return res.status(500).json({ status: 500, message:"Internal Server Error : "+err.message });
            }
            return res.status(200).json({status:200, message:"success", data: data})
        })
    }
);


app.post("/update", [VerifyToken, upload.single('file')], (req, res) => {

    const imagePath = req.protocol + '://' + req.get('host') + '/' + req.file?.path;
    
    AuthController.edit(req, imagePath, (err, data) => {
        if (err) {                
            return res.status(500).json({ status: 500, message: "Internal Server Error : " + err.message });
        }
        return res.status(200).json({status: 200, message: "success"})
    });
});



app.post("/delete", [VerifyToken], (req, res) => {
    AuthController.delete(req, (err, data, status) => {
            if(err){                
                    return res.status(500).json({ status: 500, message:"Internal Server Error : "+err.message });
            }
            return res.status(200).json({status:200, message:"success"})
        })
    }
);

app.post("/publish", [VerifyToken], (req, res) => {
    AttendanceController.publish(req, (err, data, status) => {
            if(err){                
                    return res.status(500).json({ status: 500, message:"Internal Server Error : "+err.message });
            }
            return res.status(200).json({status:200, message:"success"})
        })
    }
);


app.post("/verifyPublish", [VerifyToken], (req, res) => {
    AttendanceController.verifyPublish(req, (err, data, status) => {
            if(err){                
                    return res.status(500).json({ status: 500, message:"Internal Server Error : "+err.message });
            }

            if(data.length !== 0){
                return res.status(200).json({status:200, message:"success", IsPublished: true})
            }
            return res.status(200).json({status:200, message:"success", IsPublished: false})
        })
    }
);
module.exports = app;
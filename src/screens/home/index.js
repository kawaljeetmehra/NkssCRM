import React, { useEffect, useState } from "react";
import {HeaderComp, ProfileHead, Wrapper} from "../header";
import { CardComponent, CardContent, IconComponent, ImgComp, ListComponent, TableComp, TableFilters } from "../../components/layout";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import withRedux from "../../redux/setupRedux";
import { useSimplePOSTAPI } from "../../hooks/api";
import ModalComp from "../../components/model";
import ChartComp from "../../components/chart";

const IndexScreen = (props) => {
    const {loading, handleAPI} = useSimplePOSTAPI("/api/status");
    const {loading:leaveLoading, handleAPI:handleLeaveAPI} = useSimplePOSTAPI("/api/fetchtodayleave");
    const {loading:salaryStatus, handleAPI:handleSalaryStatus} = useSimplePOSTAPI("/api/salary");
    const {loading:salryLoading, handleAPI:handlePublishSalarySlip} = useSimplePOSTAPI("/api/verifyPublish");
    const [leaveData, setLeaveData] = useState([]);
    let [start, setstartTime] = useState();
    const [startTimes, setStartTimes] = useState();
    const [totalWOrking, setTotalWorking] = useState("");
    const [startType, setStartType] = useState("Check In");
    const [IsPublished, setIsPublished] = useState(false);

    useEffect(() => {
        handlePublishSalarySlip({month: new Date().getMonth(), year: new Date().getFullYear()})
                 .then(data => {
                    setIsPublished(data.IsPublished) 
                 })
                 .catch(err => {
                     console.error(err)
                 })
    }, [])


    useEffect(() => {
        handleLeaveAPI({})
                 .then(data => {
                    if(props.user.user.role_id == 2){
                         // let filter_data = data.data.filter(item => item.user_id == props.user.user.RecordID);
                          setLeaveData(data.data);
                    }else{
                        setLeaveData(data.data)
                    }
                 })
                 .catch(err => {
                     console.error(err)
                 })
    }, [])

    const [data, setData] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [greet, setGreet] = useState();

    useEffect(() => {
        
            if (!start) return;

            const startLowercase = start.toLowerCase(); // Convert to lowercase
            
            const interval = setInterval(() => {
                // Splitting the start time to get hours, minutes, and seconds
                let [hours, minutes, seconds] = start.split(":").map(num => parseInt(num));
            
                // Converting pm time to 24-hour format
                if (startLowercase.includes("pm")) {
                    if (hours !== 12) {
                        hours += 12;
                    }
                } else if (startLowercase.includes("am")) {
                    if (hours === 12) {
                        hours = 0;
                    }
                }
            
                // Creating a Date object with the start time
                let startTime = new Date();
                startTime.setHours(hours, minutes, seconds);
            
                // Getting the current time
                let currentTime = new Date();
            
                // Calculating the difference in milliseconds
                let timeDifference = currentTime - startTime;
            
                // Handling cases where current time is before start time
                if (timeDifference < 0) {
                    clearInterval(interval);
                    setStartTimes("Timer not started yet");
                    return;
                }
            
                // Converting milliseconds to hours, minutes, and seconds
                let hoursDiff = Math.floor(timeDifference / (1000 * 60 * 60));
                timeDifference -= hoursDiff * 1000 * 60 * 60;
                let minutesDiff = Math.floor(timeDifference / (1000 * 60));
                timeDifference -= minutesDiff * 1000 * 60;
                let secondsDiff = Math.floor(timeDifference / 1000);
                setStartTimes(`${hoursDiff} hours ${minutesDiff} minutes ${secondsDiff} seconds`)
            }, 1000);
        
    })

    useEffect(() => {
         handleAPI({month: new Date().getMonth() + 1, year: new Date().getFullYear()})
                 .then(data => {
                    let userStatus = data.data.filter(item => {
                            return item.user_id == props.user.user.RecordID
                    });

                   // console.log(data.data)
                    
                    if(props.user.user.role_id == 2){
                          setData(userStatus)
                    }else{
                          setData(data.data)
                    }
                    setStatusData(data.Attdstatus)

                    let start = JSON.parse(userStatus[0]?.Attendance).start.split(",")[1];
                    let end = JSON.parse(userStatus[0]?.Attendance)?.endDate?.split(",")[1];  

                     if(start?.length > 0 && end?.length > 0){
                        const timeStringToMilliseconds = (timeString) => {
                            let [hours, minutes, seconds] = timeString.split(":").map(num => parseInt(num));
                            let totalMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;
                            return totalMilliseconds;
                        };
        
                        // Convert start and end time to milliseconds
                        let startTime = timeStringToMilliseconds(start);
                        let endTime = timeStringToMilliseconds(end);
        
                        // Calculate the total working time in milliseconds
                        let totalWorkingTimeMilliseconds = endTime - startTime;
        
                        // Convert total working time to hours, minutes, and seconds
                        let hours = Math.floor(totalWorkingTimeMilliseconds / (1000 * 60 * 60));
                        totalWorkingTimeMilliseconds %= 1000 * 60 * 60;
                        let minutes = Math.floor(totalWorkingTimeMilliseconds / (1000 * 60));
                        totalWorkingTimeMilliseconds %= 1000 * 60;
                        let seconds = Math.floor(totalWorkingTimeMilliseconds / 1000);
                        setStartTimes("");
                        setTotalWorking(`${hours} hours ${minutes} minutes ${seconds} seconds`)
                    }else if(end){
                        setStartTimes("")
                    }else{
                            setstartTime(start)
                            setStartType("Check Out");
                                          
                    }
                 })
                 .catch(err => {
                     console.error(err)
                 })
    }, [])

    useEffect(function Greeting() {
        // Get the current time
        const currentTime = new Date().getHours();
      
        // Define the greeting based on the time
        let greeting;
        if (currentTime < 12) {
          greeting = 'Good Morning';
        } else if (currentTime < 18) {
          greeting = 'Good Afternoon';
        } else {
          greeting = 'Good Evening';
        }
      
        setGreet(greeting)
    }, [])


    
    const {loading:leaveMarkAttd, handleAPI:handleaveMarkAttd} = useSimplePOSTAPI("/api/attendance");

    const MarkAttd = () => {
        handleaveMarkAttd({month: new Date().getMonth() + 1 , year: new Date().getFullYear() })
        function formatAMPM(date) {
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();
            const ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // handle midnight
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            const strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
            return strTime;
        }
        
        const currentTime = new Date();
        const formattedTime = formatAMPM(currentTime);
        setstartTime(formattedTime)
        setTotalWorking(startTimes);
        setStartType("Check Out")
    }

    const [modalOpen, setModalOpen] = useState(false);
    const [modal, setModal] = useState(false);

    const open = () => {
        setModal(true);
    };

    const close = () => {
        setModal(false);
    };

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const [salarystatus, setSalaryStatus] = useState([]);
    useEffect(() => {
        handleSalaryStatus({month: props.user.user.user_id})
             .then(data => {
                setSalaryStatus(data.data)
             })
    }, [])
    
     return (
          <>
              <Wrapper>     
                    <Col className="col-md-12 col-lg-8">
                        <Row>
                            <div class="col-md-12">
                                <div class="card banner">
                                    <Card.Body>
                                        <div class="row justify-content-center align-items-center banner-container">
                                            <div class="col-lg-6 banner-item">
                                                <div class="banner-text">
                                                    <h1 class="fw-bold mb-4">
                                                        Hello <span class="text-secondary">{props.user.user.name} !</span>
                                                    </h1>
                                                </div>
                                                <p class="mb-4">{greet}, Welcome to your dashboard. Start your today time for marking your presence.</p>
                                                <button type="button" class="btn btn-primary mb-2" onClick={MarkAttd}>{totalWOrking ? "Finished" : startType}</button>
                                                <p style={{color:"#4B3144"}}><b>{totalWOrking ? "Today Working : "+totalWOrking : startTimes}</b></p>
                                            </div>
                                            <div class="col-lg-6 banner-img">
                                                <div class="img">
                                                    <img src="../assets/images/dashboard/01.png" class="img-fluid w-75" alt="img8"/>
                                                </div>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </div>
                            </div>
                            
                            <Col className="col-md-12">
                                <Card >
                                    <Card.Header className="d-flex justify-content-between flex-wrap">
                                        <Card.Title>
                                            <h4>Monthly Attendance Overview</h4>
                                        </Card.Title>
                                        <div className="d-flex align-items-center align-self-center">
                                            <CardContent>
                                                <svg width="12"  style={{color:"#74CDCC"}} viewBox="0 0 24 24" fill="currentColor">
                                                    <g>
                                                        <circle cx="12" cy="12" r="8" fill="currentColor"></circle>
                                                    </g>
                                                </svg>
                                                <div className="ms-2">
                                                    <span style={{color:"#74CDCC"}}>Total Leaves</span>
                                                </div>
                                            </CardContent>
                                            <div className="d-flex align-items-center ms-3 text-secondary">
                                                <svg  width="12" viewBox="0 0 24 24" fill="currentColor">
                                                    <g>
                                                        <circle cx="12" cy="12" r="8" fill="currentColor"></circle>
                                                    </g>
                                                </svg>
                                                <div className="ms-2">
                                                    <span>Total Present</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card.Header>
                                    <Card.Body style={{textAlign:"center"}}>
                                        <div style={{width:"40%", textAlign:"center", margin:"auto auto auto 28%"}}>
                                            <ChartComp
                                                present={salarystatus.presentDays}
                                                absent={salarystatus.absentDays}
                                                leave={salarystatus.leaveDays}
                                            />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col className="col-md-12 col-lg-12">
                                <Card className="overflow-hidden">
                                    <TableFilters />
                                        <CardComponent>
                                            <TableComp data={leaveData}/>
                                        </CardComponent>
                                </Card>
                            </Col>
                        </Row>
                    </Col>

                    <Col className="col-md-12 col-lg-4">
                        <Row>
                            <div className="col-md-12 col-lg-12">
                                <Card>
                                    <Card.Header className="d-flex justify-content-between flex-wrap">
                                            <Card.Title><h4>Users</h4></Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <CardContent>
                                            <div>
                                                <h6 className="mb-3">Total Users</h6>
                                                <span>{statusData.InActive} InActive</span> <br />
                                                <span className="text-success">{statusData.active} Active</span>
                                            </div>
                                            <div id="d-activity-1" className="rounded-bar-chart"></div>
                                        </CardContent>
                                        <hr />
                                        <CardContent>
                                            <div>
                                                <h6 className="mb-3">Today Status</h6>
                                                <span>{statusData.Present} Present</span><br />
                                                <span className="text-danger">{statusData.Leave} Leave</span>
                                            </div>
                                            <div id="d-activity" className="rounded-bar-chart"></div>
                                        </CardContent>
                                    </Card.Body>
                                </Card>
                            </div>

                            <Col className="col-md-12 col-lg-12">
                                <CardComponent>
                                        <p>Your Current Month Status</p>
                                        <div className="d-flex align-itmes-center   mb-4">
                                            <div className="d-flex align-itmes-center me-0 me-md-4">
                                                <IconComponent iconCode="M16.9303 7C16.9621 6.92913 16.977 6.85189 16.9739 6.77432H17C16.8882 4.10591 14.6849 2 12.0049 2C9.325 2 7.12172 4.10591 7.00989 6.77432C6.9967 6.84898 6.9967 6.92535 7.00989 7H6.93171C5.65022 7 4.28034 7.84597 3.88264 10.1201L3.1049 16.3147C2.46858 20.8629 4.81062 22 7.86853 22H16.1585C19.2075 22 21.4789 20.3535 20.9133 16.3147L20.1444 10.1201C19.676 7.90964 18.3503 7 17.0865 7H16.9303ZM15.4932 7C15.4654 6.92794 15.4506 6.85153 15.4497 6.77432C15.4497 4.85682 13.8899 3.30238 11.9657 3.30238C10.0416 3.30238 8.48184 4.85682 8.48184 6.77432C8.49502 6.84898 8.49502 6.92535 8.48184 7H15.4932ZM9.097 12.1486C8.60889 12.1486 8.21321 11.7413 8.21321 11.2389C8.21321 10.7366 8.60889 10.3293 9.097 10.3293C9.5851 10.3293 9.98079 10.7366 9.98079 11.2389C9.98079 11.7413 9.5851 12.1486 9.097 12.1486ZM14.002 11.2389C14.002 11.7413 14.3977 12.1486 14.8858 12.1486C15.3739 12.1486 15.7696 11.7413 15.7696 11.2389C15.7696 10.7366 15.3739 10.3293 14.8858 10.3293C14.3977 10.3293 14.002 10.7366 14.002 11.2389Z"/>
                                                <div className="ms-3">
                                                    <h5>{salarystatus.presentDays}</h5>
                                                    <small className="mb-0">Present &nbsp; </small>
                                                </div>
                                            </div>
                                            <div className="d-flex align-itmes-center">
                                                <IconComponent iconCode={"M14.1213 11.2331H16.8891C17.3088 11.2331 17.6386 10.8861 17.6386 10.4677C17.6386 10.0391 17.3088 9.70236 16.8891 9.70236H14.1213C13.7016 9.70236 13.3719 10.0391 13.3719 10.4677C13.3719 10.8861 13.7016 11.2331 14.1213 11.2331ZM20.1766 5.92749C20.7861 5.92749 21.1858 6.1418 21.5855 6.61123C21.9852 7.08067 22.0551 7.7542 21.9652 8.36549L21.0159 15.06C20.8361 16.3469 19.7569 17.2949 18.4879 17.2949H7.58639C6.25742 17.2949 5.15828 16.255 5.04837 14.908L4.12908 3.7834L2.62026 3.51807C2.22057 3.44664 1.94079 3.04864 2.01073 2.64043C2.08068 2.22305 2.47038 1.94649 2.88006 2.00874L5.2632 2.3751C5.60293 2.43735 5.85274 2.72207 5.88272 3.06905L6.07257 5.35499C6.10254 5.68257 6.36234 5.92749 6.68209 5.92749H20.1766ZM7.42631 18.9079C6.58697 18.9079 5.9075 19.6018 5.9075 20.459C5.9075 21.3061 6.58697 22 7.42631 22C8.25567 22 8.93514 21.3061 8.93514 20.459C8.93514 19.6018 8.25567 18.9079 7.42631 18.9079ZM18.6676 18.9079C17.8282 18.9079 17.1487 19.6018 17.1487 20.459C17.1487 21.3061 17.8282 22 18.6676 22C19.4969 22 20.1764 21.3061 20.1764 20.459C20.1764 19.6018 19.4969 18.9079 18.6676 18.9079Z"} />
                                                <div className="ms-3">
                                                    <h5>{salarystatus.leaveDays}</h5>
                                                    <small className="mb-0">Leaves</small>
                                                </div>
                                            </div>
                                        </div>


                                        {IsPublished ?      
                                                <a href={"http://localhost:4000/salaryslips.pdf?month="+new Date().getMonth()+"&year="+new Date().getFullYear()+"&user_id="+props.user.user.RecordID} target="_blank" class="btn btn-primary d-flex justify-content-center align-items-center">
                                                    <svg width="20" class="text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.9303 7C16.9621 6.92913 16.977 6.85189 16.9739 6.77432H17C16.8882 4.10591 14.6849 2 12.0049 2C9.325 2 7.12172 4.10591 7.00989 6.77432C6.9967 6.84898 6.9967 6.92535 7.00989 7H6.93171C5.65022 7 4.28034 7.84597 3.88264 10.1201L3.1049 16.3147C2.46858 20.8629 4.81062 22 7.86853 22H16.1585C19.2075 22 21.4789 20.3535 20.9133 16.3147L20.1444 10.1201C19.676 7.90964 18.3503 7 17.0865 7H16.9303ZM15.4932 7C15.4654 6.92794 15.4506 6.85153 15.4497 6.77432C15.4497 4.85682 13.8899 3.30238 11.9657 3.30238C10.0416 3.30238 8.48184 4.85682 8.48184 6.77432C8.49502 6.84898 8.49502 6.92535 8.48184 7H15.4932ZM9.097 12.1486C8.60889 12.1486 8.21321 11.7413 8.21321 11.2389C8.21321 10.7366 8.60889 10.3293 9.097 10.3293C9.5851 10.3293 9.98079 10.7366 9.98079 11.2389C9.98079 11.7413 9.5851 12.1486 9.097 12.1486ZM14.002 11.2389C14.002 11.7413 14.3977 12.1486 14.8858 12.1486C15.3739 12.1486 15.7696 11.7413 15.7696 11.2389C15.7696 10.7366 15.3739 10.3293 14.8858 10.3293C14.3977 10.3293 14.002 10.7366 14.002 11.2389Z" fill="currentColor"></path>
                                                    </svg>
                                                    <span class="ms-2">View Previous Month Salary Slip</span>
                                                </a>
                                            :
                                            ""
                                        }
                                </CardComponent>
                            </Col>

                            <Col className="col-md-12 col-lg-12">
                                <Card>
                                    <Card.Header>
                                            <h4 className="card-title">Today Attendance Records</h4>
                                    </Card.Header>
                                    <Card.Body>
                                            <ListComponent data={data}/>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
            </Wrapper>
          </>
     )
}

export default withRedux(IndexScreen);
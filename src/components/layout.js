import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

export const CardComponent = ({children}) => {
      
    return (
         <>
            <div className="col-md-12">
                <div className="card banner">
                    <div class="card-body ">
                        <div className="row justify-content-center align-items-center banner-container">
                                {children}
                        </div>
                    </div>
                </div>
            </div>
         </>
    )
}


export const ImgComp = ({src}) => {
      
     return (
         <>
            <div className="img">
                <img src={src} className="img-fluid w-75" alt="img8" />
            </div>
         </>
     )
}


export const TableFilters = () => {
     return (
         <>
             <div className="card-header d-flex justify-content-between flex-wrap">
                <div className="header-title">
                    <h4 className="card-title mb-2">Today Leave Requests</h4>
                </div>
                <div className="btn-group" role="group" aria-label="Basic checkbox toggle button group">
                    <input type="checkbox" className="btn-check" id="btncheck1" /> 
                    <label className="btn btn-outline-primary" for="btncheck1">Today</label>

                    <input type="checkbox" className="btn-check" id="btncheck2" />
                    <label className="btn btn-outline-primary" for="btncheck2">This Week</label>

                    <input type="checkbox" className="btn-check" id="btncheck3" />
                    <label className="btn btn-outline-primary" for="btncheck3">This Month</label>
                </div>
            </div>
         </>
     )
}


export const TableComp = ({data}) => {
    
    return (
        <>
           <div className="table-responsive mt-4">
                <table id="basic-table" className="table table-striped mb-0 transactions-table" role="grid">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Assigned To</th>
                            <th>Subject</th>
                            <th>From</th>
                            <th>To</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => (
                              <tr>
                              <td>
                                  <div className="d-flex align-items-center">
                                      <img className="img-fluid me-3" width={"50px"} style={{borderRadius:"40px"}} src={item.image} alt="profile" />
                                      <h6>{item.LeaveRequester}</h6>
                                  </div>
                              </td>
                              <td>
                                  {item.AssignedUser}
                              </td>
                              <td>{item.subject}</td>
                              <td>{new Date(item.from_leave_date).toDateString()}</td>
                              <td>{new Date(item.to_leave_date).toDateString()}</td>
                          </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}


export const CardContent = ({children}) => {
    return (
        <>
            <div className="d-flex  align-items-center justify-content-between" style={{position:"relative"}}>
                {children}
            </div>        
        </>
    )
}


export const ListComponent = ({data}) => {
    return (
        <>
           <ul className="list-inline">
                {data.map(item => {
                    const attendanceData = JSON.parse(item.Attendance);
                    const startTime = attendanceData?.start;
                    const endDate = attendanceData?.endDate;

                    return startTime || attendanceData == "L" ? (
                    <li className="d-flex mb-4 align-items-center" key={item.id}>
                        <a href="#" className="text-primary p-2 bg-soft-primary avatar-40">
                        <svg width="21" viewBox="0 0 21 25" fill="currentcolor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.28862 23.998C6.5536 23.0666 0.39428 16.9198 0.0472757 14.6845C-0.299728 12.4492 1.34854 12.201 2.21605 12.3563C2.86023 12.4716 4.22192 14.213 4.88033 15.102C4.99677 15.2592 5.25233 15.1761 5.25233 14.9805V2.45522C5.25233 1.92495 5.37705 1.38987 5.70187 0.970726C7.00017 -0.704531 8.17055 0.0979736 8.82881 1.06838C9.07446 1.43052 9.15613 1.87233 9.15613 2.30992V7.24655C9.15613 6.632 9.30246 5.95667 9.84659 5.67102C10.3585 5.40232 10.9274 5.44638 11.4379 5.6202C12.2659 5.90218 12.6262 6.80571 12.6262 7.68044V8.22845C12.6262 7.58252 12.7966 6.89845 13.3347 6.54112C14.1148 6.02303 14.9402 6.17499 15.5954 6.52063C16.2666 6.87472 16.53 7.65553 16.53 8.41437V10.9847C16.53 9.75556 16.9063 8.20999 18.1336 8.27669C18.4136 8.2919 18.6911 8.36319 18.9501 8.46494C19.684 8.75335 20.0368 9.53366 20.0899 10.3204C20.2518 12.7177 20.5288 17.922 20 19.3412C19.306 21.2039 18.265 22.601 17.8312 23.0666C14.3612 26.0469 10.0236 24.9293 8.28862 23.998Z" fill="currentcolor" />
                        </svg>
                        </a>
                        <div className="ms-3 flex-grow-1">
                        <h6>{item.name}</h6>
                        {attendanceData === "L" ? (
                            <small className="mb-0">Leave</small>
                        ) : (
                            <small className="mb-0">{item.punch}</small>
                        )}
                        </div>
                        {endDate ? (
                        <p>{endDate?.split(",")[1]}</p>
                        ) : (
                        <p>{startTime?.split(",")[1]?? "10:00:00 AM"}</p>
                        )}
                    </li>
                    ) : null;
                })}
                </ul>

        </>
    )
}


export const IconComponent = ({width=20, iconCode, color="black", classes = "rounded bg-soft-primary"}) => {
     return (
         <>
            <div>
                <div className={"p-2 "+classes}>
                    <svg width={width} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d={iconCode} fill={color}></path>
                    </svg>
                </div>
            </div>
         </>
     )
}


export const ExportComp = () => {
    return (
        <>
           <div class="dropdown" >
                <button style={{border:"1px solid grey",  borderRadius:"20px"}} class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    Export
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li><a class="dropdown-item">PDF</a></li>
                    <li><a class="dropdown-item">Excel</a></li>
                </ul>
                </div>
        </>
    )
}
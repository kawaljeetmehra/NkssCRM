import React, { useEffect, useState } from "react";
import { Wrapper } from "../header";
import { Button, Card, Col, Container, FormSelect, Row, Table } from "react-bootstrap";
import { ExportComp, IconComponent } from "../../components/layout";
import { useSimplePOSTAPI } from "../../hooks/api";
import Swal from "sweetalert2";
import withRedux from "../../redux/setupRedux";

const AttendanceComp = (props) => {
    const [MonthID, setMonthID] = useState();
    const [Year, setYear] = useState();
    const [date, setDate] = useState();
    const {loading, handleAPI} = useSimplePOSTAPI("/api/fetchattendance");
    const {loading:PublishLoader, handleAPI:handlePublishAPI} = useSimplePOSTAPI("/api/publish");
    const [data, setData] = useState([]);

    const handleClick = () => {
        handleAPI({month:MonthID, year:Year}).then(data => {
            if(props.user.user.role_id == 2){
                   
                   let filter_attd = data.data.filter(item => item.user_id == props.user.user.RecordID);
                   setData(filter_attd)
            }else{
                setData(data.data)
            }
        }).catch(err => {
            console.error(err)
        })

        console.log(props.user.user.role_id)
        let date = new Date(Year, MonthID, 0).getDate();
        setDate(date)
    } 


    const handlePublish = () => {
        Swal.fire({
            title: "Are you sure want to publish?",
            text: "You would not be able to revert this",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes!"
          }).then((result) => {
            if (result.isConfirmed) {
                handlePublishAPI({month:MonthID, year:Year}).then(data => {
                    Swal.fire({
                        title: "Published!",
                        text: "You have Published Selected Month Salary Slip",
                        icon: "success"
                    });
                }).catch(err => {
                    console.error(err)
                })
            }
          });
    }

    let heading = [];
    for (let i = 1; i <= date; i++) {
        let currentDate = new Date(Year, MonthID - 1, i);
        let dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
        heading.push(
            <td
                key={i}
                style={{
                    backgroundColor: "#D2B4DE",
                    color: 'white',
                    borderRight: "4px solid white",
                    borderRadius: "10px"
                }}
            >
                <b>{i}</b>{dayName}
            </td>
        );
    }

    let tableData = [];
    data.map(item => {
        let key = 0;
        let children = [
            <td key={0}>
                <Card style={{ backgroundColor: "#D2B4DE", color: 'white', borderRight: "1px solid white", fontSize:"11px" }}>
                    <Card.Body>
                        <b>{item.name}</b>
                    </Card.Body>
                </Card>
            </td>
        ];
    
        for (let i = 1; i <= date; i++) {
            let attd = JSON.parse(item[i]);
            let currentDate = new Date(Year, MonthID - 1, i);
            let dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
            if(dayName == "Sunday"){
                children.push(
                     <td key={i}>
                        <Card style={{ backgroundColor: "#FFF1F8" , color:"red"}}>
                            <Card.Body>
                                <div style={{ fontSize: "13px", marginTop: "-20px", marginBottom: "-30px" }}>
                                     <p><b>Sunday</b></p>
                                    <p style={{ marginTop: "-10px" }}><b>OFF</b></p>
                                </div>
                            </Card.Body>
                        </Card>
                    </td>
                )
            }else{
                children.push(
                    <td key={i}>
                        <Card style={{ backgroundColor: "#FFF1F8" }}>
                            <Card.Body>
                                {attd == null ? 
                                      <>
                                        <div style={{ fontSize: "13px", marginTop: "-20px", marginBottom: "-30px", width:"100px" }}>
                                                <p>&nbsp; &nbsp; </p>
                                                <p style={{ marginTop: "-10px" }}>&nbsp; &nbsp; </p>
                                        </div>
                                      </>
                                    :
                                 attd == "L" ?
                                        <>
                                            <div style={{ fontSize: "13px", marginTop: "-20px", marginBottom: "-30px", color:"#FF8000" }}>
                                                <p><b>Approved</b></p>
                                                <p style={{ marginTop: "-10px" }}><b>Leave</b></p>
                                            </div>
                                        </>
                                    :
                                    <div style={{ fontSize: "13px", marginTop: "-20px", marginBottom: "-30px" }}>
                                        <p><b>Start Time:</b> {attd.start}</p>
                                        <p style={{ marginTop: "-10px" }}><b>End Time:</b> {attd.endDate}</p>
                                    </div>
                                }
                            </Card.Body>
                        </Card>
                    </td>
                );
            }
        }
    
        key++;
        let row = <tr>{children}</tr>;
        tableData.push(row);
    })

    return (
        <>
             <Wrapper>
               <Row>
                    <Col className="col-sm-12">
                        <Card>
                            <Card.Header className="d-flex justify-content-between">
                                <div className="header-title">
                                   <h4 className="card-title">Attendance</h4>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                      <Row>
                                          <Col className="col-md-3">
                                               <FormSelect onChange={(e) => setYear(e.target.value)} style={{border:"2px solid #403B3B", borderRadius:"20px"}}>
                                                     <option>***Year***</option>
                                                     <option>2023</option>
                                                     <option>2024</option>
                                               </FormSelect>
                                          </Col>
                                          <Col className="col-md-3">
                                               <FormSelect onChange={(e) => setMonthID(e.target.value)} style={{border:"2px solid #403B3B",  borderRadius:"20px"}}>
                                                     <option>***Month***</option>
                                                     <option value={1}>January</option>
                                                     <option value={2}>Feburary</option>
                                                     <option value={3}>March</option>
                                                     <option value={4}>April</option>
                                                     <option value={5}>May</option>
                                                     <option value={6}>June</option>
                                                     <option value={7}>July</option>
                                                     <option value={8}>August</option>
                                                     <option value={9}>September</option>
                                                     <option value={10}>October</option>
                                                     <option value={11}>November</option>
                                                     <option value={12}>December</option>
                                               </FormSelect>
                                          </Col>
                                          <Col className="col-md-2">
                                                    <Button onClick={handleClick} style={{border:"1px solid grey",  borderRadius:"20px"}}>
                                                        View Calender
                                                    </Button>
                                          </Col>
                                          <Col className="col-md-2">
                                                    <Button onClick={handlePublish} style={{border:"1px solid grey",  borderRadius:"20px"}}>
                                                        Publish
                                                    </Button>
                                          </Col>
                                          <Col className="col-md-2" >
                                                <div class="dropdown" >
                                                <button style={{border:"1px solid grey",  borderRadius:"20px"}} class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                    Export
                                                </button>
                                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                    <li><a class="dropdown-item" target="_blank" href={"http://localhost:4000/salaryslips.pdf?month="+MonthID+"&year="+Year}>PDF</a></li>
                                                </ul>
                                                </div>
                                          </Col>
                                      </Row>


                                    {!date ? 
                                         <>
                                            {/* <IconComponent width={"180"} classes="" iconCode={"M12.8701 12.6307C12.8701 13.1127 12.4771 13.5057 11.9951 13.5057C11.5131 13.5057 11.1201 13.1127 11.1201 12.6307V8.21069C11.1201 7.72869 11.5131 7.33569 11.9951 7.33569C12.4771 7.33569 12.8701 7.72869 12.8701 8.21069V12.6307ZM11.1251 15.8035C11.1251 15.3215 11.5161 14.9285 11.9951 14.9285C12.4881 14.9285 12.8801 15.3215 12.8801 15.8035C12.8801 16.2855 12.4881 16.6785 12.0051 16.6785C11.5201 16.6785 11.1251 16.2855 11.1251 15.8035Z"}/> */}
                                            {/* <h2 style={{marginTop:"-50px", marginBottom:"20%"}}>Please Select</h2> */}
                                         </>
                                         :
                                        <Container className="mt-md-5">
                                            <Row style={{overflow:"scroll"}}>
                                                <Col className="col-md-12">
                                                        <Table>
                                                            <tr style={{fontSize:"20px", borderBottom:"4px solid white"}}>
                                                                <td style={{backgroundColor:"#D2B4DE", color:'white', padding:"10px",borderRight:"4px solid white", borderRadius:"10px"}}>Employee</td>
                                                                {heading}
                                                            </tr>
                                                                {tableData}
                                                        </Table>
                                                </Col>
                                            </Row>
                                        </Container>
                                    }
                             </Card.Body>
                        </Card>
                    </Col>
                </Row>
             </Wrapper>
        </>
    )
}

export default withRedux(AttendanceComp);
import React, { useEffect, useState } from "react";
import { Wrapper } from "../header";
import { Button, Card, Col, Container, FormSelect, Row } from "react-bootstrap";
import DataTableComponent from "../../components/dataTable";
import { DateInput, Input, SelectInput } from "../../components/form";
import { ExportComp } from "../../components/layout";
import { useSimplePOSTAPI } from "../../hooks/api";
import withRedux from "../../redux/setupRedux";
import ModalComp from "../../components/model";
import Swal from "sweetalert2";

const LeaveComp = (props) => {
    const [text, setText] = useState('');
    const [data, setData] = useState([]);
    const [IsAdmin, setIsAdmin] = useState(props.user.user.role_id);

    const Heading = ["Profile", "Employee", "From", "To", "Assigned", "Status"];

    const { loading: userLoading, handleAPI: fetchUser, data:userData } = useSimplePOSTAPI("/api/fetchleaves");
    const [modalOpen, setModalOpen] = useState(false);
    const [modal, setModal] = useState(false);
    const {loading, handleAPI} = useSimplePOSTAPI("/api/requestleave");

    const {loading:confirmLoading, handleAPI:handleApprove} = useSimplePOSTAPI("/api/approveleave");
    const confirmRequest = async (request_leave_id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, approve it!"
          }).then((result) => {
            if (result.isConfirmed) {
                setData(prevData => {
                    const updatedData = prevData.map(item => {
                        if (item.RecordID === request_leave_id) {
                            return {
                                ...item,
                                Status: <button className="btn btn-success">Approved</button>
                            };
                        }
                        return item;
                    });
                    return updatedData;
                });
                handleApprove({ request_leave_id })
                Swal.fire({
                    title: "Aprroved!",
                    text: "Employee leave has been approved.",
                    icon: "success"
                });
            }
          });
    };
    
    
    const [DummyDate, setDummy] = useState([]);
    useEffect(() => {
            fetchUser({}).then((data) =>  {
                if(data.data.length == 0) return;
                let mapData = data.data.map(item => {
                    const Employee = item.LeaveRequester;
                    const Profile = item.image;
                    const From = new Date(item.from_leave_date).toDateString();
                    const To = new Date(item.to_leave_date).toDateString();
                    const Assigned = item.AssignedUser;
                    const Status = item.IsApproved == 1 ? <button className="btn btn-success">Approved</button> : IsAdmin == 1  ? <button className="btn btn-danger" onClick={() => confirmRequest(item.RecordID)}>Approve</button> : "";

                    return {
                        Profile,
                        Employee,
                        From,
                        To,
                        Assigned,
                        Status,
                        RecordID: item.RecordID
                    }
                })

                setData(mapData)
                setDummy(mapData);
            })
    }, [loading])

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



    const {loading:UserLoading, handleAPI:fetchUsers} = useSimplePOSTAPI("/api/users");
    const [usersData, setUserData] = useState([]);

    useEffect(() => {
        fetchUsers({}).then((data) =>  {
            // const Heading = ["Profile", "Employee", "DOJ", "Salary", "Action"];
            let mapData = data.data.map(item => {
                   const id = item.RecordID;
                   const Name = item.name;

                   return {
                       id,
                       Name
                   }
            })

            setUserData(mapData)
        })
    }, [])

    const [validationTxt, setValidationTxt] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        let from_leave_date = e.target.from_leave_date.value;
        let to_leave_date = e.target.to_leave_date.value;
        let leave_count = e.target.leave_count.value;
        let to_user_id = e.target.to_user_id.value;
        let username  = e.target.to_user_id.selectedOptions[0].text;;
        let description = e.target.description.value;
        let subject = e.target.subject.value;

        if(!from_leave_date){
              return setValidationTxt("Please Enter From Date!")
        }else if(!to_leave_date){
              return setValidationTxt("Please Enter To Date!")
        }else if(!to_user_id){
                return setValidationTxt("Please Select Assign!")
        }else if(!subject){
                return setValidationTxt("Please Type Subject!")
        }else if(!description){
                return setValidationTxt("Please Type Reason!")
        }

        let form = {
             from_leave_date,
             to_leave_date,
             leave_count,
             to_user_id,
             description,
             subject
        }

        let newData ={
            Profile :props.user.user.image,
            Employee : props.user.user.name,
            From : new Date(from_leave_date).toDateString(),
            To: new Date(to_leave_date).toDateString(),
            Assigned: username,
            Status:  IsAdmin == 1 ? <button className="btn btn-danger">Approve</button> : ""
        }


        setData([ newData,...data])
        handleAPI(form)
        closeModal()
        Swal.fire({
            title: "Good job!",
            text: "Request Sent!",
            icon: "success"
          });
          
    }


    const handleDate = (e) => {
         if(e.target.value){
               let val = new Date(e.target.value).toDateString();
               let filterDate = DummyDate.filter(item => item.From == val);

               setData(filterDate);
         }
    }

    return (
        <>
            <ModalComp isOpen={modalOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit}>
                    <p align="center" style={{color:"red"}}>{validationTxt}</p>
                    <Row className="mt-4">
                        <Col className="col-md-1 mt-2">
                                <label>
                                    <b>From</b>
                                </label>
                        </Col>
                        <Col className="col-md-5">
                                <DateInput name="from_leave_date"/>
                        </Col>

                        <Col className="col-md-1 mt-2">
                                <label>
                                    <b>To</b>
                                </label>
                        </Col>
                        <Col className="col-md-5">
                               <DateInput name="to_leave_date"/>
                        </Col>
                    </Row>

                    <Row className="mt-4">
                        <Col className="col-md-1 mt-2">
                                <label>
                                    <b>Count</b>
                                </label>
                        </Col>
                        <Col className="col-md-5">
                                <Input type={"number"} placeholder={"Leave Count"} attrName="leave_count"/>
                        </Col>

                        <Col className="col-md-1 mt-2">
                                <label>
                                    <b>Assign</b>
                                </label> 
                        </Col>
                        <Col className="col-md-5">
                               <FormSelect name="to_user_id" style={{border:"2px solid #403B3B",  borderRadius:"20px"}}>
                                    <option value={""}>**Select**</option>
                                    {usersData.map(item => (
                                           <option value={item.id}>{item.Name}</option>
                                    ))}
                                </FormSelect>
                        </Col>
                    </Row>

                    <Row className="mt1">
                        <Col className="col-md-1 mt-2">
                                <label>
                                    <b>Subject</b>
                                </label>
                        </Col>
                        <Col className="col-md-5">
                                <Input type={"text"} placeholder={"Enter Subject"} attrName="subject"/>
                        </Col>
                        <Col className="col-md-1 mt-2">
                                <label>
                                    <b>Info</b>
                                </label>
                        </Col>
                        <Col className="col-md-5">
                            <textarea placeholder="Enter Reason" style={{border:"2px solid #403B3B",  borderRadius:"20px"}} className="form-control" name="description"></textarea>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button type="submit">Request</Button>
                        </Col>
                    </Row>
                </form>
            </ModalComp>
            <Wrapper>
                <Container>
                    <Row>
                        <Card>
                            <Card.Header className="d-flex justify-content-between">
                                <div className="header-title">
                                    <h4 className="card-title">Leaves</h4>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col className={"col-md-3"}>
                                        <Input handleFunction={setText} placeholder={"Search..."} />
                                    </Col>
                                    <Col className={"col-md-2"}>
                                        <DateInput fnc={handleDate}/>
                                    </Col>
                                    <Col className={"col-md-2"}>
                                        <Button onClick={openModal}>Apply Leave</Button>
                                    </Col>
                                    <Col className="col-md-2"> 
                                    </Col>
                                    <Col className={"col-md-3"}>
                                        <ExportComp />
                                    </Col>
                                </Row>
                                <DataTableComponent value={text} data={data} Heading={Heading} />
                            </Card.Body>
                        </Card>
                    </Row>
                </Container>
            </Wrapper>
        </>
    );
}

export default withRedux(LeaveComp);

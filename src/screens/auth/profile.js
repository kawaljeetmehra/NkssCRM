import React, { useEffect, useState } from "react";
import withRedux from "../../redux/setupRedux";
import { HeaderComp, Wrapper } from "../header";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { DateInput, Input } from "../../components/form";
import { useOtherMultiAPI, usePostAPI, useSimplePOSTAPI } from "../../hooks/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


const ProfileComp = (props) => {

    const [image, setImage] = useState(props.user.user.image.replace(/\\/g, '/'));

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
        }
    };

    const navigation = useNavigate();
    const [text, setText] = useState();
    let k = "Task Progress"
    const [data, setData] = useState([]);
    
    const Heading = ["Profile", "Employee", "Email", "Designation"];
    
    const handleSearch = (v) => {
           setText(v)
    }

    const {data:api_data, loading, handleAPI} = useOtherMultiAPI("api/update");
    const [validationtxt, setvalidatTxt] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setvalidatTxt("")
        //console.log(e.target.name.value))
        if(!e.target.name.value){
            return  setvalidatTxt("Please Enter Name");
        }else if(!e.target.email.value){
            return setvalidatTxt("Please Enter Email");
        }
        Swal.fire({
            title: "Are you sure want to update?",
            text: "You have to login again for session refresh",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes!"
          }).then((result) => {
            if (result.isConfirmed) {
                handleAPI(['name', 'email', 'salary', 'email_key' ,'designation', 'bank_name', 'bank_account_number', 'ifsc', 'username', 'password'], e);
                    Swal.fire({
                        title: "Profile Updated!",
                        text: "Please logout and login again!",
                        icon: "success"
                    });
            }
          });
        //setModalOpen(false)
    }

    return (
        <>
          <Wrapper>
            <div class="row">
                <div class="col-lg-12">
                    <div class="card">
                        <div class="iq-header-img">
                            <img src="../../assets/images/icons/15.png" alt="header" class="img-fluid w-100 h-100"        style={{ objectFit: 'contain' }} />
                        </div>
                        <div class="card-body">
                            <div class="d-flex flex-wrap align-items-center justify-content-between">
                                <div class="d-flex flex-wrap align-items-center">
                                    <div class="profile-img position-relative me-3 mb-3 mb-lg-0">
                                        <img src={props.user.user.image} class="img-fluid rounded-pill bg-white avatar-100" alt="profile-image" />
                                    </div>
                                    <div class="d-flex flex-wrap align-items-center mb-3 mb-sm-0">
                                        <h4 class="me-2 h4">{props.user.user.name}</h4>
                                        <span> - {props.user.user.designation}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                            <form onSubmit={handleSubmit} enctype="multipart/form-data">
                                 <Row className="justify-content-center text-center p-4">
                                    <Col>
                                        <label htmlFor="imageUpload">
                                        <span
                                            style={{
                                            border:"3px solid #4B3144",
                                            height: "130px",
                                            width: "130px",
                                            marginTop:"-20%",
                                            borderRadius: "50px",
                                            display: "block",
                                            cursor: "pointer",
                                            backgroundImage: image ? `url("${image}")` : '',
                                            backgroundSize: "cover",
                                            }}
                                        ></span>
                                        </label>
                                        <input
                                        type="file"
                                        name="file"
                                        id="imageUpload"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={handleImageUpload}
                                        />
                                    </Col>
                                    </Row>
                                    <p style={{color:"red", textAlign:"center"}}>{validationtxt}</p>
                                <Row>
                                        <Col className="col-md-1 mt-2">
                                            <label>
                                                <b>Name</b>
                                            </label>
                                        </Col>
                                        <Col className="col-md-5">
                                            <Input attrName="name" value={props.user.user.name} type={"text"} placeholder="Enter Name"/>
                                        </Col>

                                        <Col className="col-md-1 mt-2">
                                            <label>
                                                <b>Email</b>
                                            </label>
                                        </Col>
                                        <Col className="col-md-5">
                                            <Input attrName={"email"} value={props.user.user.email} type={"email"} placeholder="Enter Email"/>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col className="col-md-1 mt-2">
                                            <label>
                                                <b>Salary</b>
                                            </label>
                                        </Col>
                                        <Col className="col-md-5">
                                            <Input attrName={"salary"} value={props.user.user.salary} type={"number"} placeholder="Enter Salary"/>
                                        </Col>

                                        <Col className="col-md-1 mt-2">
                                            <label>
                                                <b>Key</b>
                                            </label>
                                        </Col>
                                        <Col className="col-md-5">
                                            <Input attrName={"email_key"} value={props.user.user?.email_key} type={"text"} placeholder="Enter Security Pass"/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="col-md-1 mt-2">
                                            <label>
                                                <b>Role</b>
                                            </label>
                                        </Col>
                                        <Col className="col-md-5">
                                            <Input attrName={"designation"}  value={props.user.user?.designation} type={"text"} placeholder="Enter Designation"/>
                                        </Col>

                                        <Col className="col-md-1 mt-2">
                                            <label>
                                                <b>Bank</b>
                                            </label>
                                        </Col>
                                        <Col className="col-md-5">
                                            <Input attrName={"bank_name"} value={props.user.user?.bank_name} type={"text"} placeholder="Enter Bank Name"/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="col-md-1 mt-2">
                                            <label>
                                                <b>Account</b>
                                            </label>
                                        </Col>
                                        <Col className="col-md-5">
                                            <Input attrName={"bank_account_number"}  value={props.user.user?.bank_account_number} type={"text"} placeholder="Enter Bank Account Number"/>
                                        </Col>

                                        <Col className="col-md-1 mt-2">
                                            <label>
                                                <b>IFSC</b>
                                            </label>
                                        </Col>
                                        <Col className="col-md-5">
                                            <Input attrName={"ifsc"} type={"text"} value={props.user.user?.ifsc} placeholder="Enter IFSC Code"/>
                                        </Col>
                                    </Row>
                                        <Row>
                                            <Col className="col-md-1 mt-2">
                                                <label>
                                                <b>User</b>
                                                </label>
                                            </Col>
                                            <Col className="col-md-5">
                                                <Input attrName={"username"} value={props.user.user?.username} type={"text"} placeholder="Enter Username"/>
                                            </Col>

                                            <Col className="col-md-1 mt-2">
                                                <label>
                                                <b>Pass</b>
                                                </label>
                                            </Col>
                                            <Col className="col-md-5">
                                                <Input attrName={"password"} value={props.user.user?.password} type={"text"} placeholder="Enter Password"/>
                                            </Col>
                                        </Row>
                                    <Row>
                                            <Col>
                                            <Button type="submit" disabled={loading}>{loading ? "Submitting...." : "Submit"}</Button>
                                            </Col>
                                    </Row>
                        </form>
                    </div>
                </div>
            </div>
          </Wrapper>
        </>
    )
}

export default withRedux(ProfileComp);
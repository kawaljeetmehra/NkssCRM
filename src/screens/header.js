import React, { useContext, useEffect, useState } from "react";
import { NavComp } from "../components/nav";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { MyContext } from "./context";
import { Link, useLocation, useNavigate, useNavigation } from "react-router-dom";
import ModalComp from "../components/model";
import { DateInput, Input } from "../components/form";
import DataTableComponent from "../components/dataTable";
import { ExportComp } from "../components/layout";
import withRedux from "../redux/setupRedux";
import Swal from 'sweetalert2';
import { useOtherMultiAPI, usePostAPI, useSimplePOSTAPI } from "../hooks/api";

export const HeaderComp = ()  => {

    const { showNav, handleNav } = useContext(MyContext);
    const [loader, setLoader] = useState(true)
    useEffect(() => {
        setInterval(() => {
            setLoader(false)
        }, 2000)
    });
    
    return (
        <>
            <div id="loading">
                <div className={ loader ? "loader simple-loader" : ""}>
                    <div class="loader-body"></div>
                </div>
            </div>
            <aside className={showNav? "sidebar sidebar-default navs-shape on-resize" : "sidebar sidebar-default navs-shape on-resize sidebar-mini"}>
                    <div  className="sidebar-header d-flex align-items-center justify-content-start">
                        <a href="../dashboard/index.html" className="navbar-brand d-flex justify-content-center align-items-center">
                            <img src="../nkss_logo.PNG" width={"60px"} className="sidebar-color-logo  " />
                            <p className="logo-title m-0" style={{fontSize:"16px", marginLeft:"-15px"}}><b>&nbsp; Nkss Pvt. Ltd.</b></p>
                        </a>
                        <div  onClick={handleNav} className="sidebar-toggle" data-toggle="sidebar" data-active="true">
                            <i className="icon" onClick={handleNav}>
                                <svg onClick={handleNav} width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path onClick={handleNav} d="M4.25 12.2744L19.25 12.2744" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path onClick={handleNav} d="M10.2998 18.2988L4.2498 12.2748L10.2998 6.24976" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </i>
                        </div>
                    </div>
                    <div className="sidebar-body pt-0 data-scrollbar">
                        {<NavComp />}
                        <div id="sidebar-footer" className="sidebar-footer-color">
                            <div className="sidebar-footer-main pb-5">
                                <div className="card ms-3 me-3 bg-white sidebar-footer-contain">
                                    <div className="card-body">
                                        <div className="sidebarbottom-content">
                                            <div>
                                                <img src="../assets/images/icons/09.png" alt="icon" className="img-fluid" />
                                            </div>
                                            <h5 className="mt-3"><span className="text-secondary">Be more</span> secure <span className="text-secondary">with</span> Pro Feature</h5>
                                            <button type="button" className="btn btn-secondary mt-3">Upgrade Now</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="sidebar-footer" className="position-relative sidebar-footer sidebar-footer-default mt-md-12 mt-lg-12" style={{marginTop:"150%"}}>
                            <div className="sidebar-footer-main pb-5">
                                <div className="card ms-3 me-3 bg-primary sidebar-footer-contain">
                                    <div className="card-body">
                                        <div className="sidebarbottom-content">
                                            <h5 className="text-white mt-3">&nbsp;</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="image text-center sidebar-footer-image">
                                    <img src="../assets/images/icons/09.png" alt="icon" className="img-fluid" />
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>      
        </>
    )
}


export const ProfileHead = withRedux((props) => {
    const { showNav, handleNav } = useContext(MyContext);
    const location = useLocation();

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

    const [image, setImage] = useState("../assets/images/avatars/01.png");

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


    const [text, setText] = useState();
    let k = "Task Progress"
    const [data, setData] = useState([]);
    
    const Heading = ["Profile", "Employee", "Email", "Designation"];
    
    const handleSearch = (v) => {
           setText(v)
    }

    const logoutUser = () => {
        Swal.fire({
            title: "Are you sure want to logout?",
            text: "You have to login again",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes!"
          }).then((result) => {
            if (result.isConfirmed) {
                props.logout();
                Swal.fire({
                    title: "Deleted!",
                    text: "You have been logged out",
                    icon: "success"
                });
            }
          });
    }

    const {data:api_data, loading, handleAPI} = useOtherMultiAPI("api/auth/register");
    const [validationtxt, setvalidatTxt] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setvalidatTxt("")
        if(!e.target.name.value){
            return  setvalidatTxt("Please Enter Name");
        }else if(!e.target.email.value){
            return setvalidatTxt("Please Enter Email");
        }else if(!e.target.doj.value){
            return setvalidatTxt("Please Enter Date of Joining");
        }else if(!e.target.file.value){
            return setvalidatTxt("Please Select Image");
        }
        handleAPI(['name', 'email', 'salary', 'doj', 'designation', 'bank_name', 'bank_account_number', 'ifsc', 'username', 'password'], e);
        setModalOpen(false)
    }
    

    const {loading:UserLoading, handleAPI:fetchUser} = useSimplePOSTAPI("/api/users");

    useEffect(() => {
        fetchUser({}).then((data) =>  {
            // const Heading = ["Profile", "Employee", "DOJ", "Salary", "Action"];
            let mapData = data.data.map(item => {
                   const Employee = item.name;
                   const Email = item.email;
                   const Designation = item.designation;
                   const id = item.RecordID;
                   const Profile = item.image;

                   return {
                       id,
                       Employee,
                       Email,
                       Designation,
                       Profile
                   }
            })

            setData(mapData)
        })
    }, [api_data])
     return (
         <>
            <ModalComp isOpen={modalOpen} onClose={closeModal}>
                   <form onSubmit={handleSubmit}>
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
                                    backgroundImage: `url(${image})`,
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
                                     <Input attrName="name" type={"text"} placeholder="Enter Name"/>
                                </Col>

                                <Col className="col-md-1 mt-2">
                                     <label>
                                         <b>Email</b>
                                     </label>
                                </Col>
                                <Col className="col-md-5">
                                     <Input attrName={"email"} type={"email"} placeholder="Enter Email"/>
                                </Col>
                            </Row>

                            <Row>
                                <Col className="col-md-1 mt-2">
                                     <label>
                                        <b>Salary</b>
                                     </label>
                                </Col>
                                <Col className="col-md-5">
                                     <Input attrName={"salary"} type={"number"} placeholder="Enter Salary"/>
                                </Col>

                                <Col className="col-md-1 mt-2">
                                     <label>
                                         <b>DOJ</b>
                                     </label>
                                </Col>
                                <Col className="col-md-5">
                                     <Input attrName={"doj"} type={"date"} placeholder="Enter DOJ"/>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="col-md-1 mt-2">
                                    <label>
                                        <b>Role</b>
                                    </label>
                                </Col>
                                <Col className="col-md-5">
                                    <Input attrName={"designation"} type={"text"} placeholder="Enter Designation"/>
                                </Col>

                                <Col className="col-md-1 mt-2">
                                    <label>
                                        <b>Bank</b>
                                    </label>
                                </Col>
                                <Col className="col-md-5">
                                    <Input attrName={"bank_name"} type={"text"} placeholder="Enter Bank Name"/>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="col-md-1 mt-2">
                                    <label>
                                        <b>Account</b>
                                    </label>
                                </Col>
                                <Col className="col-md-5">
                                    <Input attrName={"bank_account_number"} type={"text"} placeholder="Enter Bank Account Number"/>
                                </Col>

                                <Col className="col-md-1 mt-2">
                                    <label>
                                        <b>IFSC</b>
                                    </label>
                                </Col>
                                <Col className="col-md-5">
                                    <Input attrName={"ifsc"} type={"text"} placeholder="Enter IFSC Code"/>
                                </Col>
                            </Row>
                                <Row>
                                    <Col className="col-md-1 mt-2">
                                        <label>
                                           <b>User</b>
                                        </label>
                                    </Col>
                                    <Col className="col-md-5">
                                        <Input attrName={"username"} type={"text"} placeholder="Enter Username"/>
                                    </Col>

                                    <Col className="col-md-1 mt-2">
                                        <label>
                                           <b>Pass</b>
                                        </label>
                                    </Col>
                                    <Col className="col-md-5">
                                        <Input attrName={"password"} type={"password"} placeholder="Enter Password"/>
                                    </Col>
                                </Row>
                            <Row>
                                    <Col>
                                      <Button type="submit" disabled={loading}>{loading ? "Submitting...." : "Submit"}</Button>
                                    </Col>
                            </Row>
                 </form>
            </ModalComp>

            <ModalComp isOpen={modal} onClose={close}>
            <Container className="p-4">
                   <Row  className="p-2">
                        <Row>
                            <Col className={"col-md-5"}>
                                    <Input handleFunction={handleSearch} placeholder={"Search..."}/>
                            </Col>
                            <Col className="col-md-4">
                            </Col>
                            <Col className={"col-md-3"}>
                                <ExportComp />
                            </Col>
                        </Row>
                        <DataTableComponent value={text} data={data} Heading={Heading}/>
                    </Row>
               </Container>
             </ModalComp>
            <div className="position-relative">
                    <nav className="nav navbar navbar-expand-lg navbar-light iq-navbar">
                        <div className="container-fluid navbar-inner">
                            <a href="../dashboard/index.html" className="navbar-brand">
                                <h4 className="logo-title"></h4>
                            </a>
                            <div className="sidebar-toggle" data-toggle="sidebar" data-active="true">
                                <i className="icon" onClick={handleNav}>
                                    <svg width="20px" height="20px" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
                                    </svg>
                                </i>
                            </div>
                            <h5 className="title text-primary mt-3">
                               <div class="bd-example">
                                    <nav aria-label="breadcrumb">
                                        <ol class="breadcrumb">
                                            <li class=""><a href="#">Home</a></li>
                                            <li class="breadcrumb-item active" aria-current="page">&nbsp; {location.pathname !== "/" ? " / "+location.pathname.replace("/", "").toUpperCase() : ""}</li>
                                        </ol>
                                    </nav>
                                </div>
                            </h5>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon">
                                    <span className="navbar-toggler-bar bar1 mt-2"></span>
                                    <span className="navbar-toggler-bar bar2"></span>
                                    <span className="navbar-toggler-bar bar3"></span>
                                </span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav ms-auto  navbar-list mb-2 mb-lg-0 align-items-center">
                                    <li className="nav-item dropdown">
                                        <a href="#" className="nav-link" id="mail-drop" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <svg width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path opacity="0.4" d="M22 15.94C22 18.73 19.76 20.99 16.97 21H16.96H7.05C4.27 21 2 18.75 2 15.96V15.95C2 15.95 2.006 11.524 2.014 9.298C2.015 8.88 2.495 8.646 2.822 8.906C5.198 10.791 9.447 14.228 9.5 14.273C10.21 14.842 11.11 15.163 12.03 15.163C12.95 15.163 13.85 14.842 14.56 14.262C14.613 14.227 18.767 10.893 21.179 8.977C21.507 8.716 21.989 8.95 21.99 9.367C22 11.576 22 15.94 22 15.94Z" fill="currentColor"></path>
                                                <path d="M21.4759 5.67351C20.6099 4.04151 18.9059 2.99951 17.0299 2.99951H7.04988C5.17388 2.99951 3.46988 4.04151 2.60388 5.67351C2.40988 6.03851 2.50188 6.49351 2.82488 6.75151L10.2499 12.6905C10.7699 13.1105 11.3999 13.3195 12.0299 13.3195C12.0339 13.3195 12.0369 13.3195 12.0399 13.3195C12.0429 13.3195 12.0469 13.3195 12.0499 13.3195C12.6799 13.3195 13.3099 13.1105 13.8299 12.6905L21.2549 6.75151C21.5779 6.49351 21.6699 6.03851 21.4759 5.67351Z" fill="currentColor"></path>
                                            </svg>
                                            <span className="bg-primary count-mail"></span>
                                        </a>
                                        <div className="sub-drop dropdown-menu dropdown-menu-end p-0" aria-labelledby="mail-drop">
                                            <div className="card shadow-none m-0">
                                                <div className="card-header d-flex justify-content-between bg-primary py-3">
                                                    <div className="header-title">
                                                        <h5 className="mb-0 text-white">All Message</h5>
                                                    </div>
                                                </div>
                                                <div className="card-body p-0 ">
                                                    <a href="#" className="iq-sub-card">
                                                        <div className="d-flex  align-items-center">
                                                            <div className="">
                                                                <img className="avatar-40 rounded-pill bg-soft-primary p-1" src="../assets/images/pages/01.png" alt="" />
                                                            </div>
                                                            <div className=" w-100 ms-3">
                                                                <h6 className="mb-0 ">Bni Emma Watson</h6>
                                                                <small className="float-left font-size-12">13 Jun</small>
                                                            </div>
                                                        </div>
                                                    </a>
                                                    <a href="#" className="iq-sub-card">
                                                        <div className="d-flex align-items-center">
                                                            <div className="">
                                                                <img className="avatar-40 rounded-pill bg-soft-primary p-1" src="../assets/images/pages/02.png" alt="" />
                                                            </div>
                                                            <div className="ms-3">
                                                                <h6 className="mb-0 ">Lorem Ipsum Watson</h6>
                                                                <small className="float-left font-size-12">20 Apr</small>
                                                            </div>
                                                        </div>
                                                    </a>
                                                    <a href="#" className="iq-sub-card">
                                                        <div className="d-flex align-items-center">
                                                            <div className="">
                                                                <img className="avatar-40 rounded-pill bg-soft-primary p-1" src="../assets/images/pages/03.png" alt="" />
                                                            </div>
                                                            <div className="ms-3">
                                                                <h6 className="mb-0 ">Why do we use it?</h6>
                                                                <small className="float-left font-size-12">30 Jun</small>
                                                            </div>
                                                        </div>
                                                    </a>
                                                    <a href="#" className="iq-sub-card">
                                                        <div className="d-flex align-items-center">
                                                            <div className="">
                                                                <img className="avatar-40 rounded-pill bg-soft-primary p-1" src="../assets/images/pages/04.png" alt="" />
                                                            </div>
                                                            <div className="ms-3">
                                                                <h6 className="mb-0 ">Variations Passages</h6>
                                                                <small className="float-left font-size-12">12 Sep</small>
                                                            </div>
                                                        </div>
                                                    </a>
                                                    <a href="#" className="iq-sub-card">
                                                        <div className="d-flex align-items-center">
                                                            <div className="">
                                                                <img className="avatar-40 rounded-pill bg-soft-primary p-1" src="../assets/images/pages/05.png" alt="" />
                                                            </div>
                                                            <div className="ms-3">
                                                                <h6 className="mb-0 ">Lorem Ipsum generators</h6>
                                                                <small className="float-left font-size-12">5 Dec</small>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a href="#" className="nav-link" id="notification-drop" data-bs-toggle="dropdown">
                                            <svg width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M19.7695 11.6453C19.039 10.7923 18.7071 10.0531 18.7071 8.79716V8.37013C18.7071 6.73354 18.3304 5.67907 17.5115 4.62459C16.2493 2.98699 14.1244 2 12.0442 2H11.9558C9.91935 2 7.86106 2.94167 6.577 4.5128C5.71333 5.58842 5.29293 6.68822 5.29293 8.37013V8.79716C5.29293 10.0531 4.98284 10.7923 4.23049 11.6453C3.67691 12.2738 3.5 13.0815 3.5 13.9557C3.5 14.8309 3.78723 15.6598 4.36367 16.3336C5.11602 17.1413 6.17846 17.6569 7.26375 17.7466C8.83505 17.9258 10.4063 17.9933 12.0005 17.9933C13.5937 17.9933 15.165 17.8805 16.7372 17.7466C17.8215 17.6569 18.884 17.1413 19.6363 16.3336C20.2118 15.6598 20.5 14.8309 20.5 13.9557C20.5 13.0815 20.3231 12.2738 19.7695 11.6453Z" fill="currentColor"></path>
                                                <path opacity="0.4" d="M14.0088 19.2283C13.5088 19.1215 10.4627 19.1215 9.96275 19.2283C9.53539 19.327 9.07324 19.5566 9.07324 20.0602C9.09809 20.5406 9.37935 20.9646 9.76895 21.2335L9.76795 21.2345C10.2718 21.6273 10.8632 21.877 11.4824 21.9667C11.8123 22.012 12.1482 22.01 12.4901 21.9667C13.1083 21.877 13.6997 21.6273 14.2036 21.2345L14.2026 21.2335C14.5922 20.9646 14.8734 20.5406 14.8983 20.0602C14.8983 19.5566 14.4361 19.327 14.0088 19.2283Z" fill="currentColor"></path>
                                            </svg>
                                            <span className="bg-danger dots"></span>
                                        </a>
                                        <div className="sub-drop dropdown-menu dropdown-menu-end p-0" aria-labelledby="notification-drop">
                                            <div className="card shadow-none m-0">
                                                <div className="card-header d-flex justify-content-between bg-primary py-3">
                                                    <div className="header-title">
                                                        <h5 className="mb-0 text-white">All Notifications</h5>
                                                    </div>
                                                </div>
                                                <div className="card-body p-0">
                                                    <a href="#" className="iq-sub-card">
                                                        <div className="d-flex align-items-center">
                                                            <img className="avatar-40 rounded-pill bg-soft-primary p-1" src="../assets/images/pages/01.png" alt="" />
                                                            <div className="ms-3 w-100">
                                                                <h6 className="mb-0 ">Emma Watson Bni</h6>
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <p className="mb-0">95 MB</p>
                                                                    <small className="float-right font-size-12">Just Now</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </a>
                                                    <a href="#" className="iq-sub-card">
                                                        <div className="d-flex align-items-center">
                                                            <div className="">
                                                                <img className="avatar-40 rounded-pill bg-soft-primary p-1" src="../assets/images/pages/02.png" alt="" />
                                                            </div>
                                                            <div className="ms-3 w-100">
                                                                <h6 className="mb-0 ">New customer is join</h6>
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <p className="mb-0">Cyst Bni</p>
                                                                    <small className="float-right font-size-12">5 days ago</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </a>
                                                    <a href="#" className="iq-sub-card">
                                                        <div className="d-flex align-items-center">
                                                            <img className="avatar-40 rounded-pill bg-soft-primary p-1" src="../assets/images/pages/03.png" alt="" />
                                                            <div className="ms-3 w-100">
                                                                <h6 className="mb-0 ">Two customer is left</h6>
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <p className="mb-0">Cyst Bni</p>
                                                                    <small className="float-right font-size-12">2 days ago</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </a>
                                                    <a href="#" className="iq-sub-card">
                                                        <div className="d-flex align-items-center">
                                                            <img className="avatar-40 rounded-pill bg-soft-primary p-1" src="../assets/images/pages/04.png" alt="" />
                                                            <div className="w-100 ms-3">
                                                                <h6 className="mb-0 ">New Mail from Fenny</h6>
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <p className="mb-0">Cyst Bni</p>
                                                                    <small className="float-right font-size-12">3 days ago</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a className="nav-link py-0 d-flex align-items-center" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <img src={props.user.user.image} alt="User-Profile" className="img-fluid avatar avatar-50 avatar-rounded" />
                                            <div className="caption ms-3 d-none d-md-block ">
                                                <h6 className="mb-0 caption-title">{props.user.user.name}</h6>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                            </svg>
                                        </a>
                                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                            <li><Link to="/profile"><a className="dropdown-item">Profile</a></Link></li>
                                            <li onClick={() => openModal()}><a className="dropdown-item">Add User</a></li>
                                            <li onClick={() => open()}><a className="dropdown-item">Show Users</a></li>
                                            <li>
                                                <hr className="dropdown-divider" />
                                            </li>
                                            <li style={{cursor:"pointer"}}><a className="dropdown-item" onClick={logoutUser}>Logout</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
         </>
     )
})


export const Wrapper = ({children}) => {
     return (
         <>
            <HeaderComp />
                <main className="main-content">
                    <ProfileHead />
                            <Container className="conatiner-fluid content-inner mt-5 py-0">
                                <Row>
                                        {children}
                                </Row>
                            </Container>
                </main>
         </>
     )
}


export const ContainerRowCol = ({colClass, rowClass, children}) => {
       return (
         <>
            <Container>
                  <Row className={rowClass}>
                      <Col className={colClass}>
                            {children}
                      </Col>
                  </Row>
            </Container>
         </>
       )
}
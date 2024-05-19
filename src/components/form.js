import React, { useEffect, useRef, useState } from "react";
import 'animate.css';
import $, { fn } from 'jquery'
import { Col, Row } from "react-bootstrap";

export const Input = ({icon, name, type, attrName,handleInput, handleFunction, value, keyPress, placeholder}) => {
    const [val, setVal] = useState();
    const handleChange = e => {
        setVal(e.target.value)
        if(handleFunction) handleFunction(e.target.value);
        if(handleInput) handleInput(e);
    }

    useEffect(() => {
        setVal(value)
    }, [])


       return (
          <>
                <div className="d-flex flex-row align-items-center mb-4">
                    {icon}
                    <div className="form-outline flex-fill mb-0">
                    <input style={{border:"2px solid #403B3B", borderRadius:"20px"}} type={type} value={val?? ""} onKeyPress={keyPress} onChange={handleChange} placeholder={placeholder} name={attrName} id="form3Example1c" className="form-control" />
                    </div>
                </div>
          </>
       )
}

export const SelectInput = ({icon, name, type, attrName,handleInput, handleFunction, value, keyPress}) => {
  const [val, setVal] = useState();
  const handleChange = e => {
      setVal(e.target.value)
      if(handleFunction) handleFunction(e.target.value);
      if(handleInput) handleInput(e);
  }

  useEffect(() => {
      setVal(value)
  }, [])


     return (
        <>
              <div className="d-flex flex-row align-items-center mb-4">
                  {icon}
                  <div className="form-outline flex-fill mb-0">
                     <select className="form-control" placeholder={"Enter "+name} name={attrName} style={{fontSize:"13px", borderRadius:"20px"}}>
                         <option>**Select {name}**</option>
                         <option value={"1"}>Jobs</option>
                         <option value={"2"}>Placement</option>
                     </select>
                  </div>
              </div>
        </>
     )
}

export const FileInput = () => {
    const [imagePreview, setImagePreview] = useState("https://canningsolicitors.ie/wp-content/uploads/2021/12/00-user-dummy-200x200-1.png"); // Replace with your dummy image URL
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const input = e.target;

        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                setImagePreview(e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    const handlePreviewClick = () => {
        fileInputRef.current.click();
    }

    return (
         <>
            <style>
                 {`
                      h1 {
                        font-size: 20px;
                        text-align: center;
                        margin: 20px 0 20px;
                      }
                      .avatar-upload {
                        position: relative;
                        max-width: 205px;
                        margin: 0 -20px 0 auto;
                      }
                      .avatar-upload .avatar-edit {
                        position: absolute;
                        right: 12px;
                        z-index: 1;
                        top: 10px;
                      }
                      .avatar-upload .avatar-edit input {
                        display: none;
                      }
                    
                      .avatar-upload .avatar-edit input + label:after {
                        content: "\f040";
                        font-family: 'FontAwesome';
                        color: #F6B21B;
                        position: absolute;
                        left: 0;
                        right: 0;
                        text-align: center;
                        margin: auto;
                      }
                      .avatar-upload .avatar-preview {
                        width: 112px;
                        height: 112px;
                        position: relative;
                        border-radius: 100%;
                        border: 5px solid #E6E6E6;
                        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
                        cursor:pointer;
                      }
                      .avatar-upload .avatar-preview > div {
                        width: 100%;
                        height: 100%;
                        border-radius: 100%;
                        background-size: cover;
                        background-repeat: no-repeat;
                        background-position: center;
                      }
                      
                  `}
            </style>
            <div className="container" style={{marginBottom:"8px"}}>
                <div className="avatar-upload">
                    <div className="avatar-edit">
                        <input
                            type="file"
                            id="imageUpload"
                            accept=".png, .jpg, .jpeg"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                            name="image"
                            style={{ display: "none" }}
                        />
                        <label htmlFor="imageUpload"></label>
                    </div>
                    <div className="avatar-preview" onClick={handlePreviewClick}>
                        <div id="imagePreview" style={{ backgroundImage: `url(${imagePreview})` }}></div>
                    </div>
                </div> 
            </div>
         </>
    )
}

export const FormFileInput = () => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFileName(selectedFile.name);
  };

  return (
   <Row>
  <Col className="col-md-3">
    <div style={{ position: 'relative' }}>
      <input
        type="file"
        className="form-control"
        placeholder="Enter File"
        name="file"
        style={{ position: 'absolute', left: 0, top: 0, opacity: 0 }}
        onChange={handleFileChange}
      />
      <label
        htmlFor="fileInput"
        placeholder="Enter file"
        style={{
          marginTop: '30px',
          color: 'black', // Change color here
          padding: '6px 10px',
          cursor: 'pointer',
          borderRadius: '5px',
        }}
        title="Select Image"
      >
        <i className="fa fa-image" htmlFor="fileInput" style={{ marginRight: '5px' }}></i>
        <span>Media</span>
      </label>
    </div>
  </Col>
</Row>

  );
};



export const DateInput = ({name, fnc}) => {

    const handleDateVal = (e) => {
       if(fnc) fnc(e)
    }
    return (
       <>
          <input type="date" name={name} onChange={handleDateVal} className="form-control" style={{border:"2px solid #403B3B", borderRadius:"20px"}}/>
       </>
    )
}



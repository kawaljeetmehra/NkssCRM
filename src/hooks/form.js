import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMulipartAPI, useOtherMultiAPI, usePostAPI } from "./api";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {loginHere} from '../redux';
import Swal from "sweetalert2";

export const useFormSubmit = (validation, route, token="", link) => {
        const [checkPass, setCheckPass] = useState([false, ""]);
        const [data, handleAPI] = useMulipartAPI();
        const {data: data2, handleAPI: handleAPI2} = useOtherMultiAPI(link);
        const {handleAPI : postData} = usePostAPI(link);
        const [loading, setLoading] = useState(false);
        const navigate = useNavigate();
        const location = useLocation();
        const dispatch = useDispatch();


        
        const handleSubmit = async e => {
            setLoading(true);
            setCheckPass([false, ""])
            e.preventDefault();

            let form = e.target.elements;
             
            if(location.pathname == '/register'){
                let passowrd = form.password.value;
                let rpassword = form.rpassword.value;
                if(passowrd != rpassword){
                    setLoading(false)
                    return setCheckPass([true, "Warning, Password Not Same"])
                }
            }

            for(let i =0; i < validation.length; i++) {
                if(validation[i] == "file") continue;
                let string = form[validation[i]].placeholder;
                
                if(!form[validation[i]]?.value??""){
                    setLoading(false)
                    setCheckPass([true, "Warning, Please "+string+""]);
                    return ;
                }
            }

            let api;
            if(location.pathname == '/register'){
                api = handleAPI(validation, e)
            }else{
                    if(e.target?.file?.files[0]??null){
                            api = handleAPI2(validation, e)
                    }else{
                        api = postData(validation, e, token)
                    }
            }

            api.then(data => {
                console.log(data)
                       if(data.message == "Email Not Verified"){
                            setLoading(false)
                            setCheckPass([true, "Invalid OTP, Email Not Verfied"]);
                            return ;
                       }
                       if(location.pathname == '/register'){
                            let credentials = {
                                username: form.name.value,
                                password: form.password.value,
                            }
                            try {
                                const response = axios.post(
                                    process.env.REACT_APP_API_URL + "api/login",
                                    credentials,
                                    {
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                    }
                                );
                                const user = response;
                                setLoading(false);

                                dispatch(loginHere(credentials))
                                user.then(data => {
                                    navigate(route+"?token="+data.data[0].token)
                                  // navigate(route+"?token="+data.data.token)  
                                })
                            } catch (error) {
                                console.log(error.message);
                            }
                       }else{
                        setLoading(false)
                        if(location.pathname == "/skills/posts"){
                            Swal.fire({
                                title: 'Success!',
                                text: 'Posted',
                                icon: 'success',
                                confirmButtonText: 'Cool'
                            })
                         }
                          navigate(route)
                       }
            })
            
        }

        return [ handleSubmit , checkPass, loading];
}
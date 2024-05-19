import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useSelector } from "react-redux";
import { logout } from "../redux";
import Swal from "sweetalert2";


const handleLogout = async () => {
  // Show confirmation message
  const result = await Swal.fire({
      title: 'Token Expired',
      text: 'Your session has expired. Do you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Logout'
  });

  if (result.isConfirmed) {
      // Clear local storage
      localStorage.clear();
      // Redirect to login page
      window.location.href = '/login';
  }
}

export const useMulipartAPI = () => {
    const [data, setData] = useState();
    
    const handleAPI = async (fields, e) => {
        const formData = new FormData();

        // Append the data to formData
        fields.forEach(element => {
            formData.append(element, e.target[element].value);
        });
        
        // Append the image to formData
        const imageFile = e.target.file.files[0];
        formData.append('file', imageFile);
        try {
            const response = await axios.post(
              "http://localhost:4000/",
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data', // Use 'multipart/form-data' for FormData
                },
              }
            );
            setData(response.data);
            return response.data;
            
          } catch (error) {
            console.error(error);
          }
    }
      
      return [data, handleAPI]
}


export const useOtherMultiAPI = (link) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  let token = useSelector(state => state);
  token = token.user.token;

  const handleAPI = async (fields, e) => {
      setLoading(true)
      const formData = new FormData();

      // Append the data to formData
      fields.forEach(element => {
          if(e.target[element] !== "file"){
            //console.log(e.target[element])
                formData.append(element, e.target[element].value);
          }
      });
      
      // Append the image to formData
      const imageFile = e.target.file.files[0];
      formData.append('file', imageFile);
      try {
        console.log(token)
          const response = await axios.post(
            "http://localhost:4000/" + link,
            formData,
            {
              headers: {
                Authorization: "Bearer "+token,
                'Content-Type': 'multipart/form-data', // Use 'multipart/form-data' for FormData
              },
            }
          );
          console.log(response.data)
    
          setLoading(false)
          setData(response.data);
          return response.data;
          
        } catch (error) {
          console.error(error);
        }
  }
    
    return {data, loading, handleAPI}
}



export const usePostAPI = (link) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    let token = useSelector(state => state);
    token = token.user.token;
    
    const handleAPI = async (fields, e) => {
        setLoading(true)
        const formData = new FormData();

        // Append the data to formData
        fields.forEach(element => {
            formData.append(element, e.target[element].value);
        });

        try {
            const response = await axios.post(
              "http://localhost:4000"+ link,
              formData,
              {
                headers: {
                    Authorization: token, 
                    'Content-Type': 'application/json'
                },
              }
            );
      
            setData(response.data);
            setLoading(false)
            return response.data;
            
          } catch (error) {
            console.error(error);
          }
    }
      
      return {loading, handleAPI, data}
}


export const useSimplePOSTAPI = (link) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    let token = useSelector(state => state);

    console.log(token)
    token = token.user.token;

    const handleAPI = async (fields) => {
        try {
            const response = await axios.post(
              "http://localhost:4000" + link,
              fields,
              {
                headers: {
                    Authorization: "Bearer "+token, 
                    'Content-Type': 'application/json'
                },
              }
            );
      
            setData(response.data);
            return response.data;
            
          } catch (error) {
            if (error.response && error.response.status === 401) {
              handleLogout()   
            }
            console.error(error);
          }
    }
      
      return {loading, handleAPI, data}
}


export const useFetchAPI = () => {
     const [data, setData] = useState();
     const [Loading, setLoading] = useState(true);
     let token = useSelector(state => state);
     token = token.user[0].token;

     const handleAPI = async (fields, link) => {
         setLoading(true)
         const response = await axios.post(
            process.env.REACT_APP_API_URL+link,
            fields, 
            {
              headers: {
                  Authorization: token, 
                  'Content-Type': 'application/json'
              },
            }
         )

         setData(response.data);
         setLoading(false)
     }

     return {data, handleAPI, Loading, setData}
}
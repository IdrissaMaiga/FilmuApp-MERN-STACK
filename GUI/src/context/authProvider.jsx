import React, { createContext, useState,  useLayoutEffect } from 'react'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'
import PropTypes from "prop-types";
import Bowser from "bowser";
export const baseurl= 'http://filmu.live'//'http://myservermovie.zapto.org:4000' //"http://192.168.1.102:8800"//'http://localhost:8800'
const api = axios.create({
  baseURL: baseurl, // Ensure this matches your backend
 // withCredentials: true, 
})
 export const streamingserverurl = 'http://763025459169.cdn-fug.com:8080' // Ensure this matches your backend
const epg = axios.create({
  baseURL: 'http://763025459169.cdn-fug.com:2082/player_api.php' // Ensure this matches your backend
})

export const AuthContext = createContext()



export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userchange, setuserchange] = useState(true)
 
 
  const toast=useToast()
  const logo = 'https://i.postimg.cc/cJmbLVSV/filmulogo-1.png';
  const currency="FCFA";
  const means = [
    {
      phone: "+223 77374782",
      logo: "data:image/png;base64,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",
      name: "Orange Money",
      exampleimg:"https://i.postimg.cc/j5W8wxFR/example.png"
    }
    ];


async function getDeviceInfo() {
  // Initialize Bowser to parse the user agent
  const browser = Bowser.getParser(window.navigator.userAgent);
  const deviceType = browser.getPlatformType(); // e.g., desktop, mobile, tablet
  const browserName = browser.getBrowserName();
  const osName = browser.getOSName();

  // Get approximate location and IP address
  let ipAddress = "";
  let location = "";
  
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    ipAddress = data.ip;
  } catch (error) {
    console.error("Could not fetch IP address:", error);
  }

  // Return the gathered information
  return {
    deviceType,
    browser: browserName,
    os: osName,
    location,  // You could also use another API to get a more detailed location based on IP
    ipAddress,
  };
}
  const handleSuccess = (message) => {
    toast({
      title: "Success",
      description: message,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  const handleError = (error, title) => {
    if (error.response) {
      toast({
        title,
        description: error.response.data?.error||error.response.data?.message || `Error (Status Code: ${error.response.status})`,
        status: "error",
        isClosable: true,
      });
    } else if (error.request) {
      toast({
        title: "Network Error",
        description: "No response from the server. Please try again later.",
        status: "error",
        isClosable: true,
      });
    } else {
      toast({
        title: "Error",
        description: error.message || "An unknown error occurred.",
        status: "error",
        isClosable: true,
      });
    }
  };

  useLayoutEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        
        const token = localStorage.getItem('accessToken');
        //console.log(token)
          const response = await api.get("/api/user/profile", {
            headers: { Authorization: `Bearer ${token}` }
          
           //, withCredentials: true 
          });
         // console.log(response.data)
          if (response.data?.exit){
            toast({
              title: "Exclu",
              description: "Exclu du compte Veiller vous reconnect",
              status: "error",
              isClosable: true,
            });
            localStorage.removeItem('accessToken');
           
          }
          setUser(response.data);
        
        
      } catch (error) {
       // handleError(error,"unable to get user")
        console.error("Error fetching user profile:", error);
        setUser(null);
       
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userchange]);

  const flagdevice = async (data) => {
    setLoading(true); // Set loading to true before fetching
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.patch("/api/user/flag",data, {  headers: { Authorization: `Bearer ${token}` }
          // , withCredentials: true 
          });
       handleSuccess(response.data?.message)
       setuserchange(userchange=>!userchange)
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const getTaste = async () => {
    const token = localStorage.getItem('accessToken');
    try {const response =(await api.get("/api/taste", { headers: { Authorization: `Bearer ${token}` }, 
      //withCredentials: true 
    })).data;
    //console.log(response)
    return response
    } catch (error) {
    } 
  };
  
  const checkIfInTaste = async (id, type) => {
    try {
      // Define the query parameters based on the type (movie or series)
      const queryParams = `id=${id}&type=${type}`;
      const token = localStorage.getItem('accessToken');
      // Make a GET request to the backend endpoint with the query parameters
      const response = await api.get(`/api/taste/is/in?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
        // withCredentials: true, // if credentials like cookies or JWT are required
      });
      if (response.data?.exit){
        toast({
          title: "Exclu",
          description: "Exclu du compte Veiller vous reconnect",
          status: "error",
          isClosable: true,
        });
        localStorage.removeItem('accessToken');
       
      }
      // Return the inTaste value from the response
      return response.data.inTaste;
    } catch (error) {
      console.error("Error checking taste:", error);
      return false; // Return false if an error occurs
    }
  };
  
  
  // Function to update taste list (add or delete a movie or series)
const updateTaste = async (movieId, seriesId, inOut) => {
  try {
    const data = {
      movieId: movieId || null,
      seriesId: seriesId || null,
      inOut, // true to add, false to remove
    };
    const token = localStorage.getItem('accessToken');
    const response = await api.patch('/api/taste/addOrdelete', data, {
      headers: { Authorization: `Bearer ${token}` },
      // withCredentials: true,
    });
    if (response.data?.exit){
      toast({
        title: "Exclu",
        description: "Exclu du compte Veiller vous reconnect",
        status: "error",
        isClosable: true,
      });
      localStorage.removeItem('accessToken');
     
    }
    //console.log(response.data.message);
  } catch (error) {
    console.error('Error updating taste list:', error);
  }
};
  
  const getByTmdbOrImagePath = async (tmdb, imagePath,type) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.post(`/api/${type}/byquery`,{tmdb,imagePath},{
        headers: { Authorization: `Bearer ${token}` },
        // withCredentials: true,
      });
    //  console.log(response.data)
      return response.data; // Return the movie data
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      return null; // Or handle error as needed
    }
  };
  const login = async (data) => {
    
    try {
      setLoading(true);
      const deviceInfo = await getDeviceInfo();

      
      const response = await api.post('/api/auth/login', {...data,deviceInfo}, {
           // withCredentials: true
           });
         
      if (response?.data?.accessToken)
      localStorage.setItem("accessToken",response?.data?.accessToken)
      setUser(response.data);
      toast({
        title: "Logged in",
        description: "Salut! 😊"+response.data.email,
        status: "success",
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      handleError(error, "Login Failed");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      
      const token = localStorage.getItem('accessToken');
     
      await api.post('/api/auth/logout', {}, { headers: { Authorization: `Bearer ${token}` }
           , 
          // withCredentials: true 
          });
      localStorage.removeItem('accessToken');
      
      
      // Verify that token is removed
     
  
      setUser(null);
     
      handleSuccess("Logged out successfully");
    } catch (error) {
     // handleError(error)
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };
  

  // Helper function for error handling
  


  const requestPasswordReset = async (data) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      // Call the API to request a password reset
      await api.post(
        '/api/user/password-reset/request',
        data,
        {headers: { Authorization: `Bearer ${token}` }, 
       // withCredentials: true 
      }
      );
  
      handleSuccess("Verification Code Sent")
  
      return true; // Return true if email is successfully sent
  
    } catch (error) {{
      // Handle errors from Axios
     handleError(error)
      }
  
      console.error('Password reset request error:', error);
      return false; // Return false if there's an error
    } finally {
      setLoading(false);
    }
  };
  const getAllAgents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      // Call the API to request a password reset
     let response= await api.get(
        '/api/user/agents',
        {headers: { Authorization: `Bearer ${token}` },
        // withCredentials: true 
        }
      );
  
      return response; // Return true if email is successfully sent
  
    } catch (error) {
      // Handle errors from Axios
      handleError(error)
  
      console.error('fetch agents error:', error);
      return false; // Return false if there's an error
    } finally {
      setLoading(false);
    }
  };
  


  const changePassword = async (data) => {
    // Initialize the navigation function
    let response;
    const token = localStorage.getItem('accessToken');
    try {
      setLoading(true);
      //console.log(data)
      // Call the API to change the password
      response = await api.patch(
        '/api/user/password-reset/update',
        data,
        {headers: { Authorization: `Bearer ${token}` }, 
       // withCredentials: true 
      }
      );

      handleSuccess("Password Changed")
      return true
    } catch (error) {
      // Handle errors from Axios
     handleError(error)
      console.error('Password change error:', error);
    } finally {
      setLoading(false);
    }
  };






  const verifyEmailAndCreateAccount = async (data) => {
    try {
     // console.log(data);
      const token = localStorage.getItem('accessToken');
      // Call the backend to verify email and upload image
      const response = await api.patch(
        '/api/user/confirmAccount',
        data,
        {headers: { Authorization: `Bearer ${token}` },
        // withCredentials: true 
        }
      );
  
      if (response.status === 200) { // Axios uses 'response.status' to check status
       handleSuccess('Account Create')
        return true;  // Return true on success
      } else {
        throw new Error('Error verifying email or uploading image');
      }
    } catch (error) {
      // Handle various error scenarios
      
       handleError(error)
      
  
    
      setLoading(false);
      return false; // Return false if there's an error
    } finally {
      setLoading(false);
    }
  };
  
  
  const sendVerificationCode = async (data) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      // Call the backend API to send the verification code to the email
      const response = await api.post(
        '/api/user/verifyemail',
        data,
        {headers: { Authorization: `Bearer ${token}` }, 
       // withCredentials: true 
      }  // Optional, depends on if you're using cookies for session management
      );
  
      if (response.status === 200) {  // Axios uses 'response.status'
        
        handleSuccess('Code Sent')
        return true; // Return true on success
      } else {
        throw new Error('Error sending code');
      }
    } catch (error) {
      // Handle various error scenarios
    handleError(error)
      return false; // Return false if there's an error
    } finally {
      setLoading(false);
    }
  };
  
  const updateField = async (data) => {
    let response;
    const token = localStorage.getItem('accessToken');
    try {
      setLoading(true);
       const { fieldName, fieldValue,targetUserId}=data
      // Call the API to update the specified field
      response = await api.put(
        '/api/user/profile/updateField',
        { fieldName, fieldValue},
        { headers: { Authorization: `Bearer ${token}` },
       // withCredentials: true 
      }
      );
      return true;
    } catch (error) {
      handleError(error);
      console.error(`Error updating ${data.fieldName}:`, error);
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <AuthContext.Provider value={{
    user,
    loading,
    login,
    logout,
    requestPasswordReset,
    changePassword,
    getAllAgents,
    verifyEmailAndCreateAccount,
    sendVerificationCode,
    api,
    handleError,
    handleSuccess,
    logo,
    updateField,
    means,
    currency,
    flagdevice,
    setuserchange,
    epg,
    streamingserverurl,
    getTaste,
    checkIfInTaste,
    updateTaste,
    getByTmdbOrImagePath
    }}>
      {children}
    </AuthContext.Provider>
  )
}
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider

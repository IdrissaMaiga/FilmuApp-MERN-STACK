import React, { createContext, useState, useEffect, useLayoutEffect } from 'react'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'
import PropTypes from "prop-types";
const api = axios.create({
  baseURL: 'http://localhost:8800' // Ensure this matches your backend
})

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [transactionMeans, settransactionMeans] = useState([]);
  const toast=useToast()
  const [logo, setLogo] = useState("")
  const currency="CFA";
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
        
        
          const response = await api.get("/api/user/profile", { withCredentials: true });

          const image = await api.get('/images'); // Replace with your actual API URL
          
        
        // Select only the first and third images if they exist
        if (image.data&&image.data.length>0)
          
         {  
           const logos= image.data.filter(image => image.for === "SiteLogo")
          if (logos&&logos.length>0){
          setLogo(logos[0].url) 
        } 
        
          settransactionMeans(image.data.filter(image => image.for !== "SiteLogo"))
          console.log(transactionMeans)
        }
        else{settransactionMeans([])}
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
  }, []);

  const login = async (data) => {
    
    try {
      setLoading(true);
      const response = await api.post('/api/auth/login', data, { withCredentials: true });
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
      
      
     
     
      await api.post('/api/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('accessToken');
      
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
  
      // Call the API to request a password reset
      await api.post(
        '/api/user/password-reset/request',
        data,
        { withCredentials: true }
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
  
      // Call the API to request a password reset
     let response= await api.get(
        '/api/user/agents',
        { withCredentials: true }
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
    
    try {
      setLoading(true);
  
      // Call the API to change the password
      response = await api.patch(
        '/api/user/password-reset/update',
        data,
        { withCredentials: true }
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
      
     
      // Call the backend to verify email and upload image
      const response = await api.patch(
        '/api/user/confirmAccount',
        data,
        { withCredentials: true }
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
      
  
      console.error('Verification and upload error:', error);
      setLoading(false);
      return false; // Return false if there's an error
    } finally {
      setLoading(false);
    }
  };
  
  
  const sendVerificationCode = async (data) => {
    setLoading(true);
    try {
      // Call the backend API to send the verification code to the email
      const response = await api.post(
        '/api/user/verifyemail',
        data,
        { withCredentials: true }  // Optional, depends on if you're using cookies for session management
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
    currency
    }}>
      {children}
    </AuthContext.Provider>
  )
}
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider

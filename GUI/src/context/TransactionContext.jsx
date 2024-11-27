import React, { createContext, useContext } from 'react';
import { useAuth } from './useAuth';
import { useState } from 'react';
const TransactionContext = createContext();

export const useTransaction=()=>useContext(TransactionContext)
export const TransactionProvider = ({ children }) => {
   
    const {api,handleError,handleSuccess,setuserchange}=useAuth()
    // State to track loading status for each transaction operation
    const [tloading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
  
    // Function to create a subscription transaction
    const createSubscriptionTransaction = async (data) => {
      setLoading(true); // Start loading
      try {
        const token = localStorage.getItem('accessToken');
       const response=  await api.post('/api/transaction/subscription', data,{
        headers: { Authorization: `Bearer ${token}` }, 
        //withCredentials: true,
          });
          if (response)
        {handleSuccess("Subscription transaction created successfully.");
          setuserchange(d=>!d)
        return true}
        else throw new Error("no sub")
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
  
    // Function to create a single download transaction
    const createDownloadTransactionSingle = async (data) => {

        const token = localStorage.getItem('accessToken');
       const res= await api.post('/api/transaction/download/single', data,{
          headers: { Authorization: `Bearer ${token}` },
          //  withCredentials: true,
          });
          
        return res.data?.done
    };
  
    // Function to create a bulk download transaction
    const createDownloadTransactionBulk = async (data) => {
      
      try {
        const token = localStorage.getItem('accessToken');
        await api.post('/api/transaction/download/bulk', data,{
          headers: { Authorization: `Bearer ${token}` }, 
          //withCredentials: true,
          });
        handleSuccess("Bulk download transaction created successfully.");
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
  
    //  function to create a deposit transaction
    const createDepositTransaction = async (data) => {
        setLoading(true); // Start loading
        const token = localStorage.getItem('accessToken');
        try {
          // Create a FormData object
          const formData = new FormData();

          // Append other data fields to FormData
          formData.append('amount', parseFloat(data.amount)); // Ensure amount is a float
          formData.append('ID', data.ID);
          formData.append('phonenumber', data.phonenumber);
          formData.append("countryCode",data.countryCode)
          // Append the image file if it exists
          if (data.picture) {
            formData.append('picture', data.picture); // 'picture' matches the key expected by multer
          }
          
          // Send the FormData using axios
          await api.post('/api/transaction/deposit', formData, {
           // withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data', // Set the Content-Type header
              Authorization: `Bearer ${token}`
            },
          });
      
          handleSuccess("Deposit transaction created successfully.");
          return true
        } catch (error) {
          handleError(error,"Error in creating");
        } finally {
          setLoading(false); // Stop loading
        }
      };
      
    // function to create a withdrawal transaction
    const createRetraitTransaction = async (data) => {
      setLoading(true); // Start loading
      const token = localStorage.getItem('accessToken');
      try {
        await api.post('/api/transaction/retrait', data, {
          headers: { Authorization: `Bearer ${token}` },
          // withCredentials: true,
          });
        handleSuccess("Withdrawal transaction created successfully.");
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    const getUserTransaction = async () => {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      try {
        const response = await api.get('/api/transaction/mine', {
          headers: { Authorization: `Bearer ${token}` },
          // withCredentials: true,
        });
        setTransactions(response.data); // Set fetched transactions to state
      } catch (error) {
        handleError(error,"Error in getting transactions");
      } finally {
        setLoading(false);
      }
    };

    const createMoneyFlow = async (data) => {
      const token = localStorage.getItem('accessToken');
        setLoading(true); // Start loading
       
        try {
          const response = await api.post('/api/transaction/Moneyflow',data,{
            headers: { Authorization: `Bearer ${token}` },  
            //withCredentials: true,
          }); // Adjust the URL as necessary
    
          return response.data;
        } catch (error) {
          handleError(error);
        } finally {
          setLoading(false); // Stop loading
        }
      };
  
  
  

  return (
    <TransactionContext.Provider value= {{
        tloading, // Expose the loading state
        createSubscriptionTransaction,
        createDownloadTransactionSingle,
        createDownloadTransactionBulk,
        createDepositTransaction,
        createRetraitTransaction,
        createMoneyFlow,
        transactions,
        getUserTransaction,
      }}>
       {children}
    </TransactionContext.Provider>
  );
};


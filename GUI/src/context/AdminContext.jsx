import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { Navigate } from 'react-router-dom';
const AdminContext = createContext();
export const useAdmin = () => {
  return useContext(AdminContext);
};

export const AdminProvider = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const {user,api,handleError,handleSuccess}=useAuth()
    const [subscriptions, setSubscriptions] = useState([]);
    const [jsonInput, setJsonInput] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [moneyflow, setMoneyflow] = useState([]);
  
    
    const fetchSubscriptions = async () => {
        setLoading(true); // Set loading to true before fetching
        const token = localStorage.getItem('accessToken');
        try {
          const response = await api.get('/api/subscription', {headers: { Authorization: `Bearer ${token}` } });
          setSubscriptions(response.data);
        } catch (error) {
          //handleError(error)
        } finally {
          setLoading(false); // Set loading to false after fetching
        }
      };
    
      useEffect(() => {
        fetchSubscriptions(); // Fetch subscriptions on component mount
      }, []);
// Assuming setLoading is available from context or props


// Function to update a subscription by ID
const updateSubscription = async (id, fieldName, fieldValue) => {
    setLoading(true); // Start loading
    const token = localStorage.getItem('accessToken');
    try {
      const response = await api.put(
        `/api/subscription/${id}`,
        { fieldName, fieldValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
     handleSuccess('Subscription updated.')
     
  
      return response.data;
    } catch (error) {
      console.error('Failed to update subscription:', error);
  
     //handleError(error)
  
      throw error; // Pass the error to the calling function if needed
    } finally {
      setLoading(false); // End loading
    }
  };



  


// Function to delete a subscription by ID
const deleteSubscription = async (id) => {
  setLoading(true); // Start loading
  const token = localStorage.getItem('accessToken');
  try {
    const response = await api.delete(`/api/subscription/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    handleSuccess('Subscription deleted.')
    return response.data;
  } catch (error) {
   // handleError(error)
    throw error;
  } finally {
    setLoading(false); // End loading
  }
};
 

const reverseTransaction = async (data) => {
  setLoading(true); // Start loading
  const token = localStorage.getItem('accessToken');
  try {
    await api.post('/api/transaction/reverse', data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    handleSuccess("Transaction reversed successfully.");
  } catch (error) {
   // handleError(error);
  } finally {
    setLoading(false); // Stop loading
  }
};

  const removeSubscription = async (id) => {
    await deleteSubscription(id);
    const subs = await fetchSubscriptions();
    setSubscriptions(subs);
  };
  const createSubscriptionsFromJson = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const subscriptionsArray = JSON.parse(jsonInput);
  
      if (!Array.isArray(subscriptionsArray)) {
        throw new Error('Input must be an array of subscription objects.');
      }
  
      setLoading(true); // Start loading
  
      const response = await api.post('/api/subscription/bulk', {"subscriptions":subscriptionsArray}, {
        //withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });
  
     handleSuccess('Subscriptions created.')
  
      setJsonInput(''); // Clear JSON input
      fetchSubscriptions(); // Refresh the list of subscriptions
  
      return response.data;
    } catch (error) {
      //handleError(error)
    } finally {
      setLoading(false); // End loading
    }
  };
   // Fetch all transactions (for admin only)
   const getAllTransactions = async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    try {
      const response = await api.get('/api/transaction/all', {
        //withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data); // Set fetched transactions to state
    //  handleSuccess("All transactions fetched");
    } catch (error) {
     // handleError(error);
    } finally {
      setLoading(false);
    }
  };


    // Admin-restricted function to reverse a transaction
   
     // Function to get all money flows
     const getAllMoneyFlow = async () => {
      setLoading(true); // Start loading
      const token = localStorage.getItem('accessToken');
      try {
        const response = await api.get('/api/transaction/moneyflows',{
          //withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }); // Adjust the URL as necessary
     //   handleSuccess("Money flows retrieved successfully.");
        setMoneyflow(response.data.MoneyFlow)
        return response.data.MoneyFlow;
      } catch (error) {
      //  handleError(error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
  
    // Function to update money flow
    const updateMoneyflow = async (id, data) => {
      setLoading(true); // Start loading
      const token = localStorage.getItem('accessToken');
      try {
        await api.put(`/api/transaction/moneyflow/${id}`, data,{
          //withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        });
        handleSuccess("Money flow updated successfully.");
      } catch (error) {
       // handleError(error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
  
    // Function to delete money flow
    const deleteMoneyflow = async (id) => {
      setLoading(true); // Start loading
      const token = localStorage.getItem('accessToken');
      try {
        await api.delete(`/api/transaction/moneyflow/${id}`,{
         // withCredentials: true,
         headers: { Authorization: `Bearer ${token}` }
        });
        // Check if token is present before removing


        handleSuccess("Money flow deleted successfully.");
      } catch (error) {
        //handleError(error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

  return (
    <AdminContext.Provider value={{
         subscriptions,
      removeSubscription,
      loading,
      updateSubscription ,
      jsonInput,
      setJsonInput,
      createSubscriptionsFromJson,
      fetchSubscriptions,
      getAllMoneyFlow,
      moneyflow,
      updateMoneyflow,
      deleteMoneyflow,
      getAllTransactions,
      
      transactions,
      user}}>
      {user?.role==="ADMIN"?children:<Navigate to={"/"}/>}
    </AdminContext.Provider>
  );
};

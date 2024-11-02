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
    const [moneyflows, setMoneyflow] = useState([]);
  
    
    const fetchSubscriptions = async () => {
        setLoading(true); // Set loading to true before fetching
        
        try {
          const response = await api.get('/api/subscription', { withCredentials: true });
          setSubscriptions(response.data);
        } catch (error) {
          handleError(error)
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
    try {
      const response = await api.put(
        `/api/subscription/${id}`,
        { fieldName, fieldValue },
        { withCredentials: true }
      );
  
     handleSuccess('Subscription updated.')
     
  
      return response.data;
    } catch (error) {
      console.error('Failed to update subscription:', error);
  
     handleError(error)
  
      throw error; // Pass the error to the calling function if needed
    } finally {
      setLoading(false); // End loading
    }
  };



  


// Function to delete a subscription by ID
const deleteSubscription = async (id) => {
  setLoading(true); // Start loading
  try {
    const response = await api.delete(`/api/subscription/${id}`, {
      withCredentials: true,
    });
    handleSuccess('Subscription deleted.')
    return response.data;
  } catch (error) {
    handleError(error)
    throw error;
  } finally {
    setLoading(false); // End loading
  }
};
 

  

  const removeSubscription = async (id) => {
    await deleteSubscription(id);
    const subs = await fetchSubscriptions();
    setSubscriptions(subs);
  };
  const createSubscriptionsFromJson = async () => {
    try {
      const subscriptionsArray = JSON.parse(jsonInput);
  
      if (!Array.isArray(subscriptionsArray)) {
        throw new Error('Input must be an array of subscription objects.');
      }
  
      setLoading(true); // Start loading
  
      const response = await api.post('/api/subscription/bulk', {"subscriptions":subscriptionsArray}, {
        withCredentials: true,
      });
  
     handleSuccess('Subscriptions created.')
  
      setJsonInput(''); // Clear JSON input
      fetchSubscriptions(); // Refresh the list of subscriptions
  
      return response.data;
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false); // End loading
    }
  };
   // Fetch all transactions (for admin only)
   const getAllTransactions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/transaction/all', {
        withCredentials: true,
      });
      setTransactions(response.data); // Set fetched transactions to state
      handleSuccess("All transactions fetched");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };


    // Admin-restricted function to reverse a transaction
    const reverseTransaction = async (data) => {
      setLoading(true); // Start loading
      try {
        await api.post('/api/transaction/reverse', data, {
          withCredentials: true,
        });
        handleSuccess("Transaction reversed successfully.");
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
     // Function to get all money flows
     const getAllMoneyFlow = async () => {
      setLoading(true); // Start loading
      try {
        const response = await api.get('/api/transaction',{
          withCredentials: true,
        }); // Adjust the URL as necessary
        handleSuccess("Money flows retrieved successfully.");
        setMoneyflow(response)
        return response.data;
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
  
    // Function to update money flow
    const updateMoneyflow = async (id, data) => {
      setLoading(true); // Start loading
      try {
        await api.put(`/api/transaction/moneyflow/${id}`, data,{
          withCredentials: true,
        });
        handleSuccess("Money flow updated successfully.");
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
  
    // Function to delete money flow
    const deleteMoneyflow = async (id) => {
      setLoading(true); // Start loading
      try {
        await api.delete(`/api/transaction/moneyflow/${id}`,{
          withCredentials: true,
        });
        // Check if token is present before removing


        handleSuccess("Money flow deleted successfully.");
      } catch (error) {
        handleError(error);
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
      reverseTransaction,
      getAllMoneyFlow,
      moneyflows,
      updateMoneyflow,
      deleteMoneyflow,
      getAllTransactions,
      
      transactions,
      user}}>
      {user?.role==="ADMIN"?children:<Navigate to={"/"}/>}
    </AdminContext.Provider>
  );
};

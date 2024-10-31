
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";

//tasteRoute.post('/taste', authenticateToken, createTaste)

// Route to get the taste of the logged-in user
//tasteRoute.get('/taste/:userId', authenticateToken, getTaste)

// Route to update the taste of a user by ID

  //'/taste/:userId',
 

// Route to delete the taste of the logged-in user
//tasteRoute.delete('/taste/:userId', authenticateToken, deleteTaste)
// Route to  add or serie to the taste of the logged-in user
//tasteRoute.patch('/tasteaddOrdelete', authenticateToken, addordeleteTaste)
import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";
const api = axios.create({
  baseURL: 'http://localhost:8800/api/' // Ensure this matches your backend
})



  

export const useStoredInfo = () => {
const toast = useToast();

const useTaste = () => {
  
 

  
     
   //bool
  const createTate = async (name) => {
    try {
      const res=await api.post(
        '/taste',
        {name},
        { withCredentials: true }
      )
      if (!res.data.taste) {
        toast({
          title: "Error!",
          description: "that taste already existe",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
       return false
      }

      toast({
        title: "Success!",
        description: `Taste ${name} created`,
        status: "success",
        isClosable: true,
      });
     return true;
    } catch (error) {
      console.log(error, "Unable to create the taste");
      toast({
        title: "Error!",
        description: "An error occurred.",
        status: "error",
        isClosable: true,
      });
    }
  };


  const AddMovieOrSerieToTate = async (name) => {
    try {
      const res=await api.post(
        '/taste',
        {name},
        { withCredentials: true }
      )
      if (!res.data.taste) {
        toast({
          title: "Error!",
          description: "that taste already existe",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
       return false
      }

      toast({
        title: "Success!",
        description: `Taste ${name} created`,
        status: "success",
        isClosable: true,
      });
     return true;
    } catch (error) {
      console.log(error, "Unable to create the taste");
      toast({
        title: "Error!",
        description: "An error occurred.",
        status: "error",
        isClosable: true,
      });
    }
  };
  

  const checkIfInWatchlist = async (userId, dataId) => {
    const docRef = doc(
      db,
      "users",
      userId?.toString(),
      "watchlist",
      dataId?.toString()
    );

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return true;
    } else {
      return false;
    }
  };

  const removeFromWatchlist = async (userId, dataId) => {
    try {
      await deleteDoc(
        doc(db, "users", userId?.toString(), "watchlist", dataId?.toString())
      );
      toast({
        title: "Success!",
        description: "Removed from watchlist",
        status: "success",
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error!",
        description: "An error occurred.",
        status: "error",
        isClosable: true,
      });
      console.log(error, "Error while deleting doc");
    }
  };

  const getWatchlist = useCallback(async (userId) => {
    const querySnapshot = await getDocs(
      collection(db, "users", userId, "watchlist")
    );
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));
    return data;
  }, []);

  return {
    addDocument,
    addToWatchlist,
    checkIfInWatchlist,
    removeFromWatchlist,
    getWatchlist,
  };
};


}
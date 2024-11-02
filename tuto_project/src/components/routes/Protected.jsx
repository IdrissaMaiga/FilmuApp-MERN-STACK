import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import PropTypes from "prop-types";
import { Center,Spinner } from "@chakra-ui/react";

const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  
  
  

  return <>{loading? <Center height="100vh"> 
  <Spinner 
    thickness="4px"
    speed="0.65s"
    emptyColor="gray.200"
    color="blue.500"
    size="xl"
  />
  </Center>:(user ?children: (<Navigate to={"/login"}/>)) }
    
  
  </>;
};

export default Protected;

Protected.propTypes = {
  children: PropTypes.node.isRequired,
};

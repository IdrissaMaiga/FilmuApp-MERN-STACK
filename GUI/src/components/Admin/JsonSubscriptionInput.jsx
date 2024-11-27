import React from 'react';
import { Box, Button, FormControl, FormLabel, Textarea} from '@chakra-ui/react';
import { useAdmin } from '../../context/AdminContext';


const JsonSubscriptionInput = () => {
  const { jsonInput, setJsonInput, createSubscriptionsFromJson}= useAdmin();
// Assuming `useAuth` provides the loading state


  const handleJsonChange = (e) => setJsonInput(e.target.value);

  const handleCreateSubscriptions = async () => {
    
    await createSubscriptionsFromJson();
   
  };

  return (
    <Box mt={8} width={{ base: "100%", md: "80%", lg: "60%" }} mx="auto">
      <FormControl>
        <FormLabel>JSON Input for Subscriptions</FormLabel>
        <Textarea
          value={jsonInput}
          onChange={handleJsonChange}
          placeholder="Enter an array of subscription objects in JSON format"
          resize="vertical"
        />
        <Button 
          onClick={handleCreateSubscriptions} 
          colorScheme="teal" 
          mt={2} 
          width="full"
          loadingText="Creating..." // Text to show when loading
        >
          Create Subscriptions from JSON
        </Button>
      </FormControl>
    </Box>
  );
};

export default JsonSubscriptionInput;

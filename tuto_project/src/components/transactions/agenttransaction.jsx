import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  Textarea,
  VStack,
  Center,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { useTransaction } from "../../context/TransactionContext";

const CreateMoneyFlow = () => {
  const { createMoneyFlow, tloading } = useTransaction();
  const [jsonInput, setJsonInput] = useState('');
  const [responseMessage, setResponseMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      const data = JSON.parse(jsonInput); // Parse JSON input
      const response = await createMoneyFlow(data); // Call the API

      if (response.errors) {
        setError(response.errors);
        setResponseMessage(null);
      } else {
        setResponseMessage(`${response.message}`);
        setError(null);
      }
    } catch (err) {
      setError("Invalid JSON format or server error.");
      setResponseMessage(null);
    }
  };

  const bgGradient = useColorModeValue('linear(to-br, white, gray.100)', 'linear(to-br, black, #141414)');

  return (
    <Center minHeight="100vh" bgGradient={bgGradient}>
      <VStack spacing={6} w={{ base: '90%', sm: '80%', md: '500px' }} p={6} boxShadow="lg" borderRadius="md">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">Create Money Flow Entries</Text>
        
        <Textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Enter JSON data here...'
          size="lg"
          rows={10}
          borderColor="gray.300"
          bg={useColorModeValue('gray.50', 'gray.800')}
        />

        <Button
          colorScheme="teal"
          onClick={handleSubmit}
          width="100%"
          isDisabled={tloading}
        >
          {tloading ? <Spinner size="sm" /> : 'Submit'}
        </Button>

        {responseMessage && (
          <Text color="green.500" fontWeight="bold" textAlign="center">
            {responseMessage}
          </Text>
        )}

        {error && (
          <Box color="red.500" textAlign="center">
            {Array.isArray(error) ? error.map((err, index) => (
              <Text key={index}>{err.error}</Text>
            )) : <Text>{error}</Text>}
          </Box>
        )}
      </VStack>
    </Center>
  );
};

export default CreateMoneyFlow;

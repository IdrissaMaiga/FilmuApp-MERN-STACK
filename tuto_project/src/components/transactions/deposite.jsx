import React, { useState } from 'react';
import {
  Box,
  Button,
  Center,
  VStack,
  Text,
  Spinner,
  useColorModeValue,
  ScaleFade,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab
} from '@chakra-ui/react';
import { CheckCircleIcon, AttachmentIcon } from '@chakra-ui/icons';
import { useTransaction } from '../../context/TransactionContext';
import { useNavigate } from 'react-router-dom';

const Deposit = () => {
  const [picture, setPicture] = useState(null);
  const [isCreated, setIsCreated] = useState(false);
  const [error, setError] = useState('');
  const { createDepositTransaction, tloading } = useTransaction();
  const navigate = useNavigate();

  const handleCreateTransaction = async () => {
    try {
      const response = await createDepositTransaction({ picture });
      if (response) {
        setIsCreated(true);
        setError('');
      }
    } catch (err) {
      setError("Échec de la transaction. Veuillez réessayer.");
    }
  };

  const handleReset = () => {
    setPicture(null);
    setIsCreated(false);
  };

  const handleNavigateHome = () => navigate('/');
  const handleNavigateTransactions = () => navigate('/transaction');

  const bgGradient = useColorModeValue('linear(to-br, white, gray.200)', 'linear(to-br, black, #141414)');
  const boxBg = useColorModeValue('gray.100', '#181818');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Center minHeight="100vh" bgGradient={bgGradient}  >
     <Tabs colorScheme="teal">
      <TabList m={0} p={0}> {/* Remove margin and padding */}
        <Tab>Transaction type {/* the phone number */}{/* the transferlogo */} </Tab>
      </TabList>

      <TabPanels m={0} p={0}> {/* Remove margin and padding */}
        <TabPanel mt={2} p={0}> {/* Remove margin and padding */} 
       {/* put an image from the db here*/} 
      <VStack
        spacing={6}
        w={"100%"}
        bg={boxBg}
        p={6}
        borderRadius="md"
        boxShadow="lg"
        margin={0}
      >
        <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color={textColor}>
          Ajouter une capture de la transaction
        </Text>

        {tloading && (
          <Center>
            <Spinner thickness="4px" speed="0.75s" color="yellow.400" size="xl" />
          </Center>
        )}

        {error && <Text color="red.500">{error}</Text>}

        {isCreated ? (
          <ScaleFade initialScale={0.8} in={isCreated}>
            <Box textAlign="center" color="yellow.600">
              <CheckCircleIcon boxSize="50px" color="green.400" />
              <Text fontSize="lg" fontWeight="bold">Transaction en attente</Text>
              <Text>Le statut de votre transaction est en attente.</Text>
              <VStack>
                <Button mt={2} colorScheme="yellow" onClick={handleReset}>
                  Ajouter une autre capture
                </Button>
                <Button mt={2} colorScheme="blue" onClick={handleNavigateHome}>
                  Aller à l'accueil
                </Button>
                <Button mt={4} onClick={handleNavigateTransactions} bg="purple.500" color="white" _hover={{ bg: 'purple.600' }}>
                  Voir les transactions
                </Button>
              </VStack>
            </Box>
          </ScaleFade>
        ) : (
          <VStack as="form" spacing={4} onSubmit={(e) => {
            e.preventDefault();
            handleCreateTransaction();
          }}>
            <Box w="100%" textAlign="center">
              <input
                type="file"
                accept="image/*"
                id="file-upload"
                onChange={(e) => setPicture(e.target.files[0])}
                style={{ display: 'none' }}
              />
              <label htmlFor="file-upload">
                <Button
                  as="span"
                  bg="teal.500"
                  color="white"
                  leftIcon={<AttachmentIcon />}
                  _hover={{ bg: "teal.600" }}
                  width="100%"
                >
                  Choisir une photo
                </Button>
              </label>
              {picture && <Text mt={2} fontSize="sm" color={textColor}>{picture.name}</Text>}
            </Box>

            <Button
              type="submit"
              bg="green.500"
              color="white"
              _hover={{ bg: "green.600" }}
              width="100%"
            >
              Envoyer la capture
            </Button>

            <Button
              onClick={handleReset}
              bg="red.400"
              color="white"
              _hover={{ bg: "red.500" }}
              width="100%"
            >
              Réinitialiser
            </Button>

            <Button
              mt={4}
              onClick={handleNavigateHome}
              bg="orange.500"
              color="white"
              _hover={{ bg: "orange.600" }}
              width="100%"
            >
              Aller à l'accueil
            </Button>
            <Button
              mt={4}
              onClick={handleNavigateTransactions}
              bg="purple.500"
              color="white"
              _hover={{ bg: "purple.600" }}
              width="100%"
            >
              Voir les transactions
            </Button>
          </VStack>
        )}
      </VStack>
   
    </TabPanel>
                  </TabPanels>
                  </Tabs> </Center>);
};

export default Deposit;

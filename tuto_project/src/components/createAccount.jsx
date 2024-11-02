import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  VStack,
  Spinner,
  Select,
  useColorModeValue,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const EmailVerification = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+223'); // Default to +1
  const { loading, verifyEmailAndCreateAccount, sendVerificationCode } = useAuth();
  const [isCodeSent, setIsCodeSent] = useState(false);
  const navigate = useNavigate();
  const toast=useToast()
  // Load data from local storage on component mount
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedCodeSent = localStorage.getItem('isCodeSent');
    if (storedCodeSent) setIsCodeSent(true);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleSendCode = async () => {
    const success = await sendVerificationCode({email});
    if (success) {
      setIsCodeSent(true);
      localStorage.setItem('isCodeSent', 'true');
      localStorage.setItem('email', email);
    }
  };

  const handleVerifyAndCreateAccount = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne sont pas identiques.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      
      return;
    }

    
    const data= { email,newPassword:password, code, phone:phoneNumber,countryCode } 
    const response = await verifyEmailAndCreateAccount(data);
    if (response) {
      localStorage.removeItem('isCodeSent');
      localStorage.removeItem('email');
      navigate('/login');
    }
  };

  const handleReset = () => {
    setEmail('');
    setCode('');
    setPassword('');
    setConfirmPassword('');
    setPhoneNumber('');
    setCountryCode('+1');
    setIsCodeSent(false);
    localStorage.removeItem('isCodeSent');
    localStorage.removeItem('email');
  };


  const bgGradient = useColorModeValue('linear(to-br, white, gray.200)', 'linear(to-br, black, #141414)');
  const boxBg = useColorModeValue('gray.100', '#181818');
  const textColor = useColorModeValue('gray.800', 'white');
  const buttonBg = useColorModeValue('blue.600', '#e50914');
  const buttonHoverBg = useColorModeValue('blue.500', '#b20610');
  const inputBg = useColorModeValue('white', 'black.200');
  const inputBorderColor = useColorModeValue('gray.300', '#444');
  const inputPlaceholderColor = useColorModeValue('gray.500', 'gray.500');
  const bg =useColorModeValue('gray.200', 'gray.600')
  const bghover=useColorModeValue('gray.300', 'gray.700') 
  return (
    <Center minHeight="100vh" bgGradient={bgGradient} px={4}>
      <VStack
        spacing={6}
        w={{ base: '90%', sm: '80%', md: '400px' }}
        bg={boxBg}
        p={6}
        borderRadius="md"
        boxShadow="lg"
      >
        <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color={textColor}>
          Créez votre compte
        </Text>

        {loading && (
          <Center>
            <Spinner thickness="4px" speed="0.65s" color="red.600" size="xl" />
          </Center>
        )}

        {!isCodeSent ? (
          <>
            <FormControl isRequired>
              <FormLabel color={textColor}>E-mail</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                bg={inputBg}
                borderColor={inputBorderColor}
                color={textColor}
                placeholder="Entrez votre e-mail"
                _placeholder={{ color: inputPlaceholderColor }}
              />
            </FormControl>

            <Button
              onClick={handleSendCode}
              bg={buttonBg}
              color="white"
              _hover={{ bg: buttonHoverBg }}
              width="100%"
              size="lg"
            >
              Envoyer le code de vérification
            </Button>
            <Button
              mt={4}
              onClick={()=>navigate("/")}
              bg="orange.500"
              color="white"
              _hover={{ bg: "orange.600" }}
              width="100%"
              size="lg"
            >
              Retour a l'indentification
            </Button>
          </>
        ) : (
          <form onSubmit={handleVerifyAndCreateAccount}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel color={textColor}>Code de vérification</FormLabel>
                <Input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  bg={inputBg}
                  borderColor={inputBorderColor}
                  color={textColor}
                  placeholder="Entrez le code"
                  _placeholder={{ color: inputPlaceholderColor }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={textColor}>Numero Orange!!</FormLabel>
                <Flex>
                  <Select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    bg={inputBg}
                    borderColor={inputBorderColor}
                    color={textColor}
                    width="30%" // Set width for country code select
                  >
                    
                    <option value="+223">+223</option>
                    <option value="+226">+226</option>
                    <option value="+227">+227</option>
                    <option value="+241">+241</option>
                    <option value="+242">+242</option>
                    <option value="+243">+243</option>
                    <option value="+225">+225</option>
                    <option value="+237">+237</option>
                    <option value="+255">+255</option>
                    <option value="+256">+256</option>
                    <option value="+254">+254</option>
                    <option value="+233">+233</option>
                    {/* Add more African codes as needed */}
                  </Select>

                  <Input
                    type="number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    bg={inputBg}
                    borderColor={inputBorderColor}
                    color={textColor}
                    placeholder="Numéro de téléphone"
                    _placeholder={{ color: inputPlaceholderColor }}
                    width="70%" // Set width for phone input
                  />
                </Flex>
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={textColor}>Mot de passe</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  bg={inputBg}
                  borderColor={inputBorderColor}
                  color={textColor}
                  placeholder="Entrez le mot de passe"
                  _placeholder={{ color: inputPlaceholderColor }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={textColor}>Confirmez le mot de passe</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  bg={inputBg}
                  borderColor={inputBorderColor}
                  color={textColor}
                  placeholder="Confirmez le mot de passe"
                  _placeholder={{ color: inputPlaceholderColor }}
                />
              </FormControl>

              <Button
                type="submit"
                bg={buttonBg}
                color="white"
                _hover={{ bg: buttonHoverBg }}
                width="100%"
                size="lg"
              >
                Créer le compte
              </Button>

              <Button
                onClick={handleReset}
                bg={bg}
                _hover={{ bghover}}
                variant="outline"
                color={textColor}
                width="100%"
                size="lg"
              >
                Réinitialiser le processus
              </Button>
            </Stack>
          </form>
        )}
      </VStack>
    </Center>
  );
};

export default EmailVerification;

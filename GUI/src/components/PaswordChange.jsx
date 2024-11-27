import React, { useState, useEffect } from 'react';
import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  VStack,
  Spinner,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

const PasswordChange = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { requestPasswordReset, changePassword } = useAuth();

  // Load isCodeSent state from localStorage when the component mounts
  useEffect(() => {
    const codeSentState = localStorage.getItem('isCodeSent');
    if (codeSentState === 'true') {
      setIsCodeSent(true);
    }
  }, []);

  // Handle requesting the password reset code
  const handleRequestReset = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const isSuccess = await requestPasswordReset({email});
      if (isSuccess) {
        setIsCodeSent(true);
        localStorage.setItem('isCodeSent', 'true');
      } else {
        toast({
          title: 'Error',
          description: 'There was an issue sending the email. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to request password reset.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error requesting password reset:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle password change using the received code
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const isChange = await changePassword({email, newPassword, code:verificationCode});
      if (isChange) {
        // Clear local storage before navigating
        localStorage.removeItem('isCodeSent');
        navigate('/login');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to change password. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error changing password:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset the process
  const handleResetProcess = () => {
    setIsCodeSent(false);
    setEmail('');
    setVerificationCode('');
    setNewPassword('');
    localStorage.removeItem('isCodeSent');
  };

  // Theme-based color mode adaptation
  const bgGradient = useColorModeValue('linear(to-br, white, gray.200)', 'linear(to-br, black, #141414)');
  const boxBg = useColorModeValue('gray.100', '#181818');
  const borderColor = useColorModeValue('gray.200', '#333');
  const textColor = useColorModeValue('gray.800', 'white');
  const buttonBg = useColorModeValue('blue.600', '#e50914');
  const buttonHoverBg = useColorModeValue('blue.500', '#b20610');
  const inputBg = useColorModeValue('white', 'black.200');
  const inputBorderColor = useColorModeValue('gray.300', '#444');
  const inputPlaceholderColor = useColorModeValue('gray.500', 'gray.500');

  return (
    <Center minHeight="100vh" bgGradient={bgGradient} px={4}>
      <VStack
        spacing={6}
        w={{ base: '100%', md: '400px' }}
        bg={boxBg}
        p={6}
        borderRadius="md"
        boxShadow="lg"
        borderColor={borderColor}
      >
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          Change Your Password
        </Text>

        {loading && (
          <Center>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="red.600"
              size="xl"
            />
          </Center>
        )}

        {!isCodeSent && (
          <>
            <Button
              onClick={() => navigate('/login')}
              bg="red.600"
              color="white"
              _hover={{ bg: 'gray.500' }}
              mb={4}
            >
              Back to Login
            </Button>

            <form onSubmit={handleRequestReset}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel color={textColor}>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    bg={inputBg}
                    borderColor={inputBorderColor}
                    color={textColor}
                    placeholder="Enter your email"
                    _placeholder={{ color: inputPlaceholderColor }}
                  />
                </FormControl>
                <Button
                  type="submit"
                  bg={buttonBg}
                  color="white"
                  _hover={{ bg: buttonHoverBg }}
                  isLoading={loading}
                >
                  Request Reset Code
                </Button>
              </Stack>
            </form>
          </>
        )}

        {isCodeSent && (
          <form onSubmit={handleChangePassword}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel color={textColor}>Verification Code</FormLabel>
                <Input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  bg={inputBg}
                  borderColor={inputBorderColor}
                  color={textColor}
                  placeholder="Enter the code sent to your email"
                  _placeholder={{ color: inputPlaceholderColor }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={textColor}>New Password</FormLabel>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  bg={inputBg}
                  borderColor={inputBorderColor}
                  color={textColor}
                  placeholder="Enter your new password"
                  _placeholder={{ color: inputPlaceholderColor }}
                />
              </FormControl>

              <Button
                type="submit"
                bg={buttonBg}
                color="white"
                _hover={{ bg: buttonHoverBg }}
                isLoading={loading}
              >
                Change Password
              </Button>
            </Stack>
          </form>
        )}

        {isCodeSent && (
          <Button
            mt={4}
            bg="red.500"
            color="white"
            _hover={{ bg: 'red.600' }}
            onClick={handleResetProcess}
          >
            Restart Process
          </Button>
        )}
      </VStack>
    </Center>
  );
};

export default PasswordChange;

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
  VStack,
  Spinner,
  Icon,
  useBreakpointValue,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaTelegram, FaInfoCircle, FaWhatsapp, FaFileContract } from 'react-icons/fa'; // Import FaFileContract for Terms icon
import { useAuth } from '../context/useAuth';
import { Navigate, useNavigate, Link as RouterLink } from 'react-router-dom';

const CustomLogo = () => {
  const {logo}=useAuth()
  const logoWidth = useBreakpointValue({ base: '80px', md: '120px' });
  return (
    <Box as='img' borderRadius='30px' src={logo} alt='Custom Logo' width={logoWidth} />
  );
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const headingFontSize = useBreakpointValue({ base: '20px', md: '24px' });
  const { colorMode, toggleColorMode } = useColorMode();

  // Use color mode values
  const bgColor = useColorModeValue('white', '#141414');
  const cardBgColor = useColorModeValue('gray.100', '#181818');
  const textColor = useColorModeValue('gray.800', 'white');
  const inputBgColor = useColorModeValue('gray.50', 'black.200');
  const inputBorderColor = useColorModeValue('gray.300', '#444');
  const linkColor = useColorModeValue('#e50914', '#e50914');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({email, password});
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate('/changepassword');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  if (loading) {
    return (
      <Center height='100vh'>
        <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='red.600' size='xl' />
      </Center>
    );
  }

  return user ? (
    <Navigate to='/' />
  ) : (
    <Box
      bg={bgColor}
      minHeight='100vh'
      display='flex'
      alignItems='center'
      justifyContent='center'
      px={4}
      bgGradient={colorMode === 'dark' ? 'linear(to-br, black, #141414)' : ''}
    >
      <VStack>
        <Stack spacing={8} width={{ base: '100%', md: '400px' }}>
          <VStack as='header' spacing='6' mt={{ base: '6', md: '8' }}>
            <CustomLogo />
            <Heading as='h1' fontWeight='500' fontSize={headingFontSize} color={textColor} letterSpacing='-0.5px'>
              Connectez-vous à votre compte
            </Heading>
          </VStack>

          <Card
            bg={cardBgColor}
            variant='outline'
            borderColor={colorMode === 'dark' ? '#333' : 'gray.200'}
            w='100%'
            boxShadow='lg'
            borderRadius='8px'
            overflow='hidden'
          >
            <CardBody>
              <form onSubmit={handleSubmit}>
                <Stack spacing='4'>
                  <FormControl>
                    <FormLabel color={textColor}>Email</FormLabel>
                    <Input
                      type='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      bg={inputBgColor}
                      borderColor={inputBorderColor}
                      color={textColor}
                      size='md'
                      borderRadius='6px'
                      _placeholder={{ color: 'gray.500' }}
                      required
                    />
                  </FormControl>
                  <FormControl>
                    <HStack justify='space-between'>
                      <FormLabel color={textColor}>Mot de passe</FormLabel>
                      <Button
                        as='a'
                        variant='link'
                        size='xs'
                        color={linkColor}
                        fontWeight='500'
                        onClick={handleForgotPassword}
                      >
                        Mot de passe oublié ?
                      </Button>
                    </HStack>
                    <Input
                      type='password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      bg={inputBgColor}
                      borderColor={inputBorderColor}
                      color={textColor}
                      size='md'
                      borderRadius='6px'
                      _placeholder={{ color: 'gray.500' }}
                      required
                    />
                  </FormControl>

                  <Button
                    type='submit'
                    bg={linkColor}
                    color='white'
                    size='md'
                    _hover={{ bg: '#b20610' }}
                    _active={{ bg: '#90050d' }}
                    borderRadius='6px'
                  >
                    Connexion
                  </Button>
                </Stack>
              </form>
            </CardBody>
          </Card>

          <Card
            variant='outline'
            borderColor={colorMode === 'dark' ? '#333' : 'gray.200'}
            bg={cardBgColor}
            w='100%'
            boxShadow='lg'
            borderRadius='8px'
          >
            <CardBody>
              <Center>
                <HStack fontSize='sm' spacing='1' color={textColor}>
                  <Text>Nouveau sur notre plateforme ?</Text>
                  <Button
                    as='a'
                    variant='link'
                    size='xs'
                    color={linkColor}
                    fontWeight='500'
                    onClick={handleRegister}
                  >
                    Créer un compte.
                  </Button>
                </HStack>
              </Center>
            </CardBody>
          </Card>
        </Stack>

        <Center as='footer' mt='16'>
          <VStack spacing='2' pt='4'>
            <HStack spacing='6'>
              <RouterLink
                color={textColor}
                to="/register/agent-registration"
                _hover={{ textDecoration: 'underline' }}
              >
                <Icon as={FaInfoCircle} /> Aide
              </RouterLink>
              
              <Link isExternal color='#0088cc' href='https://t.me/yourTelegramLink'>
                <Icon as={FaTelegram} /> Telegram
              </Link>
              <Link isExternal color='#25D366' href='https://wa.me/yourWhatsAppNumber'>
                <Icon as={FaWhatsapp} /> WhatsApp
              </Link>
              <RouterLink
                color={textColor}
                to="/terms"
                _hover={{ textDecoration: 'underline' }}
              >
                <Icon as={FaFileContract} /> Terms
              </RouterLink>
            </HStack>
            <Text fontSize='xs' color='gray.500'>
              © 2024 Tous droits réservés
            </Text>
          </VStack>
        </Center>
      </VStack>
    </Box>
  );
};

export default Login;

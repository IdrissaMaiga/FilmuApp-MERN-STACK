import React, { useEffect, useState } from 'react'; 
import {
  Box,
  Button,
  Center,
  Heading,
  Image,
  Stack,
  Text,
  VStack,
  useBreakpointValue,
  useColorModeValue,
  Badge,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { FaMedal, FaStar, FaCrown, FaClock } from 'react-icons/fa';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const Registration = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', '#141414');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.300', '#333');
  const buttonColor = useColorModeValue('#e50914', '#e50914');
  const headingFontSize = useBreakpointValue({ base: '22px', md: '28px' });
  const badgeBgColor = useColorModeValue('green.500', 'green.300');
  const w = useBreakpointValue({ base: '100%', md: '250px' });
  const planBg = useColorModeValue('gray.50', 'gray.700');
  const h = useBreakpointValue({ base: 'auto', md: '450px' });
  const direction = useBreakpointValue({ base: 'column', md: 'row' });
  const { logo, api,currency } = useAuth();

  const [plans, setPlans] = useState([]);

  const iconMap = {
    FaStar: FaStar,
    FaCrown: FaCrown,
    FaMedal: FaMedal,
    FaClock: FaClock,
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/api/subscription');
        setPlans(response.data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };
    fetchPlans();
  }, []);

  const handlePlanClick = (plan) => {
    localStorage.setItem('Plan', JSON.stringify(plan));
    navigate('/register/fast-registration');
  };

  return (
    <Center minHeight="100vh" px={6} py={12} bg={bgColor}>
      <VStack spacing={8} w="100%" maxW="1000px" position="relative">
        <HStack top="10px" right="20px">
          <Button
            as={RouterLink}
            to="/login"
            fontSize="md"
            fontWeight="bold"
            color={buttonColor}
            _hover={{ textDecoration: 'underline' }}
          >
            Retour à la Connexion
          </Button>
        </HStack>

        <Image src={logo} alt="Logo" boxSize="100px" objectFit="contain" borderRadius={"20px"} />

        <Heading as="h1" fontWeight="600" fontSize={headingFontSize} color={textColor} textAlign="center">
          Nos Plans
        </Heading>

        <Text fontSize="lg" color={textColor} textAlign="center" maxW="700px">
          Nous sommes les leaders en streaming avec plus de 100,000 films et séries, ainsi que plus de 20,000 chaînes de TV du monde entier. Rejoignez-nous et profitez du meilleur du divertissement! Notre service client est disponible 24/7 pour vous assister.
        </Text>

        <VStack spacing={6} w="100%">
          <Button
            w="100%"
            bg={buttonColor}
            color="white"
            size="md"
            _hover={{ bg: '#b20610' }}
            _active={{ bg: '#90050d' }}
            borderRadius="6px"
            onClick={() => navigate('/register/fast-registration')}
          >
            Inscription Rapide
          </Button>

          <Button
            w="100%"
            bg="blue.600"
            color="white"
            size="md"
            _hover={{ bg: 'blue.500' }}
            _active={{ bg: 'blue.700' }}
            borderRadius="6px"
            onClick={() => navigate('/register/agent-registration')}
          >
            Inscription par un Agent Certifié
          </Button>
        </VStack>
        
        <Stack direction={direction} spacing={6} w="100%" justifyContent="center">
          {[...plans].reverse()?.map((plan, idx) => (
            <Box
              key={idx}
              w={w}
              bg={planBg}
              p={8}
              borderRadius="lg"
              boxShadow="lg"
              textAlign="center"
              borderColor={borderColor}
              borderWidth="1px"
              _hover={{ boxShadow: '0 0 20px rgba(229, 9, 20, 0.6)' }}
              transition="box-shadow 0.3s ease-in-out"
              h={h}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              onClick={() => handlePlanClick(plan)}
              cursor="pointer"
            >
              {plan.badge && (
                <Badge colorScheme="green" mb={2} bg={badgeBgColor}>
                  {plan.badge}
                </Badge>
              )}
              <Icon as={iconMap[plan.icon] || FaClock} boxSize={10} color="yellow.500" mb={4} />
              <Text fontSize="xl" fontWeight="bold" color={textColor}>
                {plan.price} <Text as="span" fontSize="lg" color="gray.500">{currency}/mois</Text>
              </Text>

              <Box mt={4}>
                <HStack justifyContent="center" spacing={1}>
                  <Text fontSize="lg" fontWeight="semibold" color={textColor}>Appareils:</Text>
                  <Text fontSize="lg" fontWeight="bold" color="green.500">{plan.devices}</Text>
                </HStack>
 
                <HStack justifyContent="center" spacing={1} mt={1}>
                  <Text fontSize="lg" fontWeight="semibold" color={textColor}>Téléchargements:</Text>
                  <Text fontSize="lg" fontWeight="bold" color="green.500">{plan.downloads < 2000 ? plan.downloads : "Illimité"}</Text>
                </HStack>
              </Box>

              <Text fontSize="sm" mt={3} color={textColor} textAlign="center">{plan.description}</Text>

              {plan.downloads < 2000 && (
                <Text fontSize="sm" mt={2} color="gray.500">
                  Augmentez les téléchargements pour <Text as="span" fontWeight="bold">300 CFA</Text> par téléchargement supplémentaire
                </Text>
              )}
            </Box>
          ))}
        </Stack>
      </VStack>
    </Center>
  );
};

export default Registration;

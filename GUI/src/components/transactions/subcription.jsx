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
  Badge,
  Icon,
  HStack,
  Input,
  useToast,
  useBreakpointValue,
  useColorModeValue,
  IconButton
} from '@chakra-ui/react';
import { FaMedal, FaStar, FaCrown, FaClock, FaPlus, FaMinus } from 'react-icons/fa';
import {  FiChevronUp ,FiChevronRight} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTransaction } from '../../context/TransactionContext';
import { useAuth } from '../../context/useAuth';

const SubscriptionTransaction = () => {
  const navigate = useNavigate();
  const { logo, api, currency } = useAuth();
  const { createSubscriptionTransaction ,tloading} = useTransaction();

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [referralCode, setReferralCode] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const iconMap = { FaStar, FaCrown, FaMedal, FaClock };
  const boxBg = useColorModeValue("white",'gray.900');
  const planBg = useColorModeValue('#ffffff', '#2D3748');
  const buttonColor = useColorModeValue('#ff4757', '#ff4757');
  const badgeBgColor = useColorModeValue('green.400', 'green.300');
  const textColor = useColorModeValue('gray.700', 'white');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
       // const token = localStorage.getItem('accessToken');
        const response = await api.get('/api/subscription');
        setPlans(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des forfaits:", error);
      }
    };
    fetchPlans();

    // Check local storage for selected plan
    const savedPlan = localStorage.getItem('Plan');
    if (savedPlan) {
      setSelectedPlan(JSON.parse(savedPlan));
    }
  }, []);

 
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
   
    localStorage.setItem('Plan', JSON.stringify(plan));
  };

  const handleSubscribe = () => {
  const response=  createSubscriptionTransaction({
      unit: quantity,
      type: selectedPlan?.type,
      referredCode: referralCode,
    })

  };

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  return (
    <Box minHeight="100vh" minWidth="100vw" bg={boxBg} display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={6} width="100%" maxW="1200px" p={4} align="stretch">
        <Center>
          <Image src={logo} alt="Logo" boxSize="80px" objectFit="contain" borderRadius="20px" />
        </Center>
        <Heading
          as="h1"
          fontWeight="600"
          fontSize={useBreakpointValue({ base: "28px", md: "32px" })}
          color={textColor}
          textAlign="center"
          w="100%"
        >
          Choisissez Votre Forfait
        </Heading>

        <Text fontSize="lg" color={textColor} textAlign="center" maxW="700px" mx="auto">
          Obtenez les meilleurs forfaits de divertissement. 
        </Text>

        <VStack spacing={6} w="100%">
        <HStack justifyContent="center" spacing={2}>
        <Text fontSize="lg" color={textColor} textAlign="center" maxW="700px" mx="auto">
        Saisissez un code de parrainage pour une remise de 15% !
        </Text>
      <IconButton
        onClick={() => setIsVisible(!isVisible)}
        icon={isVisible ? <FiChevronUp /> : <FiChevronRight />}
        colorScheme="teal"
        aria-label={isVisible ? "Hide Code Input" : "Show Code Input"}
      />
      
      {isVisible && (
        <Input
          placeholder="Code de Parrainage"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          maxW="300px"
          bg="gray.100"
          color="gray.700"
          _placeholder={{ color: "gray.500" }}
          border="2px solid"
          borderColor={referralCode ? "green.500" : "gray.300"}
          _focus={{ borderColor: "green.500" }}
        />
      )}
      
    </HStack>

          <Stack
            direction={useBreakpointValue({ base: "column", md: "row" })}
            spacing={6}
            w="100%"
            justifyContent="center"
            wrap="wrap"
            display="grid"
            gridTemplateColumns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }}
            gap={4}
          >
            {[...plans]?.map((plan) => (
              <Box
                key={plan.id}
                w="100%"
                bg={planBg}
                p={6}
                borderRadius="lg"
                boxShadow="0 4px 15px rgba(229, 9, 20, 0.4)"
                textAlign="center"
                cursor="pointer"
                border={selectedPlan?.id === plan.id ? "2px solid #ff4757" : "2px solid transparent"}
                onClick={() => handlePlanSelect(plan)}
                _hover={{ boxShadow: '0 0 20px rgba(229, 9, 20, 0.6)', transform: 'scale(1.05)' }}
                transition="all 0.3s ease-in-out"
                position="relative"
              >
                {selectedPlan?.id === plan.id && (
                  <Badge colorScheme="red" position="absolute" top="2" right="2">
                    Quantité: {quantity}
                  </Badge>
                )}
                {plan.badge && (
                  <Badge colorScheme="green" mb={2} bg={badgeBgColor}>
                    {plan.badge}
                  </Badge>
                )}
                <Icon as={iconMap[plan.icon] || FaClock} boxSize={10} color="yellow.500" mb={4} />
                <Text fontSize="xl" fontWeight="bold" color={textColor}>
                  {plan.price} <Text as="span" fontSize="lg" color="gray.500">{currency}/mois</Text>
                </Text>
                <Text fontSize="sm" mt={3} color={textColor} textAlign="center">{plan.description}</Text>
                {plan.downloads < 2000 && (
                  <Text fontSize="sm" mt={2} color="gray.500">
                    Augmentez les téléchargements pour <Text as="span" fontWeight="bold">300 CFA</Text> par téléchargement supplémentaire
                  </Text>
                )}

                {selectedPlan?.id === plan.id && (
                  <>
                    <Box
                      position="absolute"
                      bottom="0"
                      left="0"
                      width="100%"
                      height="25%"
                      bg="rgba(0, 0, 0, 0.3)"
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      borderBottomRadius="lg"
                      px={4}
                    >
                      <HStack spacing={2}>
                        <Icon
                          as={FaMinus}
                          boxSize={5}
                          color="white"
                          cursor="pointer"
                          onClick={() => handleQuantityChange(-1)}
                        />
                        <Text color="white" fontWeight="bold">{quantity}</Text>
                        <Icon
                          as={FaPlus}
                          boxSize={5}
                          color="white"
                          cursor="pointer"
                          onClick={() => handleQuantityChange(1)}
                        />
                      </HStack>
                      <Button
                        bg={buttonColor}
                        color="white"
                        size="md"
                        _hover={{ bg: '#ff6b6b' }}
                        _active={{ bg: '#ff4747' }}
                        borderRadius="6px"
                        onClick={handleSubscribe}
                      >
                        S'abonner
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
            ))}
          </Stack>
        </VStack>
      </VStack>
    </Box>
  );
};

export default SubscriptionTransaction;

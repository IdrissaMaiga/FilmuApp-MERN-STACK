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
  HStack,
  useBreakpointValue,
  useColorModeValue,
  Icon,
  Link as ChakraLink,
  Spinner,
} from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaInstagram, FaStar, FaWhatsapp, FaTelegram } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth';



const GetAgents = () => {
  const { getAllAgents,logo } = useAuth();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue('white', '#141414');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.300', '#333');
  const buttonColor = useColorModeValue('#e50914', '#e50914');
  const starColor = useColorModeValue('yellow.400', 'yellow.300');

  // Ensure that all hooks are placed at the top
  const isMobile = useBreakpointValue({ base: 'column', md: 'row' });
  const boxWidth = useBreakpointValue({ base: '100%', md: '250px' });
  const boxHeight = useBreakpointValue({ base: 'auto', md: 'auto' });
  const planBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      const response = await getAllAgents();
      setAgents(response.data || []);
      setLoading(false);
    };

    fetchAgents();
  }, []);

  const renderSocialMediaIcons = (socialMedias) => {
    const socialMediaMap = {
      facebook: FaFacebook,
      twitter: FaTwitter,
      instagram: FaInstagram,
      whatsapp: FaWhatsapp,
      telegram: FaTelegram,
    };

    return Object.entries(socialMedias).map(([platform, link]) => {
      const IconComponent = socialMediaMap[platform.toLowerCase()];
      const iconColor = {
        facebook: 'blue.500',
        twitter: 'cyan.500',
        instagram: 'pink.500',
        whatsapp: 'green.500',
        telegram: 'blue.300',
      }[platform.toLowerCase()];

      return IconComponent ? (
        <ChakraLink key={platform} href={link} isExternal>
          <Icon
            as={IconComponent}
            boxSize={8} // Larger size by default
            mr={3}
            color={iconColor}
            _hover={{ boxSize: 10 }} // Larger on hover
          />
        </ChakraLink>
      ) : null;
    });
  };

  return (
    <Center minHeight="100vh" px={6} py={12} bg={bgColor}>
      <VStack spacing={8} w="100%" maxW="1000px" position="relative">
        {/* Back to Login and Registration Option */}
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
        <Button
          as={RouterLink}
          to="/register"
          fontSize="md"
          fontWeight="bold"
          color={buttonColor}
          _hover={{ textDecoration: 'underline' }}
        >
          Retour debut Inscription
        </Button>

        {/* Logo */}
        <Image src={logo} alt="Logo" boxSize="100px" objectFit="contain" borderRadius="20px" />

        {/* Heading */}
        <Heading as="h1" fontWeight="600" fontSize="28px" color={textColor} textAlign="center">
          Liste des Agents Certifiés
        </Heading>

        {/* Loading Spinner */}
        {loading ? (
          <Spinner size="xl" />
        ) : (
          <Stack direction={isMobile} spacing={6} w="100%" justifyContent="center" wrap="wrap">
            {/* Map over agents */}
            {agents.length > 0 ? (
              agents.map((agent, idx) => (
                <Box
                  key={idx}
                  w={boxWidth}
                  bg={planBg}
                  p={8}
                  borderRadius="lg"
                  boxShadow="lg"
                  textAlign="center"
                  borderColor={borderColor}
                  borderWidth="1px"
                  position="relative" // Set relative position to adjust the star icon
                  _hover={{ boxShadow: '0 0 20px rgba(229, 9, 20, 0.6)' }}
                  transition="box-shadow 0.3s ease-in-out"
                  h={boxHeight}
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                >
                  {/* Star Badge at top-right corner */}
                  <Icon
                    as={FaStar}
                    color={starColor}
                    boxSize={6}
                    position="absolute"
                    top="10px"
                    right="10px"
                  />

                  {/* Agent Info */}
                  <HStack justifyContent="center">
                    <Text fontSize="xl" fontWeight="bold" color={textColor}>
                      {agent.email}
                    </Text>
                  </HStack>
                  
                  {agent.phone && (
                 <ChakraLink href={`tel:${agent.phone}`} isExternal>
                  <Text fontSize="lg" mt={2} color={textColor} _hover={{ textDecoration: 'underline' }}>
                   Téléphone: {agent.phone}
                  </Text>
                  </ChakraLink>
                   )}
                  {agent.workingtime && (
                    <Text fontSize="md" mt={1} color={textColor}>
                      Horaires de travail: {agent.workingtime}
                    </Text>
                  )}

                  {/* Social Media Links */}
                  {agent.SocialMedias && Object.keys(agent.SocialMedias).length > 0 && (
                    <HStack mt={4} justifyContent="center">
                      {renderSocialMediaIcons(agent.SocialMedias)}
                    </HStack>
                  )}
                </Box>
              ))
            ) : (
              <Text fontSize="lg" color={textColor}>
                Aucun agent disponible pour le moment.
              </Text>
            )}
          </Stack>
        )}
      </VStack>
    </Center>
  );
};

export default GetAgents;

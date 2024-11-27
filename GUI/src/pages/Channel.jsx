import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Image,
  Skeleton,
  SimpleGrid,
  Select,
  Button,
  HStack,
  VStack,
  useBreakpointValue,
  Circle,
  useColorMode
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { FaArrowLeft } from 'react-icons/fa';
import PortPlayer from './portplayer';

const ChannelDetailPage = () => {
  const { id } = useParams();
  const { api } = useAuth();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regionFilter, setRegionFilter] = useState('');
  const [resolutionFilter, setResolutionFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [selectedPortId, setSelectedPortId] = useState(localStorage.getItem('selectedPortId') || null);
  const{colorMode}=useColorMode();
  const navigate = useNavigate();
  
  const fontSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const padding = useBreakpointValue({ base: 2, md: 4 });
  
  useEffect(() => {
    const fetchChannelDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get(`/api/channels/${id}`, {headers: { Authorization: `Bearer ${token}` }, 
        //  withCredentials: true
         });
        setChannel(response.data);
      } catch (error) {
        console.error("Échec de la récupération des détails du canal", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChannelDetails();
  }, [id, api]);
  useEffect(() => {
    // Store the selectedPortId when it changes
    if (selectedPortId) {
      localStorage.setItem('selectedPortId', selectedPortId);
    }

    // Cleanup function to run when the component unmounts (route changes)
    return () => {
      localStorage.removeItem('selectedPortId');
    };
  }, [selectedPortId, location.pathname]); // Re-run effect on route change

  const goBack = () => {localStorage.removeItem('selectedPortId');
    ;navigate(-1)}

  const filteredPorts = channel?.ports.filter((port) => {
    const matchesRegion = regionFilter ? port.region === regionFilter : true;
    const matchesResolution = resolutionFilter ? port.resolution === resolutionFilter : true;
    const matchesLanguage = languageFilter ? port.language === languageFilter : true;
    return matchesRegion && matchesResolution && matchesLanguage;
  });

  const uniqueRegions = [...new Set(channel?.ports.map((port) => port.region).filter(Boolean))];
  const uniqueResolutions = [...new Set(channel?.ports.map((port) => port.resolution).filter(Boolean))];
  const uniqueLanguages = [...new Set(channel?.ports.map((port) => port.language).filter(Boolean))];

  if (loading) {
    return <Skeleton height="400px" />;
  }

  if (!channel) {
    return <Text>Canal non trouvé</Text>;
  }

  return (
    <Box p={padding}>
       
       <Button 
        leftIcon={<FaArrowLeft style={{ fontSize: '10px' }} />} // Set the icon size to make it even smaller
        onClick={goBack} 
        colorScheme="red" 
        variant="solid" 
        size="xs" 
        paddingRight={3}
        mb={1}

      >
          </Button>

      {/* Video Player */}
      <Box mb={2} >
        {selectedPortId ? (
          <PortPlayer
            key={selectedPortId}
            portId={selectedPortId}
            logo={
              <Box ml={2}>
                <HStack>
                 
                    <Image
       src={channel.logos[0] || 'default-logo.png'}
      alt="Logo du Canal"
      borderRadius="md"
      objectFit="contain"
      fallbackSrc="default-logo.png"
      boxSize={{ base: '40px', md: '50px' }}
      loading="lazy" // This ensures lazy loading
      sx={{
        opacity: 0, // Initial opacity is 0
        transition: 'opacity 1s ease-in-out', // Smooth fade-in transition
        '&[src]': {
          opacity: 1, // When image is loaded, opacity changes to 1
        },
      }}
    />
                  <VStack align="start" spacing={0}>
                    <Text mt={1} fontSize={fontSize} fontWeight="bold">
                      {channel.name}
                    </Text>
                    {channel.category !== "undefined" && (
                      <Text color="gray.500" fontSize={fontSize}>
                        {channel.category}
                      </Text>
                    )}
                  </VStack>
                </HStack>
              </Box>
            }
          />
        ) : (
          <Box ml={2}>
          <HStack>
            <Image
              src={channel.logos[0] || 'default-logo.png'}
              alt="Logo du Canal"
              boxSize={{ base: '40px', md: '50px' }}
              borderRadius="md"
            />
            <VStack align="start" spacing={0}>
              <Text mt={1} fontSize={fontSize} fontWeight="bold">
                {channel.name}
              </Text>
              {channel.category !== "undefined" && (
                <Text color="gray.500" fontSize={fontSize}>
                  {channel.category}
                </Text>
              )}
            </VStack>
            <Text fontSize="lg" textAlign="center" color="gray.500">
            Sélectionnez un flux à lire
          </Text>
          </HStack>
        </Box>
          
        )}
      </Box>

      {/* Filters */}
      <Box display="flex" flexWrap="wrap" gap={4} mb={6}>
        <Select
          placeholder="Filtrer par région"
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          borderColor="blue.300"
          focusBorderColor="teal.600"
          w={{ base: '100%', md: 'auto' }}
        >
          {uniqueRegions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </Select>

        <Select
          placeholder="Filtrer par résolution"
          value={resolutionFilter}
          onChange={(e) => setResolutionFilter(e.target.value)}
          borderColor="blue.300"
          focusBorderColor="teal.600"
          w={{ base: '100%', md: 'auto' }}
          
        >
          {uniqueResolutions.map((resolution) => (
            <option key={resolution} value={resolution}>
              {resolution}
            </option>
          ))}
        </Select>

        <Select
          placeholder="Filtrer par langue"
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
          borderColor="blue.300"
          focusBorderColor="teal.600"
          w={{ base: '100%', md: 'auto' }}
        >
          {uniqueLanguages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </Select>
      </Box>

      {/* Ports List */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 2 }} spacing={4}>
        {filteredPorts.map((port) => (
          <Box
            key={port.id}
            p={padding}
            border="1px solid #ddd"
            borderRadius="md"
            cursor="pointer"
            bg={port.id === selectedPortId ? 'blue.100' : (colorMode === 'dark' ? 'black' : 'gray.50')}
            onClick={() => setSelectedPortId(port.id)}
            transition="background 0.2s"
            _hover={{ bg: 'teal.50' }}
          >
            <HStack><Text fontSize={fontSize} fontWeight="bold">{port.name}</Text>
            {port.region&& <Text fontSize="sm" color="gray.500">{port.region }</Text>}
            {port.resolution&&<Text fontSize="sm" color="gray.500">{port.resolution}</Text>}
              
              {port.ok && (
                <Circle size="10px" bg="green.500" />
              )}
            </HStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ChannelDetailPage;

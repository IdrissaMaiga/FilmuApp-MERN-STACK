import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Box, Text, Skeleton, VStack, Collapse, Button, Divider, useColorMode, useBreakpointValue } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/useAuth';
import HLSPlayer from '../components/hlsplayer';


const PortPlayer = ({ portId, logo }) => {
  const { api, epg, streamingserverurl, user } = useAuth();
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(true);
  const [epgData, setEpgData] = useState([]);
  const [streamUrl, setStreamUrl] = useState("");
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [StreamingAccess, setStreamingAccess] = useState(undefined);
  // Helper function to decode Base64 strings and handle UTF-8 encoding
  const decodeBase64 = (str) => {
    try {
      const decodedStr = atob(str);
      return decodeURIComponent(escape(decodedStr));
    } catch (e) {
      console.error("Erreur lors du décodage de la chaîne");
      return str; // Fallback to the original if decoding fails
    }
  };
  useLayoutEffect(() => {const access={username:!!user?.StreamingAccess?.username?.trim()?user.StreamingAccess.username:null,
    password:!!user?.StreamingAccess?.username?.trim()?user.StreamingAccess.password:null
  }
  setStreamingAccess(access)
},
  [user])

  // Responsive font and size adjustments
  const fontSize = useBreakpointValue({ base: 'sm', md: 'md' });
 

  useEffect(() => {
    const fetchPortAndPlay = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        const response = await api.get(`/api/port/${portId}`, {headers: { Authorization: `Bearer ${token}` },
         //  withCredentials: true 
          });
        const port = response.data;

        if (user.StreamingAccess && port) {
          const tempUrl = `${streamingserverurl}/live/${user.StreamingAccess.username}/${user.StreamingAccess.password}/${port.indexer}.m3u8`;
          setStreamUrl(tempUrl);

          const epgResponse = await epg.get("", {
            params: {
              username: user.StreamingAccess.username,
              password: user.StreamingAccess.password,
              action: 'get_short_epg',
              stream_id: port.indexer,
            },
          });
         
          setEpgData(epgResponse.data.epg_listings || []);
          
        }
      } catch (err) {
        console.error('Échec du chargement du port ou du flux');
        
      } finally {
        setLoading(false);
      }
    };

    fetchPortAndPlay();
  }, [portId, api, user, epg]);
  
  return (StreamingAccess&&StreamingAccess?.username&&StreamingAccess?.password) ? (
    <VStack 
      spacing={6} 
      align="stretch" 
      p={0} 
      borderRadius="lg" 
      bg={colorMode === 'dark' ? 'black' : 'white'}
      color={colorMode === 'dark' ? 'white' : 'black'}
      boxShadow="md"
      width="100%"
      m={0}
    >
      {loading ? (
        <Skeleton height="200px" borderRadius="8px" />
      ) : (
        (portId && streamingserverurl &&
          <HLSPlayer
            src={streamUrl}  
            onContextMenu={(e) => e.preventDefault()} 
            width="100%" 
            height="500px"  
            style={{
              borderRadius: '8px', 
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              margin: '0',
              width: "100%"
            }}
          />
        )
      )}
     
      {logo && (
        logo
      )}

      {epgData.length > 0 ? (
        <Box 
          p={3} 
          bg={colorMode === 'dark' ? 'black' : 'gray.50'} 
          borderRadius="md" 
          boxShadow="sm" 
          mb={2}
        >
          <Text fontSize={fontSize} fontWeight="bold" color="blue.600">
            {decodeBase64(epgData[0].title)}
          </Text>
          <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.300' : 'gray.500'}>
            {new Date(epgData[0].start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(epgData[0].end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </Box>
      ) : null}

      <Box width="100%">
        <Button 
          onClick={() => setIsGuideOpen(!isGuideOpen)} 
          size="sm" 
          rightIcon={isGuideOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} 
          mb={2}
          width="100%"
          variant="outline"
          colorScheme="blue"
        >
          {isGuideOpen ? "Masquer le programme" : "Afficher le programme"}
        </Button>
        <Collapse in={isGuideOpen} animateOpacity>
          {epgData.length > 0 ? (
            epgData.map((program) => (
              <Box 
                key={program.id} 
                p={3} 
                bg={colorMode === 'dark' ? 'black' : 'gray.50'} 
                borderRadius="md" 
                boxShadow="sm" 
                mb={2}
              >
                <Text fontSize={fontSize} fontWeight="bold" color="blue.600">
                  {decodeBase64(program.title)}
                </Text>
                <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.300' : 'black'}>
                  {new Date(program.start).toLocaleString()} - {new Date(program.end).toLocaleString()}
                </Text>
                <Divider my={2} />
                <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.100' : 'gray.700'}>
                  {decodeBase64(program.description)}
                </Text>
              </Box>
            ))
          ) : (
            <Text fontSize="sm" color="gray.500">Aucune donnée EPG disponible.</Text>
          )}
        </Collapse>
      </Box>
    </VStack>
  ) : (
    <Text color="red.500" fontWeight="bold">Pas autorisé à diffuser</Text>
  );
};

export default PortPlayer;

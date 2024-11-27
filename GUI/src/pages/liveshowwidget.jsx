import React, { useEffect, useState, useRef } from 'react';
import { Box, Flex, IconButton, Skeleton,  useBreakpointValue, Image, Center, VStack,  Spacer,  useColorModeValue } from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

const ChannelWidget = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScrollable, setIsScrollable] = useState(false);
  const [pageSize, setPageSize] = useState(24);  // Default page size
  
  const scrollRef = useRef(null);
  const { api } = useAuth();
  const scrollAmount = useBreakpointValue({ base: 200, md: 300 });
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const navigate = useNavigate();




  const updateResponsiveValues = () => {
    const screenWidth = window.innerWidth;
  
    // Set `pageSize` (items to fetch) and `chunkSize` (items per row) based on screen size
    if (screenWidth > 2560) {           // Large 4K screens or ultra-wide displays
      setPageSize(48);                   // Fetch more items for large screens
               // Display more items per row
    } else if (screenWidth > 1440) {     // 1440p screens (common high-resolution monitors)
      setPageSize(36);                   // Fetch slightly fewer items
                // Show a moderate number of items per row
    } else if (screenWidth > 1200) {     // Large desktop screens
      setPageSize(24);                   // Slightly fewer items
               // Show moderate items per row
    } else if (screenWidth > 768) {      // Tablet or small desktop screens
      setPageSize(18);                   // Fetch less items
                   // Fewer items per row
    } else {                             // Mobile screens
      setPageSize(12);                   // Minimal fetch for small screens
                    // Minimal items per row
    }
  };
  

  useEffect(() => {
    // Update values on component mount and when screen is resized
    updateResponsiveValues();
    window.addEventListener("resize", updateResponsiveValues);

    return () => {
      window.removeEventListener("resize", updateResponsiveValues);
    };
  }, []);
  useEffect(() => {
    fetchChannels();
  }, []);
  const bg= useColorModeValue("white","black")
  useEffect(() => {
    const { scrollWidth, clientWidth } = scrollRef.current || {};
    setIsScrollable(scrollWidth > clientWidth);
  }, [channels]);

  const fetchChannels = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
        const response = await api.get('/api/channels/', {headers: { Authorization: `Bearer ${token}` },
            params: {
              //page: currentPage,
              limit: pageSize,
              //searchTerm,
              category: "SPORT",
            },
           // withCredentials: true,
          });
      setChannels(response.data.channels);
    } catch (error) {
      console.error('Failed to fetch channels', error);
    } finally {
      setLoading(false);
    }
  };
  const handleChannelClick = (channelId) => {
    navigate(`/channel/${channelId}`);
  };
  const renderLogo = (logos) => (
    <Image
      src={logos[0] || logos[1] || 'default-logo.png'}
      alt="Channel Logo"
      borderRadius="md"
      objectFit="contain"
      fallbackSrc="default-logo.png"
      minH="100px"
      minW="100px"
      loading="lazy" // This ensures lazy loading
      sx={{
        opacity: 0, // Initial opacity is 0
        transition: 'opacity 1s ease-in-out', // Smooth fade-in transition
        '&[src]': {
          opacity: 1, // When image is loaded, opacity changes to 1
        },
      }}
    />
  );

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <Box
      bg={bg}
      maxH="100px"
      width="100%"
      overflow="hidden"
      position="relative"
      borderRadius="md"
      backdropFilter="blur(10px)"
      px={0}
      paddingBottom={200}
    >
    

      <Flex alignItems="center" position="relative">
      {!isMobile&&<IconButton
          icon={<FaChevronLeft />}
          onClick={scrollLeft}
          position="absolute"
          left="0"
          zIndex="20"
          aria-label="Scroll Left"
          display={isScrollable ? 'block' : 'none'}
          bg="transparent"
          _hover={{ bg: 'gray.200' }}
          _focus={{ boxShadow: 'outline' }}
        />}

        <Flex
          ref={scrollRef}
          overflowX="auto"
          p={0}
          maxHeight="200px" // Ensures no vertical scroll
          sx={{
            scrollbarWidth: 'none',
            '::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {loading ? (
            <Flex gap="4">
              {Array.from({ length: 20 }).map((_, index) => (
                <Skeleton key={index} height="200px" maxHeight="200px" width="110px" borderRadius="md" />
              ))}
            </Flex>
          ) : (
            <Flex gap="4" px={2}>
             {channels?.map((channel, index) => (
  <Center key={channel?.id || index}> {/* Ensure each item has a unique key */}
    <VStack
      border="1px solid #ddd"
      p={0}
      onClick={() => handleChannelClick(channel.id)}
      borderRadius="md"
      height="100%" // Set height to ensure square
      width="100%"  // Set width to ensure square
      textAlign="center"
      cursor="pointer"
      boxShadow="md"
      borderColor={bg}
      overflow="hidden" // Prevent overflow
      _hover={{ boxShadow: 'xl', bg: 'gray.50' }}
      spacing={4} // Add spacing between logo, name, and category
      align="center"
    >
      <Spacer />
      {renderLogo(channel.logos)}
     
      <Spacer />
    </VStack>
  </Center>
))}

            </Flex>
          )}
        </Flex>

        {!isMobile&&<IconButton
          icon={<FaChevronRight />}
          onClick={scrollRight}
          position="absolute"
          right="0"
          zIndex="20"
          aria-label="Scroll Right"
          display={isScrollable ? 'block' : 'none'}
          bg="transparent"
          _hover={{ bg: 'gray.200' }}
          _focus={{ boxShadow: 'outline' }}
        />}
      </Flex>
    </Box>
  );
};

export default ChannelWidget;

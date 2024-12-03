import React, { useState, useEffect, useCallback } from 'react';
import { Box, Input, Select, Skeleton, SimpleGrid, Image, Button, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../context/useAuth';
import { streamingserverurl } from '../context/authProvider';


const ITEMS_PER_PAGE = 20;

const ChannelListPage = () => {
  const [channels, setChannels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const { api } = useAuth();
  const [currentPage, setCurrentPage] = useState(
    parseInt(localStorage.getItem('currentPage')) || 1
  );
  const navigate = useNavigate();

  useEffect(() => {
    fetchChannels();
  }, [searchTerm, selectedCategory, currentPage]);

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  const fetchChannels = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('accessToken');
    try {
      const response = await api.get('/api/channels/', {headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          searchTerm,
          category: selectedCategory,
        },
        //withCredentials: true,
      });

      setChannels(response.data.channels);
      setTotalPages(response.data.totalPages);
      extractCategories(response.data.channels);
    } catch (error) {
      console.error('Failed to fetch channels', error);
      setError('Failed to load channels. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const extractCategories = (channels) => {
    const uniqueCategories = Array.from(new Set(channels.map(channel => channel.category).filter(Boolean)));
    setCategories(uniqueCategories);
  };

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleChannelClick = (channelId) => {
    navigate(`/channel/${channelId}`);
  };

  const renderLogo = (logos) => (
     <Image
      src={`${streamingserverurl}/media/${encodeURIComponent(`${logos[0]}`)}`|| `${streamingserverurl}/media/${encodeURIComponent(`${logos[1]}`)}` || 'default-logo.png'}
      alt="Channel Logo"
      borderRadius="md"
      objectFit="contain"
      fallbackSrc="default-logo.png"
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

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <Box p={6}>
      <Box mb={6}>
        <Input
          placeholder="Search channels..."
          value={searchTerm}
          onChange={handleSearch}
          mb={3}
          borderColor="teal.400"
          focusBorderColor="teal.600"
        />
        <Select
          placeholder="Select Category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          borderColor="teal.400"
          focusBorderColor="teal.600"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </Box>

      <Box>
        {loading ? (
          <SimpleGrid columns={{ base: 3, md: 4, lg: 8 }} spacing={4}>
            {Array(8).fill('').map((_, index) => (
              <Box key={index} border="1px solid #ddd" p={4} borderRadius="md">
                <Skeleton height="150px" borderRadius="md" />
                <Skeleton mt={2} height="20px" />
              </Box>
            ))}
          </SimpleGrid>
        ) : error ? (
          <Text color="red.500" textAlign="center" fontSize="lg">
            {error}
          </Text>
        ) : channels.length === 0 ? (
          <Text mt={6} color="gray.500" fontSize="lg" textAlign="center">
            No channels found.
          </Text>
        ) : (
          <SimpleGrid columns={{ base: 3, md: 4, lg: 8 }} spacing={4}>
            {channels.map((channel) => (
              <Box
                key={channel.id}
                border="1px solid #ddd"
                p={4}
                borderRadius="md"
                textAlign="center"
                cursor="pointer"
                boxShadow="md"
                _hover={{ boxShadow: "xl", bg: "gray.50" }}
                onClick={() => handleChannelClick(channel.id)}
              >
                {renderLogo(channel.logos)}
                <Text mt={2} fontWeight="bold">{channel.name}</Text>
                {channel.category!="undefined" &&  (<Text color="gray.500">{channel.category || 'No category'}</Text>)}
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>

      {!loading && (
        <Box mt={6} display="flex" justifyContent="center" alignItems="center" gap={4}>
          <Button
            leftIcon={<FaArrowLeft />}
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            colorScheme="red"
            variant="solid"
            size="md"
          >
            Previous
          </Button>
          <Box
            as="span"
            fontSize="lg"
            fontWeight="semibold"
            px={3}
            py={1}
            borderRadius="md"
            bg="gray.100"
            color="gray.700"
            display="flex"
            alignItems="center"
          >
            {currentPage} / {totalPages}
          </Box>
          <Button
            rightIcon={<FaArrowRight />}
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            colorScheme="red"
            variant="solid"
            size="md"
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ChannelListPage;

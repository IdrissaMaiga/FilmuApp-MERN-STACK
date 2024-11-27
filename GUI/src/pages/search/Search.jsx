import { 
  Container,
  Skeleton,
  Heading,
  Stack,
  Input,
  Text,
  useColorModeValue,
  Box,
  IconButton,
  Flex
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { searchall } from "../../services/api";
import PaginationComponent from "../../components/PaginationComponent";
import Card from "../Card";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const isImageValid = (url) => 
  new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });

const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

const SearchMoviesAndSeries = () => {
  const [items, setItems] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [type, setType] = useState('all');
  const scrollRefs = useRef([]);
  const [pageSize, setPageSize] = useState(24);  // Default page size
  const [chunkSize, setChunkSize] = useState(10);  
  const selectBgColor = useColorModeValue('white', 'gray.800');
  const selectTextColor = useColorModeValue('gray.800', 'white'); 
  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await searchall({
        page: activePage,
        search: searchQuery,
        pageSize: pageSize,
        type: type,
      });

      const filterValidImages = async (items) => {
        const promises = items.map(async (item) => {
          const isValidImage = await isImageValid(item.imagePath);
          return isValidImage ? item : null;
        });
        return (await Promise.all(promises)).filter(Boolean);
      };

      // Retrieve movies and/or series based on selected type
      let allItems = [];
      if (type === "movie" || type === "all") {
        const validMovies = await filterValidImages(res.results.movies);
        allItems = [...allItems, ...validMovies];
      }
      if (type === "series" || type === "all") {
        const validSeries = await filterValidImages(res.results.series);
        allItems = [...allItems, ...validSeries];
      }

      setItems(allItems);
      setTotalItems(type === 'movie' ? res.totalMovies : type === 'series' ? res.totalSeries : res.totalMovies + res.totalSeries);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const updateResponsiveValues = () => {
    const screenWidth = window.innerWidth;
  
    // Set `pageSize` (items to fetch) and `chunkSize` (items per row) based on screen size
    if (screenWidth > 2560) {           // Large 4K screens or ultra-wide displays
      setPageSize(48);                   // Fetch more items for large screens
      setChunkSize(16);                  // Display more items per row
    } else if (screenWidth > 1440) {     // 1440p screens (common high-resolution monitors)
      setPageSize(36);                   // Fetch slightly fewer items
      setChunkSize(12);                  // Show a moderate number of items per row
    } else if (screenWidth > 1200) {     // Large desktop screens
      setPageSize(24);                   // Slightly fewer items
      setChunkSize(8);                   // Show moderate items per row
    } else if (screenWidth > 768) {      // Tablet or small desktop screens
      setPageSize(18);                   // Fetch less items
      setChunkSize(6);                   // Fewer items per row
    } else {                             // Mobile screens
      setPageSize(12);                   // Minimal fetch for small screens
      setChunkSize(4);                   // Minimal items per row
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
    fetchData();
  }, [activePage, searchQuery, type]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setActivePage(1);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setActivePage(1);
  };

  const scrollLeft = (index) => {
    scrollRefs.current[index].scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = (index) => {
    scrollRefs.current[index].scrollBy({ left: 300, behavior: "smooth" });
  };

  const noResultsMessage = !isLoading && items.length === 0;
  const itemChunks = chunkArray(items, chunkSize);

  return (
    <Container maxW={"container.xl"}
   
    >
      <Heading as="h2" fontSize={"md"} textTransform={"uppercase"} my={4}>
        Rechercher des Films et Séries
      </Heading>

      <Stack direction="row" spacing={4} my={4}>
        <Input
          placeholder="Recherchez des films ou des séries"
          value={searchQuery}
          onChange={handleSearchChange}
        />
       
        <select
          onChange={handleTypeChange}
          value={type}
          style={{
            backgroundColor: selectBgColor,
            color: selectTextColor,
            border: '1px solid',
            borderColor: borderColor,
            padding: '8px',
            borderRadius: '4px',
          }}
        >
          <option value="all">Tous</option>
          <option value="movie">Films</option>
          <option value="series">Séries</option>
        </select>
      </Stack>

      {noResultsMessage && (
        <Text color="gray.500" fontSize="lg">
          Aucun résultat trouvé pour "{searchQuery}".
        </Text>
      )}

      {itemChunks.map((chunk, index) => (
        <Box key={`item-${index}`} maxH="400px" width="100%" overflow="hidden" position="relative" my={4}>
          <Flex alignItems="center">
          {!isMobile&& <IconButton
              icon={<FaChevronLeft />}
              onClick={() => scrollLeft(index)}
              position="absolute"
              left="0"
              zIndex="20"
              aria-label="Scroll Left"
              bg="transparent"
              _hover={{ bg: "gray.200" }}
            />}

            <Flex
              ref={(el) => (scrollRefs.current[index] = el)}
              overflowX="auto"
              py="4"
              sx={{
                scrollbarWidth: "none",
                "::-webkit-scrollbar": { display: "none" },
              }}
            >
              {isLoading ? (
                  <Flex gap="4">
                  {Array.from({ length: chunkSize }).map((_, i) => (
                    <Skeleton
                      key={i}
                      width={{ base: "150px", md: "180px", lg: "220px" }}
                      height={{ base: "210px", md: "260px", lg: "270px" }}
                      borderRadius="md"
                    />
                  ))}
                </Flex>
              ) : (
                <Flex gap="4" px={2}>
                  {chunk.map((item) => (
                    <Card  key={item?.id} item={item} type={item.type_==="MOVIE" ? "movie" : "series"} />
                  ))}
                </Flex>
              )}
            </Flex>

            {!isMobile&&<IconButton
              icon={<FaChevronRight />}
              onClick={() => scrollRight(index)}
              position="absolute"
              right="0"
              zIndex="20"
              aria-label="Scroll Right"
              bg="transparent"
              _hover={{ bg: "gray.200" }}
            />}
          </Flex>
        </Box>
      ))}

      <PaginationComponent
        activePage={activePage}
        totalPages={Math.ceil(totalItems / 24)}
        setActivePage={setActivePage}
      />
    </Container>
  );
};

export default SearchMoviesAndSeries;












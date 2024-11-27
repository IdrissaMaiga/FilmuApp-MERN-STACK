import { 
  Container, 
  Skeleton, 

  Button, 
  Stack, 
  Box, 
  IconButton, 
  Flex ,

  Text,
  useColorMode
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { fetchdata, fetchgenre } from "../../services/api";
import PaginationComponent from "../../components/PaginationComponent";
import Card from "../Card";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// Utility function to check if an image URL is valid
const isImageValid = (url) =>
  new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(true); 
    img.onerror = () => resolve(false);
  });

// Utility function to split movies into chunks of specified size
const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRandom, setIsRandom] = useState(false);
  const [shuffleCount, setShuffleCount] = useState(0);
  const scrollRefs = useRef([]);
  const [pageSize, setPageSize] = useState(24);  // Default page size
  const [chunkSize, setChunkSize] = useState(10); 
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const [genres, setGenres] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const { colorMode } = useColorMode(); 
  const isDarkMode = colorMode === "dark";
  const activeColor = "red.500";
  const inactiveColor = isDarkMode ? "gray.400" : "gray.700";

  const bgColor = isDarkMode ? "#050505" : "white";


  const hoverBgColor = activeColor; 
  const hoverTextColor = "white";
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
    setIsLoading(true);
    fetchdata(activePage, pageSize, "movie", isRandom,sortBy)
      .then(async (res) => {
        const moviePromises = (res?.movies || []).map(async (movie) => {
          const isValidImage = await isImageValid(movie.imagePath);
          return isValidImage ? movie : null;
        });
        const validMovies = (await Promise.all(moviePromises)).filter(Boolean);
        setMovies(validMovies);
        setActivePage(res?.page || 1);
        setTotalPages(Math.ceil(res?.totalMovies / res?.pageSize));
      })
      .catch((err) => console.error(err, "err"))
      .finally(() => setIsLoading(false));
  }, [activePage, isRandom, shuffleCount,sortBy]);

  useEffect(() => {
    // Fetch movie genres using the fetchgenre function
    const getGenres = async () => {
      const data = await fetchgenre("movie"); // Use "tv" for TV genres
      setGenres(data.genres);
       // Assuming 'data.genres' contains the list of genres
    };
  
    getGenres().catch((error) => console.error("Error fetching genres:", error));
  }, []);
  
  const handleToggleRandom = () => {
    setIsRandom((prev) => !prev);
    setActivePage(1);
    setShuffleCount(0);
  };

  const handleShuffle = () => {
    setShuffleCount((prev) => prev + 1);
  };

  const scrollLeft = (index) => {
    scrollRefs.current[index].scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = (index) => {
    scrollRefs.current[index].scrollBy({ left: 300, behavior: "smooth" });
  };

  // Split movies into chunks of 10
  const movieChunks = chunkArray(movies, chunkSize);

  return (
    <Container maxW="container.xl"
    sx={{
      overflowY: 'auto',
      overscrollBehavior: 'none', // Disable overscroll
    }}
    > <Flex
    gap="4"
    my="10"
    flexDirection="column"
    w="100%"
    bg={bgColor}
    borderRadius="lg"
    boxShadow="md"
    alignItems="baseline"
  >
    <Text fontSize="md" textTransform="uppercase" mb={2}>
      Découvrir des Films
    </Text>
  
    <Flex
      overflowX="auto"
      gap="4"
      w="full"
      p={2}
      justifyContent="start"
      scrollSnapType="x mandatory"
      sx={{
        "&::-webkit-scrollbar": {
          height: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: activeColor,
          borderRadius: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: isDarkMode ? "gray.700" : "gray.200",
        },
        WebkitOverflowScrolling: "touch",
      }}
      onMouseDown={(e) => {
        e.currentTarget.isDown = true;
        e.currentTarget.startX = e.pageX - e.currentTarget.offsetLeft;
        e.currentTarget.scrollLeft = e.currentTarget.scrollLeft;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.isDown = false;
      }}
      onMouseUp={(e) => {
        e.currentTarget.isDown = false;
      }}
      onMouseMove={(e) => {
        if (!e.currentTarget.isDown) return;
        e.preventDefault();
        const x = e.pageX - e.currentTarget.offsetLeft;
        const walk = (x - e.currentTarget.startX) * 0.5; // Reduce multiplier for slower scrolling
        e.currentTarget.scrollLeft = e.currentTarget.scrollLeft - walk;
      }}
    >
      {genres.map((genre) => (
        <Box key={genre.id} flexShrink={0} scrollSnapAlign="center">
          <Button
            variant="outline"
            colorScheme={sortBy === genre.name ? "red" : "gray"}
            color={sortBy === genre.name ? "gray" : inactiveColor}
            _hover={{
              bg: hoverBgColor,
              color: hoverTextColor,
            }}
            onClick={() => setSortBy(genre.name)}
            px={4}
            py={2}
            borderWidth={2}
            borderColor={sortBy === genre.name ? activeColor : "gray.300"}
          >
            {genre.name}
          </Button>
        </Box>
      ))}
    </Flex>
  </Flex>
  

      {movieChunks.map((chunk, index) => (
        <Box key={index} maxH="400px" width="100%" overflow="hidden" position="relative" my={4}>
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
                  {chunk.map((item, i) => (
                    <Card key={item?._id?.$oid || i} item={item} type="movie" />
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

      <Stack direction="row" spacing={4} my={4} alignItems="center">
       {sortBy==""&& <Button onClick={handleToggleRandom} colorScheme="red">
          {isRandom ? "Pagination" : "Aléatoire"}
        </Button>}
        {isRandom && (
          <Button onClick={handleShuffle} colorScheme="orange">
            Mélanger
          </Button>
        )}
        {!isRandom && (
          <PaginationComponent
            activePage={activePage}
            totalPages={totalPages}
            setActivePage={setActivePage}
          />
        )}
      </Stack>
    </Container>
  );
};

export default Movies;

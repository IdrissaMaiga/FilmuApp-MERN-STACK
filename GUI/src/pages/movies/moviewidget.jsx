import { useEffect, useState, useRef } from "react";
import { Box, Flex, IconButton, Skeleton, Text, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import Card from "../Card";
import { fetchdata } from "../../services/api"; // Make sure to adjust the path based on where you fetch movies

const MovieWidget = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const scrollAmount = useBreakpointValue({ base: 200, md: 300 });
  const bgcolor = useColorModeValue("white","black");
  const [pageSize, setPageSize] = useState(24);  // Default page size
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isImageValid = (url) =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(true); // Image is valid
      img.onerror = () => resolve(false); // Image is broken
    });




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
    setIsLoading(true);

    // Fetch movies based on the current mode (random or paginated)
    fetchdata(1, pageSize, "movie", true)
      .then(async (res) => {
       
          
        // Create an array of promises to check each movie's image
        const moviePromises = (res?.movies || []).map(async (movie) => {
      
          const isValidImage = await isImageValid(movie.imagePath);
          return isValidImage ? movie : null; // Return the movie if the image is valid, otherwise return null
        });

        // Wait for all promises to resolve, then filter out null values
        const validMovies = (await Promise.all(moviePromises)).filter(Boolean);

        setMovies(validMovies); // Ensure only movies with valid images are set
   

        // Calculate total pages based on totalMovies and pageSize
       
      })
      .catch((err) => console.error(err, "err"))
      .finally(() => setIsLoading(false));
  }, []); // Re-fe

  useEffect(() => {
    const { scrollWidth, clientWidth } = scrollRef.current || {};
    setIsScrollable(scrollWidth > clientWidth);
  }, [movies]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
  
  return (
    
    <Box
      bg={bgcolor}
      maxH="400px"
      width="100%"
      overflow="hidden"
      position="relative"
      borderRadius="md"
      backdropFilter="blur(10px)"
      //px={{ base: 2, md: 4 }}
    >
     

     {movies&& <Flex alignItems="center" position="relative">
       {!isMobile&&<IconButton
          icon={<FaChevronLeft />}
          onClick={scrollLeft}
          position="absolute"
          left="0"
          zIndex="20"
          aria-label="Scroll Left"
          display={isScrollable ? "block" : "none"}
          bg="transparent"
          _hover={{ bg: "gray.200" }}
          _focus={{ boxShadow: "outline" }}
        />}
        
        <Flex
          ref={scrollRef}
          overflowX="auto"
          py="4"
          sx={{
            scrollbarWidth: "none",
            "::-webkit-scrollbar": { display: "none" },
          }}
        >
          {isLoading ? (
            <Flex gap="4">
              {Array.from({ length: pageSize }).map((_, index) => (
                <Skeleton key={index}  width={{ base: "150px", md: "180px", lg: "220px" }}
                height={{ base: "210px", md: "260px", lg: "270px" }}  borderRadius="md" />
              ))}
            </Flex>
          ) : (
            <Flex gap="4" px={2}>
              {movies.map((item, index) => (
     <Card key={item?._id.$oid || index} item={item} type={"movie"} />
))}
            </Flex>
          )}
        </Flex>

        {!isMobile&&  <IconButton
          icon={<FaChevronRight />}
          onClick={scrollRight}
          position="absolute"
          right="0"
          zIndex="20"
          aria-label="Scroll Right"
          display={isScrollable ? "block" : "none"}
          bg="transparent"
          _hover={{ bg: "gray.200" }}
          _focus={{ boxShadow: "outline" }}
        />}
      </Flex>}
    </Box>
  );
};

export default MovieWidget;

import { useEffect, useState, useRef } from "react";
import { Box, Flex, IconButton, Skeleton, Text, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight, FaHeart } from "react-icons/fa";
import { useAuth } from "../../context/useAuth";

import Card from "../Card";

const TasteWidget = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getTaste } = useAuth();
  const scrollRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const scrollAmount = useBreakpointValue({ base: 200, md: 300 });
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  //const bg= useColorModeValue("white","black")
  useEffect(() => {
    setIsLoading(true);
    getTaste()
      .then((res) => {
        setMovies([...res.Movies,...res.Series]|| []);
        setIsScrollable(res.Movies.length > 0);
      })
      .catch((err) => console.error("Error fetching movies:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Check if scrolling is possible
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
    <Box>
       {!isLoading &&movies.length>0&&<Flex
        align="center"
        fontSize="xs"
        fontWeight="bold"
      
        display={"inline-flex"}
        pl={2}
        borderRadius="md"
       
        color="red.600"
        backdropFilter="blur(5px)"
      >
        <FaHeart style={{ marginRight: "0.5rem" }} />
        My List
      </Flex>}
    <Box
     // bg={bg}
      maxH="400px"
      width="100%"
      overflow="hidden"
      position="relative"
      borderRadius="md"
      backdropFilter="blur(10px)"
      //px={{ base: 2, md: 4 }}
    >
     

     {true&&<Flex alignItems="center" position="relative">
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
              {Array.from({ length: 20 }).map((_, index) => (
                <Skeleton key={index} width={{ base: "150px", md: "180px", lg: "220px" }}
                height={{ base: "210px", md: "260px", lg: "270px" }}  borderRadius="md" />
              ))}
            </Flex>
          ) : (
            <Flex gap="4" px={2}>
              {movies.map((item) => (
                <Card key={item?.id} item={item} type={item.type_==="MOVIE" ? "movie" : "series"} />
              ))}
            </Flex>
          )}
        </Flex>

        {!isMobile&& <IconButton
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
    </Box></Box>
  );
};

export default TasteWidget;

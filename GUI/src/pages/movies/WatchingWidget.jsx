import { useEffect, useState, useRef } from "react";
import { Box, Flex, IconButton, Skeleton, useBreakpointValue } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight, FaHeart } from "react-icons/fa";
import Card from "../Card";
import { fetchWatchingData } from "../../services/api";

const WatchingWidget = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const scrollAmount = useBreakpointValue({ base: 200, md: 300 });
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  useEffect(() => {
    setIsLoading(true);

    // Retrieve `watchingData` from local storage
    const storedWatchingData = JSON.parse(localStorage.getItem("watchingData")) || {
      movies: [],
      series: [],
    };
    if (storedWatchingData){
    // Extract IDs from `watchingData`
    const ids = {
      movieIds: storedWatchingData.movies.map((m) => m.id),
      seriesIds: storedWatchingData.series.map((s) => s.id),
    };

    // Fetch data from the server
    fetchWatchingData(ids)
      .then((res) => {
        setItems(res.data || []);
        setIsScrollable(res.data.length > 0);
      })
      .catch((err) => console.error("Error fetching items:", err))
      .finally(() => setIsLoading(false));
}}, []);

  // Check if scrolling is possible
  useEffect(() => {
    const { scrollWidth, clientWidth } = scrollRef.current || {};
    setIsScrollable(scrollWidth > clientWidth);
  }, [items]);

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
  if (!items) return<></>
  return (
    <Box>
      <Flex align="center" fontSize="xs" fontWeight="bold" display="inline-flex" pl={2} borderRadius="md" color="red.600" backdropFilter="blur(5px)">
        <FaHeart style={{ marginRight: "0.5rem" }} />
        Watching List
      </Flex>
      
      <Box bg="rgba(255, 0, 0, 0.05)" maxH="400px" width="100%" overflow="hidden" position="relative" borderRadius="md" backdropFilter="blur(10px)" 
      //px={{ base: 2, md: 4 }}
      >
        <Flex alignItems="center" position="relative">
        {!isMobile&& <IconButton
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
          
          <Flex ref={scrollRef} overflowX="auto" py="4" sx={{ scrollbarWidth: "none", "::-webkit-scrollbar": { display: "none" } }}>
            {isLoading ? (
              <Flex gap="4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} width={{ base: "140px", md: "180px", lg: "220px" }}
                  height={{ base: "210px", md: "260px", lg: "270px" }} borderRadius="md" />
                ))}
              </Flex>
            ) : (
              <Flex gap="4" px={2}>
                {items.map((item) => (
                  <Card
                    key={item.id}
                    item={item}
                    type={item.type_ === "MOVIE" ? "movie" : "series"}
                    progress={
                      item.isFinished
                        ? 100
                        : (item.watchingTimeInMin / item.totalTime) * 100
                    }
                  />
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
        </Flex>
      </Box>
    </Box>
  );
};

export default WatchingWidget;

import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { StarIcon } from "@chakra-ui/icons";

const Card = ({ item, type }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    let {  tmdb, imagePath } = item;
    let id =item?._id?.$oid ||item.id;
    
    
    if (id && tmdb && imagePath) {
      navigate(`/${type}/${id}/${tmdb}?imgPath=${encodeURIComponent(imagePath)}`);
    }
  };

  return (
    <Box
   
      onClick={handleClick}
      position="relative"
      transform="scale(1)"
      _hover={{
        transform: { base: "scale(1)", md: "scale(1.05)" },
        transition: "transform 0.3s ease-in-out",
        zIndex: "1",
        "& .overlay": {
          opacity: 1,
        },
      }}
      borderRadius="md"
      overflow="hidden"
      cursor="pointer"
      width={{ base: "150px", md: "180px", lg: "220px" }}
      height={{ base: "210px", md: "260px", lg: "270px" }} 
      bg="gray.900"
      
    >
      <Image
        src={item.imagePath || "default-image.jpg"}
        alt={item?.title || item?.name || "Movie Image"}
        height="100%"
        width="100%"
        objectFit="cover"
      />
      <Box
        className="overlay"
        pos="absolute"
        bottom="0"
        left="0"
        w="100%"
        h="40%"
        bg="rgba(0, 0, 0, 0.7)"
        opacity="0"
        transition="opacity 0.3s ease-in-out"
        padding="4px"
        color="white"
       
      >
        <Text textAlign="center" fontWeight="bold" fontSize={{ base: "xs", md: "sm" }}>
          {item?.title || item?.name || "Title Unavailable"}
        </Text>

        <Text textAlign="center" fontSize={{ base: "10px", md: "xs" }} color="green.200">
          {(item?.added || item?.published) && !isNaN(new Date(item.added || item.published).getFullYear())
            ? new Date(item.added || item.published).getFullYear()
            : ""}
        </Text>

       {!isNaN(Number(item.value)) && <Flex alignItems="center" justifyContent="center" gap={2} mt="1">
          <StarIcon fontSize={{ base: "xs", md: "sm" }} color="yellow.400" />
          <Text fontSize={{ base: "xs", md: "sm" }}>{isNaN(Number(item.value)) ? "" : item.value}</Text>
        </Flex>}
      </Box>
    </Box>
  );
};

export default Card;

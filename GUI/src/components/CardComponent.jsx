/* eslint-disable react/prop-types */
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { StarIcon } from "@chakra-ui/icons";

const CardComponent = ({ item, type }) => {
  const navigate = useNavigate();

  // Function to handle click and navigate to the details page
  const handleClick = () => {
    navigate(`/detail/${type}/${item?.id}/${item?.tmdb}/${item?.imagePath}`);
  };

  return (
    <Box
      onClick={handleClick} // Set onClick to trigger navigation
      position={"relative"}
      transform={"scale(1)"}
      _hover={{
        transform: { base: "scale(1)", md: "scale(1.08)" },
        transition: "transform 0.2s ease-in-out",
        zIndex: "10",
        "& .overlay": {
          opacity: 1,
        },
      }}
      borderRadius={{
        base: "2px",
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "10px",
      }}
      overflow="hidden"
      cursor="pointer" // Make it clear the box is clickable
    >
      <Image
        src={`${item.imagePath}`}
        alt={item?.title || item?.name}
        height={"100%"}
      />
      <Box
        className="overlay"
        pos={"absolute"}
        p="2"
        bottom={"0"}
        left={"0"}
        w={"100%"}
        h={"33%"}
        bg="rgba(0,0,0,0.9)"
        opacity={"0"}
        transition={"opacity 0.3s ease-in-out"}
      >
        <Text textAlign={"center"}>{item?.title || item?.name}</Text>
        <Text textAlign={"center"} fontSize={"x-small"} color={"green.200"}>
          {new Date(item.added).getFullYear() || "N/A"}
        </Text>
        <Flex alignItems={"center"} justifyContent={"center"} gap={2} mt="4">
          <StarIcon fontSize={"small"} />
          <Text>{item.rating}</Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default CardComponent;

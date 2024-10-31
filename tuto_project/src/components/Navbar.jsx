import {
  Avatar,
  Box,
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Badge,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { FaStar, FaMedal, FaCrown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import ColorModeSwitch from "./colormode";

const Navbar = () => {
  const { user, logout ,currency} = useAuth();
  const { onOpen, isOpen, onClose } = useDisclosure();

  // Function to determine the subscription badge icon
  const getSubscriptionIcon = (subscriptionType) => {
    const iconProps = {
      fontSize: "1.25em", // Increase font size for all icons
    };
      if (user?.role=="ADMIN"){return (
        <Badge
          colorScheme="yellow"
          bg="yellow"
          borderRadius="full"
          px="2" // Padding to accommodate text
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="0.6em" color="black">Admin</Text>
        </Badge>
      );}
      switch (subscriptionType) {
        case "BASIC":
          return <FaStar {...iconProps} color="gold" />;
        case "FAMILY":
          return <FaMedal {...iconProps} color="silver" />;
        case "PREMIUM":
          return <FaMedal {...iconProps} color="gold" />;
        case "UNLIMITED":
          return <FaCrown {...iconProps} color="#FFD700" />; // More vibrant yellow
        default:
          return (
            <Badge
              colorScheme="yellow"
              bg="yellow"
              borderRadius="full"
              px="2" // Padding to accommodate text
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="0.6em" color="black">No Sub</Text>
            </Badge>
          );
      }
    };
    
  
  return (
    <Box py="4" mb="-16px">
      <Container maxW={"container.xl"}>
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Link to="/">
            <Box
              fontSize={"35px"}
              fontWeight={"bold"}
              color={"red"}
              letterSpacing={"widest"}
              fontFamily={"mono"}
            >
              FILMU
            </Box>
          </Link>

          {/* DESKTOP */}
          <Flex
            gap="4"
            alignItems={"center"}
            display={{ base: "none", md: "flex" }}
          >
            <ColorModeSwitch />
            <Link to="/">Home</Link>
            <Link to="/movies">Movies</Link>
            <Link to="/shows">TV Shows</Link>
            <Link to="/search">
              <SearchIcon fontSize={"xl"} />
            </Link>
            {user && (
              <Menu>
                <MenuButton>
                  <Flex alignItems="center" position="relative">
                    {/* Avatar and Badge Container */}
                    <Box position="relative" display="flex" alignItems="center">
                      <Avatar
                        bg={"red.500"}
                        color={"white"}
                        size={"sm"}
                        name={user?.email}
                      />
                      {/* Badge at bottom-right of Avatar */}
                      <Box
                        position="absolute"
                        bottom="0"
                        right="0"
                        transform="translate(25%, 25%)"
                      >
                        {getSubscriptionIcon(user?.subscription?.type)}
                      </Box>
                    </Box>
                    {/* Balance Display */}
                    <Text ml="2" fontWeight="bold">
                      {user?.balance?.toLocaleString("en-US")} {currency}
                    </Text>
                  </Flex>
                </MenuButton>
                <MenuList>
                  <Link to="/watchlist">
                    <MenuItem>Watchlist</MenuItem>
                  </Link>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>

          {/* Mobile */}
          <Flex
            display={{ base: "flex", md: "none" }}
            alignItems={"center"}
            gap="4"
          >
            <ColorModeSwitch />
            <Link to="/search">
              <SearchIcon fontSize={"xl"} />
            </Link>
            <IconButton onClick={onOpen} icon={<HamburgerIcon />} />
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
              <DrawerOverlay />
              <DrawerContent bg={"black"}>
                <DrawerCloseButton />
                <DrawerHeader>
                  {user && (
                    <Flex alignItems="center" gap="3">
                    {/* Avatar, Badge, and Balance for Mobile */}
                    <Box position="relative" display="flex">
                      <Avatar bg="red.500" size="sm" name={user?.email} />
                      {/* Badge on Avatar */}
                      <Box position="absolute" bottom="0" right="0" transform="translate(25%, 25%)">
                        {getSubscriptionIcon(user?.subscription?.type)}
                      </Box>
                    </Box>
                    {/* User Information and Balance */}
                    <VStack align="start" spacing="0.5" ml="1">
                      <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                        {user?.displayName || user?.email}
                      </Text>
                      <Text fontSize="md" fontWeight="bold" >
                        {user?.balance?.toLocaleString("en-US")} CFA
                      </Text>
                    </VStack>
                  </Flex>
                  
                  )}
                </DrawerHeader>

                <DrawerBody>
                  <Flex flexDirection={"column"} gap={"4"} onClick={onClose}>
                    <Link to="/">Home</Link>
                    <Link to="/movies">Movies</Link>
                    <Link to="/shows">TV Shows</Link>
                    {user && (
                      <>
                        <Link to="/watchlist">Watchlist</Link>
                        <Button
                          variant={"outline"}
                          colorScheme="red"
                          onClick={logout}
                        >
                          Logout
                        </Button>
                      </>
                    )}
                  </Flex>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;

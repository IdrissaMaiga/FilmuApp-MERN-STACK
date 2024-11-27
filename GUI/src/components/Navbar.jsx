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
  useColorModeValue,
  HStack,
  Link
} from "@chakra-ui/react";

import {
  FaStar,
  FaUser,
  FaMedal,
  FaCrown,
  FaWallet,
  FaExchangeAlt,
  FaRegCreditCard,
  FaDownload,
  FaSignOutAlt,
} from "react-icons/fa";
import { Navigate, Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import ColorModeSwitch from "./colormode";

const Navbar = () => {
  const { user, logout, currency } = useAuth();
  const { onOpen, isOpen, onClose } = useDisclosure();
  const navigate=useNavigate()
  const location = useLocation();
  const activeLinkColor = useColorModeValue("red.500", "red.300");
 
  const bg = useColorModeValue("gray.100", "gray.700");

  
  const getSubscriptionIcon = (subscriptionType) => {
    const iconProps = {
      fontSize: "1.25em",
    };
    if (user?.role === "ADMIN") {
      return (
        <Badge
          colorScheme="yellow"
          bg="yellow"
          borderRadius="full"
          p="0"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="0.6em" color="black">
            Admin
          </Text>
        </Badge>
      );
    }
    switch (subscriptionType) {
      case "BASIC":
        return <FaStar {...iconProps} color="gold" />;
      case "FAMILY":
        return <FaMedal {...iconProps} color="silver" />;
      case "PREMIUM":
        return <FaMedal {...iconProps} color="gold" />;
      case "UNLIMITED":
        return <FaCrown {...iconProps} color="#FFD700" />;
      default:
        return (
          <Badge
            colorScheme="yellow"
            bg="yellow"
            borderRadius="full"
             px="0.6"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="0.6em" color="black">
              No Sub
            </Text>
          </Badge>
        );
    }
  };

  const backgroundColor = useColorModeValue("white.100", "black");
  const textColor = useColorModeValue("black", "white");
  const drawerBg = useColorModeValue("white", "black");
  const avatarBg = useColorModeValue(user.isactive?"red.500":"red.100", user.isactive?"red.500":"red.100");

  return (
    <Box py="4" mb="-16px" bg={backgroundColor}>
      <Container maxW={"container.xl"}>
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Link to="/"
           as={RouterLink}
           textDecoration="none"  // Prevents underline by default
  _hover={{
    textDecoration: "none",  // Prevents underline on hover
  }}
          >
            <Box
              fontSize={"35px"}
              fontWeight={"bold"}
              color={"red.500"}
              letterSpacing={"widest"}
              fontFamily={"mono"}
            >
              FILMU
            </Box>
          </Link>

          {/* DESKTOP */}
          <Flex gap="4" alignItems={"center"} display={{ base: "none", md: "flex" }}>
            <ColorModeSwitch />
            <Link
        as={RouterLink}
        to="/"
        color={location.pathname === "/" ? activeLinkColor : textColor}
        fontWeight={location.pathname === "/" ? "bold" : "normal"}
        mr="4"
      >
        Home
      </Link>
      <Link
        as={RouterLink}
        to="/channel"
        color={location.pathname === "/channel" ? activeLinkColor : textColor}
        fontWeight={location.pathname === "/channel" ? "bold" : "normal"}
        mr="4"
      >
        ChainesLive
      </Link>
      <Link
        as={RouterLink}
        to="/movies"
        color={location.pathname === "/movies" ? activeLinkColor : textColor}
        fontWeight={location.pathname === "/movies" ? "bold" : "normal"}
        mr="4"
      >
        Films
      </Link>
      <Link
        as={RouterLink}
        to="/shows"
        color={location.pathname === "/shows" ? activeLinkColor : textColor}
        fontWeight={location.pathname === "/shows" ? "bold" : "normal"}
      >
        Serie
      </Link>
            {(!location.pathname .includes('/channel'))&&<Link
        as={RouterLink} to="/search">
              <SearchIcon fontSize={"xl"} color={textColor} />
            </Link>}
            {user && (
              <Menu>
                <MenuButton>
                  <Flex alignItems="center" position="relative">
                    <Box position="relative" display="flex" alignItems="center">
                      <Avatar bg={avatarBg} color="white" size={"sm"} name={user.name || user?.email} />
                      <Box position="absolute" bottom="0" right="0" transform="translate(25%, 25%)">
                        {getSubscriptionIcon(user?.subscription?.type)}
                      </Box>
                    </Box>
                  </Flex>
                </MenuButton>
                <MenuList bg={drawerBg} color={textColor}  zIndex={21}>
                <Box 
      px={4} 
      py={2} 
      bg={bg} 
      
      boxShadow="md" 
      width="fit-content"
      
    >
      <HStack spacing={2}>
        <Text fontSize="sm" fontWeight="medium" color="gray.500">
          Balance:
        </Text>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          {user.balance?.toLocaleString("en-US")} {currency}
        </Text>
      </HStack>
    </Box>
    <Link
        as={RouterLink} to="/profile">
                    <MenuItem icon={<FaUser />}>Mon Profil</MenuItem>
                  </Link>
                  <Link
        as={RouterLink} to="/deposit">
                    <MenuItem icon={<FaWallet />}>Dépot</MenuItem>
                  </Link>
                  
                  <Link
        as={RouterLink} to="/transaction">
                    <MenuItem icon={<FaExchangeAlt />}>Mes Transactions</MenuItem>
                  </Link>
                  <Link
        as={RouterLink} to="/subscribe">
                    <MenuItem icon={<FaRegCreditCard />}>Abonnement</MenuItem>
                  </Link>
                  <MenuItem icon={<FaSignOutAlt />} onClick={(e)=>{logout();navigate("/login")}}>
                    Déconnexion
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>

          {/* Mobile */}
          <Flex display={{ base: "flex", md: "none" }} alignItems={"center"} gap="4">
            <ColorModeSwitch />
            {(!location.pathname .includes('/channel')) && <Link
            bg={location.pathname === "/search" ? "red.400" : "transparent"}
            px={2}
            borderRadius={10}
             
             as={RouterLink} to="/search">
              <SearchIcon fontSize={"xl"} color={textColor} />
            </Link>}
            <IconButton onClick={onOpen} icon={<HamburgerIcon />} />
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
              <DrawerOverlay />
              <DrawerContent bg={drawerBg}>
                <DrawerCloseButton />
                <DrawerHeader>
                  {user && (
                    <Flex alignItems="center" gap="3">
                      <Box position="relative" display="flex">
                        <Avatar bg={avatarBg} size="sm" name={user?.email} />
                        <Box position="absolute" bottom="0" right="0" transform="translate(25%, 25%)">
                          {getSubscriptionIcon(user?.subscription?.type)}
                        </Box>
                      </Box>
                      <VStack align="start" spacing="0.5" ml="1">
                        <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                          {user?.displayName || user?.email}
                        </Text>
                        <Text fontSize="md" fontWeight="bold" color={textColor}>
                          {user?.balance?.toLocaleString("en-US")} {currency}
                        </Text>
                      </VStack>
                    </Flex>
                  )}
                </DrawerHeader>
                <DrawerBody>
                  <Flex flexDirection={"column"} gap={"4"} onClick={onClose}>
                  <Link
        as={RouterLink}
        to="/"
        color={location.pathname === "/" ? activeLinkColor : textColor}
        fontWeight={location.pathname === "/" ? "bold" : "normal"}
        mr="4"
      >
        Home
      </Link>
      <Link
        as={RouterLink}
        to="/channel"
        color={location.pathname === "/channel" ? activeLinkColor : textColor}
        fontWeight={location.pathname === "/channel" ? "bold" : "normal"}
        mr="4"
      >
        ChainesLive
      </Link>
      <Link
        as={RouterLink}
        to="/movies"
        color={location.pathname === "/movies" ? activeLinkColor : textColor}
        fontWeight={location.pathname === "/movies" ? "bold" : "normal"}
        mr="4"
      >
        Films
      </Link>
      <Link
        as={RouterLink}
        to="/shows"
        color={location.pathname === "/shows" ? activeLinkColor : textColor}
        fontWeight={location.pathname === "/shows" ? "bold" : "normal"}
      >
        Serie
      </Link>
      <Link
        as={RouterLink} to="/profile">
                      <Flex alignItems="center">
                        <FaUser />
                        <span style={{ marginLeft: '8px', color: textColor }}>Mon Profil</span>
                      </Flex>
                    </Link>
                    <Link
        as={RouterLink} to="/deposit">
                      <Flex alignItems="center">
                        <FaWallet />
                        <span style={{ marginLeft: '8px', color: textColor }}>Dépot</span>
                      </Flex>
                    </Link>
                    
                    <Link
        as={RouterLink} to="/transaction">
                      <Flex alignItems="center">
                        <FaExchangeAlt />
                        <span style={{ marginLeft: '8px', color: textColor }}>Mes Transactions</span>
                      </Flex>
                    </Link>
                    <Link
        as={RouterLink} to="/subscribe">
                      <Flex alignItems="center">
                        <FaRegCreditCard />
                        <span style={{ marginLeft: '8px', color: textColor }}>Abonnement</span>
                      </Flex>
                    </Link>
                  
                    {user && (
                      <Button variant="outline" colorScheme="red" onClick={(e)=>{logout();navigate("/login")}}>
                        <Flex alignItems="center">
                          <FaSignOutAlt />
                          <span style={{ marginLeft: '8px' }}>Déconnexion</span>
                        </Flex>
                      </Button>
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

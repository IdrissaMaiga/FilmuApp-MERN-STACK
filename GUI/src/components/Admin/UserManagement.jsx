import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  IconButton,
  Input,
  useColorModeValue,
  SimpleGrid,
} from '@chakra-ui/react';
import {  FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useAuth } from '../../context/useAuth';
import UserDetail from './userdetail';
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { api } = useAuth();

  const bgColor = useColorModeValue("white", "black");
  const buttonColorScheme = useColorModeValue("teal", "teal");

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get('/api/user/users', {headers: { Authorization: `Bearer ${token}` }, 
      
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserDetail = (user) => {
    setSelectedUser(selectedUser?.id === user.id ? null : user);
  };

  return (
    <Box mx="auto" p={0} m={0} bg={bgColor} borderRadius="md" boxShadow="lg">
      <HStack justifyContent="space-between" mb={6}>
        <Heading as="h2" size="lg">User Management</Heading>
      </HStack>

      <HStack mb={4} spacing={3}>
        <Input
          placeholder="Search by name, email, or phone"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="md"
          variant="filled"
        />
        <IconButton icon={<FaSearch />} colorScheme={buttonColorScheme} />
      </HStack>

      {loading ? (
        <Text>Loading users...</Text>
      ) : filteredUsers.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={2}>
          {filteredUsers.map((user) => (
           
                 <Box 
              key={user.id}
              borderWidth="1px"
              borderRadius="lg"
              p={4}
              bg={bgColor}
              boxShadow="lg"
              width={"auto"}
              position="relative">
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold" >Name:{user.name || 'N/A'}</Text>
                <Text fontWeight="bold">Email:{user.email || 'N/A'}</Text>
                

                
                <IconButton
                  icon={selectedUser?.id === user.id ? <FaChevronUp /> : <FaChevronDown />}
                  size="sm"
                  colorScheme={buttonColorScheme}
                  onClick={() => toggleUserDetail(user)}
                />
              </VStack>

              {selectedUser?.id === user.id && (
                <Box
                  position="absolute"
                  top="100%"
                  left="0"
                  width="100%"
                  bg={bgColor}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  zIndex="10" // Higher z-index to overlay above other elements
                  boxShadow="lg"
                >
                  <UserDetail id={user.id} onClose={() => setSelectedUser(null)} />
                </Box>
              )}
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Text>No users found.</Text>
      )}
    </Box>
  );
};

export default UserList;

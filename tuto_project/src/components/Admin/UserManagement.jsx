import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  IconButton,
  Input,
  Button,
  Switch,
  useColorModeValue,
  SimpleGrid,
  Badge
} from '@chakra-ui/react';
import { FaDollarSign, FaSearch } from 'react-icons/fa';
import { useAuth } from '../../context/useAuth';

const UserManagement = () => {
  const [depositAmounts, setDepositAmounts] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tempStreamingAccess, setTempStreamingAccess] = useState({});
  const { currency, api } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  const bgColor = useColorModeValue("white", "black");
  const buttonColorScheme = useColorModeValue("teal", "teal");

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    const initialStreamingAccess = {};
    users.forEach((user) => {
      if (user.StreamingAccess) {
        initialStreamingAccess[user.id] = { ...user.StreamingAccess };
      }
    });
    setTempStreamingAccess(initialStreamingAccess);
  }, [users]);

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/user/users', { withCredentials: true });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  const getUser = async (targetUserId) => {
    setLoading(true);
    try {
      const response = await api.get('/api/user/profile',{targetUserId}, { withCredentials: true });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserField = useCallback(async (userId, fieldName, fieldValue) => {
    setLoading(true);
    try {
      await api.put(
        '/api/user/profile/updateField',
        { targetUserId: userId, fieldName, fieldValue },
        { withCredentials: true }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) => 
          user.id === userId ? { ...user, [fieldName]: fieldValue } : user
        )
      );
    } catch (error) {
      console.error(`Error updating ${fieldName}:`, error);
    } finally {
      setLoading(false);
    }
  }, [api]);

  const handleStreamingAccessChange = (userId, key, value) => {
    setTempStreamingAccess((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [key]: value
      }
    }));
  };

  const saveStreamingAccess = async (userId) => {
    const accessData = tempStreamingAccess[userId];
    if (!accessData) return;
    await updateUserField(userId, 'StreamingAccess', accessData);
  };

  const handleFieldToggle = async (userId, field) => {
    const currentValue = users.find((user) => user.id === userId)[field];
    await updateUserField(userId, field, !currentValue);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDepositChange = (userId, value) => {
    setDepositAmounts((prev) => ({ ...prev, [userId]: value }));
  };

  const createDepositTransactionAdmin = async (userId) => {
    const amount = depositAmounts[userId];
    if (!amount) return;
    setLoading(true);
    try {
      await api.post('/api/transaction/admindeposit', { userId, amount }, { withCredentials: true });
      setDepositAmounts((prev) => ({ ...prev, [userId]: '' }));
    } catch (error) {
      console.error("Error creating deposit transaction:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box  mx="auto" p={0} m={0} bg={bgColor} borderRadius="md" boxShadow="lg">
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
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={2}>
          {filteredUsers.map((user) => (
            <Box key={user.id} borderWidth="1px" borderRadius="md" p={4} bg={bgColor}>
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold">Name:</Text>
                <Text>{user.name || 'N/A'}</Text>
                
                <Text fontWeight="bold">Email:</Text>
                <Text>{user.email || 'N/A'}</Text>
                
                <Text fontWeight="bold">Phone:</Text>
                <Text>{user.phone || 'N/A'}</Text>
               {user.subscription&&(<><Text fontWeight="bold">Abonnement :</Text>
                
          <Text>Début : {new Date(user?.subscribtionStartDay).toLocaleString()}</Text>
          <Text>Fin : {new Date(user?.subscribtionEndDay).toLocaleString()}</Text>
          <Text>Type : {user.subscription?.type}</Text>
              </>)} 
                
                <Text fontWeight="bold">Balance:</Text>
                <Badge colorScheme="blue">{currency}{user.balance}</Badge>

                <HStack>
                  <Text fontWeight="bold">Is Active:</Text>
                  <Switch
                    isChecked={user.isactive}
                    onChange={() => handleFieldToggle(user.id, 'isactive')}
                  />
                </HStack>

                <HStack>
                  <Text fontWeight="bold">Is Banned:</Text>
                  <Switch
                    isChecked={user.isbanned}
                    onChange={() => handleFieldToggle(user.id, 'isbanned')}
                  />
                </HStack>

                <Text fontWeight="bold">Referral Made:</Text>
                <Text>{user.referralsMade ? user.referralsMade.length : '0'}</Text>

                <Text fontWeight="bold">Streaming Access:</Text>
                <VStack align="start">
                  <Input
                    placeholder="Streaming Username"
                    value={tempStreamingAccess[user.id]?.username || ''}
                    onChange={(e) => handleStreamingAccessChange(user.id, 'username', e.target.value)}
                  />
                  <Input
                    placeholder="Streaming Password"
                    type="text"
                    value={tempStreamingAccess[user.id]?.password || ''}
                    onChange={(e) => handleStreamingAccessChange(user.id, 'password', e.target.value)}
                  />
                  <Button
                    size="sm"
                    mt={2}
                    colorScheme={buttonColorScheme}
                    onClick={() => saveStreamingAccess(user.id)}
                  >
                    Save Streaming Access
                  </Button>
                </VStack>

                <HStack mt={2}>
                  <IconButton icon={<FaDollarSign />} onClick={() => setDepositAmounts((prev) => ({ ...prev, [user.id]: '' }))} size="sm" colorScheme={buttonColorScheme} />
                  <Input
                    placeholder="Enter deposit amount"
                    value={depositAmounts[user.id] || ''}
                    onChange={(e) => handleDepositChange(user.id, e.target.value)}
                    size="sm"
                  />
                  <Button
                    size="sm"
                    bg="green.300"
                    onClick={() => createDepositTransactionAdmin(user.id)}
                  >
                    Deposit
                  </Button>
                </HStack>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Text>No users found.</Text>
      )}
    </Box>
  );
};

export default UserManagement;

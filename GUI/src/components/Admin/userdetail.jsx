import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  HStack,
  Switch,
  Button,
  Badge,
  Input,
  Collapse,
  useColorModeValue,
} from '@chakra-ui/react';
import { useAuth } from '../../context/useAuth';

const UserDetail = ({ id, onClose }) => {
  const [tempUser, setTempUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState(0);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [streamingUsername, setStreamingUsername] = useState('');
  const [streamingPassword, setStreamingPassword] = useState('');
  const { api, currency } = useAuth();
  function formatPrismaDate(prismaDateTime) {
    const date = new Date(prismaDateTime); // Parse the Prisma DateTime string
    return date.toLocaleString(); // Convert to a human-readable format
  }
  
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('black', 'white');

  // Fetch user data
  const getUser = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get(`/api/user/profile`, {headers: { Authorization: `Bearer ${token}` },
        params: { targetUserId: id },
       // withCredentials: true,
       
      });
      setTempUser(response.data);
      setStreamingUsername(response.data.StreamingAccess?.username || '');
      setStreamingPassword(response.data.StreamingAccess?.password || '');
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleStreamingAccessUpdate = async () => {
    try {
        await updateUserField("StreamingAccess", {
            username: streamingUsername,
            password: streamingPassword,
          });
      
      setTempUser((prev) => ({
        ...prev,
        StreamingAccess: {
          username: streamingUsername,
          password: streamingPassword,
        },
      }));
    } catch (error) {
      console.error("Error updating streaming access:", error);
    }
  };

  const createDepositTransaction = async () => {
    if (!depositAmount || depositAmount <= 0) return;
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    try {
      await api.post(
        '/api/transaction/admindeposit',
        { userId: id, amount: depositAmount },
        { 
         // withCredentials: true
         headers: { Authorization: `Bearer ${token}` }
         }
      );
      setTempUser((prev) => ({
        ...prev,
        balance: prev.balance + parseFloat(depositAmount),
      }));
      setDepositAmount(0);
    } catch (error) {
      console.error("Error creating deposit transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const reverseTransaction = async (transactionId) => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    try {
        await api.post(
            `/api/transaction/reverse`,
            {
              targetUserId: id, // Send targetUserId and transactionId in the body
              transactionId
            },
            {
             // withCredentials: true,
             headers: { Authorization: `Bearer ${token}` }
            }
          );
          
      setTempUser((prev) => ({
        ...prev,
        transactions: prev.transactions.map((t) =>
          t.id === transactionId ? { ...t, reversed: true } : t
        ),
      }));
    } catch (error) {
      console.error("Error reversing transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserField = async (fieldName, fieldValue) => {
    try {
      const token = localStorage.getItem('accessToken');  
      await api.put(
        '/api/user/profile/updateField',
        { targetUserId: id, fieldName, fieldValue },
        {
           //withCredentials: true 
           headers: { Authorization: `Bearer ${token}` }
          }
      );
      setTempUser((prev) => (prev ? { ...prev, [fieldName]: fieldValue } : prev));
    } catch (error) {
      console.error(`Error updating ${fieldName}:`, error);
    }
  };

  const handleFieldToggle = async (field) => {
    const newValue = !tempUser[field];
    setTempUser((prev) => ({ ...prev, [field]: newValue }));
    await updateUserField(field, newValue);
  };

  const getStatus = (transaction) => {
    if (transaction.reversed) return 'Returned';
    if (transaction.isApproved) return 'Approved';
    if (transaction.isPending) return 'Pending';
    if (transaction.isCanceled) return 'Canceled';
    return 'Unknown';
  };

  const getColor = (transaction) => {
    if (transaction.reversed) return 'purple.300';
    if (transaction.isApproved) return 'green.300';
    if (transaction.isPending) return 'yellow.300';
    if (transaction.isCanceled) return 'pink.300';
    return 'gray.200';
  };

  useEffect(() => {
    getUser();
  }, [id]);

  if (loading || !tempUser) {
    return <Text color={textColor}>Loading user details...</Text>;
  }

  return (
    <Box borderWidth="1px" borderRadius="md" p={4} bg={bgColor} mt={4}>
      <VStack align="start" spacing={3} color={textColor}>
        {/* User Information */}
        <Text fontWeight="bold">Name:</Text>  
        <Text bg={tempUser.isLogined===true ?"green.400":'gray.400'}>{tempUser.name || 'N/A'}</Text>

        <Text fontWeight="bold">Email:</Text>
        <Text>{tempUser.email || 'N/A'}</Text>

        <Text fontWeight="bold">Devices:</Text>

        <Text >{tempUser.devices}</Text>

        <Text fontWeight="bold">lastlogintime:</Text>

       <Text >{formatPrismaDate(tempUser.updatedAt)}</Text>


        <Text fontWeight="bold">Phone:</Text>
        <Text>{tempUser.phone || 'N/A'}</Text>

        <Text fontWeight="bold">Balance:</Text>
        <Badge colorScheme="blue">
          {currency}{tempUser.balance}
        </Badge>

        {/* Deposit Section */}
        <Text fontWeight="bold">Deposit Amount:</Text>
        <Input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder="Enter amount"
          mb={2}
        />
        <Button onClick={createDepositTransaction} colorScheme="teal">
          Deposit
        </Button>

        {/* Streaming Access */}
        <Text fontWeight="bold">Streaming Access:</Text>
        <Text>Username: {tempUser.StreamingAccess?.username || 'N/A'}</Text>
        <Text>Password: {tempUser.StreamingAccess?.password || 'N/A'}</Text>

        {/* Switches */}
        <HStack>
          <Text fontWeight="bold">Is Active:</Text>
          <Switch
            isChecked={tempUser.isactive}
            onChange={() => handleFieldToggle('isactive')}
          />
        </HStack>

        <HStack>
          <Text fontWeight="bold">Is Banned:</Text>
          <Switch
            isChecked={tempUser.isbanned}
            onChange={() => handleFieldToggle('isbanned')}
          />
        </HStack>
 
   
 {/* Streaming Access - Editable Fields */}
 <Text fontWeight="bold">Streaming Access:</Text>
        <Text>Username:</Text>
        <Input
          value={streamingUsername}
          onChange={(e) => setStreamingUsername(e.target.value)}
          placeholder="Enter new username"
        />
        <Text>Password:</Text>
        <Input
          value={streamingPassword}
          onChange={(e) => setStreamingPassword(e.target.value)}
          placeholder="Enter new password"
        />
        <Button onClick={handleStreamingAccessUpdate} colorScheme="blue">
          Update Streaming Access
        </Button>

        {/* Switches */}
        {/* Transactions Section */}
        {tempUser.transactions&& <> <HStack>
          <Text fontWeight="bold">Transactions:</Text>
          <Button size="xs" onClick={() => setIsTransactionOpen(!isTransactionOpen)} colorScheme="blue">
            {isTransactionOpen ? 'Hide' : 'Show'}
          </Button>
        </HStack>
        <Collapse in={isTransactionOpen}>
          <VStack spacing={1} align="start">
            {tempUser.transactions?.map((transaction) => (
              (transaction.transactionType === "ABON" || transaction.transactionType === "TELE") && (
                <Box key={transaction.id} bg={getColor(transaction)} p={2} borderRadius="md">
                  <HStack justify="space-between">
                    <Text>{transaction.transactionType}: {currency}{transaction.amount}</Text>
                    <Badge>{getStatus(transaction)}</Badge>
                    {!transaction.reversed && (
                      <Button size="xs" onClick={() => reverseTransaction(transaction.id)} colorScheme="red">
                        Reverse
                      </Button>
                    )}
                  </HStack>
                </Box>
              )
            )) || <Text>N/A</Text>}
          </VStack>
            </Collapse>
</>}
            {tempUser.downloads&& 
       <><HStack>
          <Text fontWeight="bold">Downloads:</Text>
          <Button size="xs" onClick={() => setIsDownloadOpen(!isDownloadOpen)} colorScheme="blue">
            {isDownloadOpen ? 'Hide' : 'Show'}
          </Button>
        </HStack>
        <Collapse in={isDownloadOpen}>
          <VStack spacing={1} align="start">
            {tempUser.downloads?.map((download) => (
              <Text key={download.id}>{download.filename}</Text>
            )) || <Text>N/A</Text>}
          </VStack>
        </Collapse></> }

        <Button onClick={onClose}>Close</Button>
      </VStack>
    </Box>
  );
};

export default UserDetail;

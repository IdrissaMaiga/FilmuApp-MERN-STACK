import React, { useEffect, useState } from 'react';
import { useTransaction } from '../../context/TransactionContext';
import { useAuth } from '../../context/useAuth';
import {
  Box,
  Flex,
  Heading,
  Select,
  Input,
  Spinner,
  Text,
  VStack,
  Grid,
  useColorModeValue,
  Switch,
} from '@chakra-ui/react';
import { useAdmin } from '../../context/AdminContext';

const TransactionsPanel = () => {
  const { user,currency } = useAuth();
  const { transactions, tloading } = useTransaction();
  const {getAllTransactions,reverseTransaction}=useAdmin();
  const [sortedTransactions, setSortedTransactions] = useState([]);
  const [sortOption, setSortOption] = useState('createdAt');
  const [searchTerm, setSearchTerm] = useState('');
  const [showImages, setShowImages] = useState(true);

  const bg = useColorModeValue('#f4f6f8', '#1A202C');
  const textColor = useColorModeValue('#333', '#F7FAFC');
  const boxBgColor = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    getAllTransactions;
  }, []);

  useEffect(() => {
    // Sort transactions based on the selected sort option
    let sorted = [...transactions];
    if (sortOption === 'createdAt') {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === 'transactionType') {
      sorted.sort((a, b) => a.transactionType.localeCompare(b.transactionType));
    }
    setSortedTransactions(sorted);
  }, [transactions, sortOption]);

  // Define helper functions before using them
  const getStatus = (transaction) => {
    if (transaction.isApproved) return 'Approved';
    if (transaction.isPending) return 'Pending';
    if (transaction.isCanceled) return 'Canceled';
    return null;
  };

  const getColor = (transaction) => {
    if (transaction.isApproved) return 'green.100';
    if (transaction.isPending) return 'yellow.100';
    if (transaction.isCanceled) return 'pink.100';
    return 'white';
  };

  // Get unique transaction types for sorting options
  const uniqueTransactionTypes = ['All Types', ...Array.from(new Set(transactions.map(t => t.transactionType)))];

  const filteredTransactions = sortedTransactions.filter(transaction =>
    Object.values(transaction).some(field => {
      if (typeof field === 'string') {
        return field.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (typeof field === 'number') {
        return field.toString().includes(searchTerm);
      }
      return false;
    }) || (getStatus(transaction) && getStatus(transaction).toLowerCase().includes(searchTerm.toLowerCase()))
  );
  

  return (
    <Box p={5} bg={bg} color={textColor} borderRadius="md" maxWidth="800px" mx="auto" mt={"20"}>
      <Heading as="h2" size="lg" color={textColor} mb={4}>
        Transactions
      </Heading>

      {/* Controls */}
      <Flex mb={4} alignItems="center">
        <Text fontWeight="bold" mr={2}>Sort by:</Text>
        <Select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          mr={4}
        >
          {uniqueTransactionTypes.map(type => (
            <option key={type} value={type === 'All Types' ? 'transactionType' : 'transactionType'}>
              {type}
            </option>
          ))}
        </Select>

        <Input
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          mr={4}
        />
        
        {/* Toggle for showing/hiding images */}
        <Flex alignItems="center">
          <Text mr={2}>Show Images</Text>
          <Switch isChecked={showImages} onChange={() => setShowImages(!showImages)} />
        </Flex>
      </Flex>

      {/* Loading and transactions list */}
      {tloading ? (
        <Flex justify="center" align="center" height="100px">
          <Spinner />
        </Flex>
      ) : (
        <Box borderTop="1px solid #ddd" pt={2}>
          {filteredTransactions.length ? (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
              {filteredTransactions.map((transaction) => (
                <Box key={transaction.id} p={4} bg={getColor(transaction)} borderRadius="md" boxShadow="sm" color={"black"} >
                  <Text><strong>Amount:</strong> {transaction.amount} {currency}</Text>
                  <Text><strong>Phone Number:</strong> {transaction.phonenumber}</Text>
                  <Text><strong>Status:</strong> {getStatus(transaction)}</Text>
                  <Text><strong>Transaction ID:</strong> {transaction.ID}</Text>
                  <Text><strong>Type:</strong> {transaction.transactionType}</Text>
                  <Text><strong>Created At:</strong> {new Date(transaction.createdAt).toLocaleString()}</Text>
                  {showImages && transaction.imageBase64 && (
                    <Box>
                      <strong>Image:</strong>
                      <img src={`data:image/png;base64,${transaction.imageBase64}`} alt="Transaction" style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '10px' }} />
                    </Box>
                  )}
                </Box>
              ))}
            </Grid>
          ) : (
            <Text textAlign="center" color="#777">No transactions found.</Text>
          )}
        </Box>
      )}
    </Box>
  );
};

export default TransactionsPanel;

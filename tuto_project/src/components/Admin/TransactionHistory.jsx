// TransactionHistory.jsx
// reverse{ transactionId,userId }
//reverseTransaction
import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const TransactionHistory = () => {
  return (
    <Box bg="white" p={4} rounded="md" shadow="md">
      <Heading size="md">Transaction History</Heading>
      <Text mt={4}>View and manage transaction records here.</Text>
    </Box>
  );
};

export default TransactionHistory;
//update money flow { amount, details, phonenumeber,  isApproved, ID, type }
//updateMoneyflow
//delete moneyflow { id }
//deleteMoneyflow
// getall money flows
//getAllMoneyFlow
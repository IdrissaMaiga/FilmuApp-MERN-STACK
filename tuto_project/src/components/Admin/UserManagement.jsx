// UserManagement.jsx
import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const UserManagement = () => {
  return (
    <Box bg="white" p={4} rounded="md" shadow="md">
      <Heading size="md">User Management</Heading>
      <Text mt={4}>Manage user accounts, roles, and permissions here.</Text>
    </Box>
  );
};

export default UserManagement;

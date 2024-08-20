// src/components/Port.jsx
import React from 'react';
import { Box } from '@chakra-ui/react';

const Port = ({ port }) => {
  return (
    <Box mb={2}>
      <p>{port.name} - {port.region} ({port.indexer})</p>
    </Box>
  );
};

export default Port;

// Channel component

import React, { useState } from 'react';
import { Box, Image, Text, VStack, HStack, Button } from '@chakra-ui/react';

const Channel = ({ channel, onClick, provided, snapshot }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      p={4}
      borderRadius="md"
      bg="gray.100"
      cursor="pointer"
      _hover={{ transform: 'scale(1.05)', transition: 'transform 0.3s ease' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(channel)}
      boxShadow={snapshot.isDragging ? 'lg' : 'base'}
    >
      <VStack spacing={2} align="start">
        <Image
          src={channel.logos[0] || 'default-logo.png'}
          alt={channel.name}
          boxSize="100px"
          objectFit="cover"
        />
        <Text fontWeight="bold">{channel.name}</Text>
        {hovered && (
          <HStack>
            {channel.ports.map((port, index) => (
              <Button key={index} size="sm" onClick={() => onClick(channel, port.region)}>
                {port.region}
              </Button>
            ))}
          </HStack>
        )}
      </VStack>
    </Box>
  );
};

export default Channel;

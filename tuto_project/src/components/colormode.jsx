import { useState } from 'react';
import { Flex, Switch, useColorMode, Box } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

const ColorModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode(); // Chakra UI hook for color mode
  const [startX, setStartX] = useState(null); // Store the starting touch position

  // Function to handle touch start
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX); // Capture the initial touch position
  };

  // Function to handle touch move
  const handleTouchMove = (e) => {
    if (startX === null) return; // If no starting point, return

    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;

    // If user swipes more than 50px right or left, toggle the mode
    if (diff > 50 && colorMode === 'light') {
      toggleColorMode(); // Swipe right, switch to dark mode
      setStartX(null); // Reset the touch start position
    } else if (diff < -50 && colorMode === 'dark') {
      toggleColorMode(); // Swipe left, switch to light mode
      setStartX(null); // Reset the touch start position
    }
  };

  // Function to reset touch position when touch ends
  const handleTouchEnd = () => {
    setStartX(null); // Reset the start position after swipe ends
  };

  return (
    <Flex align="center">
      {/* Switch Component with custom thumb */}
      <Box
        position="relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* SunIcon visible only in light mode */}
        <Box
          position="absolute"
          top="50%"
          left="4px"
          transform="translateY(-50%)"
          display={colorMode === 'light' ? 'block' : 'none'} // Hide in dark mode
        >
          <SunIcon boxSize="1.25rem" color="red.500" />
        </Box>

        {/* MoonIcon visible only in dark mode */}
        <Box
          position="absolute"
          top="50%"
          right="4px"
          transform="translateY(-50%)"
          display={colorMode === 'dark' ? 'block' : 'none'} // Hide in light mode
        >
          <MoonIcon boxSize="1.25rem" color="red.300" />
        </Box>

        {/* Switch element with transparent track and thumb */}
        <Switch
          isChecked={colorMode === 'dark'}
          onChange={toggleColorMode}
          colorScheme="red"
          size="lg" // Use a larger size for better touch interaction
          sx={{
            'span.chakra-switch__track': {
              backgroundColor: 'transparent', // Make the track transparent
              border: '2px solid red', // Add a border for visibility
            },
            'span.chakra-switch__thumb': {
              boxSize: '1.5rem', // Adjust thumb size to be consistent and touch-friendly
              bg: 'rgba(255, 255, 255, 0.5)', // Make the thumb semi-transparent
              display: 'flex',
              alignItems: 'center',
              zIndex: 2,
              justifyContent: 'center',
            },
          }}
        />
      </Box>
    </Flex>
  );
};

export default ColorModeSwitch;

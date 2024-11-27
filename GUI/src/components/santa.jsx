import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useState, useEffect } from "react";

const SantaRide = () => {
  const [isVisible, setIsVisible] = useState(true);

  const santaRideAnimation = keyframes`
    0% { transform: translateX(100%); }
    50% { transform: translateX(20%); }
    100% { transform: translateX(-100%); }
  `;

  useEffect(() => {
    // Set the component to be hidden after 6 seconds (the duration of the animation)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 6000); // Animation duration is 6s

    // Cleanup timer when component is unmounted
    return () => clearTimeout(timer);
  }, []);

  return (
    isVisible && (
      <Box
        display="inline-flex"
        gap="15px"
        fontSize="36px"
        position="relative"
        animation={`${santaRideAnimation} 6s ease-in-out forwards`} // 'forwards' keeps the final state
        alignItems="center"
      >
        🦌🦌🦌 <Box as="span">🛷</Box> <Box as="span">🎅</Box>
      </Box>
    )
  );
};

export default SantaRide;

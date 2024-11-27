import React, { useEffect, useState } from 'react';
import { AdminProvider } from '../../context/AdminContext';
import { Box, Flex, Tabs, TabList, TabPanels, Tab, TabPanel, useBreakpointValue } from '@chakra-ui/react';

import SubscriptionList from './SubscriptionList';
import JsonSubscriptionInput from './JsonSubscriptionInput';
import UserManagement from './UserManagement';
import TransactionHistory from './TransactionHistory';


const Admin = () => {
  // Define a responsive padding value based on screen size
  const padding = useBreakpointValue({ base: 2, md: 4 });
  const height = useBreakpointValue({ base: "auto", md: "100vh" });

  // State to manage the active tab index
  const [activeTabIndex, setActiveTabIndex] = useState(() => {
    // Retrieve the active tab index from localStorage or default to 0
    const savedTabIndex = localStorage.getItem('activeTabIndex');
    return savedTabIndex ? parseInt(savedTabIndex, 10) : 0;
  });

  // Effect to save the active tab index to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('activeTabIndex', activeTabIndex);
  }, [activeTabIndex]);

  return (
    <AdminProvider>
      <Flex height={height} direction="column">
        <Box
          flex="1"
          p={padding}
          overflowY="auto"
          css={{
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none', // IE and Edge
            scrollbarWidth: 'none', // Firefox
          }}
        >
          <Tabs 
            isFitted 
            variant="enclosed" 
            colorScheme="teal" 
            size={useBreakpointValue({ base: 'sm', md: 'md' })} 
            index={activeTabIndex} // Set the current tab index
            onChange={(index) => setActiveTabIndex(index)} // Update state on tab change
          >
            <TabList mb="1em">
              <Tab>Subscriptions</Tab>
              <Tab>Users</Tab>
              <Tab>Transactions</Tab>
       
            </TabList>
            <TabPanels>
              {/* Subscriptions Tab */}
              <TabPanel p={0}>
                <Tabs variant="soft-rounded" colorScheme="teal">
                  <TabList>
                    <Tab>Create via JSON</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <JsonSubscriptionInput />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
                <SubscriptionList />
              </TabPanel>
              {/* Other tabs */}
              <TabPanel p={0}><UserManagement /></TabPanel>
              <TabPanel p={0}><TransactionHistory /></TabPanel>
             ó
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </AdminProvider>
  );
};

export default Admin;

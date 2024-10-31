import React from 'react';
import { AdminProvider } from '../../context/AdminContext';
import { Box, Flex, Tabs, TabList, TabPanels, Tab, TabPanel, useBreakpointValue } from '@chakra-ui/react';

import SubscriptionList from './SubscriptionList';
import JsonSubscriptionInput from './JsonSubscriptionInput';
import UserManagement from './UserManagement';
import TransactionHistory from './TransactionHistory';
import DownloadSection from './DownloadSection';

const Admin = () => {
  // Define a responsive padding value based on screen size
  const padding = useBreakpointValue({ base: 2, md: 4 });
  const height = useBreakpointValue({ base: "auto", md: "100vh" });

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
          <Tabs isFitted variant="enclosed" colorScheme="teal" size={useBreakpointValue({ base: 'sm', md: 'md' })}>
            <TabList mb="1em">
              <Tab>Subscriptions</Tab>
              <Tab>Users</Tab>
              <Tab>Transactions</Tab>
              <Tab>Download</Tab>
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
              <TabPanel p={0}><DownloadSection /></TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </AdminProvider>
  );
};

export default Admin;

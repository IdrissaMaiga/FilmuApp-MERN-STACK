import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import {
  Box,
  Flex,
  Select,
  Input,
  Spinner,
  Text,
  VStack,
  Grid,
  Button,
  useColorModeValue,
  Switch,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
} from '@chakra-ui/react';
import { MdPayment } from 'react-icons/md';
import { useAdmin } from '../../context/AdminContext';

const TransactionHistory = () => {
  const { currency } = useAuth();
  const { getAllTransactions, transactions, loading: tloading, reverseTransaction } = useAdmin();

  const [sortedTransactions, setSortedTransactions] = useState([]);
  const [sortOption, setSortOption] = useState('createdAt');
  const [searchTerm, setSearchTerm] = useState('');
  const [showImages, setShowImages] = useState(true);

  const bg = useColorModeValue('#f4f6f8', '#1A202C');
  const textColor = useColorModeValue('#333', '#F7FAFC');
  const boxBgColor = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    getAllTransactions();
  }, []);

  useEffect(() => {
    let filtered = [...transactions];

    if (sortOption !== 'createdAt') {
      if (sortOption === 'Tous les types') {
        filtered = [...transactions];
      } else {
        filtered = filtered.filter((t) => t.transactionType === sortOption);
      }
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setSortedTransactions(filtered);
  }, [transactions, sortOption]);

  const getStatus = (transaction) => {
    if (transaction.reversed) return 'retourné';
    if (transaction.isPending) return 'En attente';
    if (transaction.isCanceled) return 'Annulé';
    return 'Inconnu';
  };

  const getColor = (transaction) => {
    if (transaction.reversed) return 'purple.100';
    if (transaction.isApproved) return 'green.100';
    if (transaction.isPending) return 'yellow.100';
    if (transaction.isCanceled) return 'pink.100';
    return 'white';
  };

  const uniqueTransactionTypes = ['Tous les types', 'createdAt', ...new Set(transactions.map((t) => t.transactionType))];

  const filteredTransactions = sortedTransactions.filter((transaction) =>
    Object.values(transaction).some((field) => {
      if (typeof field === 'string') {
        return field.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (typeof field === 'number') {
        return field.toString().includes(searchTerm);
      }
      return false;
    }) || (getStatus(transaction) && getStatus(transaction).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleReverse = (transactionId,userId) => {
    const confirmReverse = window.confirm('Êtes-vous sûr de vouloir annuler cette transaction?');
    if (confirmReverse) {
     
      reverseTransaction({ transactionId,userId});
    }
  };

  return (
    <Tabs variant="soft-rounded" colorScheme="teal" p={2}>
      <TabList m={0} p={0}>
        <Tab>
          <MdPayment style={{ display: 'inline', marginRight: '8px' }} />
          User Transactions
        </Tab>
      </TabList>

      <TabPanels m={0} p={2}>
        <TabPanel mt={2} p={0}>
          <VStack p={0} m={0}>
            <Box p={2} m={0} bg={bg} color={textColor} borderRadius="md"  mt="3">
              <Flex mb={4} alignItems="center">
                <Text fontWeight="bold" mr={2}>Trier par :</Text>
                <Select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  mr={4}
                >
                  {uniqueTransactionTypes.map((type) => (
                    <option key={type} value={type === 'Tous les types' ? 'createdAt' : type}>
                      {type}
                    </option>
                  ))}
                </Select>

                <Input
                  placeholder="Rechercher des transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  mr={4}
                />

                <Flex alignItems="center">
                  <Text mr={2}>Afficher les images</Text>
                  <Switch isChecked={showImages} onChange={() => setShowImages(!showImages)} />
                </Flex>
              </Flex>

              {tloading ? (
                <Flex justify="center" align="center" height="100px">
                  <Spinner />
                </Flex>
              ) : (
                <Box borderTop="1px solid #ddd" pt={2}>
                  {filteredTransactions.length ? (
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)',lg: 'repeat(5, 1fr)' }} gap={4}>
                      {filteredTransactions.map((transaction) => (
                        <Box key={transaction.id} p={4} bg={getColor(transaction)} borderRadius="md" boxShadow="sm" color="black">
                          <Text><strong>Montant :</strong> {transaction.amount} {currency}</Text>
                          <Text><strong>Numéro de téléphone :</strong> {transaction.phonenumber}</Text>
                          <Text><strong>Statut :</strong> {getStatus(transaction)}</Text>
                          <Text><strong>ID de transaction :</strong> {transaction.ID}</Text>
                          <Text><strong>Type :</strong> {transaction.transactionType}</Text>
                          <Text><strong>Créé le :</strong> {new Date(transaction.createdAt).toLocaleString()}</Text>
                          {showImages && transaction.imageBase64 && (
                            <Box>
                              <strong>Image :</strong>
                              <img src={`data:image/png;base64,${transaction.imageBase64}`} alt="Transaction" style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '10px' }} />
                            </Box>
                          )}
                          {(transaction.transactionType === 'ABON' || transaction.transactionType === 'TELE')&&!transaction.reversed && (
                            <Button
                              colorScheme="red"
                              mt={2}
                              onClick={() => handleReverse(transaction.id,transaction.userId)}
                            >
                              Annuler la transaction
                            </Button>
                          )}
                        </Box>
                      ))}
                    </Grid>
                  ) : (
                    <Text textAlign="center" color="#777">Aucune transaction trouvée.</Text>
                  )}
                </Box>
              )}
            </Box>
          </VStack>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default TransactionHistory;

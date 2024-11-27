import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Select,
  Input,
  Spinner,
  Text,
  VStack,
  Grid,
  useColorModeValue,
} from '@chakra-ui/react';
import { useAdmin } from '../../context/AdminContext';

const Moneyflow = () => {
  const { getAllMoneyFlow, moneyflow, loading } = useAdmin();  // Fetch moneyflow data
  const [sortedMoneyFlow, setSortedMoneyFlow] = useState([]);
  const [sortOption, setSortOption] = useState('createdAt');
  const [searchTerm, setSearchTerm] = useState('');

  const bg = useColorModeValue('#f4f6f8', '#1A202C');
  const textColor = useColorModeValue('#333', '#F7FAFC');

  useEffect(() => {
   getAllMoneyFlow();  // Fetch all money flows on mount
    console.log(moneyflow)
  }, []);

  useEffect(() => {
    let filtered = [...moneyflow];

    if (sortOption !== 'createdAt') {
      if (sortOption === 'Tous les types') {
        filtered = [...moneyflow];
      } else {
        filtered = filtered.filter((t) => t.type === sortOption);
      }
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setSortedMoneyFlow(filtered);
  }, [moneyflow, sortOption]);

  const getStatus = (moneyFlow) => {
    if (moneyFlow.isApproved) return 'Approuvé';
    return 'Non Approuvé';
  };

  const getColor = (moneyFlow) => {
    return moneyFlow.isApproved ? 'green.100' : 'pink.100';
  };

  const uniqueMoneyTypes = ['Tous les types', 'createdAt', ...new Set(moneyflow?.map((t) => t.type))];

  const filteredMoneyFlow = sortedMoneyFlow.filter((moneyFlow) =>
    Object.values(moneyFlow).some((field) => {
      if (typeof field === 'string') {
        return field.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (typeof field === 'number') {
        return field.toString().includes(searchTerm);
      }
      return false;
    })
  );

  return (
   
          <VStack p={0} m={0}>
            <Box p={2} m={0} bg={bg} color={textColor} mt="3">
              <Flex mb={4} alignItems="center">
                <Text fontWeight="bold" mr={2}>Trier par :</Text>
                <Select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  mr={4}
                >
                  {uniqueMoneyTypes?.map((type) => (
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

              </Flex>

              {loading ? (
                <Flex justify="center" align="center" height="100px">
                  <Spinner />
                </Flex>
              ) : (
                <Box borderTop="1px solid #ddd" pt={2}>
                  {filteredMoneyFlow.length ? (
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' }} gap={4}>
                      {filteredMoneyFlow.map((moneyFlow) => (
                        <Box key={moneyFlow.id} p={4} bg={getColor(moneyFlow)} boxShadow="sm" color="black">
                          <Text><strong>Montant :</strong> {moneyFlow.amount}</Text>
                          <Text><strong>Numéro de téléphone :</strong> {moneyFlow.phonenumeber}</Text>
                          <Text><strong>Statut :</strong> {getStatus(moneyFlow)}</Text>
                          <Text><strong>ID de transaction :</strong> {moneyFlow.ID}</Text>
                          <Text><strong>Type :</strong> {moneyFlow.type}</Text>
                          <Text><strong>Moyen :</strong> {moneyFlow.mean}</Text>
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
     
  );
};

export default Moneyflow;

import React, { useEffect, useState } from 'react';
import { useTransaction } from '../../context/TransactionContext';
import { useAuth } from '../../context/useAuth';
import {
  Box,
  Flex,
  Heading,
  Select,
  Input,
  Spinner,
  Text,
  VStack,
  Grid,
  useColorModeValue,
  Switch,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  HStack,
  Wrap,
  Center,
  WrapItem,
  useDisclosure,
  IconButton,
} from '@chakra-ui/react';
import { DownloadIcon, MinusIcon } from '@chakra-ui/icons';
import { MdSubscriptions, MdPayment,MdAttachMoney } from 'react-icons/md';


const TransactionsPanel = () => {
  const { user, currency } = useAuth();
  const { transactions, tloading, getUserTransaction, createRetraitTransaction } = useTransaction();

  const [sortedTransactions, setSortedTransactions] = useState([]);
  const [sortOption, setSortOption] = useState('createdAt');
  const [searchTerm, setSearchTerm] = useState('');
  const [showImages, setShowImages] = useState(true);
  const [amount, setAmount] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bg = useColorModeValue('#f4f6f8', '#1A202C');
  const textColor = useColorModeValue('#333', '#F7FAFC');
  const boxBgColor = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    getUserTransaction();
  }, []);

  const handleCreateRetraitTransaction = async () => {
    await createRetraitTransaction({ amount });
    onClose();
    setAmount(''); // Reset input field
    await getUserTransaction();
  };

  useEffect(() => {
    let filtered = [...transactions];

    // Apply sort by transaction type or by date
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

  return (<>
    {tloading ? (
      <Center>
        <Spinner thickness="4px" speed="0.75s" color="yellow.400" size="xl" />
      </Center>
    ):
    (<VStack>
      <Wrap mt="8" mb="-20" p={2} spacing={2} align="baseline" justify="space-between">
      <WrapItem width={{ base: '100%', md: 'auto' }}>
          <Button
            as="a"
            href="/deposit"
            colorScheme="green"
            size={{ base: 'sm', md: 'md', lg: 'lg' }}
            leftIcon={<MdAttachMoney/>}
            width="full"
          >
            Dépot
          </Button>
        </WrapItem>
        <WrapItem width={{ base: '100%', md: 'auto' }}>
          <Button
            colorScheme="red"
            onClick={onOpen}
            size={{ base: 'sm', md: 'md', lg: 'lg' }}
            leftIcon={<MinusIcon />}
            width="full"
          >
            Retrait
          </Button>
        </WrapItem>
        <WrapItem width={{ base: '100%', md: 'auto' }}>
          <Button
            as="a"
            href="/downloads"
            colorScheme="blue"
            size={{ base: 'sm', md: 'md', lg: 'lg' }}
            leftIcon={<DownloadIcon />}
            width="full"
          >
            Téléchargements
          </Button>
        </WrapItem>
       
        <WrapItem width={{ base: '100%', md: 'auto' }}>
          <Button
            as="a"
            href="/subscriptions"
            colorScheme="purple"
            size={{ base: 'sm', md: 'md', lg: 'lg' }}
            leftIcon={<MdSubscriptions />}
            width="full"
          >
            Abonnements
          </Button>
        </WrapItem>
      </Wrap>

      <Box p={5} bg={bg} color={textColor} borderRadius="md" mt="20">
        <Heading as="h2" size="lg" color={textColor} mb={4}>
          <MdPayment style={{ display: 'inline', marginRight: '8px' }} />
          Transactions
        </Heading>

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

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Demande de Retrait</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb={2}>Entrer le montant :</Text>
              <Input
                placeholder="Montant"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                autoFocus
              />
            </ModalBody>
            <ModalFooter>
              <IconButton
                icon={<MinusIcon />}
                colorScheme="red"
                onClick={handleCreateRetraitTransaction}
                aria-label="Soumettre la demande"
              />
            </ModalFooter>
          </ModalContent>
        </Modal>

        {tloading ? (
          <Flex justify="center" align="center" height="100px">
            <Spinner />
          </Flex>
        ) : (
          <Box borderTop="1px solid #ddd" pt={2}>
            {filteredTransactions.length ? (
              <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' ,lg:'repeat(4, 1fr)' }} gap={4}>
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
                  </Box>
                ))}
              </Grid>
            ) : (
              <Text textAlign="center" color="#777">Aucune transaction trouvée.</Text>
            )}
          </Box>
        )}
      </Box>
    </VStack>)}
    </>);
};

export default TransactionsPanel;

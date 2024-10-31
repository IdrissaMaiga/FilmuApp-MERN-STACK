import React, { useState } from 'react';
import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Input,
  Select,
  Spinner,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useAdmin } from '../../context/AdminContext';
import { EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';

const editableFields = ['type', 'price', 'devices', 'downloads', 'description'];
const hiddenFields = ["id"];

const SubscriptionRow = ({
  subscription,
  onEdit,
  onDelete,
  isEditing,
  editedSubscription,
  onInputChange,
  onUpdate,
  onCancel,
  typess,
}) => {
  const { id } = subscription;

  return (
    <Tr key={id}>
      {Object.keys(subscription).map((key) => (
        !hiddenFields.includes(key) && (
          <Td key={key}>
            {isEditing && editableFields.includes(key) ? (
              key === 'type' ? (
                <Select
                  name={key}
                  value={editedSubscription[key]}
                  onChange={onInputChange}
                  placeholder={`Select ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                >
                  {typess.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input
                  name={key}
                  type={typeof subscription[key] === 'number' ? 'number' : 'text'}
                  value={editedSubscription[key]}
                  onChange={onInputChange}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                />
              )
            ) : (
              subscription[key]
            )}
          </Td>
        )
      ))}
      <Td>
        {isEditing ? (
          <>
            <IconButton
              icon={<CheckIcon />}
              colorScheme="teal"
              onClick={onUpdate}
              aria-label="Save changes"
              mr={2}
              isRound
            />
            <IconButton
              icon={<CloseIcon />}
              colorScheme="red"
              onClick={onCancel}
              aria-label="Cancel edit"
              isRound
            />
          </>
        ) : (
          <>
            <IconButton
              icon={<EditIcon />}
              colorScheme="blue"
              onClick={() => onEdit(subscription)}
              aria-label="Edit subscription"
              mr={2}
              isRound
            />
            <Button
              onClick={() => onDelete(id)}
              colorScheme="red"
              aria-label="Delete subscription"
            >
              Delete
            </Button>
          </>
        )}
      </Td>
    </Tr>
  );
};

const SubscriptionList = () => {
  const { subscriptions, removeSubscription, updateSubscription, loading, fetchSubscriptions } = useAdmin();
  
  const [editSubscriptionId, setEditSubscriptionId] = useState(null);
  const [editedSubscription, setEditedSubscription] = useState({});

  const getSubscriptionTypes = () => {
    if (!subscriptions) return [];
    return [...new Set(subscriptions.map((sub) => sub.type))];
  };

  const typeOptions = getSubscriptionTypes();

  const handleDelete = async (id) => {
    try {
      await removeSubscription(id);
      fetchSubscriptions();
      const allCookies = document.cookie;
       console.log(allCookies);

    } catch (error) {
      console.error('Failed to delete subscription:', error);
    }
  };

  const handleEditClick = (subscription) => {
    setEditSubscriptionId(subscription.id);
    setEditedSubscription(subscription);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedSubscription((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    const updates = Object.entries(editedSubscription).filter(
      ([key, value]) => value !== subscriptions.find((sub) => sub.id === editedSubscription.id)[key]
    ).map(async ([fieldName, fieldValue]) => {
      if (['devices', 'downloads', 'price', 'duration'].includes(fieldName) && typeof fieldValue === 'string') {
        fieldValue = parseInt(fieldValue, 10);
      }
      await updateSubscription(editedSubscription.id, fieldName, fieldValue);
    });

    await Promise.all(updates);
    setEditSubscriptionId(null);
    fetchSubscriptions();
  };

  const handleCancel = () => {
    setEditSubscriptionId(null);
    setEditedSubscription({});
  };

  return (
    <Box mt={8} width={{ base: "100%", md: "90%", lg: "80%" }} mx="auto" overflowX="auto">
      <h2>Existing Subscriptions</h2>
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Table variant="simple" mt={4} size="sm" width="100%">
          <Thead>
            <Tr>
              {subscriptions.length > 0 && Object.keys(subscriptions[0]).map((key) => (
                !hiddenFields.includes(key) && (
                  <Th key={key} whiteSpace="nowrap">{key.charAt(0).toUpperCase() + key.slice(1)}</Th>
                )
              ))}
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {subscriptions && subscriptions.length > 0 ? (
              subscriptions.map((subscription) => (
                <SubscriptionRow
                  key={subscription.id}
                  typess={typeOptions}
                  subscription={subscription}
                  onEdit={handleEditClick}
                  onDelete={handleDelete}
                  isEditing={editSubscriptionId === subscription.id}
                  editedSubscription={editedSubscription}
                  onInputChange={handleInputChange}
                  onUpdate={handleUpdate}
                  onCancel={handleCancel}
                />
              ))
            ) : (
              <Tr>
                <Td colSpan={Object.keys(subscriptions[0]).length + 1}>No subscriptions available.</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default SubscriptionList;

import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  IconButton,
  Input,
  useColorModeValue,
  Badge,
  Select,
  Button,
  Tooltip,
  Spacer,
} from '@chakra-ui/react';
import {
  FaPen,
  FaCheck,
  FaTimes,
  FaClipboard,
  FaFacebook,
  FaLinkedin,
  FaWhatsapp,
  FaTwitter,
  FaInstagram,
  FaPlus,
  FaFlag
} from 'react-icons/fa';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

const socialMediaIcons = {
  whatsapp: FaWhatsapp,
  facebook: FaFacebook,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  instagram: FaInstagram
};

const countryCodes = [
  "+223", "+234", "+225", "+221", "+254", "+256", "+255", "+212", "+27", "+20", "+237"
  // Add more African country codes here as needed
];

const UserProfile = () => {
  const { updateField, user, currency,flagdevice,loading } = useAuth();
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);
  const initialCountryCode = user.phone?.split(' ')[0] || '+223';
  const initialLocalPhone = user.phone?.split(' ')[1] || '';
  const [isEditing, setIsEditing] = useState({ name: false, phone: false });
  const [formData, setFormData] = useState({
    name: user.name,
    countryCode: initialCountryCode,
    localPhoneNumber: initialLocalPhone,
  });
  const [socialLinks, setSocialLinks] = useState(user.SocialMedias || {});
  const [isSocialEditing, setIsSocialEditing] = useState(false);
  const [newPlatform, setNewPlatform] = useState('');
  const [newLink, setNewLink] = useState('');

  const handleEditToggle = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  


  const handleFlagDevice = (deviceId) => {
     flagdevice({deviceId})
  };
  //use devices are in user.devicesInfo
//every device in that array  if exist have a .id  do not show the mot recent login witch device.loginTime
//model Device {
   // id           String    @id @default(auto()) @map("_id") @db.ObjectId
  //  deviceType   String?
  //  browser      String?
  //  os           String?
   // location     String?
   /// ipAddress    String?                                                                                                                                                
  //  loginTime DateTime  @default(now())
 // }



  const handleSave = (field) => {
    if (field === 'phone') {
      const updatedPhone = `${formData.countryCode} ${formData.localPhoneNumber}`;
      updateField({ fieldName: 'phone', fieldValue: updatedPhone });
     
      console.log(user)
    } else {
      updateField({ fieldName: field, fieldValue: formData[field] });
    
    }
    setIsEditing((prev) => ({ ...prev, [field]: false }));
  };

  const handleCancel = (field) => {
    if (field === 'phone') {
      setFormData((prev) => ({
        ...prev,
        countryCode: initialCountryCode,
        localPhoneNumber: initialLocalPhone,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: user[field],
      }));
    }
    setIsEditing((prev) => ({ ...prev, [field]: false }));
  };

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSocialMediaSave = () => {
    const updatedSocialLinks = { ...socialLinks };
    if (newPlatform && newLink) {
      updatedSocialLinks[newPlatform] = newLink;
    }
    setSocialLinks(updatedSocialLinks);
    updateField({ fieldName: 'SocialMedias', fieldValue: updatedSocialLinks });
    setNewPlatform('');
    setNewLink('');
    setIsSocialEditing(false);
  };

  const handleSocialMediaDelete = (platform) => {
    const updatedSocialLinks = { ...socialLinks };
    delete updatedSocialLinks[platform];
    setSocialLinks(updatedSocialLinks);
    updateField({ fieldName: 'SocialMedias', fieldValue: updatedSocialLinks });
  };

  return (
   
    <Box
      bg={useColorModeValue('gray.100', 'gray.800')}
      p={8}
      rounded="lg"
      boxShadow="2xl"
      maxW="500px"
      mx="auto"
      border="1px solid"
    >
      <Heading as="h3" size="lg" mb={6} textAlign="center" color="red.500">
        Mon Profil
      </Heading>

      <VStack align="start" spacing={6}>
        <HStack w="100%">
          <Text fontWeight="bold" w="150px">Nom :</Text>
          {isEditing.name ? (
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              size="sm"
            />
          ) : (
            <Text>{user.name}</Text>
          )}
          <Spacer />
          <IconButton
            icon={isEditing.name ? <FaCheck /> : <FaPen />}
            aria-label={isEditing.name ? 'Save name' : 'Edit name'}
            size="sm"
            onClick={() =>
              isEditing.name ? handleSave('name') : handleEditToggle('name')
            }
          />
          {isEditing.name && (
            <IconButton
              icon={<FaTimes />}
              aria-label="Cancel edit"
              size="sm"
              onClick={() => handleCancel('name')}
            />
          )}
        </HStack>

        {/* Referral Code */}
        <HStack w="100%">
          <Text fontWeight="bold" w="auto">Code de parrainage :</Text>
          <Text>{user?.refferalCode}</Text>
          <Tooltip
            hasArrow
            label={isCopied ? "Copié !" : "Copier le code"}
            closeOnClick={false}
          >
            <IconButton
              icon={<FaClipboard />}
              aria-label="Copy referral code"
              size="sm"
              onClick={handleCopyReferralCode}
            />
          </Tooltip>
        </HStack>

        {/* Social Media Field */}
        <VStack align="start" w="100%" spacing={4}>
          <Text fontWeight="bold" w="150px">Réseaux sociaux :</Text>
          {Object.entries(socialLinks).map(([platform, link]) => {
            const Icon = socialMediaIcons[platform];
            return (
              <HStack key={platform} w="100%">
                {Icon && <Icon color="blue.500" />}
                <Text as="a" href={link} target="_blank" rel="noopener noreferrer">
                  {link}
                </Text>
                <Spacer />
                <IconButton
                  icon={<FaPen />}
                  aria-label="Edit social link"
                  size="sm"
                  onClick={() => {
                    setNewPlatform(platform);
                    setNewLink(link);
                    setIsSocialEditing(true);
                  }}
                />
                <IconButton
                  icon={<FaTimes />}
                  aria-label="Delete social link"
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleSocialMediaDelete(platform)}
                />
              </HStack>
            );
          })}

          {/* Add New Social Media Link */}
          {isSocialEditing ? (
            <HStack>
              <Select
                placeholder="Select Platform"
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value)}
                size="sm"
              >
                <option value="facebook">Facebook</option>
                <option value="linkedin">LinkedIn</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="twitter">Twitter</option>
                <option value="instagram">Instagram</option>
              </Select>
              <Input
                placeholder="Enter link"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                size="sm"
              />
              <IconButton
                icon={<FaCheck />}
                aria-label="Save link"
                size="sm"
                colorScheme="green"
                onClick={handleSocialMediaSave}
              />
            </HStack>
          ) : (
            <Button
              leftIcon={<FaPlus />}
              size="sm"
              colorScheme="teal"
              onClick={() => setIsSocialEditing(true)}
            >
              Ajouter un lien
            </Button>
          )}
        </VStack>

        {/* Subscription Details */}
        <VStack spacing={2} w="100%">
          <Text fontWeight="bold">Abonnement :</Text>
          <Text>Début : {new Date(user?.subscribtionStartDay).toLocaleString()}</Text>
          <Text>Fin : {new Date(user?.subscribtionEndDay).toLocaleString()}</Text>
          <Text>Type : {user.subscription?.type}</Text>
        </VStack>

        {/* Email and Balance */}
        <VStack spacing={2} w="100%">
          <Text fontWeight="bold">Email :</Text>
          <Text>{user.email}</Text>
          <Badge colorScheme="blue">Solde: {currency}{user.balance}</Badge>
        </VStack>

        {/* Phone Field */}
        <HStack w="100%">
          <Text fontWeight="bold" w="150px">Téléphone :</Text>
          {isEditing.phone ? (
            <HStack>
              <Select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleInputChange}
                size="sm"
              >
                {countryCodes.map((code) => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </Select>
              <Input
                name="localPhoneNumber"
                type='number'
                value={formData.localPhoneNumber}
                onChange={handleInputChange}
                size="sm"
              />
            </HStack>
          ) : (
            <Text>{user.phone}</Text>
          )}
          <Spacer />
          <IconButton
            icon={isEditing.phone ? <FaCheck /> : <FaPen />}
            aria-label={isEditing.phone ? 'Save phone' : 'Edit phone'}
            size="sm"
            onClick={() =>
              isEditing.phone ? handleSave('phone') : handleEditToggle('phone')
            }
          />
          {isEditing.phone && (
            <IconButton
              icon={<FaTimes />}
              aria-label="Cancel edit"
              size="sm"
              onClick={() => handleCancel('phone')}
            />
          )}
        </HStack>
        <VStack align="start" spacing={6} mt={8} w="100%">
  <Text fontWeight="bold" fontSize="lg">Appareil Actuellement Connectés :</Text>
  {user.devicesInfo
    .sort((a, b) => new Date(b.loginTime) - new Date(a.loginTime)) // Exclude the most recent login
    .map((device, index) => (
      <Box
        key={device.id}
        w="100%"
        p={4}
        borderWidth="1px"
        borderRadius="md"
        boxShadow="sm"
        bg={useColorModeValue('white', 'gray.700')}
      >
        <HStack spacing={4} align="center">
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold">Type d'appareil : {device.deviceType || 'N/A'}</Text>
            <Text>Navigateur : {device.browser || 'N/A'}</Text>
            <Text>Système d'exploitation : {device.os || 'N/A'}</Text>
            <Text>Location : {device.location || 'N/A'}</Text>
            <Text>Adresse IP : {device.ipAddress || 'N/A'}</Text>
            <Text>Date de connexion : {new Date(device.loginTime).toLocaleString()}</Text>
          </VStack>
          <Spacer />
          <Tooltip label="Marquer cet appareil comme suspect" closeOnClick={false}>
            <IconButton
              icon={<FaFlag />}
              colorScheme="red"
              onClick={() => handleFlagDevice(device.id)}
              aria-label="Flag Device"
              isLoading={loading} // optional loading state for UX
            />
          </Tooltip>
        </HStack>
      </Box>
    ))}
</VStack>
        <VStack spacing={4} mt={6} w="100%">
            <Button colorScheme="teal" w="100%" onClick={() => navigate('/changepassword')}>
              Changer le mot de passe
            </Button>
            <Button colorScheme="teal" w="100%" onClick={() => navigate('/subscribe')}>
              S'abonner
            </Button>
            <Button colorScheme="teal" w="100%" onClick={() => navigate('/deposit')}>
              Dépôt
            </Button>
          </VStack>
      </VStack>
    </Box>
);
};

export default UserProfile;

import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  StackDivider,
  Container,
  useColorModeValue,
  Link,
  IconButton,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  // Utilisation des valeurs du mode couleur pour le mode clair/sombre
  const bgColor = useColorModeValue('white', '#141414');
  const textColor = useColorModeValue('gray.800', 'white');
  const navigate = useNavigate();

  return (
    <Box
      bg={bgColor}
      color={textColor}
      minHeight='100vh'
      py='12'
      px={{ base: '4', md: '8' }}
    >
      <Container maxW='container.md'>
        {/* Bouton Retour */}
        <IconButton
          icon={<ArrowBackIcon />}
          aria-label='Retour'
          onClick={() => navigate('/login')}
          variant='ghost'
          color={textColor}
          mb='6'
        />

        <VStack
          spacing='8'
          align='stretch'
          divider={<StackDivider borderColor={useColorModeValue('gray.200', '#333')} />}
        >
          <Heading as='h1' size='xl' textAlign='center'>
            Conditions Générales
          </Heading>

          <Box>
            <Heading as='h2' size='md' mb='4'>
              1. Introduction
            </Heading>
            <Text>
              Bienvenue sur notre service de streaming. Ces Conditions Générales régissent votre utilisation de notre plateforme. En accédant ou en utilisant nos services, vous acceptez d'être lié par ces conditions.
            </Text>
          </Box>

          <Box>
            <Heading as='h2' size='md' mb='4'>
              2. Conditions de Compte
            </Heading>
            <Text>
              Vous devez avoir 18 ans ou plus pour créer un compte. Vous êtes responsable du maintien de la confidentialité de votre compte et de votre mot de passe. Vous acceptez de fournir des informations exactes et complètes lors de l'inscription.
            </Text>
          </Box>

          <Box>
            <Heading as='h2' size='md' mb='4'>
              3. Utilisation du Contenu
            </Heading>
            <Text>
              Notre contenu est destiné à un usage personnel et non commercial uniquement. Vous ne pouvez pas distribuer, modifier, reproduire ou exécuter le contenu sans autorisation. Le streaming est limité à un seul appareil par compte, sauf indication contraire.
            </Text>
          </Box>

          <Box>
            <Heading as='h2' size='md' mb='4'>
              4. Paiement et Abonnement
            </Heading>
            <Text>
              Les frais d'abonnement seront facturés sur une base mensuelle ou annuelle, selon le plan choisi. Les paiements ne sont pas remboursables, sauf si la loi l'exige. Nous nous réservons le droit de modifier les frais d'abonnement avec préavis.
            </Text>
          </Box>

          <Box>
            <Heading as='h2' size='md' mb='4'>
              5. Résiliation et Suspension
            </Heading>
            <Text>
              Nous pouvons résilier ou suspendre votre compte si vous violez ces conditions ou si vous adoptez un comportement frauduleux ou illégal. En cas de résiliation, vous perdrez l'accès au contenu et à tout avantage associé.
            </Text>
          </Box>

          <Box>
            <Heading as='h2' size='md' mb='4'>
              6. Modifications du Service
            </Heading>
            <Text>
              Nous pouvons mettre à jour ou modifier le service à tout moment pour améliorer l'expérience utilisateur ou pour se conformer aux réglementations. Nous vous informerons des changements importants, et votre utilisation continue du service constitue l'acceptation de ces changements.
            </Text>
          </Box>

          <Box>
            <Heading as='h2' size='md' mb='4'>
              7. Informations de Contact
            </Heading>
            <Text>
              Si vous avez des questions ou des préoccupations concernant ces Conditions Générales, veuillez nous contacter à{' '}
              <Link href='mailto:servicefilmu@gmail.com' color='blue.500'>
                servicefilmu@gmail.com
              </Link>.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Terms;

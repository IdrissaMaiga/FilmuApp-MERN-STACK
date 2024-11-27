import { useState } from "react";
import {
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { DownloadIcon, CheckCircleIcon } from "@chakra-ui/icons";

const DownloadButton = ({ sid, id, createDownloadTransactionSingle }) => {
  const toast = useToast();
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [confirmDetails, setConfirmDetails] = useState(null);

  const handleDownload = async (allow, sid, mid) => {
    setLoading(true);
    try {
      const result = await createDownloadTransactionSingle({
        SerieId: sid,
        movieId: mid,
        allow,
      });
      if (result === true) {
        toast({
          title: "Download successful!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsDownloaded(true);
      } else if (result === false) {
        setConfirmDetails({ sid, mid }); // Save details for confirmation
        onOpen(); // Open the confirmation modal
      } else {
        toast({
          title: "Échec du téléchargement.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Une erreur s'est produite.",
        description: "Veuillez réessayer plus tard.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDownload = async () => {
    if (confirmDetails) {
      const { sid, mid } = confirmDetails;
      await handleDownload(true, sid, mid);
      setIsDownloaded(true);
      onClose(); // Close the modal
    }
  };

  return (
    <>
      {!isDownloaded ? (
        <Button ml= {2}
          onClick={() => handleDownload(false, sid, id)}
          isLoading={loading}
          colorScheme="teal"
        >
          <DownloadIcon />
        </Button>
      ) : (
        <Button
          ml= {2}
          leftIcon={<CheckCircleIcon />}
          colorScheme="green"
          variant="outline"
          onClick={() => setIsDownloaded(false)} // Example action
        >
          Télécharger
        </Button>
      )}

      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmation de Paiement</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
           Nombre limite de telechargements voulez-vous payer avec votre solde pour télécharger ?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Annuler
            </Button>
            <Button colorScheme="green" onClick={handleConfirmDownload}>
              Confirmer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DownloadButton;

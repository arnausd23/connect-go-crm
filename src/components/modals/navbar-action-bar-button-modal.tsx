import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { NAVBAR_ACTION_BAR_BUTTON_LABELS } from '../../utils/constants';

type NavbarActionBarButtonModalProps = {
  body: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: NAVBAR_ACTION_BAR_BUTTON_LABELS;
};

const NavbarActionBarButtonModal = ({
  body,
  isOpen,
  onClose,
  title,
}: NavbarActionBarButtonModalProps) => {
  return (
    <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bgColor={'background'} color={'white'}>
        <ModalHeader fontSize={'lg'}>{title}</ModalHeader>
        <ModalBody>{body}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default NavbarActionBarButtonModal;

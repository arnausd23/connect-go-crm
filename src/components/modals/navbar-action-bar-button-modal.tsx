import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { NAVBAR_ACTION_BAR_BUTTON_LABELS } from '../../utils/constants';

type NavbarActionBarButtonModalProps = {
  body: ReactNode;
  footer: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: NAVBAR_ACTION_BAR_BUTTON_LABELS;
};

const NavbarActionBarButtonModal = ({
  body,
  footer,
  isOpen,
  onClose,
  title,
}: NavbarActionBarButtonModalProps) => {
  return (
    <Modal
      isCentered={true}
      isOpen={isOpen}
      onClose={onClose}
      trapFocus={false}
      size={
        title === NAVBAR_ACTION_BAR_BUTTON_LABELS.CreateClient ? '2xl' : 'md'
      }
    >
      <ModalOverlay />
      <ModalContent bgColor={'background'} color={'white'}>
        <ModalHeader fontSize={'lg'}>{title}</ModalHeader>
        <ModalBody>{body}</ModalBody>
        <ModalFooter>
          <Button
            color={'background'}
            colorScheme={'gray'}
            fontSize={'14px'}
            onClick={() => onClose()}
            mr={'1rem'}
            variant={'solid'}
          >
            {'Cancelar'}
          </Button>
          {footer}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NavbarActionBarButtonModal;

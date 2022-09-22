import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import { NAVBAR_ACTION_BAR_BUTTON_LABELS } from '../../utils/constants';

type NavbarActionBarButtonModalProps = {
  body: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: NAVBAR_ACTION_BAR_BUTTON_LABELS;
};

export type NavbarActionBarModalProps = {
  data?: any;
  isLoading: boolean;
  onActionClick?: () => void;
  setData?: Dispatch<SetStateAction<any>>;
};

const NavbarActionBarButtonModal = ({
  actionButtonLabel,
  body,
  isLoading,
  isOpen,
  onClose,
  onActionClick,
  title,
}: NavbarActionBarButtonModalProps & {
  actionButtonLabel: string;
  isLoading: boolean;
  onActionClick: () => void;
}) => {
  return (
    <Modal
      closeOnOverlayClick={false}
      isCentered={true}
      isOpen={isOpen}
      onClose={onClose}
      trapFocus={false}
      size={
        title === NAVBAR_ACTION_BAR_BUTTON_LABELS.CreateClient ? 'xl' : 'md'
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
            disabled={isLoading}
            fontSize={'14px'}
            onClick={() => onClose()}
            mr={'1rem'}
            variant={'solid'}
          >
            {'Cancelar'}
          </Button>
          <Button
            bgColor={'blue.400'}
            colorScheme={'blue'}
            fontSize={'14px'}
            isLoading={isLoading}
            onClick={() => onActionClick()}
            variant={'solid'}
          >
            {actionButtonLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NavbarActionBarButtonModal;

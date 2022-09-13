import { IconButton, useDisclosure } from '@chakra-ui/react';
import { ReactElement, ReactNode } from 'react';
import { NAVBAR_ACTION_BAR_BUTTON_LABELS } from '../../utils/constants';
import NavbarActionBarButtonModal from '../modals/navbar-action-bar-button-modal';

type NavbarActionBarButtonProps = {
  ariaLabel: NAVBAR_ACTION_BAR_BUTTON_LABELS;
  icon: ReactElement;
  modalBody: ReactNode;
};
const NavbarActionBarButton = ({
  ariaLabel,
  icon,
  isLoading,
  modalBody,
  actionButtonLabel,
  onActionClick,
}: NavbarActionBarButtonProps & {
  actionButtonLabel: string;
  isLoading: boolean;
  onActionClick: () => void;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        aria-label={ariaLabel}
        icon={icon}
        variant={'ghost'}
        onClick={() => onOpen()}
      />
      <NavbarActionBarButtonModal
        title={ariaLabel}
        isLoading={isLoading}
        isOpen={isOpen}
        onClose={onClose}
        body={modalBody}
        actionButtonLabel={actionButtonLabel}
        onActionClick={onActionClick}
      />
    </>
  );
};

export default NavbarActionBarButton;

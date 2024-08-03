import { IconButton } from '@chakra-ui/react';
import { ReactElement, ReactNode } from 'react';
import { NAVBAR_ACTION_BAR_BUTTON_LABEL } from '../../utils/constants';
import CustomModal from '../custom/custom-modal';

type NavbarActionBarButtonProps = {
  ariaLabel: NAVBAR_ACTION_BAR_BUTTON_LABEL;
  icon: ReactElement;
  isOpen: boolean;
  modalBody: ReactNode;
  onClose: () => void;
  onOpen: () => void;
};
const NavbarActionBarButton = ({
  ariaLabel,
  icon,
  isLoading,
  isOpen,
  modalBody,
  onClose,
  onOpen,
  actionButtonLabel,
  onActionClick,
}: NavbarActionBarButtonProps & {
  actionButtonLabel: string;
  isLoading: boolean;
  onActionClick: () => void;
}) => {
  return (
    <>
      <IconButton
        aria-label={ariaLabel}
        icon={icon}
        variant={'ghost'}
        onClick={() => onOpen()}
      />
      <CustomModal
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

import { Flex } from '@chakra-ui/react';
import { FiFilePlus, FiLogOut, FiSettings, FiUserPlus } from 'react-icons/fi';
import { NAVBAR_ACTION_BAR_BUTTON_LABELS } from '../../utils/constants';
import NavbarActionBarButton from './navbar-action-bar-button';

const NavbarActionBar = () => {
  return (
    <Flex
      alignItems={'center'}
      bgColor={'white'}
      borderRadius={'lg'}
      color={'background'}
      h={'3rem'}
      justifyContent={'space-between'}
      p={'0 1rem'}
      shadow={'md'}
    >
      <NavbarActionBarButton
        ariaLabel={NAVBAR_ACTION_BAR_BUTTON_LABELS.AssignPlan}
        icon={<FiUserPlus size={'1.25rem'} />}
      />
      <NavbarActionBarButton
        ariaLabel={NAVBAR_ACTION_BAR_BUTTON_LABELS.CreatePlan}
        icon={<FiFilePlus size={'1.25rem'} />}
      />
      <NavbarActionBarButton
        ariaLabel={NAVBAR_ACTION_BAR_BUTTON_LABELS.Settings}
        icon={<FiSettings size={'1.25rem'} />}
      />
      <NavbarActionBarButton
        ariaLabel={NAVBAR_ACTION_BAR_BUTTON_LABELS.SignOut}
        icon={<FiLogOut size={'1.25rem'} />}
      />
    </Flex>
  );
};

export default NavbarActionBar;

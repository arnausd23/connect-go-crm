import { Flex } from '@chakra-ui/react';
import { FiFilePlus, FiLogOut, FiSettings, FiUserPlus } from 'react-icons/fi';
import { NAVBAR_ACTION_BAR_BUTTON_LABELS } from '../../utils/constants';
import AssignPlanModalFooter from '../modals/assign-plan/assign-plan-modal-footer';
import AssignPlanModalBody from '../modals/assign-plan/assign-plan-modal-body';
import CreatePlanModalBody from '../modals/create-plan/create-plan-modal-body';
import SettingsModalBody from '../modals/settings/settings-modal-body';
import SignOutModalBody from '../modals/sign-out/sign-out-modal-body';
import NavbarActionBarButton from './navbar-action-bar-button';
import SignOutModalFooter from '../modals/sign-out/sign-out-modal-footer';
import CreatePlanModalFooter from '../modals/create-plan/create-plan-modal-footer';
import SettingsModalFooter from '../modals/settings/settings-modal-footer';

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
        modalBody={<AssignPlanModalBody />}
        modalFooter={<AssignPlanModalFooter />}
      />
      <NavbarActionBarButton
        ariaLabel={NAVBAR_ACTION_BAR_BUTTON_LABELS.CreatePlan}
        icon={<FiFilePlus size={'1.25rem'} />}
        modalBody={<CreatePlanModalBody />}
        modalFooter={<CreatePlanModalFooter />}
      />
      <NavbarActionBarButton
        ariaLabel={NAVBAR_ACTION_BAR_BUTTON_LABELS.Settings}
        icon={<FiSettings size={'1.25rem'} />}
        modalBody={<SettingsModalBody />}
        modalFooter={<SettingsModalFooter />}
      />
      <NavbarActionBarButton
        ariaLabel={NAVBAR_ACTION_BAR_BUTTON_LABELS.SignOut}
        icon={<FiLogOut size={'1.25rem'} />}
        modalBody={<SignOutModalBody />}
        modalFooter={<SignOutModalFooter />}
      />
    </Flex>
  );
};

export default NavbarActionBar;

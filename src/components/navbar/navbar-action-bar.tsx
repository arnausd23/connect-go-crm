import { Flex } from '@chakra-ui/react';
import { FiFilePlus, FiLogOut, FiSettings, FiUserPlus } from 'react-icons/fi';
import { NAVBAR_ACTION_BAR_BUTTON_LABELS, PLANS } from '../../utils/constants';
import AssignPlanModal from '../modals/assign-plan-modal';
import CreatePlanModal from '../modals/create-plan-modal';
import SettingsModal from '../modals/settings-modal';
import SignOutModal from '../modals/sign-out-modal';
import NavbarActionBarButton from './navbar-action-bar-button';
import { useState } from 'react';
import { signOut } from 'next-auth/react';

const NavbarActionBar = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [assignPlanData, setAssignPlanData] = useState({
    ci: '',
    endingDate: new Date(),
    name: PLANS.Everyday,
    startingDate: new Date(),
  });
  const [createPlanData, setCreatePlanData] = useState({
    accessType: PLANS.Everyday,
    name: '',
    price: '',
  });

  const handleAssignPlan = () => {
    setIsLoading(true);
    setTimeout(() => {
      console.log(assignPlanData);
      setIsLoading(false);
    }, 3000);
  };

  const handleCreatePlan = () => {
    setIsLoading(true);
    setTimeout(() => {
      console.log(createPlanData);
      setIsLoading(false);
    }, 3000);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/sign-in' });
  };

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
        isLoading={isLoading}
        modalBody={
          <AssignPlanModal
            data={assignPlanData}
            isLoading={isLoading}
            setData={setAssignPlanData}
          />
        }
        onActionClick={handleAssignPlan}
        actionButtonLabel={'Asignar'}
      />
      <NavbarActionBarButton
        ariaLabel={NAVBAR_ACTION_BAR_BUTTON_LABELS.CreatePlan}
        icon={<FiFilePlus size={'1.25rem'} />}
        isLoading={isLoading}
        modalBody={
          <CreatePlanModal
            data={createPlanData}
            isLoading={isLoading}
            setData={setCreatePlanData}
          />
        }
        onActionClick={handleCreatePlan}
        actionButtonLabel={'Crear'}
      />
      <NavbarActionBarButton
        ariaLabel={NAVBAR_ACTION_BAR_BUTTON_LABELS.Settings}
        icon={<FiSettings size={'1.25rem'} />}
        isLoading={isLoading}
        modalBody={<SettingsModal />}
        onActionClick={() => {}}
        actionButtonLabel={'Guardar'}
      />
      <NavbarActionBarButton
        ariaLabel={NAVBAR_ACTION_BAR_BUTTON_LABELS.SignOut}
        icon={<FiLogOut size={'1.25rem'} />}
        isLoading={isLoading}
        modalBody={<SignOutModal />}
        onActionClick={handleSignOut}
        actionButtonLabel={'Cerrar'}
      />
    </Flex>
  );
};

export default NavbarActionBar;

import { Flex, useDisclosure, useToast } from '@chakra-ui/react';
import { FiFilePlus, FiLogOut, FiSettings, FiUserPlus } from 'react-icons/fi';
import {
  NAVBAR_ACTION_BAR_BUTTON_LABEL,
  PLAN_ACCESS_TYPE,
  SUCCESS_MESSAGE,
} from '../../utils/constants';
import AssignPlanModal from '../modals/assign-plan-modal';
import CreatePlanModal from '../modals/create-plan-modal';
import SettingsModal from '../modals/settings-modal';
import SignOutModal from '../modals/sign-out-modal';
import NavbarActionBarButton from './navbar-action-bar-button';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { trpc } from '../../utils/trpc';
import { ICreatePlan } from '../../server/common/validation/schemas';

const NavbarActionBar = () => {
  const toast = useToast();
  const ctx = trpc.useContext();
  const {
    isOpen: assignPlanIsOpen,
    onOpen: assignPlanOnOpen,
    onClose: assignPlanOnClose,
  } = useDisclosure();
  const {
    isOpen: createPlanIsOpen,
    onOpen: createPlanOnOpen,
    onClose: createPlanOnClose,
  } = useDisclosure();
  const {
    isOpen: settingsIsOpen,
    onOpen: settingsOnOpen,
    onClose: settingsOnClose,
  } = useDisclosure();
  const {
    isOpen: signOutPlanIsOpen,
    onOpen: signOutPlanOnOpen,
    onClose: signOutPlanOnClose,
  } = useDisclosure();
  const [assignPlanData, setAssignPlanData] = useState({
    ci: '',
    endingDate: new Date(),
    name: '',
    startingDate: new Date(),
  });
  const [createPlanData, setCreatePlanData] = useState<ICreatePlan>({
    accessType: PLAN_ACCESS_TYPE.Unlimited,
    name: '',
    price: '',
  });
  const { mutate: assignPlanMutate, isLoading: assignPlanIsLoading } =
    trpc.useMutation('client.assignPlan', {
      onSuccess: async () => {
        toast({
          description: SUCCESS_MESSAGE.PlanAssigned,
          duration: 3000,
          isClosable: true,
          status: 'success',
          variant: 'top-accent',
        });
        setAssignPlanData({
          ci: '',
          endingDate: new Date(),
          name: '',
          startingDate: new Date(),
        });
        await ctx.invalidateQueries('client.getPlans');
        assignPlanOnClose();
      },
      onError: (error) => {
        if (error.data?.zodError?.fieldErrors) {
          for (const [_, value] of Object.entries(
            error.data?.zodError?.fieldErrors
          )) {
            toast({
              description: value,
              duration: 3000,
              isClosable: true,
              status: 'error',
              variant: 'top-accent',
            });
          }
        } else {
          toast({
            description: error.message,
            duration: 3000,
            isClosable: true,
            status: 'error',
            variant: 'top-accent',
          });
        }
      },
    });
  const { mutate: createPlanMutate, isLoading: createPlanIsLoading } =
    trpc.useMutation('plan.create', {
      onSuccess: () => {
        toast({
          description: SUCCESS_MESSAGE.PlanCreated,
          duration: 3000,
          isClosable: true,
          status: 'success',
          variant: 'top-accent',
        });
        setCreatePlanData({
          accessType: PLAN_ACCESS_TYPE.Unlimited,
          name: '',
          price: '',
        });
        createPlanOnClose();
      },
      onError: (error) => {
        if (error.data?.zodError?.fieldErrors) {
          for (const [_, value] of Object.entries(
            error.data?.zodError?.fieldErrors
          )) {
            toast({
              description: value,
              duration: 3000,
              isClosable: true,
              status: 'error',
              variant: 'top-accent',
            });
          }
        } else {
          toast({
            description: error.message,
            duration: 3000,
            isClosable: true,
            status: 'error',
            variant: 'top-accent',
          });
        }
      },
    });

  const handleAssignPlan = () => {
    assignPlanMutate(assignPlanData);
  };

  const handleCreatePlan = () => {
    createPlanMutate(createPlanData);
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
        actionButtonLabel={'Asignar'}
        ariaLabel={NAVBAR_ACTION_BAR_BUTTON_LABEL.AssignPlan}
        icon={<FiUserPlus size={'1.25rem'} />}
        isLoading={assignPlanIsLoading}
        isOpen={assignPlanIsOpen}
        modalBody={
          <AssignPlanModal
            data={assignPlanData}
            isLoading={assignPlanIsLoading}
            setData={setAssignPlanData}
          />
        }
        onActionClick={handleAssignPlan}
        onClose={assignPlanOnClose}
        onOpen={assignPlanOnOpen}
      />
      <NavbarActionBarButton
        actionButtonLabel={'Crear'}
        ariaLabel={NAVBAR_ACTION_BAR_BUTTON_LABEL.CreatePlan}
        icon={<FiFilePlus size={'1.25rem'} />}
        isLoading={createPlanIsLoading}
        isOpen={createPlanIsOpen}
        modalBody={
          <CreatePlanModal
            data={createPlanData}
            isLoading={createPlanIsLoading}
            setData={setCreatePlanData}
          />
        }
        onActionClick={handleCreatePlan}
        onClose={createPlanOnClose}
        onOpen={createPlanOnOpen}
      />
      <NavbarActionBarButton
        actionButtonLabel={'Guardar'}
        ariaLabel={NAVBAR_ACTION_BAR_BUTTON_LABEL.Settings}
        icon={<FiSettings size={'1.25rem'} />}
        isLoading={false}
        isOpen={settingsIsOpen}
        modalBody={<SettingsModal />}
        onActionClick={() => {}}
        onClose={settingsOnClose}
        onOpen={settingsOnOpen}
      />
      <NavbarActionBarButton
        actionButtonLabel={'Cerrar'}
        ariaLabel={NAVBAR_ACTION_BAR_BUTTON_LABEL.SignOut}
        icon={<FiLogOut size={'1.25rem'} />}
        isLoading={false}
        isOpen={signOutPlanIsOpen}
        modalBody={<SignOutModal />}
        onActionClick={handleSignOut}
        onClose={signOutPlanOnClose}
        onOpen={signOutPlanOnOpen}
      />
    </Flex>
  );
};

export default NavbarActionBar;

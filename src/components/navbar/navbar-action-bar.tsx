import { Flex, IconButton, useDisclosure, useToast } from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { FiFilePlus, FiLogOut, FiSettings, FiUserPlus } from 'react-icons/fi';
import { TbFaceId } from 'react-icons/tb';
import { getBaseUrl } from '../../pages/_app';
import {
  ICreatePlan,
  IUpdatePassword,
} from '../../server/common/validation/schemas';
import {
  NAVBAR_ACTION_BAR_BUTTON_LABEL,
  PLAN_ACCESS_TYPE,
  SUCCESS_MESSAGE,
} from '../../utils/constants';
import { trpc } from '../../utils/trpc';
import { useWindowStore } from '../../utils/windowStore';
import AssignPlanModal from '../modals/assign-plan-modal';
import CreatePlanModal from '../modals/create-plan-modal';
import SettingsModal from '../modals/settings-modal';
import SignOutModal from '../modals/sign-out-modal';
import NavbarActionBarButton from './navbar-action-bar-button';

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
    parking: false,
    groupClasses: false,
  });
  const [createPlanData, setCreatePlanData] = useState<ICreatePlan>({
    accessType: PLAN_ACCESS_TYPE.Unlimited,
    name: '',
    price: '',
  });
  const [settingsData, setSettingsData] = useState<IUpdatePassword>({
    newPassword: '',
    repeatedNewPassword: '',
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
          parking: false,
          groupClasses: false,
        });
        assignPlanOnClose();
        await ctx.invalidateQueries('client.getPlans');
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
      onSuccess: async () => {
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
        await ctx.invalidateQueries('plan.getAll');
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
  const { mutate: updatePasswordMutate, isLoading: updatePasswordIsLoading } =
    trpc.useMutation('auth.updatePassword', {
      onSuccess: async () => {
        toast({
          description: SUCCESS_MESSAGE.PasswordUpdated,
          duration: 3000,
          isClosable: true,
          status: 'success',
          variant: 'top-accent',
        });
        settingsOnClose();
        setSettingsData({
          newPassword: '',
          repeatedNewPassword: '',
        });
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

  const handleSettings = () => {
    updatePasswordMutate(settingsData);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/sign-in' });
  };

  const setNewWindow = useWindowStore((state:any) => state.setWindow);

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
      <IconButton
        aria-label={NAVBAR_ACTION_BAR_BUTTON_LABEL.ClientAuthentication}
        icon={<TbFaceId size={'1.25rem'} />}
        onClick={() => {
          const clientAuthWindow = window.open(
            `${getBaseUrl()}/client-authentication`,
            '_blank',
            'width=800,height=600'
          );
          setNewWindow(clientAuthWindow);
        }}
        variant={'ghost'}
      />
      <NavbarActionBarButton
        actionButtonLabel={'Guardar'}
        ariaLabel={NAVBAR_ACTION_BAR_BUTTON_LABEL.Settings}
        icon={<FiSettings size={'1.25rem'} />}
        isLoading={updatePasswordIsLoading}
        isOpen={settingsIsOpen}
        modalBody={
          <SettingsModal
            data={settingsData}
            isLoading={updatePasswordIsLoading}
            setData={setSettingsData}
          />
        }
        onActionClick={handleSettings}
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

import { Flex, IconButton, useDisclosure, useToast } from '@chakra-ui/react';
import { addDays } from 'date-fns';
import { useState } from 'react';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';
import { IEditUserPlan } from '../../../../server/common/validation/schemas';
import {
  SUCCESS_MESSAGE,
  UserPlansTableInfo,
} from '../../../../utils/constants';
import { trpc } from '../../../../utils/trpc';
import CustomModal from '../../../custom/custom-modal';
import DeletePlanModal from '../../../modals/delete-plan-modal';
import EditUserPlanModal from '../../../modals/edit-user-plan-modal';

type UserPlansActionsCellProps = {
  data: UserPlansTableInfo;
};

const UserPlansActionsCell = ({ data }: UserPlansActionsCellProps) => {
  const {
    id,
    startingDate,
    endingDate,
    parking,
    groupClasses,
    freezedDays,
    freezedStartingDate,
  } = data;
  const {
    isOpen: editPlanIsOpen,
    onOpen: editPlanOnOpen,
    onClose: editPlanOnClose,
  } = useDisclosure();
  const {
    isOpen: deletePlanIsOpen,
    onOpen: deletePlanOnOpen,
    onClose: deletePlanOnClose,
  } = useDisclosure();
  const toast = useToast();
  const ctx = trpc.useContext();

  const [editPlanData, setEditPlanData] = useState<IEditUserPlan>({
    id,
    startingDate,
    endingDate,
    parking,
    groupClasses,
    freezedDays: freezedDays.toString(),
    freezedStartingDate: freezedStartingDate ?? new Date(),
  });

  const { isLoading: editPlanIsLoading, mutate: editPlanMutate } =
    trpc.useMutation('client.editPlan', {
      onSuccess: async () => {
        toast({
          description: SUCCESS_MESSAGE.UserPlanUpdated,
          duration: 3000,
          isClosable: true,
          status: 'success',
          variant: 'top-accent',
        });
        editPlanOnClose();
        await ctx.invalidateQueries('client.getPlans');
        await ctx.invalidateQueries('accessHistory.getAll');
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

  const { isLoading: deletePlanIsLoading, mutate: deletePlanMutate } =
    trpc.useMutation('client.deletePlan', {
      onSuccess: async () => {
        toast({
          description: SUCCESS_MESSAGE.UserPlanDeleted,
          duration: 3000,
          isClosable: true,
          status: 'success',
          variant: 'top-accent',
        });
        deletePlanOnClose();
        await ctx.invalidateQueries('client.getPlans');
        await ctx.invalidateQueries('accessHistory.getAll');
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

  return (
    <Flex justifyContent={'flex-end'}>
      <IconButton
        aria-label={'Edit user plan'}
        icon={<FiEdit3 />}
        color={'background'}
        mr={'0.125rem'}
        onClick={() => editPlanOnOpen()}
        size={'sm'}
      />
      <IconButton
        aria-label={'Delete user plan'}
        icon={<FiTrash2 />}
        colorScheme={'red'}
        ml={'0.125rem'}
        onClick={() => deletePlanOnOpen()}
        size={'sm'}
      />
      <CustomModal
        title={'Editar plan de cliente'}
        isLoading={editPlanIsLoading}
        isOpen={editPlanIsOpen}
        onClose={editPlanOnClose}
        body={
          <EditUserPlanModal
            data={editPlanData}
            isLoading={editPlanIsLoading}
            setData={setEditPlanData}
          />
        }
        actionButtonLabel={'Guardar'}
        onActionClick={() => {
          if (
            parseInt(freezedDays) === 0 &&
            parseInt(editPlanData.freezedDays) > 0 &&
            freezedStartingDate === null
          ) {
            editPlanData.endingDate = addDays(
              editPlanData.endingDate,
              parseInt(editPlanData.freezedDays)
            );
          }
          editPlanMutate(editPlanData);
        }}
      />
      <CustomModal
        title={'Eliminar plan de cliente'}
        isLoading={deletePlanIsLoading}
        isOpen={deletePlanIsOpen}
        onClose={deletePlanOnClose}
        body={<DeletePlanModal />}
        actionButtonLabel={'Aceptar'}
        onActionClick={() => deletePlanMutate({ id })}
      />
    </Flex>
  );
};

export default UserPlansActionsCell;

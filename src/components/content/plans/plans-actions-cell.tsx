import { Flex, IconButton, useDisclosure, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';
import { IEditUserPlan } from '../../../server/common/validation/schemas';
import { PlansTableInfo, SUCCESS_MESSAGE } from '../../../utils/constants';
import { trpc } from '../../../utils/trpc';
import CustomModal from '../../custom-modal';
import DeletePlanModal from '../../modals/delete-plan-modal';
import EditPlanModal from '../../modals/edit-plan-modal';

type PlansActionsCellProps = {
  data: PlansTableInfo;
};

const PlansActionsCell = ({ data }: PlansActionsCellProps) => {
  const { id, startingDate, endingDate } = data;
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
        ctx.invalidateQueries('client.getPlans');
        editPlanOnClose();
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
        ctx.invalidateQueries('client.getPlans');
        deletePlanOnClose();
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
          <EditPlanModal
            data={editPlanData}
            isLoading={editPlanIsLoading}
            setData={setEditPlanData}
          />
        }
        actionButtonLabel={'Guardar'}
        onActionClick={() => editPlanMutate(editPlanData)}
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

export default PlansActionsCell;

import { Flex, IconButton, useDisclosure, useToast } from '@chakra-ui/react';
import { Plan } from '@prisma/client';
import { useState } from 'react';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';
import { IEditPlan } from '../../../../server/common/validation/schemas';
import { PLAN_ACCESS_TYPE, SUCCESS_MESSAGE } from '../../../../utils/constants';
import { trpc } from '../../../../utils/trpc';
import CustomModal from '../../../custom/custom-modal';
import DeletePlanModal from '../../../modals/delete-plan-modal';
import EditPlanModal from '../../../modals/edit-plan-modal';

type CreatedPlansActionsCellProps = {
  data: Plan;
};

const CreatedPlansActionsCell = ({ data }: CreatedPlansActionsCellProps) => {
  const { id, accessType: accessTypeString, name, price: priceNumber } = data;
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

  const accessType: PLAN_ACCESS_TYPE = accessTypeString as PLAN_ACCESS_TYPE;
  const price: string = priceNumber.toString();

  const [editPlanData, setEditPlanData] = useState<IEditPlan>({
    id,
    name,
    price,
    accessType,
  });

  const { isLoading: editPlanIsLoading, mutate: editPlanMutate } =
    trpc.useMutation('plan.edit', {
      onSuccess: async () => {
        toast({
          description: SUCCESS_MESSAGE.PlanUpdated,
          duration: 3000,
          isClosable: true,
          status: 'success',
          variant: 'top-accent',
        });
        editPlanOnClose();
        await ctx.invalidateQueries('plan.getAll');
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
    trpc.useMutation('plan.delete', {
      onSuccess: async () => {
        toast({
          description: SUCCESS_MESSAGE.PlanDeleted,
          duration: 3000,
          isClosable: true,
          status: 'success',
          variant: 'top-accent',
        });
        deletePlanOnClose();
        await ctx.invalidateQueries('plan.getAll');
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
        title={'Editar plan'}
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
        title={'Eliminar plan'}
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

export default CreatedPlansActionsCell;

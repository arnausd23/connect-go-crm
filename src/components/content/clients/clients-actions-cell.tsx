import { Flex, IconButton, useDisclosure, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';
import { clearIntervalAsync } from 'set-interval-async';
import { IEditClient } from '../../../server/common/validation/schemas';
import { ClientsTableInfo, SUCCESS_MESSAGE } from '../../../utils/constants';
import { useStore } from '../../../utils/fast-context';
import { trpc } from '../../../utils/trpc';
import CustomModal from '../../custom/custom-modal';
import DeleteClientModal from '../../modals/delete-client-modal';
import EditClientModal from '../../modals/edit-client-modal';

type ClientsActionsCellProps = {
  data: ClientsTableInfo;
};

const ClientsActionsCell = ({ data }: ClientsActionsCellProps) => {
  const { id, name, phoneNumber, ci } = data;
  const {
    isOpen: editClientIsOpen,
    onOpen: editClientOnOpen,
    onClose: editClientOnClose,
  } = useDisclosure();
  const {
    isOpen: deleteClientIsOpen,
    onOpen: deleteClientOnOpen,
    onClose: deleteClientOnClose,
  } = useDisclosure();
  const toast = useToast();
  const ctx = trpc.useContext();

  const [editClientData, setEditClientData] = useState<IEditClient>({
    id,
    name,
    phoneNumber: phoneNumber ?? '',
  });

  const [timer] = useStore((store) => store.timer);

  const { isLoading: editClientIsLoading, mutate: editClientMutate } =
    trpc.useMutation('client.edit', {
      onSuccess: async () => {
        toast({
          description: SUCCESS_MESSAGE.ClientUpdated,
          duration: 3000,
          isClosable: true,
          status: 'success',
          variant: 'top-accent',
        });
        editClientOnClose();
        if (timer) await clearIntervalAsync(timer);
        await ctx.invalidateQueries('labeledFaceDescriptor.getAll');
        await ctx.invalidateQueries('client.getAll');
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

  const { isLoading: deleteClientIsLoading, mutate: deleteClientMutate } =
    trpc.useMutation('client.delete', {
      onSuccess: async () => {
        toast({
          description: SUCCESS_MESSAGE.ClientDeleted,
          duration: 3000,
          isClosable: true,
          status: 'success',
          variant: 'top-accent',
        });
        deleteClientOnClose();
        if (timer) await clearIntervalAsync(timer);
        await ctx.invalidateQueries('labeledFaceDescriptor.getAll');
        await ctx.invalidateQueries('client.getAll');
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
        aria-label={'Edit user'}
        icon={<FiEdit3 />}
        color={'background'}
        mr={'0.125rem'}
        onClick={() => editClientOnOpen()}
        size={'sm'}
      />
      <IconButton
        aria-label={'Delete user'}
        icon={<FiTrash2 />}
        colorScheme={'red'}
        ml={'0.125rem'}
        onClick={() => deleteClientOnOpen()}
        size={'sm'}
      />
      <CustomModal
        title={'Editar cliente'}
        isLoading={editClientIsLoading}
        isOpen={editClientIsOpen}
        onClose={editClientOnClose}
        body={
          <EditClientModal
            data={editClientData}
            isLoading={editClientIsLoading}
            setData={setEditClientData}
          />
        }
        actionButtonLabel={'Guardar'}
        onActionClick={() => editClientMutate(editClientData)}
      />
      <CustomModal
        title={'Eliminar cliente'}
        isLoading={deleteClientIsLoading}
        isOpen={deleteClientIsOpen}
        onClose={deleteClientOnClose}
        body={<DeleteClientModal />}
        actionButtonLabel={'Aceptar'}
        onActionClick={() => deleteClientMutate({ id, ci })}
      />
    </Flex>
  );
};

export default ClientsActionsCell;

import { Flex, IconButton, useDisclosure, useToast } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';
import { IEditClient } from '../../../server/common/validation/schemas';
import {
  ClientsTableInfo,
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
} from '../../../utils/constants';
import { trpc } from '../../../utils/trpc';
import { useWindowStore } from '../../../utils/windowStore';
import CustomModal from '../../custom/custom-modal';
import DeleteClientModal from '../../modals/delete-client-modal';
import EditClientModal from '../../modals/edit-client-modal';
import * as faceapi from 'face-api.js';

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
    photoSrc: '',
    photoTaken: false,
    labeledFaceDescriptor: undefined,
    editPhoto: false,
  });

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
  const newWindow = useWindowStore((state: any) => state.window);

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
        newWindow?.postMessage({ type: 'refetch-descriptors' });
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

  const clientPhotoRef = useRef<HTMLImageElement>();

  const handleEditClient = async () => {
    if (editClientData.editPhoto) {
      if (editClientData.photoTaken && editClientData.photoSrc) {
        const detection = await faceapi
          .detectSingleFace(clientPhotoRef.current!)
          .withFaceLandmarks()
          .withFaceDescriptor();
        if (detection && detection.detection.score > 0.85) {
          editClientMutate({
            ...editClientData,
            labeledFaceDescriptor: detection.descriptor,
          });
        } else {
          toast({
            description: ERROR_MESSAGE.FailedDetection,
            duration: 3000,
            isClosable: true,
            status: 'error',
            variant: 'top-accent',
          });
        }
      }
    } else {
      editClientMutate({ ...editClientData, photoSrc: 'unknown' });
    }
  };

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
            imageRef={clientPhotoRef}
          />
        }
        actionButtonLabel={'Guardar'}
        onActionClick={() => handleEditClient()}
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

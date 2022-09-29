import {
  Flex,
  IconButton,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { ICreateClient } from '../../server/common/validation/schemas';
import {
  NAVBAR_ACTION_BAR_BUTTON_LABEL,
  SUCCESS_MESSAGE,
} from '../../utils/constants';
import { trpc } from '../../utils/trpc';
import CreateClientModal from '../modals/create-client-modal';
import NavbarActionBarButtonModal from '../modals/navbar-action-bar-button-modal';

const NavbarPrimaryActionButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [createClientData, setCreateClientData] = useState<ICreateClient>({
    ci: '',
    name: '',
    phoneNumber: '',
    photoSrc: '',
    photoTaken: false,
  });
  const { isLoading, mutate } = trpc.useMutation('client.create', {
    onSuccess: async () => {
      toast({
        description: SUCCESS_MESSAGE.ClientCreated,
        duration: 3000,
        isClosable: true,
        status: 'success',
        variant: 'top-accent',
      });
      setCreateClientData({
        ci: '',
        name: '',
        phoneNumber: '',
        photoSrc: '',
        photoTaken: false,
      });
      onClose();
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

  const handleCreateClient = () => {
    mutate(createClientData);
  };

  return (
    <Flex
      bgColor={'white'}
      borderRadius={'lg'}
      color={'background'}
      cursor={'pointer'}
      h={'10rem'}
      p={'1rem'}
      shadow={'md'}
    >
      <IconButton
        aria-label={NAVBAR_ACTION_BAR_BUTTON_LABEL.CreateClient}
        h={'100%'}
        icon={
          <Flex
            alignItems={'center'}
            justifyContent={'center'}
            flexDir={'column'}
          >
            <Flex
              alignItems={'center'}
              bgColor={'blue.400'}
              borderRadius={'full'}
              color={'white'}
              h={'3rem'}
              justifyContent={'center'}
              w={'3rem'}
            >
              <FiPlus size={'1.5rem'} />
            </Flex>
            <Text mt={'1rem'} fontSize={'sm'}>
              {'Crear nuevo cliente'}
            </Text>
          </Flex>
        }
        onClick={() => onOpen()}
        variant={'ghost'}
        w={'100%'}
      />
      <NavbarActionBarButtonModal
        title={NAVBAR_ACTION_BAR_BUTTON_LABEL.CreateClient}
        isLoading={isLoading}
        isOpen={isOpen}
        onClose={onClose}
        body={
          <CreateClientModal
            data={createClientData}
            isLoading={isLoading}
            setData={setCreateClientData}
          />
        }
        actionButtonLabel={'Crear'}
        onActionClick={handleCreateClient}
      />
    </Flex>
  );
};

export default NavbarPrimaryActionButton;

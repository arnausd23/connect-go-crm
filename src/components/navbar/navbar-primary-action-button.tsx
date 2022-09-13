import { Flex, IconButton, Text, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { NAVBAR_ACTION_BAR_BUTTON_LABELS } from '../../utils/constants';
import CreateClientModal from '../modals/create-client-modal';
import NavbarActionBarButtonModal from '../modals/navbar-action-bar-button-modal';

const NavbarPrimaryActionButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [createClientData, setCreateClientData] = useState({
    ci: '',
    name: '',
    phoneNumber: '',
  });

  const handleCreateClient = () => {
    setIsLoading(true);
    setTimeout(() => {
      console.log(createClientData);
      setIsLoading(false);
      onClose();
    }, 3000);
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
        aria-label={NAVBAR_ACTION_BAR_BUTTON_LABELS.CreateClient}
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
        title={NAVBAR_ACTION_BAR_BUTTON_LABELS.CreateClient}
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

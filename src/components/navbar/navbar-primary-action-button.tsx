import { Flex, IconButton, Text, useDisclosure } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { NAVBAR_ACTION_BAR_BUTTON_LABELS } from '../../utils/constants';
import NavbarActionBarButtonModal from '../modals/navbar-action-bar-button-modal';

const NavbarPrimaryActionButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
              Crear nuevo cliente
            </Text>
          </Flex>
        }
        onClick={() => onOpen()}
        variant={'ghost'}
        w={'100%'}
      />
      <NavbarActionBarButtonModal
        title={NAVBAR_ACTION_BAR_BUTTON_LABELS.CreateClient}
        isOpen={isOpen}
        onClose={onClose}
        body={<div>body</div>}
      />
    </Flex>
  );
};

export default NavbarPrimaryActionButton;

import { Flex, IconButton, Text } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';

const NavbarPrimaryActionButton = () => {
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
        aria-label={'Create new client'}
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
            <Text mt={'1rem'}>Crear nuevo cliente</Text>
          </Flex>
        }
        variant={'ghost'}
        w={'100%'}
      />
    </Flex>
  );
};

export default NavbarPrimaryActionButton;

import { Flex, Text } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';

const NavbarPrimaryActionButton = () => {
  return (
    <Flex
      alignItems={'center'}
      bgColor={'white'}
      borderRadius={'lg'}
      color={'background'}
      flexDir={'column'}
      h={'10rem'}
      justifyContent={'center'}
      p={'0 1rem'}
      shadow={'sm'}
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
      <Text mt={'0.5rem'}>Crear nuevo cliente</Text>
    </Flex>
  );
};

export default NavbarPrimaryActionButton;

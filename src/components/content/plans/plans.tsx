import { Flex } from '@chakra-ui/react';

const Plans = () => {
  return (
    <Flex
      bgColor={'dark'}
      borderRadius={'lg'}
      flexDir={'column'}
      h={'100%'}
      p={'1.5rem'}
      w={'100%'}
    >
      <Flex bgColor={'light'} h={'3rem'} w={'100%'} mb={'0.125rem'}></Flex>
      <Flex
        border={'1px solid'}
        borderColor={'light'}
        borderRadius={'lg'}
        h={'100%'}
        w={'100%'}
      ></Flex>
    </Flex>
  );
};

export default Plans;

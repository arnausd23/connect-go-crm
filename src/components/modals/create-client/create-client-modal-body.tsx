import { Flex, FormControl, FormLabel, Input } from '@chakra-ui/react';

const CreateClientModalBody = () => {
  return (
    <Flex>
      <Flex flexDir={'column'} w={'40%'}>
        <FormControl mb={'0.5rem'}>
          <FormLabel>Nombre</FormLabel>
          <Input
            bgColor={'white'}
            color={'background'}
            variant={'filled'}
            _focus={{ bgColor: 'white' }}
          />
        </FormControl>
        <FormControl mb={'0.5rem'}>
          <FormLabel>CI</FormLabel>
          <Input
            bgColor={'white'}
            color={'background'}
            type={'number'}
            variant={'filled'}
            _focus={{ bgColor: 'white' }}
          />
        </FormControl>
        <FormControl mb={'0.5rem'}>
          <FormLabel>Celular</FormLabel>
          <Input
            bgColor={'white'}
            color={'background'}
            type={'number'}
            variant={'filled'}
            _focus={{ bgColor: 'white' }}
          />
        </FormControl>
      </Flex>
      <FormControl mb={'0.5rem'} ml={'1.5rem'} w={'60%'}>
        <FormLabel>Foto</FormLabel>
        <Flex
          bgColor={'white'}
          borderRadius={'md'}
          h={'calc(100% - 2rem)'}
        ></Flex>
      </FormControl>
    </Flex>
  );
};

export default CreateClientModalBody;

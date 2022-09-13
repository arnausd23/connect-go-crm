import { Flex, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { NavbarActionBarModalProps } from './navbar-action-bar-button-modal';

const CreateClientModal = ({
  data,
  isLoading,
  setData,
}: NavbarActionBarModalProps) => {
  return (
    <Flex>
      <Flex flexDir={'column'} w={'40%'}>
        <FormControl mb={'0.5rem'}>
          <FormLabel>{'Nombre'}</FormLabel>
          <Input
            bgColor={'white'}
            color={'background'}
            disabled={isLoading}
            onChange={({ target }) => setData!({ ...data, name: target.value })}
            value={data.name}
            variant={'filled'}
            _focus={{ bgColor: 'white' }}
          />
        </FormControl>
        <FormControl mb={'0.5rem'}>
          <FormLabel>{'CI'}</FormLabel>
          <Input
            bgColor={'white'}
            color={'background'}
            disabled={isLoading}
            onChange={({ target }) => setData!({ ...data, ci: target.value })}
            type={'number'}
            value={data.ci}
            variant={'filled'}
            _focus={{ bgColor: 'white' }}
          />
        </FormControl>
        <FormControl mb={'0.5rem'}>
          <FormLabel>{'Celular'}</FormLabel>
          <Input
            bgColor={'white'}
            color={'background'}
            disabled={isLoading}
            onChange={({ target }) =>
              setData!({ ...data, phoneNumber: target.value })
            }
            type={'number'}
            value={data.phoneNumber}
            variant={'filled'}
            _focus={{ bgColor: 'white' }}
          />
        </FormControl>
      </Flex>
      <FormControl mb={'0.5rem'} ml={'1.5rem'} w={'60%'}>
        <FormLabel>{'Foto'}</FormLabel>
        <Flex
          bgColor={'white'}
          borderRadius={'md'}
          h={'calc(100% - 2rem)'}
        ></Flex>
      </FormControl>
    </Flex>
  );
};

export default CreateClientModal;

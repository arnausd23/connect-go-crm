import { Flex, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { CustomModalProps } from '../custom/custom-modal';

const EditClientModal = ({ data, isLoading, setData }: CustomModalProps) => {
  return (
    <Flex flexDir={'column'}>
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
  );
};

export default EditClientModal;

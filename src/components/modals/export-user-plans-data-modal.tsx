import { Flex, FormControl, FormLabel, Input } from '@chakra-ui/react';
import CustomDatePicker from '../custom/custom-date-picker';
import { CustomModalProps } from '../custom/custom-modal';

const ExportClientsDataModal = ({
  data,
  isLoading,
  setData,
}: CustomModalProps) => {
  return (
    <Flex flexDir={'column'}>
      <FormControl mb={'0.5rem'}>
        <FormLabel>{'Nombre'}</FormLabel>
        <Input
          bgColor={'white'}
          color={'background'}
          disabled={isLoading}
          onChange={({ target }) =>
            setData!({ ...data, userName: target.value })
          }
          value={data.userName}
          variant={'filled'}
          _focus={{ bgColor: 'white' }}
        />
      </FormControl>
      <FormControl mb={'0.5rem'}>
        <FormLabel>{'Plan'}</FormLabel>
        <Input
          bgColor={'white'}
          color={'background'}
          disabled={isLoading}
          onChange={({ target }) =>
            setData!({ ...data, planName: target.value })
          }
          value={data.planName}
          variant={'filled'}
          _focus={{ bgColor: 'white' }}
        />
      </FormControl>
      <FormControl color={'background'} mb={'0.5rem'}>
        <FormLabel color={'white'}>{'Fecha inicial'}</FormLabel>
        <CustomDatePicker
          date={data.startingDate}
          disabled={isLoading}
          onChange={(date) => setData!({ ...data, startingDate: date })}
          placeholder={'Fecha inicial'}
        />
      </FormControl>
      <FormControl color={'background'} mb={'0.5rem'}>
        <FormLabel color={'white'}>{'Fecha final'}</FormLabel>
        <CustomDatePicker
          date={data.endingDate}
          disabled={isLoading}
          onChange={(date) => setData!({ ...data, endingDate: date })}
          placeholder={'Fecha final'}
        />
      </FormControl>
      <FormControl mb={'0.5rem'}>
        <FormLabel>{'Nombre del archivo'}</FormLabel>
        <Input
          bgColor={'white'}
          color={'background'}
          disabled={isLoading}
          onChange={({ target }) =>
            setData!({ ...data, fileName: target.value })
          }
          value={data.fileName}
          variant={'filled'}
          _focus={{ bgColor: 'white' }}
        />
      </FormControl>
    </Flex>
  );
};

export default ExportClientsDataModal;

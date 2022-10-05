import { Flex, FormControl, FormLabel } from '@chakra-ui/react';
import CustomDatePicker from '../custom/custom-date-picker';
import { CustomModalProps } from '../custom/custom-modal';

const EditUserPlanModal = ({ data, isLoading, setData }: CustomModalProps) => {
  return (
    <Flex>
      <FormControl color={'background'} mb={'0.5rem'}>
        <FormLabel color={'white'}>{'Fecha inicial'}</FormLabel>
        <CustomDatePicker
          date={data.startingDate}
          disabled={isLoading}
          onChange={(date) => setData!({ ...data, startingDate: date })}
          placeholder={'Fecha inicial'}
        />
      </FormControl>
      <FormControl color={'background'} mb={'0.5rem'} ml={'1.5rem'}>
        <FormLabel color={'white'}>{'Fecha final'}</FormLabel>
        <CustomDatePicker
          date={data.endingDate}
          disabled={isLoading}
          onChange={(date) => setData!({ ...data, endingDate: date })}
          placeholder={'Fecha final'}
        />
      </FormControl>
    </Flex>
  );
};

export default EditUserPlanModal;

import {
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';
import CustomDatePicker from '../custom/custom-date-picker';
import { CustomModalProps } from '../custom/custom-modal';

const EditUserPlanModal = ({ data, isLoading, setData }: CustomModalProps) => {
  return (
    <Flex flexDir={'column'}>
      <Flex>
        <FormControl color={'background'} mb={'0.5rem'} mr={'0.75rem'}>
          <FormLabel color={'white'}>{'Fecha inicial'}</FormLabel>
          <CustomDatePicker
            date={data.startingDate}
            disabled={isLoading}
            onChange={(date) => setData!({ ...data, startingDate: date })}
            placeholder={'Fecha inicial'}
          />
        </FormControl>
        <FormControl color={'background'} mb={'0.5rem'} ml={'0.75rem'}>
          <FormLabel color={'white'}>{'Fecha final'}</FormLabel>
          <CustomDatePicker
            date={data.endingDate}
            disabled={isLoading}
            onChange={(date) => setData!({ ...data, endingDate: date })}
            placeholder={'Fecha final'}
          />
        </FormControl>
      </Flex>
      <Flex>
        <FormControl mb={'0.5rem'} mr={'0.75rem'}>
          <FormLabel>{'Parqueo'}</FormLabel>
          <Checkbox
            isChecked={data.parking}
            onChange={(e) => setData!({ ...data, parking: e.target.checked })}
          />
        </FormControl>
        <FormControl mb={'0.5rem'} ml={'0.75rem'}>
          <FormLabel>{'Clases grupales'}</FormLabel>
          <Checkbox
            isChecked={data.groupClasses}
            onChange={(e) =>
              setData!({ ...data, groupClasses: e.target.checked })
            }
          />
        </FormControl>
      </Flex>
      <Divider mb={'0.5rem'} />
      <FormControl mt={'0.5rem'}>
        <FormLabel fontWeight={'bold'}>{'Congelar plan'}</FormLabel>
      </FormControl>
      <Flex>
        <FormControl mb={'0.5rem'} mr={'0.75rem'}>
          <FormLabel>{'Días'}</FormLabel>
          <Input
            bgColor={'white'}
            color={'background'}
            disabled={isLoading}
            onChange={({ target }) =>
              setData!({ ...data, freezedDays: target.value })
            }
            type={'number'}
            value={data.freezedDays}
            variant={'filled'}
            _focus={{ bgColor: 'white' }}
          />
        </FormControl>
        <FormControl color={'background'} mb={'0.5rem'} ml={'0.75rem'}>
          <FormLabel color={'white'}>{'Desde'}</FormLabel>
          <CustomDatePicker
            date={data.freezedStartingDate}
            disabled={
              data.freezedDays.trim() === '0' ||
              data.freezedDays.trim() === '' ||
              isLoading
            }
            onChange={(date) =>
              setData!({ ...data, freezedStartingDate: date })
            }
            placeholder={'Fecha inicial'}
          />
        </FormControl>
      </Flex>
      <Divider m={'0.5rem 0'} />
      <FormControl m={'0.5rem 0'}>
        <FormLabel>{'Detalles adicionales'}</FormLabel>
        <Textarea
          bgColor={'white'}
          color={'background'}
          disabled={isLoading}
          onChange={({ target }) =>
            setData!({ ...data, additionalInfo: target.value })
          }
          resize={'none'}
          value={data.additionalInfo}
          variant={'filled'}
          _focus={{ bgColor: 'white' }}
        />
      </FormControl>
    </Flex>
  );
};

export default EditUserPlanModal;

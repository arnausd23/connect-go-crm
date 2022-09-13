import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';
import { PLANS } from '../../utils/constants';
import CustomDatePicker from '../custom-date-picker';
import { NavbarActionBarModalProps } from './navbar-action-bar-button-modal';

const AssignPlanModal = ({
  data,
  isLoading,
  setData,
}: NavbarActionBarModalProps) => {
  return (
    <Flex flexDir={'column'}>
      <FormControl mb={'0.5rem'}>
        <FormLabel>{'Plan'}</FormLabel>
        <Select
          bgColor={'white'}
          color={'background'}
          disabled={isLoading}
          onChange={({ target }) => setData!({ ...data, name: target.value })}
          value={data.type}
          variant={'filled'}
          _focus={{ bgColor: 'white' }}
        >
          <option value={PLANS.Monthly}>{PLANS.Monthly}</option>
          <option value={PLANS.ThreePerWeek}>{PLANS.ThreePerWeek}</option>
          <option value={PLANS.Daily}>{PLANS.Daily}</option>
        </Select>
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
      <Flex>
        <FormControl color={'background'} mb={'0.5rem'}>
          <FormLabel color={'white'}>{'Fecha inicial'}</FormLabel>
          <CustomDatePicker
            date={data.startingDate}
            disabled={isLoading}
            onChange={(date) => setData!({ ...data, startingDate: date })}
          />
        </FormControl>
        <FormControl color={'background'} mb={'0.5rem'} ml={'1.5rem'}>
          <FormLabel color={'white'}>{'Fecha final'}</FormLabel>
          <CustomDatePicker
            date={data.endingDate}
            disabled={isLoading}
            onChange={(date) => setData!({ ...data, endingDate: date })}
          />
        </FormControl>
      </Flex>
    </Flex>
  );
};

export default AssignPlanModal;

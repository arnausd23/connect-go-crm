import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';
import { PLANS } from '../../../utils/constants';

const AssignPlanModalBody = () => {
  return (
    <Flex flexDir={'column'}>
      <FormControl mb={'0.5rem'}>
        <FormLabel>{'Plan'}</FormLabel>
        <Select
          bgColor={'white'}
          color={'background'}
          variant={'filled'}
          _focus={{ bgColor: 'white' }}
        >
          <option value={PLANS.Monthly}>{PLANS.Monthly}</option>
          <option value={PLANS.ThreePerWeek}>{PLANS.ThreePerWeek}</option>
          <option value={PLANS.Daily}>{PLANS.Daily}</option>
        </Select>
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
    </Flex>
  );
};

export default AssignPlanModalBody;

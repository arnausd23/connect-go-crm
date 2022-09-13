import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
} from '@chakra-ui/react';
import { PLANS } from '../../utils/constants';
import { NavbarActionBarModalProps } from './navbar-action-bar-button-modal';

const CreatePlanModal = ({
  data,
  isLoading,
  setData,
}: NavbarActionBarModalProps) => {
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
        <FormLabel>{'Plan'}</FormLabel>
        <Select
          bgColor={'white'}
          color={'background'}
          disabled={isLoading}
          onChange={({ target }) => setData!({ ...data, type: target.value })}
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
        <FormLabel>{'Precio'}</FormLabel>
        <InputGroup>
          <InputLeftElement
            pointerEvents={'none'}
            color={'background'}
            children={'Bs.'}
          />
          <Input
            bgColor={'white'}
            color={'background'}
            disabled={isLoading}
            onChange={({ target }) =>
              setData!({ ...data, price: target.value })
            }
            type={'number'}
            value={data.price}
            variant={'filled'}
            _focus={{ bgColor: 'white' }}
          />
        </InputGroup>
      </FormControl>
    </Flex>
  );
};

export default CreatePlanModal;

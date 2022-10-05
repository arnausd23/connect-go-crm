import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
} from '@chakra-ui/react';
import { PLAN_ACCESS_TYPE } from '../../utils/constants';
import { CustomModalProps } from '../custom/custom-modal';

const EditPlanModal = ({ data, isLoading, setData }: CustomModalProps) => {
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
        <FormLabel>{'Tipo de acceso'}</FormLabel>
        <Select
          bgColor={'white'}
          color={'background'}
          disabled={isLoading}
          onChange={({ target }) =>
            setData!({ ...data, accessType: target.value })
          }
          value={data.accessType}
          variant={'filled'}
          _focus={{ bgColor: 'white' }}
        >
          <option value={PLAN_ACCESS_TYPE.Unlimited}>
            {PLAN_ACCESS_TYPE.Unlimited}
          </option>
          <option value={PLAN_ACCESS_TYPE.ThreePerWeek}>
            {PLAN_ACCESS_TYPE.ThreePerWeek}
          </option>
          <option value={PLAN_ACCESS_TYPE.OneSession}>
            {PLAN_ACCESS_TYPE.OneSession}
          </option>
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
              setData!({
                ...data,
                price: target.value,
              })
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

export default EditPlanModal;

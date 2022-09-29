import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { ERROR_MESSAGE } from '../../utils/constants';
import { trpc } from '../../utils/trpc';
import CustomDatePicker from '../custom-date-picker';
import { NavbarActionBarModalProps } from './navbar-action-bar-button-modal';

const AssignPlanModal = ({
  data,
  isLoading,
  setData,
}: NavbarActionBarModalProps) => {
  const toast = useToast();

  useEffect(() => {
    const startingDate = new Date(data.startingDate.valueOf());
    const endingDate = new Date(data.endingDate.valueOf());
    startingDate.setHours(0, 0, 0, 0);
    endingDate.setHours(0, 0, 0, 0);
    setData!({ ...data, startingDate, endingDate });
  }, []);

  const { data: getAllPlansData, isLoading: getAllPlansIsLoading } =
    trpc.useQuery(['plan.getAll'], {
      onSuccess: (result) => {
        if (data.name === '' || !data.name)
          setData!({ ...data, name: result?.at(0)?.name });
      },
      onError: () => {
        toast({
          description: ERROR_MESSAGE.SomethingWentWrong,
          duration: 3000,
          isClosable: true,
          status: 'error',
          variant: 'top-accent',
        });
      },
    });

  return (
    <Flex flexDir={'column'}>
      <FormControl mb={'0.5rem'}>
        <FormLabel>{'Plan'}</FormLabel>
        <Select
          bgColor={'white'}
          color={'background'}
          disabled={isLoading || getAllPlansIsLoading}
          onChange={({ target }) => setData!({ ...data, name: target.value })}
          value={data.name}
          variant={'filled'}
          _focus={{ bgColor: 'white' }}
        >
          {getAllPlansData?.map((plan) => (
            <option key={plan.id} value={plan.name}>
              {plan.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl mb={'0.5rem'}>
        <FormLabel>{'CI cliente'}</FormLabel>
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

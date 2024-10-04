import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Select,
  Switch,
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
          <InputLeftElement pointerEvents={'none'} color={'background'}>
            {'Bs.'}
          </InputLeftElement>
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
      <FormControl mb={'0.5rem'}>
        <Flex alignItems={'center'} justifyContent={'space-between'}>
          <FormLabel>{'Restricción horaria'}</FormLabel>
          <Switch
            id={'hour-restriction'}
            size={'sm'}
            colorScheme='blue'
            isChecked={data.hasHourRestriction}
            onChange={(e) =>
              setData!({ ...data, hasHourRestriction: e.target.checked })
            }
          />
        </Flex>
        {data.hasHourRestriction && (
          <RangeSlider
            mt={'0.5rem'}
            colorScheme={'blue'}
            flex={1}
            focusThumbOnChange={false}
            max={22}
            min={6}
            onChange={(e) =>
              setData!({
                ...data,
                restrictionHours: e,
              })
            }
            step={1}
            value={data.restrictionHours}
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <Flex>
              <RangeSliderThumb fontSize={'xs'} index={0}>
                <Flex mb={'2rem'}>{`${data.restrictionHours[0]}:00`}</Flex>
              </RangeSliderThumb>
              <RangeSliderThumb fontSize={'xs'} index={1}>
                <Flex mt={'2rem'}>{`${data.restrictionHours[1]}:00`}</Flex>
              </RangeSliderThumb>
            </Flex>
          </RangeSlider>
        )}
      </FormControl>
    </Flex>
  );
};

export default EditPlanModal;

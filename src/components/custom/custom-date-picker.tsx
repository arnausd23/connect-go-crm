import { InputGroup, InputRightElement } from '@chakra-ui/react';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import React from 'react';
import { FiCalendar } from 'react-icons/fi';

type DatePickerProps = {
  date: Date | undefined;
  disabled: boolean;
  onChange: (date: Date) => void;
  placeholder: string;
};

const CustomDatePicker = ({
  date,
  disabled,
  onChange,
  placeholder,
}: DatePickerProps) => {
  return (
    <InputGroup>
      <SingleDatepicker
        date={date}
        disabled={disabled}
        configs={{
          dayNames: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
          monthNames: [
            'Ene',
            'Feb',
            'Mar',
            'Abr',
            'May',
            'Jun',
            'Jul',
            'Ago',
            'Sep',
            'Oct',
            'Nov',
            'Dic',
          ],
          dateFormat: 'dd/MM/yyyy',
        }}
        onDateChange={onChange}
        propsConfigs={{
          dateNavBtnProps: {
            colorScheme: 'blue',
            bgColor: 'blue.400',
            fontSize: '14px',
            variant: 'solid',
            color: 'white',
          },
          inputProps: {
            placeholder,
            bgColor: 'white',
            color: 'background',
            variant: 'filled',
            _focus: { bgColor: 'white' },
          },
          dayOfMonthBtnProps: {
            defaultBtnProps: {
              color: 'background',
              colorScheme: 'blue',
              borderColor: 'gray.300',
              fontWeight: 'normal',
              _hover: {
                background: 'blue.500',
                color: 'white',
              },
            },
            selectedBtnProps: {
              bgColor: 'blue.500',
              color: 'white',
            },
            todayBtnProps: {
              borderColor: 'gray.300',
              bgColor: 'blue.100',
              color: 'background',
            },
          },
        }}
      />
      <InputRightElement>
        <FiCalendar />
      </InputRightElement>
    </InputGroup>
  );
};

export default CustomDatePicker;

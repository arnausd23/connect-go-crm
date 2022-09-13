import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import React from 'react';

type DatePickerProps = {
  date: Date;
  disabled: boolean;
  onChange: (date: Date) => void;
};

const CustomDatePicker = ({ date, disabled, onChange }: DatePickerProps) => {
  return (
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
          },
        },
      }}
    />
  );
};

export default CustomDatePicker;

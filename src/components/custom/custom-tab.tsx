import { Flex, Tab, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { CUSTOM_TAB_LABEL } from '../../utils/constants';

type CustomTabProps = {
  icon: ReactNode;
  label: CUSTOM_TAB_LABEL;
};

const CustomTab = ({ icon, label }: CustomTabProps) => {
  return (
    <Tab
      color={'white'}
      border={'2px solid'}
      borderColor={'dark'}
      _selected={{ bg: 'dark', border: '2px solid dark' }}
    >
      <Flex alignItems={'center'}>
        {icon}
        <Text ml={'0.5rem'} fontSize={'sm'}>
          {label}
        </Text>
      </Flex>
    </Tab>
  );
};

export default CustomTab;

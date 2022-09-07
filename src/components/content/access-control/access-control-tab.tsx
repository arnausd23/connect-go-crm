import { Flex, Tab, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { ACCESS_CONTROL_TAB_LABELS } from '../../../utils/constants';

type AccessControlTabProps = {
  icon: ReactNode;
  label: ACCESS_CONTROL_TAB_LABELS;
};

const AccessControlTab = ({ icon, label }: AccessControlTabProps) => {
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

export default AccessControlTab;

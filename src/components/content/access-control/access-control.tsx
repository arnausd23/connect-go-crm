import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { FiClock, FiUserCheck } from 'react-icons/fi';
import AccessHistory from './access-history';
import ClientAuthentication from './client-authentication';

const AccessControl = () => {
  return (
    <Flex h={'100%'} w={'100%'}>
      <Tabs variant={'enclosed'} w={'100%'}>
        <TabList border={'none'}>
          <Tab
            color={'white'}
            border={'2px solid'}
            borderColor={'dark'}
            _selected={{ bg: 'dark', border: '2px solid dark' }}
          >
            <Flex alignItems={'center'}>
              <FiUserCheck />
              <Text ml={'0.5rem'}>{'Autenticación de clientes'}</Text>
            </Flex>
          </Tab>
          <Tab
            color={'white'}
            border={'2px solid'}
            borderColor={'dark'}
            _selected={{ bg: 'dark', border: '2px solid dark' }}
          >
            <Flex alignItems={'center'}>
              <FiClock />
              <Text ml={'0.5rem'}>{'Historial de accesos'}</Text>
            </Flex>
          </Tab>
        </TabList>
        <TabPanels h={'calc(100% - 3rem)'}>
          <TabPanel
            bgColor={'dark'}
            borderRightRadius={'lg'}
            borderBottomLeftRadius={'lg'}
            h={'100%'}
            p={'1.5rem'}
            w={'100%'}
          >
            <ClientAuthentication />
          </TabPanel>
          <TabPanel
            bgColor={'dark'}
            borderRightRadius={'lg'}
            borderBottomLeftRadius={'lg'}
            h={'100%'}
            p={'1.5rem'}
            w={'100%'}
          >
            <AccessHistory />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default AccessControl;

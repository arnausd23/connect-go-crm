import { Flex, TabList, TabPanels, Tabs } from '@chakra-ui/react';
import { FiUsers } from 'react-icons/fi';
import { CUSTOM_TAB_LABEL } from '../../../utils/constants';
import CustomTab from '../../custom-tab';
import CustomTabPanel from '../../custom-tab-panel';
import ClientsPanel from './clients-panel';

const Clients = () => {
  return (
    <Flex h={'100%'} w={'100%'}>
      <Tabs variant={'enclosed'} w={'100%'}>
        <TabList border={'none'}>
          <CustomTab icon={<FiUsers />} label={CUSTOM_TAB_LABEL.Clients} />
        </TabList>
        <TabPanels h={'calc(100% - 2.4rem)'}>
          <CustomTabPanel body={<ClientsPanel />} />
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default Clients;

import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiClock, FiUserCheck } from 'react-icons/fi';
import NewWindow from 'react-new-window';
import { CUSTOM_TAB_LABEL } from '../../../utils/constants';
import CustomTab from '../../custom-tab';
import CustomTabPanel from '../../custom-tab-panel';
import AccessHistoryPanel from './access-history/access-history-panel';
import ClientAuthenticationPanel from './client-authentication/client-authentication-panel';

const AccessControl = () => {
  return (
    <Flex h={'100%'} w={'100%'}>
      <Tabs variant={'enclosed'} w={'100%'}>
        <TabList border={'none'}>
          <CustomTab
            icon={<FiUserCheck />}
            label={CUSTOM_TAB_LABEL.ClientAuthentication}
          />
          <CustomTab
            icon={<FiClock />}
            label={CUSTOM_TAB_LABEL.AccessHistory}
          />
        </TabList>
        <TabPanels h={'calc(100% - 2.4rem)'}>
          <CustomTabPanel body={<ClientAuthenticationPanel />} />
          <CustomTabPanel body={<AccessHistoryPanel />} />
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default AccessControl;

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
import { ACCESS_CONTROL_TAB_LABEL } from '../../../utils/constants';
import AccessControlTab from './access-control-tab';
import AccessControlTabPanel from './access-control-tab-panel';
import AccessHistoryPanel from './access-history-panel';
import ClientAuthenticationPanel from './client-authentication/client-authentication-panel';

const AccessControl = () => {
  return (
    <Flex h={'100%'} w={'100%'}>
      <Tabs variant={'enclosed'} w={'100%'}>
        <TabList border={'none'}>
          <AccessControlTab
            icon={<FiUserCheck />}
            label={ACCESS_CONTROL_TAB_LABEL.ClientAuthentication}
          />
          <AccessControlTab
            icon={<FiClock />}
            label={ACCESS_CONTROL_TAB_LABEL.AccessHistory}
          />
        </TabList>
        <TabPanels h={'calc(100% - 3rem)'}>
          <AccessControlTabPanel body={<ClientAuthenticationPanel />} />
          <AccessControlTabPanel body={<AccessHistoryPanel />} />
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default AccessControl;

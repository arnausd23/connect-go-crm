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
import { ACCESS_CONTROL_TAB_LABELS } from '../../../utils/constants';
import AccessControlTab from './access-control-tab';
import AccessControlTabPanel from './access-control-tab-panel';
import AccessHistory from './access-history';
import ClientAuthentication from './client-authentication';

const AccessControl = () => {
  return (
    <Flex h={'100%'} w={'100%'}>
      <Tabs variant={'enclosed'} w={'100%'}>
        <TabList border={'none'}>
          <AccessControlTab
            icon={<FiUserCheck />}
            label={ACCESS_CONTROL_TAB_LABELS.ClientAuthentication}
          />
          <AccessControlTab
            icon={<FiClock />}
            label={ACCESS_CONTROL_TAB_LABELS.AccessHistory}
          />
        </TabList>
        <TabPanels h={'calc(100% - 3rem)'}>
          <AccessControlTabPanel body={<ClientAuthentication />} />
          <AccessControlTabPanel body={<AccessHistory />} />
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default AccessControl;

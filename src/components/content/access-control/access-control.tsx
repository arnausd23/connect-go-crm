import { Flex, TabList, TabPanels, Tabs } from '@chakra-ui/react';
import { FiClock } from 'react-icons/fi';
import { CUSTOM_TAB_LABEL } from '../../../utils/constants';
import CustomTab from '../../custom/custom-tab';
import CustomTabPanel from '../../custom/custom-tab-panel';
import AccessHistoryPanel from './access-history/access-history-panel';

const AccessControl = () => {
  return (
    <Flex h={'100%'} w={'100%'}>
      <Tabs variant={'enclosed'} w={'100%'}>
        <TabList border={'none'}>
          <CustomTab
            icon={<FiClock />}
            label={CUSTOM_TAB_LABEL.AccessHistory}
          />
        </TabList>
        <TabPanels h={'calc(100% - 2.4rem)'}>
          <CustomTabPanel body={<AccessHistoryPanel />} />
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default AccessControl;

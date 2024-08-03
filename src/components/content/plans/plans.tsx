import { Flex, TabList, TabPanels, Tabs } from '@chakra-ui/react';
import { FiFileText, FiLink } from 'react-icons/fi';
import { CUSTOM_TAB_LABEL } from '../../../utils/constants';
import CustomTab from '../../custom/custom-tab';
import CustomTabPanel from '../../custom/custom-tab-panel';
import CreatedPlansPanel from './created-plans/created-plans-panel';
import UserPlansPanel from './user-plans/user-plans-panel';

const Plans = () => {
  return (
    <Flex h={'100%'} w={'100%'}>
      <Tabs variant={'enclosed'} w={'100%'}>
        <TabList border={'none'}>
          <CustomTab icon={<FiLink />} label={CUSTOM_TAB_LABEL.UserPlans} />
          <CustomTab
            icon={<FiFileText />}
            label={CUSTOM_TAB_LABEL.CreatedPlans}
          />
        </TabList>
        <TabPanels h={'calc(100% - 2.4rem)'}>
          <CustomTabPanel body={<UserPlansPanel />} />
          <CustomTabPanel body={<CreatedPlansPanel />} />
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default Plans;

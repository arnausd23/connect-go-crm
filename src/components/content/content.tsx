import { Flex, TabPanel, TabPanels } from '@chakra-ui/react';
import AccessControl from './access-control/access-control';
import Clients from './clients/clients';
import Plans from './plans/plans';

const Content = () => {
  return (
    <Flex h={'100%'} p={'1.5rem'} w={'100%'}>
      <Flex h={'100%'} w={'100%'}>
        <TabPanels display={'flex'}>
          <TabPanel p={'0'} w={'100%'}>
            <AccessControl />
          </TabPanel>
          <TabPanel p={'0'} w={'100%'}>
            <Plans />
          </TabPanel>
          <TabPanel p={'0'} w={'100%'}>
            <Clients />
          </TabPanel>
        </TabPanels>
      </Flex>
    </Flex>
  );
};

export default Content;

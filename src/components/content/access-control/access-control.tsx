import { Flex, TabList, TabPanels, Tabs } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { FiClock, FiUserCheck } from 'react-icons/fi';
import { FrameStyles, Window } from 'react-mirror';
import { CUSTOM_TAB_LABEL } from '../../../utils/constants';
import { useStore } from '../../../utils/fast-context';
import CustomTab from '../../custom/custom-tab';
import CustomTabPanel from '../../custom/custom-tab-panel';
import AccessHistoryPanel from './access-history/access-history-panel';
import ClientAuthenticationPanel from './client-authentication/client-authentication-panel';

const AccessControl = () => {
  const [openNewWindow, setStore] = useStore((store) => store.openNewWindow);

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
          <CustomTabPanel
            body={<ClientAuthenticationPanel isNewWindow={false} />}
          />
          <CustomTabPanel body={<AccessHistoryPanel />} />
        </TabPanels>
        {openNewWindow && (
          <Window
            target={CUSTOM_TAB_LABEL.ClientAuthentication}
            features={{ width: 800, height: 600 }}
            onClose={(): void => setStore({ openNewWindow: false })}
          >
            <FrameStyles />
            <ClientAuthenticationPanel isNewWindow={true} />
          </Window>
        )}
      </Tabs>
    </Flex>
  );
};

export default AccessControl;

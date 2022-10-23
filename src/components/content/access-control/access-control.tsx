import { Flex, TabList, TabPanels, Tabs } from '@chakra-ui/react';
import { FiClock, FiUserCheck } from 'react-icons/fi';
import { FrameStyles, Window } from 'react-mirror';
import { CUSTOM_TAB_LABEL } from '../../../utils/constants';
import {
  AuthenticationMessageProvider,
  DetectionBoxProvider,
  useNewWindowStore,
} from '../../../utils/fast-context';
import CustomTab from '../../custom/custom-tab';
import CustomTabPanel from '../../custom/custom-tab-panel';
import AccessHistoryPanel from './access-history/access-history-panel';
import ClientAuthenticationPanel from './client-authentication/client-authentication-panel';

const AccessControl = () => {
  const [isOpen, setNewWindowStore] = useNewWindowStore(
    (store) => store.isOpen
  );

  return (
    <Flex h={'100%'} w={'100%'}>
      <DetectionBoxProvider>
        <AuthenticationMessageProvider>
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
            {isOpen && (
              <Window
                target={CUSTOM_TAB_LABEL.ClientAuthentication}
                features={{ width: 800, height: 600 }}
                onClose={(): void => setNewWindowStore({ isOpen: false })}
              >
                <FrameStyles />
                <ClientAuthenticationPanel isNewWindow={true} />
              </Window>
            )}
          </Tabs>
        </AuthenticationMessageProvider>
      </DetectionBoxProvider>
    </Flex>
  );
};

export default AccessControl;

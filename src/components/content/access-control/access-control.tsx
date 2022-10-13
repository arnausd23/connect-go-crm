import { Flex, TabList, TabPanels, Tabs } from '@chakra-ui/react';
import { createContext, useState } from 'react';
import { FiClock, FiUserCheck } from 'react-icons/fi';
import { FrameStyles, Window } from 'react-mirror';
import {
  ClientAuthenticationContext,
  ClientAuthenticationInfo,
  CUSTOM_TAB_LABEL,
  DetectionBoxInfo,
} from '../../../utils/constants';
import CustomTab from '../../custom/custom-tab';
import CustomTabPanel from '../../custom/custom-tab-panel';
import AccessHistoryPanel from './access-history/access-history-panel';
import ClientAuthenticationPanel from './client-authentication/client-authentication-panel';

const AccessControl = () => {
  const [openClientAuth, setOpenClientAuth] = useState<boolean>(false);
  const [showAccessAuthenticationMessage, setShowAccessAuthenticationMessage] =
    useState<boolean>(false);
  const [accessAuthenticationInfo, setAccessAuthenticationInfo] =
    useState<ClientAuthenticationInfo>({
      bgColor: 'authGreen',
      endingDate: undefined,
      footer: undefined,
      header: undefined,
      name: undefined,
      startingDate: undefined,
    });
  const [isClientAuthReady, setIsClientAuthReady] = useState<boolean>(false);
  const [showDetectionBox, setShowDetectionBox] = useState<boolean>(false);
  const [detectionBoxInfo, setDetectionBoxInfo] = useState<DetectionBoxInfo>({
    x: 0,
    y: 0,
    h: 0,
    w: 0,
    color: '#ef5350',
    originHeight: 0,
    originWidth: 0,
  });
  const [newWindowRef, setNewWindowRef] = useState<any>(null);

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
            body={
              <AccessControlContext.Provider
                value={{
                  isNewWindow: false,
                  openClientAuth: openClientAuth,
                  setOpenClientAuth: setOpenClientAuth,
                  showAccessAuthenticationMessage:
                    showAccessAuthenticationMessage,
                  setShowAccessAuthenticationMessage:
                    setShowAccessAuthenticationMessage,
                  accessAuthenticationInfo: accessAuthenticationInfo,
                  setAccessAuthenticationInfo: setAccessAuthenticationInfo,
                  isClientAuthReady: isClientAuthReady,
                  setIsClientAuthReady: setIsClientAuthReady,
                  showDetectionBox: showDetectionBox,
                  setShowDetectionBox: setShowDetectionBox,
                  detectionBoxInfo: detectionBoxInfo,
                  setDetectionBoxInfo: setDetectionBoxInfo,
                  newWindowRef: newWindowRef,
                  setNewWindowRef: setNewWindowRef,
                }}
              >
                <ClientAuthenticationPanel />
              </AccessControlContext.Provider>
            }
          />
          <CustomTabPanel body={<AccessHistoryPanel />} />
        </TabPanels>
        {openClientAuth && (
          <Window
            target={CUSTOM_TAB_LABEL.ClientAuthentication}
            features={{ width: 800, height: 600 }}
            onClose={(): void => setOpenClientAuth(false)}
          >
            <FrameStyles />
            <AccessControlContext.Provider
              value={{
                isNewWindow: true,
                openClientAuth: openClientAuth,
                setOpenClientAuth: setOpenClientAuth,
                showAccessAuthenticationMessage:
                  showAccessAuthenticationMessage,
                setShowAccessAuthenticationMessage:
                  setShowAccessAuthenticationMessage,
                accessAuthenticationInfo: accessAuthenticationInfo,
                setAccessAuthenticationInfo: setAccessAuthenticationInfo,
                isClientAuthReady: isClientAuthReady,
                setIsClientAuthReady: setIsClientAuthReady,
                showDetectionBox: showDetectionBox,
                setShowDetectionBox: setShowDetectionBox,
                detectionBoxInfo: detectionBoxInfo,
                setDetectionBoxInfo: setDetectionBoxInfo,
                newWindowRef: newWindowRef,
                setNewWindowRef: setNewWindowRef,
              }}
            >
              <ClientAuthenticationPanel />
            </AccessControlContext.Provider>
          </Window>
        )}
      </Tabs>
    </Flex>
  );
};

export default AccessControl;

export const AccessControlContext = createContext<ClientAuthenticationContext>(
  {}
);

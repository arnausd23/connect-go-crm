import { Flex, TabList, TabPanels, Tabs } from '@chakra-ui/react';
import { useState } from 'react';
import { FiClock, FiUserCheck } from 'react-icons/fi';
import { FrameStyles, Window } from 'react-mirror';
import {
  ClientAuthenticationInfo,
  CUSTOM_TAB_LABEL,
  FaceDetectionBox,
} from '../../../utils/constants';
import CustomTab from '../../custom/custom-tab';
import CustomTabPanel from '../../custom/custom-tab-panel';
import AccessHistoryPanel from './access-history/access-history-panel';
import ClientAuthenticationPanel from './client-authentication/client-authentication-panel';

const AccessControl = () => {
  const [openClientAuth, setOpenClientAuth] = useState(false);
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
  const [faceDetectionBox, setFaceDetectionBox] = useState<FaceDetectionBox>({
    x: undefined,
    y: undefined,
    height: undefined,
    width: undefined,
  });
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
              <ClientAuthenticationPanel
                setOpenClientAuth={setOpenClientAuth}
                isNewWindow={false}
                showAccessAuthenticationMessage={
                  showAccessAuthenticationMessage
                }
                setShowAccessAuthenticationMessage={
                  setShowAccessAuthenticationMessage
                }
                accessAuthenticationInfo={accessAuthenticationInfo}
                setAccessAuthenticationInfo={setAccessAuthenticationInfo}
                faceDetectionBox={faceDetectionBox}
                setFaceDetectionBox={setFaceDetectionBox}
              />
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
            <ClientAuthenticationPanel
              setOpenClientAuth={setOpenClientAuth}
              isNewWindow={true}
              showAccessAuthenticationMessage={showAccessAuthenticationMessage}
              setShowAccessAuthenticationMessage={
                setShowAccessAuthenticationMessage
              }
              accessAuthenticationInfo={accessAuthenticationInfo}
              setAccessAuthenticationInfo={setAccessAuthenticationInfo}
              faceDetectionBox={faceDetectionBox}
              setFaceDetectionBox={setFaceDetectionBox}
            />
          </Window>
        )}
      </Tabs>
    </Flex>
  );
};

export default AccessControl;

import { Flex } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useState } from 'react';
import ClientAuthenticationPanel from '../components/content/access-control/client-authentication/client-authentication-panel';
import { ClientAuthenticationInfo } from '../utils/constants';

const ClientAuth: NextPage = () => {
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

  return (
    <Flex bgColor={'background'} h={'100vh'} w={'100%'}>
      <ClientAuthenticationPanel
        setOpenClientAuth={setOpenClientAuth}
        isNewWindow={false}
        showAccessAuthenticationMessage={showAccessAuthenticationMessage}
        setShowAccessAuthenticationMessage={setShowAccessAuthenticationMessage}
        accessAuthenticationInfo={accessAuthenticationInfo}
        setAccessAuthenticationInfo={setAccessAuthenticationInfo}
      />
    </Flex>
  );
};

export default ClientAuth;

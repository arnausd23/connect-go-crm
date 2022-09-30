import { Flex, IconButton } from '@chakra-ui/react';
import { useState } from 'react';
import { FiMaximize } from 'react-icons/fi';
import { AccessAuthenticationInfo } from '../../../../utils/constants';
import AccessAuthenticationMessage from './access-authentication-message';
import ClientAuthentication from './client-authentication';

const ClientAuthenticationPanel = () => {
  const [showAccessAuthenticationMessage, setShowAccessAuthenticationMessage] =
    useState<boolean>(false);
  const [accessAuthenticationInfo, setAccessAuthenticationInfo] =
    useState<AccessAuthenticationInfo>({
      bgColor: '#66BB6A',
      endingDate: undefined,
      footer: undefined,
      header: undefined,
      name: undefined,
      startingDate: undefined,
    });
  const { bgColor, endingDate, footer, header, name, startingDate } =
    accessAuthenticationInfo;

  return (
    <Flex
      bgColor={'light'}
      borderRadius={'lg'}
      h={'100%'}
      justifyContent={'center'}
      overflow={'hidden'}
      position={'relative'}
      w={'100%'}
    >
      <ClientAuthentication
        setAccessAuthenticationInfo={setAccessAuthenticationInfo}
        setShowAccessAuthenticationMessage={setShowAccessAuthenticationMessage}
      />
      <IconButton
        aria-label={'Fullscreen'}
        bottom={0}
        icon={<FiMaximize size={'1.25rem'} />}
        m={'0.5rem'}
        // onClick={() => setIsOpen(true)}
        position={'absolute'}
        right={0}
        variant={'ghost'}
      />
      {showAccessAuthenticationMessage ? (
        <AccessAuthenticationMessage
          bgColor={bgColor}
          endingDate={endingDate}
          footer={footer}
          header={header}
          name={name}
          startingDate={startingDate}
        />
      ) : undefined}
    </Flex>
  );
};

export default ClientAuthenticationPanel;

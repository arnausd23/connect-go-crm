import { CircularProgress, Flex, IconButton } from '@chakra-ui/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Dispatch, SetStateAction, useState } from 'react';
import { FiMaximize } from 'react-icons/fi';
import { ClientAuthenticationInfo } from '../../../../utils/constants';
import ClientAuthentication from './client-authentication';
import ClientAuthenticationMessage from './client-authentication-message';

type ClientAuthenticationPanelProps = {
  setOpenClientAuth: Dispatch<SetStateAction<boolean>>;
  isNewWindow: boolean;
  showAccessAuthenticationMessage: boolean;
  setShowAccessAuthenticationMessage: Dispatch<SetStateAction<boolean>>;
  accessAuthenticationInfo: ClientAuthenticationInfo;
  setAccessAuthenticationInfo: Dispatch<
    SetStateAction<ClientAuthenticationInfo>
  >;
};

const ClientAuthenticationPanel = ({
  setOpenClientAuth,
  isNewWindow,
  showAccessAuthenticationMessage,
  setShowAccessAuthenticationMessage,
  accessAuthenticationInfo,
  setAccessAuthenticationInfo,
}: ClientAuthenticationPanelProps) => {
  const { bgColor, endingDate, footer, header, name, startingDate } =
    accessAuthenticationInfo;
  const [ref] = useAutoAnimate<HTMLDivElement>();
  const [isClientAuthReady, setIsClientAuthReady] = useState<boolean>(false);

  return (
    <Flex
      bgColor={'light'}
      borderRadius={'lg'}
      h={'100%'}
      justifyContent={'center'}
      overflow={'hidden'}
      position={'relative'}
      w={'100%'}
      ref={ref}
    >
      <ClientAuthentication
        setAccessAuthenticationInfo={setAccessAuthenticationInfo}
        setShowAccessAuthenticationMessage={setShowAccessAuthenticationMessage}
        isNewWindow={isNewWindow}
        isClientAuthReady={isClientAuthReady}
        setIsClientAuthReady={setIsClientAuthReady}
      />
      {!isNewWindow && (
        <Flex bottom={0} m={'0.5rem'} position={'absolute'} right={0}>
          {isClientAuthReady ? (
            <IconButton
              aria-label={'Fullscreen'}
              disabled={!isClientAuthReady}
              icon={<FiMaximize size={'1.25rem'} />}
              onClick={() => setOpenClientAuth(true)}
              variant={'ghost'}
            />
          ) : (
            <CircularProgress
              color={'blue.400'}
              isIndeterminate={true}
              size={'2rem'}
            />
          )}
        </Flex>
      )}
      {showAccessAuthenticationMessage ? (
        <ClientAuthenticationMessage
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

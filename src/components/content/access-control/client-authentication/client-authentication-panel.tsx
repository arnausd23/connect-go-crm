import { CircularProgress, Flex, IconButton } from '@chakra-ui/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useContext } from 'react';
import { FiMaximize } from 'react-icons/fi';
import { AccessControlContext } from '../access-control';
import ClientAuthentication from './client-authentication';
import ClientAuthenticationDetectionBox from './client-authentication-detection-box';
import ClientAuthenticationMessage from './client-authentication-message';

const ClientAuthenticationPanel = () => {
  const {
    isClientAuthReady,
    isNewWindow,
    setOpenNewWindow,
    showAccessAuthenticationMessage,
    showDetectionBox,
  } = useContext(AccessControlContext);
  const [ref] = useAutoAnimate<HTMLDivElement>();

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
      <ClientAuthentication />
      {!isNewWindow && (
        <Flex bottom={'0px'} m={'0.5rem'} position={'absolute'} right={'0px'}>
          {isClientAuthReady ? (
            <IconButton
              aria-label={'Fullscreen'}
              disabled={!isClientAuthReady}
              icon={<FiMaximize size={'1.25rem'} />}
              onClick={() => setOpenNewWindow!(true)}
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
      {showDetectionBox ? <ClientAuthenticationDetectionBox /> : undefined}
      {true ? <ClientAuthenticationMessage /> : undefined}
    </Flex>
  );
};

export default ClientAuthenticationPanel;

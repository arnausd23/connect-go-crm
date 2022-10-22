import { CircularProgress, Flex, IconButton } from '@chakra-ui/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useEffect } from 'react';
import { FiMaximize } from 'react-icons/fi';
import { useStore } from '../../../../utils/fast-context';
import ClientAuthentication from './client-authentication';
import ClientAuthenticationDetectionBox from './client-authentication-detection-box';
import ClientAuthenticationMessage from './client-authentication-message';

const ClientAuthenticationPanel = ({
  isNewWindow,
}: {
  isNewWindow: boolean;
}) => {
  const [ref] = useAutoAnimate<HTMLDivElement>();

  const [{ showBox, isReadyToOpen, showMessage }, setStore] = useStore(
    (store) => store
  );

  useEffect(() => {
    console.log('panel rendered');
  });
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
      <ClientAuthentication isNewWindow={isNewWindow} />
      {!isNewWindow && (
        <Flex bottom={'0px'} m={'0.5rem'} position={'absolute'} right={'0px'}>
          {isReadyToOpen ? (
            <IconButton
              aria-label={'Fullscreen'}
              disabled={!isReadyToOpen}
              icon={<FiMaximize size={'1.25rem'} />}
              onClick={() => setStore({ openNewWindow: true })}
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
      {showBox ? (
        <ClientAuthenticationDetectionBox isNewWindow={isNewWindow} />
      ) : undefined}
      {showMessage ? <ClientAuthenticationMessage /> : undefined}
    </Flex>
  );
};

export default ClientAuthenticationPanel;

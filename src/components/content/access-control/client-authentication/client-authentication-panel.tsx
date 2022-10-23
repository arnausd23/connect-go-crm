import { Flex, IconButton } from '@chakra-ui/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { FiMaximize } from 'react-icons/fi';
import { useNewWindowStore } from '../../../../utils/fast-context';
import ClientAuthentication from './client-authentication';
import ClientAuthenticationDetectionBox from './client-authentication-detection-box';
import ClientAuthenticationMessage from './client-authentication-message';

const ClientAuthenticationPanel = ({
  isNewWindow,
}: {
  isNewWindow: boolean;
}) => {
  const [ref] = useAutoAnimate<HTMLDivElement>();

  const [isReadyToOpen, setNewWindowStore] = useNewWindowStore(
    (store) => store.isReadyToOpen
  );

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
          <IconButton
            aria-label={'Fullscreen'}
            disabled={!isReadyToOpen}
            icon={<FiMaximize size={'1.25rem'} />}
            onClick={() => setNewWindowStore({ isOpen: true })}
            variant={'ghost'}
          />
        </Flex>
      )}
      <ClientAuthenticationDetectionBox isNewWindow={isNewWindow} />
      <ClientAuthenticationMessage />
    </Flex>
  );
};

export default ClientAuthenticationPanel;

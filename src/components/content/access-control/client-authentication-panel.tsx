import { Flex, IconButton } from '@chakra-ui/react';
import { FiMaximize } from 'react-icons/fi';
import ClientAuthentication from './client-authentication';

const ClientAuthenticationPanel = () => {
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
      <ClientAuthentication />
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
    </Flex>
  );
};

export default ClientAuthenticationPanel;

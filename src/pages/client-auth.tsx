import { Flex } from '@chakra-ui/react';
import { NextPage } from 'next';
import ClientAuthentication from '../components/content/access-control/client-authentication';

const ClientAuth: NextPage = () => {
  return (
    <Flex bgColor={'background'} h={'100vh'} w={'100%'}>
      {/* <ClientAuthentication /> */}
    </Flex>
  );
};

export default ClientAuth;

import { Flex, Tabs } from '@chakra-ui/react';
import type { GetServerSideProps, NextPage } from 'next';
import { createContext, useState } from 'react';
import Content from '../components/content/content';
import Navbar from '../components/navbar/navbar';
import { getServerAuthSession } from '../server/common/get-server-auth-session';
import { IntervalContext } from '../utils/constants';
import { Provider } from '../utils/fast-context';

const Home: NextPage = () => {
  return (
    <Flex bgColor={'background'} h={'100vh'} w={'100%'}>
      <Provider>
        <Tabs display='flex' w={'100%'}>
          <Navbar />
          <Content />
        </Tabs>
      </Provider>
    </Flex>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerAuthSession({ req, res });
  if (!session) {
    return {
      redirect: { destination: '/sign-in', permanent: false },
      props: {},
    };
  }
  return { props: { session } };
};

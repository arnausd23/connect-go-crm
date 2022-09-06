import { Box } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const { data } = trpc.useQuery(['example.hello', { text: 'from tRPC' }]);

  return (
    <>
      <Head>
        <title>Connect CRM</title>
        <meta name='description' content='Connect CRM' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Box>{data ? <p>{data.greeting}</p> : <p>Loading...</p>}</Box>
    </>
  );
};

export default Home;

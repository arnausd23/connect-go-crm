import { Flex } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Navbar from '../components/navbar/navbar';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Connect CRM</title>
        <meta name='description' content='Connect CRM' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Flex bgColor={'background'} h={'100vh'} w={'100%'}>
        <Navbar />
        body
      </Flex>
    </>
  );
};

export default Home;

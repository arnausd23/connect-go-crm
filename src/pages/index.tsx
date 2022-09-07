import { Flex } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import Content from '../components/content/content';
import Navbar from '../components/navbar/navbar';
import { SECTIONS } from '../utils/constants';

const Home: NextPage = () => {
  const [currentSection, setCurrentSection] = useState<SECTIONS>(
    SECTIONS.AccessControl
  );

  return (
    <>
      <Head>
        <title>Connect CRM</title>
        <meta name='description' content='Connect CRM' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Flex bgColor={'background'} h={'100vh'} w={'100%'}>
        <Navbar
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
        />
        <Content currentSection={currentSection} />
      </Flex>
    </>
  );
};

export default Home;

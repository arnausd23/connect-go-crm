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
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Poppins&display=swap'
          rel='stylesheet'
        />
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

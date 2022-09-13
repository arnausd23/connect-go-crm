import { Flex } from '@chakra-ui/react';
import type { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import Content from '../components/content/content';
import Navbar from '../components/navbar/navbar';
import { getServerAuthSession } from '../server/common/get-server-auth-session';
import { SECTIONS } from '../utils/constants';

const Home: NextPage = () => {
  const [currentSection, setCurrentSection] = useState<SECTIONS>(
    SECTIONS.AccessControl
  );

  return (
    <Flex bgColor={'background'} h={'100vh'} w={'100%'}>
      <Navbar
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />
      <Content currentSection={currentSection} />
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

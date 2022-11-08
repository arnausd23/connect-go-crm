import { Flex, Tabs } from '@chakra-ui/react';
import type { GetServerSideProps, NextPage } from 'next';
import { useEffect } from 'react';
import Content from '../components/content/content';
import Navbar from '../components/navbar/navbar';
import { getServerAuthSession } from '../server/common/get-server-auth-session';
import { useTimerStore } from '../utils/fast-context';
import * as faceapi from 'face-api.js';

const Home: NextPage = () => {
  const [_, setTimerStore] = useTimerStore((store) => store.areModelsLoaded);

  const loadFaceapiModels = async () => {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    ]);
  };

  useEffect(() => {
    (async () => {
      await loadFaceapiModels();
      setTimerStore({ areModelsLoaded: true });
    })();
  }, []);

  return (
    <Flex bgColor={'background'} h={'100vh'} w={'100%'}>
      <Tabs display='flex' w={'100%'}>
        <Navbar />
        <Content />
      </Tabs>
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

import { Flex, Tabs } from '@chakra-ui/react';
import type { GetServerSideProps, NextPage } from 'next';
import Content from '../components/content/content';
import Navbar from '../components/navbar/navbar';
import { getServerAuthSession } from '../server/common/get-server-auth-session';
import * as faceapi from 'face-api.js';
import { trpc } from '../utils/trpc';
import { getBaseUrl } from './_app';

const Home: NextPage = () => {
  const loadFaceapiModels = async () => {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    ]);
  };
  const ctx = trpc.useContext();

  trpc.useQuery(['labeledFaceDescriptor.loadModels'], {
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    onSuccess: async () => {
      window.addEventListener('message', (event) => {
        if (event.origin.startsWith(getBaseUrl())) {
          if (!event.data.type) return;
          if (event.data.type !== 'refetch-access-history') return;
          ctx.invalidateQueries('accessHistory.getAll');
        } else {
          return;
        }
      });
      await loadFaceapiModels();
    },
  });

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

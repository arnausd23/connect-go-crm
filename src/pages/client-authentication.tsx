import { Flex, useToast } from '@chakra-ui/react';
import * as faceapi from 'face-api.js';
import { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { setIntervalAsync } from 'set-interval-async';
import ClientAuthenticationMessage from '../components/content/access-control/client-authentication/client-authentication-message';
import {
  AuthenticationMessageState,
  delay,
  ERROR_MESSAGE,
  FACE_MATCH_DISTANCE_THRESHOLD,
} from '../utils/constants';
import { useTimerStore } from '../utils/fast-context';
import { trpc } from '../utils/trpc';

const ClientAuthentication: NextPage = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<any>(null);
  const toast = useToast();
  const ctx = trpc.useContext();
  const ref = useRef<HTMLDivElement>(null);

  const [areModelsLoaded, setTimerStore] = useTimerStore(
    (store) => store.areModelsLoaded
  );

  const [{ showMessage, messageInfo }, setAuthMessage] =
    useState<AuthenticationMessageState>({
      showMessage: false,
      messageInfo: {
        bgColor: 'authGreen',
        endingDate: undefined,
        footer: undefined,
        header: undefined,
        name: undefined,
        startingDate: undefined,
      },
    });

  const loadFaceapiModels = async () => {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    ]);
  };

  useEffect(() => {
    webcamRef.current!.video!.volume = 0;
    (async () => {
      await loadFaceapiModels();
      setTimerStore({ areModelsLoaded: true });
      refetch();
    })();
  }, []);

  const { mutateAsync: createAccessHistoryMutate } = trpc.useMutation(
    'accessHistory.create',
    {
      onSuccess: async () =>
        await ctx.invalidateQueries('accessHistory.getAll'),
      onError: (error) => {
        toast({
          description: error.message,
          duration: 3000,
          isClosable: true,
          status: 'error',
          variant: 'top-accent',
        });
      },
    }
  );

  const { refetch } = trpc.useQuery(['labeledFaceDescriptor.getAll'], {
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: areModelsLoaded,
    onSuccess: async (data) => {
      console.log('LABELED DESCRIPTORS LOADING');
      const faceDescriptors: faceapi.LabeledFaceDescriptors[] = [];
      data.forEach((labeledFaceDescriptor) => {
        faceDescriptors.push(
          faceapi.LabeledFaceDescriptors.fromJSON(labeledFaceDescriptor.data)
        );
      });
      if (faceDescriptors.length > 0) {
        const faceMatcher: faceapi.FaceMatcher = new faceapi.FaceMatcher(
          faceDescriptors,
          FACE_MATCH_DISTANCE_THRESHOLD
        );
        await faceDetection(faceMatcher);
      } else {
        webcamRef.current!.video!.muted = true;
        toast({
          description: ERROR_MESSAGE.FailedToLoadModels,
          duration: 3000,
          isClosable: true,
          status: 'error',
          variant: 'top-accent',
        });
      }
    },
    onError: (error) => {
      toast({
        description: error.message,
        duration: 3000,
        isClosable: true,
        status: 'error',
        variant: 'top-accent',
      });
    },
  });

  const faceDetection = async (faceMatcher: faceapi.FaceMatcher) => {
    const timer = setIntervalAsync(async () => {
      const detection = await faceapi
        .detectSingleFace(webcamRef.current!.video!)
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (detection && detection.detection.score > 0.85) {
        console.log('DETECTION SCORE:', detection.detection.score);
        canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(
          webcamRef.current!.video!
        );
        faceapi.matchDimensions(
          canvasRef.current,
          webcamRef.current!.video!,
          true
        );
        const { distance, label: ci } = faceMatcher.findBestMatch(
          detection.descriptor
        );
        const now = new Date();
        const foundMatch: boolean = distance < FACE_MATCH_DISTANCE_THRESHOLD;
        const detectionBoxColor = foundMatch ? '#66bb6a' : '#ef5350';

        const detectionBox = new faceapi.draw.DrawBox(detection.detection.box, {
          boxColor: detectionBoxColor,
          lineWidth: 1,
        });
        detectionBox.draw(canvasRef.current);

        if (foundMatch) {
          console.log('MATCH:', ci, now, distance);
          const accessAuthenticationInfo = await createAccessHistoryMutate({
            ci,
            date: now,
          });
          setAuthMessage({
            messageInfo: accessAuthenticationInfo,
            showMessage: true,
          });
          await delay(3500);
        } else {
          console.log('NO MATCH:', ci, now, distance);
          setAuthMessage({ messageInfo, showMessage: false });
        }
      } else {
        console.log('NO FACE DETECTED');
        const context = canvasRef.current.getContext('2d');
        context.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        setAuthMessage({ messageInfo, showMessage: false });
      }
    }, 500);
    setTimerStore({ timer });
  };

  return (
    <Flex bgColor={'background'} h={'100vh'} w={'100%'}>
      <Flex
        bgColor={'light'}
        h={'100%'}
        justifyContent={'center'}
        position={'relative'}
        ref={ref}
        w={'100%'}
      >
        <Webcam
          audio={false}
          className={'client-auth-webcam'}
          ref={webcamRef}
        />
        <canvas className={'client-auth-canvas'} ref={canvasRef} />
        {showMessage ? (
          <ClientAuthenticationMessage messageInfo={messageInfo} />
        ) : undefined}
      </Flex>
    </Flex>
  );
};

export default ClientAuthentication;

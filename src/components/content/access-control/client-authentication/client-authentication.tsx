import { Flex, useToast } from '@chakra-ui/react';
import * as faceapi from 'face-api.js';
import { Dispatch, SetStateAction, useRef } from 'react';
import Webcam from 'react-webcam';
import { setIntervalAsync } from 'set-interval-async';
import {
  ClientAuthenticationInfo,
  delay,
  ERROR_MESSAGE,
  FACE_MATCH_DISTANCE_THRESHOLD,
} from '../../../../utils/constants';
import { trpc } from '../../../../utils/trpc';

type ClientAuthenticationProps = {
  setShowAccessAuthenticationMessage: Dispatch<SetStateAction<boolean>>;
  setAccessAuthenticationInfo: Dispatch<
    SetStateAction<ClientAuthenticationInfo>
  >;
  isNewWindow: boolean;
};

const ClientAuthentication = ({
  setShowAccessAuthenticationMessage,
  setAccessAuthenticationInfo,
  isNewWindow,
}: ClientAuthenticationProps) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<any>(null);
  const toast = useToast();
  const ctx = trpc.useContext();

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

  trpc.useQuery(['client.getPhotoUrls'], {
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !isNewWindow,
    onSuccess: async (urls) => {
      await loadFaceapiModels();
      const faceDescriptors = await loadFaceDescriptors(urls);
      if (faceDescriptors.length > 0) {
        const faceMatcher: faceapi.FaceMatcher = new faceapi.FaceMatcher(
          faceDescriptors,
          FACE_MATCH_DISTANCE_THRESHOLD
        );
        await faceDetection(faceMatcher);
      } else {
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

  const loadFaceapiModels = async () => {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    ]);
  };

  const loadFaceDescriptors = async (urls: string[]) => {
    const faceDescriptors: faceapi.LabeledFaceDescriptors[] = [];
    for (const url of urls) {
      const clientPhoto = await faceapi.fetchImage(url);
      const detection = await faceapi
        .detectSingleFace(clientPhoto)
        .withFaceLandmarks()
        .withFaceDescriptor();

      const ci = url.split('/').pop()?.split('.')[0];

      if (ci && detection)
        faceDescriptors.push(
          new faceapi.LabeledFaceDescriptors(ci, [detection.descriptor])
        );
    }
    return faceDescriptors;
  };

  const faceDetection = async (faceMatcher: faceapi.FaceMatcher) => {
    setIntervalAsync(async () => {
      if (webcamRef.current) {
        const detection = await faceapi
          .detectSingleFace(webcamRef.current.video!)
          .withFaceLandmarks()
          .withFaceDescriptor();
        if (detection && detection.detection.score > 0.95) {
          console.log('DETECTION SCORE:', detection.detection.score);
          canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(
            webcamRef.current.video!
          );
          faceapi.matchDimensions(
            canvasRef.current,
            webcamRef.current.video!,
            true
          );
          const { distance, label: ci } = faceMatcher.findBestMatch(
            detection.descriptor
          );
          const now = new Date();
          const foundMatch: boolean = distance < FACE_MATCH_DISTANCE_THRESHOLD;
          const detectionBoxColor = foundMatch ? '#66bb6a' : '#ef5350';

          const detectionBox = new faceapi.draw.DrawBox(
            detection.detection.box,
            {
              boxColor: detectionBoxColor,
              lineWidth: 1,
            }
          );
          detectionBox.draw(canvasRef.current);

          if (foundMatch) {
            console.log('MATCH:', ci, now, distance);
            const accessAuthenticationInfo = await createAccessHistoryMutate({
              ci,
              date: now,
            });
            setAccessAuthenticationInfo(accessAuthenticationInfo);
            setShowAccessAuthenticationMessage(true);
            await delay(2000);
          } else {
            console.log('NO MATCH:', ci, now, distance);
            setShowAccessAuthenticationMessage(false);
          }
        } else {
          const context = canvasRef.current.getContext('2d');
          context.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          setShowAccessAuthenticationMessage(false);
        }
      }
    }, 500);
  };

  return (
    <Flex
      bgColor={'light'}
      h={'100%'}
      justifyContent={'center'}
      position={'relative'}
      w={'100%'}
    >
      <Webcam audio={false} className={'client-auth-webcam'} ref={webcamRef} />
      <canvas className={'client-auth-canvas'} ref={canvasRef} />
    </Flex>
  );
};

export default ClientAuthentication;

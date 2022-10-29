import { Button, Flex, useToast } from '@chakra-ui/react';
import * as faceapi from 'face-api.js';
import { useEffect, useRef, useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import Webcam from 'react-webcam';
import { setIntervalAsync } from 'set-interval-async';
import {
  delay,
  ERROR_MESSAGE,
  FACE_MATCH_DISTANCE_THRESHOLD,
} from '../../../../utils/constants';
import {
  useAuthenticationMessageStore,
  useDetectionBoxStore,
  useNewWindowStore,
  useTimerStore,
} from '../../../../utils/fast-context';
import { trpc } from '../../../../utils/trpc';

const ClientAuthentication = ({ isNewWindow }: { isNewWindow: boolean }) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<any>(null);
  const toast = useToast();
  const ctx = trpc.useContext();
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOpen, isReadyToOpen }, setNewWindowStore] = useNewWindowStore(
    (store) => store
  );
  const [{}, setDetectionBoxStore] = useDetectionBoxStore((store) => store);
  const [{}, setAuthenticationMessageStore] = useAuthenticationMessageStore(
    (store) => store
  );
  const [areModelsLoaded, setTimerStore] = useTimerStore(
    (store) => store.areModelsLoaded
  );

  const loadFaceapiModels = async () => {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    ]);
  };

  useEffect(() => {
    webcamRef.current!.video!.volume = 0;
  }, []);

  useEffect(() => {
    if (isOpen) {
      setNewWindowStore({ ref });
      console.log('REF ISOPEN');
    }
  }, [isOpen, setNewWindowStore]);

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
    enabled: !isNewWindow && areModelsLoaded,
    onSuccess: async (data) => {
      if (!isNewWindow) {
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
      } else {
        setNewWindowStore({ ref });
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
      if (detection && detection.detection.score > 0.75) {
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

        const { height, width, x, y } = detectionBox.box;
        const { height: canvasHeight, width: canvasWidth } = canvasRef.current;
        const { offsetHeight, offsetWidth } = faceapi.getContext2dOrThrow(
          canvasRef.current
        ).canvas;

        setDetectionBoxStore({
          boxInfo: {
            h: (height / canvasHeight) * offsetHeight,
            w: (width / canvasWidth) * offsetWidth,
            x: (x / canvasWidth) * offsetWidth,
            y: (y / canvasHeight) * offsetHeight,
            color: detectionBoxColor,
            originHeight: offsetHeight,
            originWidth: offsetWidth,
          },
          showBox: true,
        });

        if (foundMatch) {
          console.log('MATCH:', ci, now, distance);
          const accessAuthenticationInfo = await createAccessHistoryMutate({
            ci,
            date: now,
          });
          setAuthenticationMessageStore({
            messageInfo: accessAuthenticationInfo,
            showMessage: true,
          });
          if (!isReadyToOpen)
            setNewWindowStore({
              isReadyToOpen: true,
            });
          await delay(2000);
        } else {
          console.log('NO MATCH:', ci, now, distance);
          setAuthenticationMessageStore({
            showMessage: false,
          });
        }
      } else {
        console.log('NO FACE DETECTED');
        setDetectionBoxStore({
          showBox: false,
          boxInfo: {
            h: 0,
            w: 0,
            x: 0,
            y: 0,
            color: '#ef5350',
            originHeight: 0,
            originWidth: 0,
          },
        });
        setAuthenticationMessageStore({
          showMessage: false,
        });
      }
    }, 500);
    setTimerStore({ timer });
  };

  const handleLoadModels = async () => {
    setTimerStore({ areModelsLoaded: true });
    webcamRef.current!.video!.muted = true;
    await loadFaceapiModels();
    refetch();
  };

  return (
    <Flex
      bgColor={'light'}
      h={'100%'}
      justifyContent={'center'}
      position={'relative'}
      ref={ref}
      w={'100%'}
    >
      <Webcam
        audio={!isNewWindow}
        className={'client-auth-webcam'}
        ref={webcamRef}
      />
      <canvas className={'client-auth-canvas'} ref={canvasRef} />
      {!isNewWindow && !areModelsLoaded ? (
        <Button
          fontSize={'14px'}
          onClick={async () => await handleLoadModels()}
          leftIcon={<FiUpload size={'1.25rem'} />}
          position={'absolute'}
          bottom={'0'}
          mb={'0.5rem'}
        >
          {'Cargar modelos'}
        </Button>
      ) : undefined}
    </Flex>
  );
};

export default ClientAuthentication;

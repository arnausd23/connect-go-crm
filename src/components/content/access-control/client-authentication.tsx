import { Flex, useToast } from '@chakra-ui/react';
import { memo, useRef } from 'react';
import Webcam from 'react-webcam';
import { trpc } from '../../../utils/trpc';
import * as faceapi from 'face-api.js';

const ClientAuthentication = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<any>(null);
  const toast = useToast();

  trpc.useQuery(['client.getPhotoUrls'], {
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    onSuccess: async (urls) => {
      await loadFaceapiModels();
      const faceDescriptors = await loadFaceDescriptors(urls);
      const faceMatcher: faceapi.FaceMatcher = new faceapi.FaceMatcher(
        faceDescriptors,
        0.4
      );
      await faceDetection(faceMatcher);
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

      if (ci)
        faceDescriptors.push(
          new faceapi.LabeledFaceDescriptors(ci, [detection?.descriptor!])
        );
    }
    return faceDescriptors;
  };

  const faceDetection = async (faceMatcher: faceapi.FaceMatcher) => {
    setInterval(async () => {
      const detection = await faceapi
        .detectSingleFace(webcamRef.current?.video!)
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (detection && detection.detection.score > 0.95) {
        canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(
          webcamRef.current?.video!
        );

        faceapi.matchDimensions(
          canvasRef.current,
          webcamRef.current?.video!,
          true
        );

        const match = faceMatcher.findBestMatch(detection.descriptor);
        console.log(match);

        const foundMatch: boolean = match.distance < 0.4;
        const detectionBoxColor = foundMatch ? '#68D391' : '#C53030';

        const detectionBox = new faceapi.draw.DrawBox(detection.detection.box, {
          boxColor: detectionBoxColor,
          lineWidth: 1,
        });
        detectionBox.draw(canvasRef.current);
        //WRITE NEW ACCESS
      } else {
        const context = canvasRef.current.getContext('2d');
        context.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }
    }, 1000);
  };

  return (
    <Flex
      bgColor={'light'}
      borderRadius={'lg'}
      h={'100%'}
      justifyContent={'center'}
      overflow={'hidden'}
      position={'relative'}
      w={'100%'}
    >
      <Webcam audio={false} className={'client-auth-webcam'} ref={webcamRef} />
      <canvas className={'client-auth-canvas'} ref={canvasRef} />
    </Flex>
  );
};

export default memo(ClientAuthentication, () => true);

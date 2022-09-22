import { Flex } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

const ClientAuthentication = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<any>(null);

  useEffect(() => {
    // startVideo();
    videoRef && loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current!.srcObject = currentStream;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const loadModels = () => {
    Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    ]).then(() => {
      faceDetection();
    });
  };

  const faceDetection = async () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current!, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks()
        .withFaceDescriptors();
      console.log(detections);
      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(
        videoRef.current!
      );
      faceapi.matchDimensions(canvasRef.current, {
        width: 940,
        height: 650,
      });
      const resized = faceapi.resizeResults(detections, {
        width: 940,
        height: 650,
      });

      faceapi.draw.drawDetections(canvasRef.current, resized);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
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
      <video
        crossOrigin='anonymous'
        ref={videoRef}
        height={'100%'}
        width={'100%'}
        autoPlay
        style={{ objectFit: 'cover' }}
      ></video>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          objectFit: 'cover',
        }}
      />
    </Flex>
  );
};

export default ClientAuthentication;

import {
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Image,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { FiCamera, FiRotateCcw } from 'react-icons/fi';
import Webcam from 'react-webcam';
import { CustomModalProps } from '../custom/custom-modal';

const CreateClientModal = ({ data, isLoading, setData }: CustomModalProps) => {
  const webCamRef = useRef<Webcam>(null);

  const handleTakePhoto = () => {
    const screenshotSrc = webCamRef.current!.getScreenshot();
    setData!({
      ...data,
      photoSrc: screenshotSrc ? screenshotSrc : '',
      photoTaken: screenshotSrc ? true : false,
    });
  };

  return (
    <Flex>
      <Flex flexDir={'column'} justifyContent={'space-between'} w={'40%'}>
        <FormControl mb={'0.5rem'}>
          <FormLabel>{'Nombre'}</FormLabel>
          <Input
            bgColor={'white'}
            color={'background'}
            disabled={isLoading}
            onChange={({ target }) => setData!({ ...data, name: target.value })}
            value={data.name}
            variant={'filled'}
            _focus={{ bgColor: 'white' }}
          />
        </FormControl>
        <FormControl mb={'0.5rem'}>
          <FormLabel>{'CI'}</FormLabel>
          <Input
            bgColor={'white'}
            color={'background'}
            disabled={isLoading}
            onChange={({ target }) => setData!({ ...data, ci: target.value })}
            type={'number'}
            value={data.ci}
            variant={'filled'}
            _focus={{ bgColor: 'white' }}
          />
        </FormControl>
        <FormControl mb={'0.5rem'}>
          <FormLabel>{'Celular'}</FormLabel>
          <Input
            bgColor={'white'}
            color={'background'}
            disabled={isLoading}
            onChange={({ target }) =>
              setData!({ ...data, phoneNumber: target.value })
            }
            type={'number'}
            value={data.phoneNumber}
            variant={'filled'}
            _focus={{ bgColor: 'white' }}
          />
        </FormControl>
      </Flex>
      <FormControl mb={'0.5rem'} ml={'1.5rem'} w={'60%'}>
        <FormLabel>{'Foto'}</FormLabel>
        <Flex
          alignItems={'center'}
          bgColor={'white'}
          borderRadius={'md'}
          color={'background'}
          flexDir={'column'}
          h={'calc(100% - 2rem)'}
          justifyContent={'center'}
          overflow={'hidden'}
          position={'relative'}
        >
          {data.photoTaken && data.photoSrc ? (
            <Image
              src={data.photoSrc}
              objectFit={'contain'}
              alt='Client photo'
            />
          ) : (
            <>
              <Webcam
                audio={false}
                forceScreenshotSourceSize={true}
                height={'100%'}
                ref={webCamRef}
                screenshotFormat={'image/jpeg'}
                screenshotQuality={1}
                width={'100%'}
              />
            </>
          )}
          <Flex position={'absolute'} bottom={'0'} right={'0'} p={'0.5rem'}>
            {data.photoTaken && data.photoSrc ? (
              <IconButton
                aria-label={'Retake photo'}
                icon={<FiRotateCcw size={'1.25rem'} />}
                onClick={() =>
                  setData!({ ...data, photoSrc: '', photoTaken: false })
                }
                variant={'solid'}
              />
            ) : (
              <IconButton
                aria-label={'Take photo'}
                icon={<FiCamera size={'1.25rem'} />}
                onClick={() => handleTakePhoto()}
                variant={'solid'}
              />
            )}
          </Flex>
        </Flex>
      </FormControl>
    </Flex>
  );
};

export default CreateClientModal;

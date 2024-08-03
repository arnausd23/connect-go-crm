import {
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Image,
  Switch,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { FiRotateCcw, FiCamera } from 'react-icons/fi';
import Webcam from 'react-webcam';
import { CustomModalProps } from '../custom/custom-modal';

const EditClientModal = ({
  data,
  isLoading,
  setData,
  imageRef,
}: CustomModalProps & { imageRef: any }) => {
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
      <Flex flexDir={'column'} w={'40%'}>
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
        <Flex alignItems={'center'} justifyContent={'space-between'}>
          <FormLabel>{'Foto'}</FormLabel>
          <Switch
            id={'edit-foto'}
            size={'sm'}
            colorScheme='blue'
            isChecked={data.editPhoto}
            onChange={(e) => setData!({ ...data, editPhoto: e.target.checked })}
          />
        </Flex>
        {data.editPhoto && (
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
                alt={'Client photo'}
                ref={imageRef}
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
            <Flex
              position={'absolute'}
              bottom={'0px'}
              right={'0px'}
              p={'0.5rem'}
            >
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
        )}
      </FormControl>
    </Flex>
  );
};

export default EditClientModal;

import { Flex, IconButton } from '@chakra-ui/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Dispatch, SetStateAction } from 'react';
import { FiMaximize } from 'react-icons/fi';
import {
  ClientAuthenticationInfo,
  FaceDetectionBox,
} from '../../../../utils/constants';
import ClientAuthentication from './client-authentication';
import ClientAuthenticationMessage from './client-authentication-message';

type ClientAuthenticationPanelProps = {
  setOpenClientAuth: Dispatch<SetStateAction<boolean>>;
  isNewWindow: boolean;
  showAccessAuthenticationMessage: boolean;
  setShowAccessAuthenticationMessage: Dispatch<SetStateAction<boolean>>;
  accessAuthenticationInfo: ClientAuthenticationInfo;
  setAccessAuthenticationInfo: Dispatch<
    SetStateAction<ClientAuthenticationInfo>
  >;
  faceDetectionBox: FaceDetectionBox;
  setFaceDetectionBox: Dispatch<SetStateAction<FaceDetectionBox>>;
};

const ClientAuthenticationPanel = ({
  setOpenClientAuth,
  isNewWindow,
  showAccessAuthenticationMessage,
  setShowAccessAuthenticationMessage,
  accessAuthenticationInfo,
  setAccessAuthenticationInfo,
  faceDetectionBox,
  setFaceDetectionBox,
}: ClientAuthenticationPanelProps) => {
  const { bgColor, endingDate, footer, header, name, startingDate } =
    accessAuthenticationInfo;
  const [ref] = useAutoAnimate<HTMLDivElement>();

  return (
    <Flex
      bgColor={'light'}
      borderRadius={'lg'}
      h={'100%'}
      justifyContent={'center'}
      overflow={'hidden'}
      position={'relative'}
      w={'100%'}
      ref={ref}
    >
      <ClientAuthentication
        setAccessAuthenticationInfo={setAccessAuthenticationInfo}
        setShowAccessAuthenticationMessage={setShowAccessAuthenticationMessage}
        isNewWindow={isNewWindow}
        setFaceDetectionBox={setFaceDetectionBox}
      />
      {!isNewWindow && (
        <IconButton
          aria-label={'Fullscreen'}
          bottom={0}
          icon={<FiMaximize size={'1.25rem'} />}
          m={'0.5rem'}
          onClick={() => setOpenClientAuth(true)}
          position={'absolute'}
          right={0}
          variant={'ghost'}
        />
      )}
      {/* {faceDetectionBox.x ? (
        <Flex
          bgColor={'red'}
          h={`${faceDetectionBox.height}px`}
          w={`${faceDetectionBox.width}px`}
          position={'absolute'}
          top={`${faceDetectionBox.y}px`}
          left={`${faceDetectionBox.x}px`}
          objectFit={'cover'}
        />
      ) : undefined} */}
      {showAccessAuthenticationMessage ? (
        <ClientAuthenticationMessage
          bgColor={bgColor}
          endingDate={endingDate}
          footer={footer}
          header={header}
          name={name}
          startingDate={startingDate}
        />
      ) : undefined}
    </Flex>
  );
};

export default ClientAuthenticationPanel;

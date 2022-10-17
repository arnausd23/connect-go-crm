import { Flex } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { AccessControlContext } from '../access-control';

const ClientAuthenticationDetectionBox = () => {
  const { detectionBoxInfo, isNewWindow, newWindowRef } =
    useContext(AccessControlContext);
  const { x, y, h, w, color, originHeight, originWidth } = detectionBoxInfo!;
  const [boxInfo, setBoxInfo] = useState({ x: 0, y: 0, h: 0, w: 0 });

  useEffect(() => {
    if (isNewWindow && newWindowRef?.current) {
      const { clientHeight, clientWidth } = newWindowRef.current;
      const newX = (x / originWidth) * clientWidth;
      const newY = (y / originHeight) * clientHeight;
      const newH = (h / originHeight) * clientHeight;
      const newW = (w / originWidth) * clientWidth;
      setBoxInfo({ x: newX, y: newY, h: newH, w: newW });
    }
  }, [
    detectionBoxInfo,
    h,
    w,
    x,
    y,
    originHeight,
    originWidth,
    isNewWindow,
    newWindowRef,
  ]);

  return (
    <Flex
      w={`${isNewWindow ? boxInfo.w : w}px`}
      h={`${isNewWindow ? boxInfo.h : h}px`}
      position={'absolute'}
      left={`${isNewWindow ? boxInfo.x : x}px`}
      top={`${isNewWindow ? boxInfo.y : y}px`}
      overflow={'hidden'}
      borderRadius={'sm'}
    >
      <Flex
        borderTop={`3px solid ${color}`}
        borderLeft={`3px solid ${color}`}
        w={'2rem'}
        h={'2rem'}
        position={'absolute'}
        left={'0px'}
        top={'0px'}
      />
      <Flex
        borderTop={`3px solid ${color}`}
        borderRight={`3px solid ${color}`}
        w={'2rem'}
        h={'2rem'}
        position={'absolute'}
        right={'0px'}
        top={'0px'}
      />
      <Flex
        borderBottom={`3px solid ${color}`}
        borderLeft={`3px solid ${color}`}
        w={'2rem'}
        h={'2rem'}
        position={'absolute'}
        left={'0px'}
        bottom={'0px'}
      />
      <Flex
        borderRight={`3px solid ${color}`}
        borderBottom={`3px solid ${color}`}
        w={'2rem'}
        h={'2rem'}
        position={'absolute'}
        right={'0px'}
        bottom={'0px'}
      />
    </Flex>
  );
};

export default ClientAuthenticationDetectionBox;

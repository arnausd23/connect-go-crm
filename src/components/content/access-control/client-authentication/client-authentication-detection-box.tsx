import { Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  useDetectionBoxStore,
  useNewWindowStore,
} from '../../../../utils/fast-context';

const ClientAuthenticationDetectionBox = ({
  isNewWindow,
}: {
  isNewWindow: boolean;
}) => {
  const [{ boxInfo, showBox }] = useDetectionBoxStore((store) => store);
  const [ref] = useNewWindowStore((store) => store.ref);

  const { x, y, h, w, color, originHeight, originWidth } = boxInfo;
  const [info, setInfo] = useState({ x: 0, y: 0, h: 0, w: 0 });

  useEffect(() => {
    if (isNewWindow && ref?.current) {
      const { clientHeight, clientWidth } = ref.current;
      const newX = (x / originWidth) * clientWidth;
      const newY = (y / originHeight) * clientHeight;
      const newH = (h / originHeight) * clientHeight;
      const newW = (w / originWidth) * clientWidth;
      setInfo({ x: newX, y: newY, h: newH, w: newW });
    }
  }, [boxInfo, h, w, x, y, originHeight, originWidth, isNewWindow, ref]);

  return (
    <Flex
      w={`${isNewWindow ? info.w : w}px`}
      h={`${isNewWindow ? info.h : h}px`}
      position={'absolute'}
      left={`${isNewWindow ? info.x : x}px`}
      top={`${isNewWindow ? info.y : y}px`}
      overflow={'hidden'}
      borderRadius={'sm'}
      visibility={showBox ? 'visible' : 'hidden'}
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

import { Flex, Text } from '@chakra-ui/react';
import { AccessAuthenticationInfo } from '../../../../utils/constants';

const AccessAuthenticationMessage = ({
  bgColor,
  endingDate,
  footer,
  header,
  name,
  startingDate,
}: AccessAuthenticationInfo) => {
  return (
    <Flex
      bgColor={bgColor}
      borderRadius={'lg'}
      bottom={'0'}
      color={'background'}
      flexDir={'column'}
      justifyContent={'space-between'}
      m={'1rem'}
      p={header && '1rem'}
      position={'absolute'}
      shadow={'md'}
    >
      <Text fontSize={'22px'} fontWeight={'semibold'}>
        {header}
      </Text>
      <Text fontSize={'20px'}>{name}</Text>
      <Flex>
        {startingDate && (
          <Flex justifyContent={'center'} mr={'3rem'}>
            <Text fontSize={'18px'} fontWeight={'semibold'}>
              {'Fecha inicial:'}
            </Text>
            <Text fontSize={'18px'}>
              {startingDate.toLocaleString('es-BO').split(',')[0]}
            </Text>
          </Flex>
        )}
        {endingDate && (
          <Flex justifyContent={'center'} ml={'3rem'}>
            <Text fontSize={'18px'} fontWeight={'semibold'}>
              {'Fecha final:'}
            </Text>
            <Text fontSize={'18px'}>
              {endingDate.toLocaleString('es-BO').split(',')[0]}
            </Text>
          </Flex>
        )}
      </Flex>
      <Text fontSize={'20px'} alignSelf={'end'}>
        {footer}
      </Text>
    </Flex>
  );
};

export default AccessAuthenticationMessage;

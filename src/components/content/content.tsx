import { Flex } from '@chakra-ui/react';
import { SECTION } from '../../utils/constants';
import AccessControl from './access-control/access-control';
import Plans from './plans/plans';

type ContentProps = {
  currentSection: SECTION;
};

const Content = ({ currentSection }: ContentProps) => {
  return (
    <Flex h={'100%'} p={'1.5rem'} w={'100%'}>
      <Flex h={'100%'} w={'100%'}>
        {currentSection === SECTION.AccessControl ? (
          <AccessControl />
        ) : (
          <Plans />
        )}
      </Flex>
    </Flex>
  );
};

export default Content;

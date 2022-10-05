import { Flex } from '@chakra-ui/react';
import { SECTION } from '../../utils/constants';
import AccessControl from './access-control/access-control';
import Clients from './clients/clients';
import Plans from './plans/plans';

type ContentProps = {
  currentSection: SECTION;
};

const Content = ({ currentSection }: ContentProps) => {
  const getCurrentSection = (currentSection: SECTION) => {
    switch (currentSection) {
      case SECTION.AccessControl:
        return <AccessControl />;
      case SECTION.Plans:
        return <Plans />;
      case SECTION.Clients:
        return <Clients />;
      default:
        return <AccessControl />;
    }
  };
  return (
    <Flex h={'100%'} p={'1.5rem'} w={'100%'}>
      <Flex h={'100%'} w={'100%'}>
        {getCurrentSection(currentSection)}
      </Flex>
    </Flex>
  );
};

export default Content;

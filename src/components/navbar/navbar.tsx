import { Divider, Flex } from '@chakra-ui/react';
import { FiArchive, FiKey } from 'react-icons/fi';
import { NAV_BAR_WIDTH } from '../../utils/constants';
import NavbarActionBar from './navbar-action-bar';
import NavbarButton from './navbar-button';
import NavbarPrimaryActionButton from './navbar-primary-action-button';

const Navbar = () => {
  return (
    <Flex
      bgColor={'light'}
      flexDir={'column'}
      h={'100%'}
      justifyContent={'space-between'}
      p={'1.5rem'}
      shadow={'lg'}
      w={`${NAV_BAR_WIDTH}px`}
    >
      <Flex flexDir={'column'}>
        <Divider bgColor={'gray.300'} m={'1rem 0'} h={'1px'} />
        <NavbarButton
          icon={<FiKey size={'1.5rem'} color={'white'} />}
          label={'Control de acceso'}
          active={true}
        />
        <NavbarButton
          icon={<FiArchive size={'1.5rem'} />}
          label={'Planes'}
          active={false}
        />
      </Flex>
      <Flex flexDir={'column'}>
        <Divider bgColor={'gray.300'} m={'1rem 0'} h={'1px'} />
        <NavbarActionBar />
        <Divider bgColor={'gray.300'} m={'1rem 0'} h={'1px'} />
        <NavbarPrimaryActionButton />
      </Flex>
    </Flex>
  );
};

export default Navbar;

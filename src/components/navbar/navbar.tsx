import { Button, Divider, Flex, TabList } from '@chakra-ui/react';
import Image from 'next/image';
import { FiArchive, FiKey, FiUsers } from 'react-icons/fi';
import { NAV_BAR_WIDTH, SECTION } from '../../utils/constants';
import { trpc } from '../../utils/trpc';
import NavbarActionBar from './navbar-action-bar';
import NavbarButton from './navbar-button';
import NavbarPrimaryActionButton from './navbar-primary-action-button';

const Navbar = () => {
  // const { mutate } = trpc.useMutation('auth.signUp');
  // const handleSignUp = () => {
  //   mutate({ username: 'g.mendez', password: 'C0NN3CT22' });
  // };

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
        <Flex
          h={'4rem'}
          alignSelf={'center'}
          mb={'0.25rem'}
          position={'relative'}
          w={'70%'}
        >
          <Image
            alt={''}
            src={'/connect-logo-dark.svg'}
            width={'100%'}
            height={'100%'}
            layout={'fill'}
          />
        </Flex>
        <Divider bgColor={'gray.300'} mb={'1rem'} h={'1px'} />
        <TabList border={'none'} display={'flex'} flexDir={'column'}>
          <NavbarButton icon={<FiKey size={'1.25rem'} />}>
            {SECTION.AccessControl}
          </NavbarButton>
          <NavbarButton icon={<FiArchive size={'1.25rem'} />}>
            {SECTION.Plans}
          </NavbarButton>
          <NavbarButton icon={<FiUsers size={'1.25rem'} />}>
            {SECTION.Clients}
          </NavbarButton>
        </TabList>
      </Flex>

      <Flex flexDir={'column'}>
        <Divider bgColor={'gray.300'} m={'1rem 0'} h={'1px'} />
        <NavbarActionBar />
        <Divider bgColor={'gray.300'} m={'1rem 0'} h={'1px'} />
        <NavbarPrimaryActionButton />
        {/* <Button
          colorScheme={'blue'}
          onClick={() => handleSignUp()}
          variant={'solid'}
        >
          {'Sign Up'}
        </Button> */}
      </Flex>
    </Flex>
  );
};

export default Navbar;

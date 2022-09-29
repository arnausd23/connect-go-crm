import { Button, Divider, Flex } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';
import { FiArchive, FiKey } from 'react-icons/fi';
import { NAV_BAR_WIDTH, SECTION } from '../../utils/constants';
import { trpc } from '../../utils/trpc';
import NavbarActionBar from './navbar-action-bar';
import NavbarButton from './navbar-button';
import NavbarPrimaryActionButton from './navbar-primary-action-button';

type NavbarProps = {
  currentSection: SECTION;
  setCurrentSection: Dispatch<SetStateAction<SECTION>>;
};

const Navbar = ({ currentSection, setCurrentSection }: NavbarProps) => {
  // const { mutate } = trpc.useMutation('auth.signUp');
  // const handleSignUp = () => {
  //   mutate({ username: 'Mateo.Altamirano', password: 'C0NN3CTmateo' });
  // };
  const handleSectionChange = (section: SECTION) => {
    if (currentSection !== section) setCurrentSection(section);
  };

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
          active={currentSection === SECTION.AccessControl}
          handleSectionChange={handleSectionChange}
          icon={<FiKey size={'1.25rem'} />}
          label={SECTION.AccessControl}
        />
        <NavbarButton
          active={currentSection === SECTION.Plans}
          handleSectionChange={handleSectionChange}
          icon={<FiArchive size={'1.25rem'} />}
          label={SECTION.Plans}
        />
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

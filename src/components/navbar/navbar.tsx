import { Button, Divider, Flex } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';
import { FiArchive, FiKey } from 'react-icons/fi';
import { NAV_BAR_WIDTH, SECTIONS } from '../../utils/constants';
import { trpc } from '../../utils/trpc';
import NavbarActionBar from './navbar-action-bar';
import NavbarButton from './navbar-button';
import NavbarPrimaryActionButton from './navbar-primary-action-button';

type NavbarProps = {
  currentSection: SECTIONS;
  setCurrentSection: Dispatch<SetStateAction<SECTIONS>>;
};

const Navbar = ({ currentSection, setCurrentSection }: NavbarProps) => {
  // const { mutate } = trpc.useMutation('auth.signUp');
  // const handleSignUp = () => {
  //   mutate({ username: 'Mateo.Altamirano', password: 'C0NN3CTmateo' });
  // };
  const handleSectionChange = (section: SECTIONS) => {
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
          active={currentSection === SECTIONS.AccessControl}
          handleSectionChange={handleSectionChange}
          icon={<FiKey size={'1.25rem'} />}
          label={SECTIONS.AccessControl}
        />
        <NavbarButton
          active={currentSection === SECTIONS.Plans}
          handleSectionChange={handleSectionChange}
          icon={<FiArchive size={'1.25rem'} />}
          label={SECTIONS.Plans}
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

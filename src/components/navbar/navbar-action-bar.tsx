import { Flex, IconButton } from '@chakra-ui/react';
import { FiFilePlus, FiLogOut, FiSettings, FiUserPlus } from 'react-icons/fi';

const NavbarActionBar = () => {
  return (
    <Flex
      alignItems={'center'}
      bgColor={'white'}
      borderRadius={'lg'}
      color={'background'}
      h={'3rem'}
      justifyContent={'space-between'}
      p={'0 1rem'}
      shadow={'md'}
    >
      <IconButton
        aria-label='Assign plan'
        icon={<FiUserPlus size={'1.25rem'} />}
        variant={'ghost'}
      />
      <IconButton
        aria-label='Create new plan'
        icon={<FiFilePlus size={'1.25rem'} />}
        variant={'ghost'}
      />
      <IconButton
        aria-label='Settings'
        icon={<FiSettings size={'1.25rem'} />}
        variant={'ghost'}
      />
      <IconButton
        aria-label='Sign out'
        icon={<FiLogOut size={'1.25rem'} />}
        variant={'ghost'}
      />
    </Flex>
  );
};

export default NavbarActionBar;

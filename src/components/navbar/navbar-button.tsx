import { Flex, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { SECTION } from '../../utils/constants';

type NavbarProps = {
  active: boolean;
  handleSectionChange: (section: SECTION) => void;
  icon: ReactNode;
  label: SECTION;
};
const NavbarButton = ({
  active,
  handleSectionChange,
  icon,
  label,
}: NavbarProps) => {
  return (
    <Flex
      alignItems={'center'}
      bgColor={active ? 'blue.400' : undefined}
      borderRadius={'lg'}
      color={active ? 'white' : 'background'}
      cursor={'pointer'}
      h={'3rem'}
      m={'0.125rem 0'}
      onClick={() => handleSectionChange(label)}
      p={'0 1rem'}
      shadow={active ? 'md' : undefined}
      userSelect={'none'}
      _hover={{ bgColor: 'blue.400', color: 'white' }}
    >
      {icon}
      <Text ml={'0.5rem'} fontSize={'sm'}>
        {label}
      </Text>
    </Flex>
  );
};

export default NavbarButton;

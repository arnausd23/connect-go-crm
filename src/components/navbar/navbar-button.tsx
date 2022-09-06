import { Flex, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

type NavbarProps = {
  active: boolean;
  icon: ReactNode;
  label: string;
};
const NavbarButton = ({ active, icon, label }: NavbarProps) => {
  return (
    <Flex
      alignItems={'center'}
      bgColor={active ? 'blue.400' : undefined}
      borderRadius={'lg'}
      color={active ? 'white' : 'background'}
      h={'3rem'}
      m={'0.125rem 0'}
      p={'0 1rem'}
      shadow={active ? 'md' : undefined}
      _hover={{ bgColor: 'blue.400', color: 'white' }}
    >
      {icon}
      <Text ml={'0.5rem'}>{label}</Text>
    </Flex>
  );
};

export default NavbarButton;

import {
  Button,
  Flex,
  TabProps,
  Text,
  useMultiStyleConfig,
  useTab,
} from '@chakra-ui/react';
import { forwardRef, ReactNode } from 'react';

const NavbarButton = forwardRef<HTMLElement, TabProps & { icon: ReactNode }>(
  (props, ref) => {
    const tabProps = useTab({ ...props, variant: 'unstyled', ref });
    const isSelected = !!tabProps['aria-selected'];

    const styles = useMultiStyleConfig('Tabs', tabProps);

    return (
      <Button
        __css={styles.tab}
        {...tabProps}
        bgColor={isSelected ? 'blue.400' : undefined}
        borderRadius={'lg'}
        color={isSelected ? 'white' : 'background'}
        cursor={'pointer'}
        h={'3rem'}
        m={'0.125rem 0'}
        p={'0 1rem'}
        shadow={isSelected ? 'md' : undefined}
        userSelect={'none'}
      >
        <Flex>
          {props.icon}
          <Text ml={'0.5rem'} fontSize={'sm'}>
            {tabProps.children}
          </Text>
        </Flex>
      </Button>
    );
  }
);

NavbarButton.displayName = 'NavbarButton';

export default NavbarButton;

import { extendTheme } from '@chakra-ui/react';

const colors = {
  background: '#24292e',
  dark: '#2e373d',
  light: '#e4f0f4',
  select: '#ecedf1',
};

export const theme = extendTheme({
  colors,
  fonts: {
    headings: `'Poppins', sans-serif`,
    body: `'Poppins', sans-serif`,
  },
});

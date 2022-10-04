import { extendTheme } from '@chakra-ui/react';

const colors = {
  authGreen: '#66bb6a',
  authOrange: '#ff7043',
  authRed: '#ef5350',
  authYellow: '#ffca28',
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

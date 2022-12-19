import { extendTheme } from '@chakra-ui/react';

const colors = {
  authGreen: '#a5d6a7',
  authOrange: '#ffab91',
  authRed: '#ef9a9a',
  authYellow: '#ffe082',
  authBlue: '#81d4fa',
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

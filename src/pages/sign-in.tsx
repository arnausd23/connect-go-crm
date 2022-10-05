import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import { signIn } from 'next-auth/react';
import router from 'next/router';
import { useState } from 'react';
import { IAuth } from '../server/common/validation/schemas';
import { ERROR_MESSAGE } from '../utils/constants';

const SignIn: NextPage = () => {
  const [credentials, setCredentials] = useState<IAuth>({
    username: '',
    password: '',
  });
  const [isSignInLoading, setIsSignInLoading] = useState<boolean>(false);
  const toast = useToast();

  const handleSignIn = async () => {
    setIsSignInLoading(true);
    const result = await signIn('credentials', {
      username: credentials.username,
      password: credentials.password,
      redirect: false,
    });
    setIsSignInLoading(false);
    if (result?.ok) return router.push('/');
    toast({
      description: result?.error
        ? result.error
        : ERROR_MESSAGE.SomethingWentWrong,
      duration: 3000,
      isClosable: true,
      status: 'error',
      variant: 'top-accent',
    });
  };

  return (
    <Flex
      alignItems={'center'}
      bgColor={'background'}
      h={'100vh'}
      justifyContent={'center'}
      w={'100%'}
    >
      <Flex
        bgColor={'dark'}
        borderRadius={'lg'}
        color={'white'}
        flexDir={'column'}
        p={'1.5rem'}
        shadow={'lg'}
        w={'20rem'}
      >
        <FormControl mb={'0.5rem'}>
          <FormLabel>{'Usuario'}</FormLabel>
          <Input
            bgColor={'white'}
            color={'background'}
            onChange={({ target }) =>
              setCredentials({ ...credentials, username: target.value })
            }
            value={credentials.username}
            variant={'filled'}
            _focus={{ bgColor: 'white' }}
          />
        </FormControl>
        <FormControl mb={'2rem'}>
          <FormLabel>{'Contraseña'}</FormLabel>
          <Input
            bgColor={'white'}
            color={'background'}
            onChange={({ target }) =>
              setCredentials({ ...credentials, password: target.value })
            }
            type={'password'}
            value={credentials.password}
            variant={'filled'}
            _focus={{ bgColor: 'white' }}
          />
        </FormControl>
        <Button
          bgColor={'blue.400'}
          colorScheme={'blue'}
          fontSize={'14px'}
          isLoading={isSignInLoading}
          onClick={async () => await handleSignIn()}
          variant={'solid'}
        >
          {'Iniciar Sesión'}
        </Button>
      </Flex>
    </Flex>
  );
};

export default SignIn;

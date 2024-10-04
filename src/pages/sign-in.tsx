import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import router from 'next/router';
import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { IAuth } from '../server/common/validation/schemas';
import { ERROR_MESSAGE } from '../utils/constants';

const SignIn: NextPage = () => {
  const [credentials, setCredentials] = useState<IAuth>({
    username: '',
    password: '',
  });
  const [isSignInLoading, setIsSignInLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

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
        <Flex
          h={'4rem'}
          alignSelf={'center'}
          m={'1rem 0'}
          position={'relative'}
          w={'80%'}
        >
          <Image
            alt={''}
            src={'/connect-logo-light.svg'}
            width={'100%'}
            height={'100%'}
            layout={'fill'}
          />
        </Flex>
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
          <InputGroup>
            <Input
              bgColor={'white'}
              color={'background'}
              onChange={({ target }) =>
                setCredentials({ ...credentials, password: target.value })
              }
              type={isVisible ? 'text' : 'password'}
              value={credentials.password}
              variant={'filled'}
              _focus={{ bgColor: 'white' }}
            />
            <InputRightElement>
              <IconButton
                aria-label={'See password'}
                bottom={'0px'}
                color={'background'}
                icon={
                  isVisible ? (
                    <FiEyeOff size={'1.25rem'} />
                  ) : (
                    <FiEye size={'1.25rem'} />
                  )
                }
                m={'0.5rem'}
                onClick={() => setIsVisible(!isVisible)}
                disabled={isSignInLoading}
                size={'sm'}
              />
            </InputRightElement>
          </InputGroup>
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

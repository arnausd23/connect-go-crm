import {
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { FiEye, FiEyeOff, FiUser } from 'react-icons/fi';
import { CustomModalProps } from '../custom/custom-modal';

const SettingsModal = ({ data, setData, isLoading }: CustomModalProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { data: sessionData } = useSession();

  return (
    <Flex flexDir={'column'}>
      <FormControl mb={'0.5rem'}>
        <FormLabel>
          <Flex>
            <Flex mr={'0.5rem'}>
              <FiUser size={'1.25rem'} />
            </Flex>
            {
              Object.entries(sessionData!).filter(
                (entry) => entry[0] === 'id'
              )[0]![1] as string
            }
          </Flex>
        </FormLabel>
      </FormControl>
      <FormControl mb={'0.5rem'}>
        <FormLabel>{'Nueva contraseña'}</FormLabel>
        <InputGroup>
          <Input
            bgColor={'white'}
            color={'background'}
            disabled={isLoading}
            onChange={({ target }) =>
              setData!({ ...data, newPassword: target.value })
            }
            type={isVisible ? 'text' : 'password'}
            value={data.newPassword}
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
              disabled={isLoading}
              size={'sm'}
            />
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl mb={'0.5rem'}>
        <FormLabel>{'Repite la nueva contraseña'}</FormLabel>
        <InputGroup>
          <Input
            bgColor={'white'}
            color={'background'}
            disabled={isLoading}
            onChange={({ target }) =>
              setData!({ ...data, repeatedNewPassword: target.value })
            }
            type={isVisible ? 'text' : 'password'}
            value={data.repeatedNewPassword}
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
              disabled={isLoading}
              size={'sm'}
            />
          </InputRightElement>
        </InputGroup>
      </FormControl>
    </Flex>
  );
};

export default SettingsModal;

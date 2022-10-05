import {
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { CustomModalProps } from '../custom/custom-modal';

const SettingsModal = ({ data, setData, isLoading }: CustomModalProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  return (
    <Flex flexDir={'column'}>
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
          <InputRightElement
            children={
              <IconButton
                aria-label={'Previous page'}
                bottom={0}
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
            }
          />
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
          <InputRightElement
            children={
              <IconButton
                aria-label={'Previous page'}
                bottom={0}
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
            }
          />
        </InputGroup>
      </FormControl>
    </Flex>
  );
};

export default SettingsModal;

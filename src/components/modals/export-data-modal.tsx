import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { CustomModalProps } from '../custom/custom-modal';

const ExportDataModal = ({ data, isLoading, setData }: CustomModalProps) => {
  return (
    <FormControl mb={'0.5rem'}>
      <FormLabel>{'Nombre del archivo'}</FormLabel>
      <Input
        bgColor={'white'}
        color={'background'}
        disabled={isLoading}
        onChange={({ target }) => setData!({ ...data, fileName: target.value })}
        placeholder={'Nombre del archivo'}
        value={data.fileName}
        variant={'filled'}
        _focus={{ bgColor: 'white' }}
      />
    </FormControl>
  );
};

export default ExportDataModal;

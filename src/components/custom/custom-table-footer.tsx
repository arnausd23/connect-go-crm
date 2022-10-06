import { Flex, IconButton } from '@chakra-ui/react';
import { Table } from '@tanstack/react-table';
import {
  FiChevronsLeft,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsRight,
  FiDownload,
} from 'react-icons/fi';
import CustomModal from './custom-modal';
import { ReactNode } from 'react';

type CustomTableFooterProps = {
  table: Table<any>;
  exportBody: ReactNode;
  onClickExport: () => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  isLoading: boolean;
};
const CustomTableFooter = ({
  table,
  exportBody,
  onClickExport,
  onOpen,
  onClose,
  isOpen,
  isLoading,
}: CustomTableFooterProps) => {
  return (
    <Flex alignItems={'center'} justifyContent={'space-between'}>
      {exportBody ? (
        <IconButton
          aria-label={'Export table data'}
          bottom={0}
          color={'white'}
          icon={<FiDownload size={'1.25rem'} />}
          m={'0.5rem'}
          onClick={() => onOpen()}
          variant={'ghost'}
          _hover={{ color: 'background', bg: 'gray.100' }}
        />
      ) : (
        <Flex />
      )}
      <Flex>
        <Flex>
          <IconButton
            aria-label={'First page'}
            bottom={0}
            color={'white'}
            icon={<FiChevronsLeft size={'1.25rem'} />}
            m={'0.5rem'}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            variant={'ghost'}
            _hover={{ color: 'background', bg: 'gray.100' }}
          />
          <IconButton
            aria-label={'Previous page'}
            bottom={0}
            color={'white'}
            icon={<FiChevronLeft size={'1.25rem'} />}
            m={'0.5rem'}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            variant={'ghost'}
            _hover={{ color: 'background', bg: 'gray.100' }}
          />
        </Flex>
        <Flex>
          <IconButton
            aria-label={'Next page'}
            bottom={0}
            color={'white'}
            icon={<FiChevronRight size={'1.25rem'} />}
            m={'0.5rem'}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            variant={'ghost'}
            _hover={{ color: 'background', bg: 'gray.100' }}
          />
          <IconButton
            aria-label={'Last page'}
            bottom={0}
            color={'white'}
            icon={<FiChevronsRight size={'1.25rem'} />}
            m={'0.5rem'}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            variant={'ghost'}
            _hover={{ color: 'background', bg: 'gray.100' }}
          />
        </Flex>
      </Flex>
      <CustomModal
        title={'Exportar datos'}
        isLoading={isLoading}
        isOpen={isOpen}
        onClose={onClose}
        body={exportBody}
        actionButtonLabel={'Exportar'}
        onActionClick={onClickExport}
      />
    </Flex>
  );
};

export default CustomTableFooter;

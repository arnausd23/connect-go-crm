import { Flex, IconButton } from '@chakra-ui/react';
import { Table } from '@tanstack/react-table';
import {
  FiChevronsLeft,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsRight,
} from 'react-icons/fi';

type CustomTableFooterProps = {
  table: Table<any>;
};
const CustomTableFooter = ({ table }: CustomTableFooterProps) => {
  return (
    <Flex alignItems={'center'} justifyContent={'space-between'}>
      <Flex>
        <IconButton
          aria-label={'Back'}
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
          aria-label={'Back'}
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
          aria-label={'Forward'}
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
          aria-label={'Forward'}
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
  );
};

export default CustomTableFooter;

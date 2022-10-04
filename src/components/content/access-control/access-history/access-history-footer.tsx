import { Flex, IconButton } from '@chakra-ui/react';
import { Table } from '@tanstack/react-table';
import {
  FiChevronsLeft,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsRight,
} from 'react-icons/fi';
import { AccessHistoryTableInfo } from '../../../../utils/constants';

type AccessHistoryTableFooterProps = {
  table: Table<AccessHistoryTableInfo>;
};
const AccessHistoryTableFooter = ({ table }: AccessHistoryTableFooterProps) => {
  return (
    <Flex alignItems={'center'} justifyContent={'space-between'}>
      <Flex>
        <IconButton
          aria-label={'Back'}
          bottom={0}
          icon={<FiChevronsLeft size={'1.25rem'} />}
          m={'0.5rem'}
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        />
        <IconButton
          aria-label={'Back'}
          bottom={0}
          icon={<FiChevronLeft size={'1.25rem'} />}
          m={'0.5rem'}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        />
      </Flex>
      <Flex>
        <IconButton
          aria-label={'Forward'}
          bottom={0}
          icon={<FiChevronRight size={'1.25rem'} />}
          m={'0.5rem'}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        />
        <IconButton
          aria-label={'Forward'}
          bottom={0}
          icon={<FiChevronsRight size={'1.25rem'} />}
          m={'0.5rem'}
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        />
      </Flex>
    </Flex>
  );
};

export default AccessHistoryTableFooter;

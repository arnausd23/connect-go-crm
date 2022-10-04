import { Flex } from '@chakra-ui/react';
import {
  createColumnHelper,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import {
  AccessHistoryTableInfo,
  TABLE_PAGE_SIZE,
} from '../../../../utils/constants';
import { trpc } from '../../../../utils/trpc';
import CustomTable from '../../../custom-table';
import CustomTableFooter from '../../../custom-table-footer';
import AccessHistoryStatusCell from './access-history-status-cell';

const AccessHistoryPanel = () => {
  const columnHelper = createColumnHelper<AccessHistoryTableInfo>();

  const columns = [
    columnHelper.accessor((row) => row.userPlan.user.name, {
      id: 'userName',
      cell: (info) => info.renderValue(),
      header: () => 'Nombre',
    }),
    columnHelper.accessor((row) => row.userPlan.plan.name, {
      id: 'planName',
      cell: (info) => info.renderValue(),
      header: () => 'Plan',
    }),
    columnHelper.accessor((row) => row.date, {
      id: 'accessDate',
      cell: (info) => info.getValue().toLocaleString('es-BO'),
      header: () => 'Fecha',
    }),
    columnHelper.accessor((row) => row, {
      id: 'status',
      cell: (info) => (
        <AccessHistoryStatusCell
          endingDate={info.getValue().userPlan.endingDate}
        />
      ),
      header: () => <Flex justifyContent={'flex-end'}>{'Estado'}</Flex>,
    }),
  ];

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: TABLE_PAGE_SIZE,
  });

  const defaultData = useMemo(() => [], []);

  const result = trpc.useQuery(
    ['accessHistory.getAll', { skip: pageIndex, take: pageSize }],
    {
      keepPreviousData: true,
    }
  );

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const table = useReactTable({
    data: result.data?.accessHistory ?? defaultData,
    columns,
    pageCount: result.data?.pageCount ?? -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <Flex
      border={'1px solid'}
      borderColor={'light'}
      borderRadius={'lg'}
      flexDir={'column'}
      h={'100%'}
      w={'100%'}
    >
      <CustomTable table={table} />
      <CustomTableFooter table={table} />
    </Flex>
  );
};

export default AccessHistoryPanel;

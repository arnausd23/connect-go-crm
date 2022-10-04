import { Flex } from '@chakra-ui/react';
import {
  createColumnHelper,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { PlansTableInfo, TABLE_PAGE_SIZE } from '../../../utils/constants';
import { trpc } from '../../../utils/trpc';
import CustomTable from '../../custom-table';
import CustomTableFooter from '../../custom-table-footer';

const Plans = () => {
  const columnHelper = createColumnHelper<PlansTableInfo>();

  const columns = [
    columnHelper.accessor((row) => row.user.name, {
      id: 'userName',
      cell: (info) => info.renderValue(),
      header: () => 'Nombre',
    }),
    columnHelper.accessor((row) => row.plan.name, {
      id: 'planName',
      cell: (info) => info.renderValue(),
      header: () => 'Plan',
    }),
    columnHelper.accessor((row) => row.startingDate, {
      id: 'startingDate',
      cell: (info) => info.getValue().toLocaleString('es-BO').split(',')[0],
      header: () => 'Fecha inicial',
    }),
    columnHelper.accessor((row) => row.endingDate, {
      id: 'endingDate',
      cell: (info) => info.getValue().toLocaleString('es-BO').split(',')[0],
      header: () => 'Fecha final',
    }),
  ];

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: TABLE_PAGE_SIZE,
  });

  const defaultData = useMemo(() => [], []);

  const result = trpc.useQuery(
    ['client.getPlans', { skip: pageIndex, take: pageSize }],
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
    data: result.data?.plans ?? defaultData,
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
      bgColor={'dark'}
      borderRadius={'lg'}
      flexDir={'column'}
      h={'100%'}
      p={'1.5rem'}
      w={'100%'}
    >
      <Flex bgColor={'light'} h={'3rem'} w={'100%'} mb={'0.125rem'}></Flex>
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
    </Flex>
  );
};

export default Plans;

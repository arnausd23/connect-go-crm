import { Flex } from '@chakra-ui/react';
import {
  createColumnHelper,
  PaginationState,
  useReactTable,
  getCoreRowModel,
} from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import { ClientsTableInfo, TABLE_PAGE_SIZE } from '../../../utils/constants';
import { trpc } from '../../../utils/trpc';
import CustomTable from '../../custom-table';
import CustomTableFooter from '../../custom-table-footer';
import ClientsActionsCell from './clients-actions-cell';

const ClientsPanel = () => {
  const columnHelper = createColumnHelper<ClientsTableInfo>();

  const columns = [
    columnHelper.accessor((row) => row.name, {
      id: 'name',
      cell: (info) => info.renderValue(),
      header: () => 'Nombre',
    }),
    columnHelper.accessor((row) => row.ci, {
      id: 'ci',
      cell: (info) => info.renderValue(),
      header: () => 'CI',
    }),
    columnHelper.accessor((row) => row.phoneNumber, {
      id: 'phoneNumber',
      cell: (info) => info.getValue(),
      header: () => 'Celular',
    }),
    columnHelper.accessor((row) => row.updatedBy, {
      id: 'updatedBy',
      cell: (info) => info.getValue(),
      header: () => 'Actualizado por',
    }),
    columnHelper.accessor((row) => row, {
      id: 'actions',
      cell: (info) => <ClientsActionsCell data={info.getValue()} />,
      header: () => <Flex justifyContent={'flex-end'}>{'Acciones'}</Flex>,
    }),
  ];

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: TABLE_PAGE_SIZE,
  });

  const defaultData = useMemo(() => [], []);

  const result = trpc.useQuery(
    ['client.getAll', { skip: pageIndex, take: pageSize }],
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
    data: result.data?.clients ?? defaultData,
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

export default ClientsPanel;

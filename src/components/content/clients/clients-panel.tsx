import { Flex, useDisclosure, useToast } from '@chakra-ui/react';
import {
  createColumnHelper,
  PaginationState,
  useReactTable,
  getCoreRowModel,
} from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import { utils, writeFile } from 'xlsx';
import { IExport } from '../../../server/common/validation/schemas';
import { ClientsTableInfo, TABLE_PAGE_SIZE } from '../../../utils/constants';
import { trpc } from '../../../utils/trpc';
import CustomTable from '../../custom/custom-table';
import CustomTableFooter from '../../custom/custom-table-footer';
import ExportDataModal from '../../modals/export-data-modal';
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

  const toast = useToast();
  const [exportData, setExportData] = useState<IExport>({
    fileName: '',
  });

  const { refetch, isLoading } = trpc.useQuery(
    ['client.exportAll', exportData],
    {
      enabled: false,
      retry: false,
      onSuccess(data) {
        const workbook = utils.book_new();
        const worksheet = utils.json_to_sheet(data);
        const headers = ['Nombre', 'CI', 'Celular', 'Actualizado por'];
        utils.sheet_add_aoa(worksheet, [headers], {
          origin: 'A1',
        });
        utils.book_append_sheet(workbook, worksheet);
        writeFile(workbook, `${exportData.fileName}.xlsx`);
        setExportData({
          fileName: '',
        });
        onClose();
      },
      onError: (error) => {
        if (error.data?.zodError?.fieldErrors) {
          for (const [_, value] of Object.entries(
            error.data?.zodError?.fieldErrors
          )) {
            toast({
              description: value,
              duration: 3000,
              isClosable: true,
              status: 'error',
              variant: 'top-accent',
            });
          }
        } else {
          toast({
            description: error.message,
            duration: 3000,
            isClosable: true,
            status: 'error',
            variant: 'top-accent',
          });
        }
      },
    }
  );

  const handleExport = () => {
    refetch();
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

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
      <CustomTableFooter
        table={table}
        exportBody={
          <ExportDataModal
            data={exportData}
            isLoading={isLoading}
            setData={setExportData}
          />
        }
        onClickExport={handleExport}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        isLoading={isLoading}
      />
    </Flex>
  );
};

export default ClientsPanel;

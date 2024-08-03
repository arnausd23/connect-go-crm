import { Button, Flex, Input, useDisclosure, useToast } from '@chakra-ui/react';
import {
  createColumnHelper,
  PaginationState,
  useReactTable,
  getCoreRowModel,
} from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import { FiXSquare } from 'react-icons/fi';
import { utils, writeFile } from 'xlsx';
import {
  IExport,
  IGetClients,
} from '../../../server/common/validation/schemas';
import {
  ClientsTableInfo,
  TABLE_PAGE_SIZE,
  useDebounce,
} from '../../../utils/constants';
import { trpc } from '../../../utils/trpc';
import CustomDatePicker from '../../custom/custom-date-picker';
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

  const [getClientsFilters, setGetClientsFilters] = useState<IGetClients>({
    name: undefined,
    ci: undefined,
    skip: undefined,
    take: undefined,
  });

  const { name, ci } = getClientsFilters;

  const defaultData = useMemo(() => [], []);
  const debouncedName = useDebounce(name, 500);
  const debouncedCI = useDebounce(ci, 500);

  const { data } = trpc.useQuery(
    [
      'client.getAll',
      { skip: pageIndex, take: pageSize, name: debouncedName, ci: debouncedCI },
    ],
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
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
    data: data?.clients ?? defaultData,
    columns,
    pageCount: data?.pageCount ?? -1,
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
    <Flex borderRadius={'lg'} flexDir={'column'} h={'100%'} w={'100%'}>
      <Flex alignItems={'center'} h={'3rem'} w={'100%'}>
        <Flex w={'100%'}>
          <Button
            fontSize={'14px'}
            leftIcon={<FiXSquare size={'1.25rem'} />}
            onClick={() =>
              setGetClientsFilters({
                name: undefined,
                ci: undefined,
              })
            }
            mr={'1px'}
            w={'100%'}
          >
            {'Borrar filtros'}
          </Button>
        </Flex>
        <Flex w={'100%'} ml={'1px'} mr={'1px'}>
          <Input
            bgColor={'white'}
            color={'background'}
            onChange={({ target }) =>
              setGetClientsFilters({
                ...getClientsFilters,
                name: target.value,
              })
            }
            placeholder={'Nombre'}
            value={name || ''}
            variant={'filled'}
            _focus={{ bgColor: 'white' }}
          />
        </Flex>
        <Flex w={'100%'} ml={'1px'} mr={'1px'}>
          <Input
            bgColor={'white'}
            color={'background'}
            onChange={({ target }) =>
              setGetClientsFilters({
                ...getClientsFilters,
                ci: target.value,
              })
            }
            placeholder={'CI'}
            type={'number'}
            value={ci || ''}
            variant={'filled'}
            _focus={{ bgColor: 'white' }}
          />
        </Flex>
      </Flex>
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
    </Flex>
  );
};

export default ClientsPanel;

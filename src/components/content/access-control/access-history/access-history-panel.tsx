import { Button, Flex, Input, useDisclosure, useToast } from '@chakra-ui/react';
import {
  createColumnHelper,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { FiXSquare } from 'react-icons/fi';
import {
  IExportAccessHistory,
  IGetUserPlans,
} from '../../../../server/common/validation/schemas';
import {
  AccessHistoryTableInfo,
  TABLE_PAGE_SIZE,
  useDebounce,
} from '../../../../utils/constants';
import { utils, writeFile } from 'xlsx';
import { trpc } from '../../../../utils/trpc';
import CustomDatePicker from '../../../custom/custom-date-picker';
import CustomTable from '../../../custom/custom-table';
import CustomTableFooter from '../../../custom/custom-table-footer';
import AccessHistoryStatusCell from './access-history-status-cell';
import ExportAccessHistoryDataModal from '../../../modals/export-access-history-data-modal';

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
          date={info.getValue().date}
        />
      ),
      header: () => <Flex justifyContent={'flex-end'}>{'Estado'}</Flex>,
    }),
  ];

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: TABLE_PAGE_SIZE,
  });

  const [getAccessHistoryFilters, setGetAccessHistoryFilters] =
    useState<IGetUserPlans>({
      userName: undefined,
      planName: undefined,
      startingDate: undefined,
      endingDate: undefined,
    });

  const { userName, planName, startingDate, endingDate } =
    getAccessHistoryFilters;

  const defaultData = useMemo(() => [], []);
  const debouncedUserName = useDebounce(userName, 500);
  const debouncedPlanName = useDebounce(planName, 500);

  const result = trpc.useQuery(
    [
      'accessHistory.getAll',
      {
        skip: pageIndex,
        take: pageSize,
        userName: debouncedUserName,
        planName: debouncedPlanName,
        startingDate,
        endingDate,
      },
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

  const toast = useToast();
  const [exportData, setExportData] = useState<IExportAccessHistory>({
    fileName: '',
    userName: undefined,
    planName: undefined,
    startingDate: undefined,
    endingDate: undefined,
  });

  const { refetch: exportRefetch, isLoading } = trpc.useQuery(
    ['accessHistory.export', exportData],
    {
      enabled: false,
      retry: false,
      onSuccess(data) {
        const workbook = utils.book_new();
        const worksheet = utils.json_to_sheet(data);
        const headers = ['Nombre', 'Plan', 'Fecha de Acceso'];
        utils.sheet_add_aoa(worksheet, [headers], {
          origin: 'A1',
        });
        utils.book_append_sheet(workbook, worksheet);
        writeFile(workbook, `${exportData.fileName}.xlsx`);
        setExportData({
          fileName: '',
          userName: undefined,
          planName: undefined,
          startingDate: undefined,
          endingDate: undefined,
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
    exportRefetch();
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
              setGetAccessHistoryFilters({
                userName: undefined,
                planName: undefined,
                startingDate: undefined,
                endingDate: undefined,
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
              setGetAccessHistoryFilters({
                ...getAccessHistoryFilters,
                userName: target.value,
              })
            }
            placeholder={'Nombre'}
            value={userName || ''}
            variant={'filled'}
            _focus={{ bgColor: 'white' }}
          />
        </Flex>
        <Flex w={'100%'} ml={'1px'} mr={'1px'}>
          <Input
            bgColor={'white'}
            color={'background'}
            onChange={({ target }) =>
              setGetAccessHistoryFilters({
                ...getAccessHistoryFilters,
                planName: target.value,
              })
            }
            placeholder={'Plan'}
            value={planName || ''}
            variant={'filled'}
            _focus={{ bgColor: 'white' }}
          />
        </Flex>
        <Flex w={'100%'} ml={'1px'} mr={'1px'}>
          <CustomDatePicker
            date={startingDate}
            disabled={false}
            onChange={(date) =>
              setGetAccessHistoryFilters({
                ...getAccessHistoryFilters,
                startingDate: date,
              })
            }
            placeholder={'Fecha inicial'}
          />
        </Flex>
        <Flex w={'100%'} ml={'1px'}>
          <CustomDatePicker
            date={endingDate}
            disabled={false}
            onChange={(date) =>
              setGetAccessHistoryFilters({
                ...getAccessHistoryFilters,
                endingDate: date,
              })
            }
            placeholder={'Fecha final'}
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
            <ExportAccessHistoryDataModal
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

export default AccessHistoryPanel;

import { Button, Flex, Input } from '@chakra-ui/react';
import {
  createColumnHelper,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { FiXSquare } from 'react-icons/fi';
import { IGetUserPlans } from '../../../../server/common/validation/schemas';
import {
  AccessHistoryTableInfo,
  TABLE_PAGE_SIZE,
  useDebounce,
} from '../../../../utils/constants';
import { trpc } from '../../../../utils/trpc';
import CustomDatePicker from '../../../custom/custom-date-picker';
import CustomTable from '../../../custom/custom-table';
import CustomTableFooter from '../../../custom/custom-table-footer';
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
          exportBody={undefined}
          onClickExport={() => undefined}
          isOpen={false}
          onOpen={() => undefined}
          onClose={() => undefined}
          isLoading={false}
        />
      </Flex>
    </Flex>
  );
};

export default AccessHistoryPanel;

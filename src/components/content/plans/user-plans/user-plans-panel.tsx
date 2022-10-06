import {
  Button,
  Flex,
  Input,
  Select,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  PaginationState,
  useReactTable,
  getCoreRowModel,
} from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import { FiSliders } from 'react-icons/fi';
import { utils, writeFile } from 'xlsx';
import { IExportUserPlans } from '../../../../server/common/validation/schemas';
import {
  UserPlansTableInfo,
  TABLE_PAGE_SIZE,
} from '../../../../utils/constants';
import { trpc } from '../../../../utils/trpc';
import CustomDatePicker from '../../../custom/custom-date-picker';
import CustomTable from '../../../custom/custom-table';
import CustomTableFooter from '../../../custom/custom-table-footer';
import ExportUserPlansDataModal from '../../../modals/export-user-plans-data-modal';
import UserPlansActionsCell from './user-plans-actions-cell';

const UserPlansPanel = () => {
  const columnHelper = createColumnHelper<UserPlansTableInfo>();

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
    columnHelper.accessor((row) => row.updatedBy, {
      id: 'updatedBy',
      cell: (info) => info.getValue(),
      header: () => 'Actualizado por',
    }),
    columnHelper.accessor((row) => row, {
      id: 'actions',
      cell: (info) => <UserPlansActionsCell data={info.getValue()} />,
      header: () => <Flex justifyContent={'flex-end'}>{'Acciones'}</Flex>,
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

  const toast = useToast();
  const [exportData, setExportData] = useState<IExportUserPlans>({
    fileName: '',
    userName: undefined,
    planName: undefined,
    startingDate: undefined,
    endingDate: undefined,
  });

  const { refetch, isLoading } = trpc.useQuery(
    ['client.exportPlans', exportData],
    {
      enabled: false,
      retry: false,
      onSuccess(data) {
        const workbook = utils.book_new();
        const worksheet = utils.json_to_sheet(data);
        const headers = [
          'Nombre',
          'Plan',
          'Fecha inicial',
          'Fecha final',
          'Actualizado por',
        ];
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
    refetch();
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex borderRadius={'lg'} flexDir={'column'} h={'100%'} w={'100%'}>
      <Flex alignItems={'center'} h={'3rem'} mb={'0.125rem'} w={'100%'}>
        <Flex w={'25%'} mr={'1px'}>
          <Button
            bgColor={'blue.400'}
            colorScheme={'blue'}
            fontSize={'14px'}
            leftIcon={<FiSliders size={'1.25rem'} />}
            // isLoading={isLoading}
            // onClick={() => onActionClick()}
            variant={'solid'}
            w={'100%'}
          >
            {'Filtrar'}
          </Button>
        </Flex>
        <Flex w={'25%'} ml={'1px'} mr={'1px'}>
          <Input
            bgColor={'white'}
            color={'background'}
            // disabled={isLoading}
            // onChange={({ target }) => setData!({ ...data, ci: target.value })}
            placeholder={'Nombre'}
            type={'number'}
            // value={data.ci}
            variant={'filled'}
            _focus={{ bgColor: 'white' }}
          />
        </Flex>
        <Flex w={'25%'} ml={'1px'} mr={'1px'}>
          <Select
            bgColor={'white'}
            color={'background'}
            // disabled={isLoading || getAllPlansIsLoading}
            // onChange={({ target }) => setData!({ ...data, name: target.value })}
            // value={data.name}
            placeholder={'Plan'}
            variant={'filled'}
            _focus={{ bgColor: 'white' }}
          >
            {/* {getAllPlansData?.map((plan) => (
          <option key={plan.id} value={plan.name}>
          {plan.name}
          </option>
        ))} */}
          </Select>
        </Flex>
        <Flex w={'25%'} ml={'1px'} mr={'1px'}>
          <CustomDatePicker
            date={undefined}
            disabled={false}
            onChange={(date) => console.log(date)}
            placeholder={'Fecha inicial'}
          />
        </Flex>
        <Flex w={'25%'} ml={'1px'}>
          <CustomDatePicker
            date={undefined}
            disabled={false}
            onChange={(date) => console.log(date)}
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
            <ExportUserPlansDataModal
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

export default UserPlansPanel;

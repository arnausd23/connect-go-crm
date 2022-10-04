import {
  TableContainer,
  Table as ChakraTable,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react';
import { flexRender, Table } from '@tanstack/react-table';
import { AccessHistoryTableInfo } from '../../../../utils/constants';

type AccessHistoryTableProps = {
  table: Table<AccessHistoryTableInfo>;
};

const AccessHistoryTable = ({ table }: AccessHistoryTableProps) => {
  return (
    <TableContainer h={'100%'} overflowY={'auto'}>
      <ChakraTable variant={'simple'} h={'100%'}>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id} color={'white'}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody color={'white'}>
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </ChakraTable>
    </TableContainer>
  );
};

export default AccessHistoryTable;

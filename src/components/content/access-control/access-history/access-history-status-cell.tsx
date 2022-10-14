import { Flex } from '@chakra-ui/react';
import { differenceInCalendarDays } from 'date-fns';

type AccessHistoryStatusCellProps = {
  endingDate: Date;
  date: Date;
};
const AccessHistoryStatusCell = ({
  endingDate,
  date,
}: AccessHistoryStatusCellProps) => {
  const enterDate = new Date(date.valueOf());
  enterDate.setHours(0, 0, 0);
  const daysUntilPlanExpires = differenceInCalendarDays(endingDate, enterDate);
  let status = 'Vigente';
  let bgColor = 'authGreen';

  if (daysUntilPlanExpires <= 3 && daysUntilPlanExpires >= 0) {
    status = `Vence ${
      daysUntilPlanExpires === 0
        ? 'hoy'
        : `en ${daysUntilPlanExpires} día${daysUntilPlanExpires > 1 ? 's' : ''}`
    }`;
    bgColor = 'authYellow';
  } else if (daysUntilPlanExpires < 0) {
    (status = 'Vencido'), (bgColor = 'authRed');
  }

  return (
    <Flex alignItems={'center'} justifyContent={'flex-end'}>
      <Flex>{status}</Flex>
      <Flex
        bgColor={bgColor}
        borderRadius={'sm'}
        h={'0.75rem'}
        ml={'0.5rem'}
        w={'0.75rem'}
      />
    </Flex>
  );
};

export default AccessHistoryStatusCell;

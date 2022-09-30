import { PrismaClient } from '@prisma/client';
import { endOfWeek, startOfWeek, differenceInCalendarDays } from 'date-fns';
import {
  MINUTES_BETWEEN_ACCESS,
  PLAN_ACCESS_TYPE,
} from '../../utils/constants';
import { createAccessHistorySchema } from '../common/validation/schemas';
import { createProtectedRouter } from './protected-router';

export const protectedAccessHistoryRouter = createProtectedRouter().mutation(
  'create',
  {
    input: createAccessHistorySchema,
    async resolve({ input, ctx }) {
      const { ci, date } = input;
      let startOfDate = new Date(date.valueOf());
      let endOfDate = new Date(date.valueOf());
      startOfDate.setHours(0, 0, 0, 0);
      endOfDate.setHours(23, 59, 59, 999);

      const user = await getUserWithActivePlans(
        ctx.prisma,
        ci,
        startOfDate,
        endOfDate
      );

      if (user && user.plans.length > 0) {
        const { plan, startingDate, endingDate } = user.plans[0]!;

        if (plan.accessType === PLAN_ACCESS_TYPE.ThreePerWeek) {
          startOfDate = startOfWeek(date, { weekStartsOn: 1 });
          endOfDate = endOfWeek(date, { weekStartsOn: 1 });
        }

        const lastAccessOfDateRange = await getLastAccessOfDateRange(
          ctx.prisma,
          user.id,
          startOfDate,
          endOfDate,
          plan.accessType === PLAN_ACCESS_TYPE.ThreePerWeek ? undefined : 1
        );

        const { bgColor, footer } = getInfoDaysUntilPlanExpires(
          endingDate,
          date,
          plan.name,
          plan.accessType
        );

        if (lastAccessOfDateRange.length > 0) {
          const { date: lastAccessOfDateRangeDate } = lastAccessOfDateRange[0]!;
          const minsDiff = getMinutesDifferenceBetweenDates(
            date,
            lastAccessOfDateRangeDate
          );

          if (minsDiff > MINUTES_BETWEEN_ACCESS) {
            switch (plan.accessType) {
              case PLAN_ACCESS_TYPE.Unlimited:
                await createAccessHistory(ctx.prisma, user.id, date);
                return {
                  bgColor,
                  endingDate,
                  footer,
                  header: 'Bienvenido',
                  name: user.name,
                  startingDate,
                };
              case PLAN_ACCESS_TYPE.ThreePerWeek:
                if (lastAccessOfDateRange.length < 3) {
                  await createAccessHistory(ctx.prisma, user.id, date);
                  return {
                    bgColor,
                    endingDate,
                    footer,
                    header: 'Bienvenido',
                    name: user.name,
                    startingDate,
                  };
                } else {
                  return {
                    bgColor: '#FF7043',
                    endingDate,
                    footer: 'Has alcanzado tu límite de accesos',
                    header: 'Lo sentimos',
                    name: user.name,
                    startingDate,
                  };
                }
              case PLAN_ACCESS_TYPE.OneSession:
                return {
                  bgColor: '#FF7043',
                  endingDate,
                  footer: 'Has alcanzado tu límite de accesos',
                  header: 'Lo sentimos',
                  name: user.name,
                  startingDate,
                };
              default:
                return {
                  bgColor: '#EF5350',
                  endingDate,
                  footer: 'Plan inválido',
                  header: 'Lo sentimos',
                  name: user.name,
                  startingDate,
                };
            }
          } else {
            return {
              bgColor,
              endingDate,
              footer,
              header: 'Bienvenido',
              name: user.name,
              startingDate,
            };
          }
        } else {
          await createAccessHistory(ctx.prisma, user.id, date);
          return {
            bgColor,
            endingDate,
            footer,
            header: 'Bienvenido',
            name: user.name,
            startingDate,
          };
        }
      } else {
        return {
          bgColor: '#EF5350',
          endingDate: undefined,
          footer: `No cuentas con planes activos`,
          header: 'Lo sentimos',
          name: user ? user.name! : undefined,
          startingDate: undefined,
        };
      }
    },
  }
);

const getUserWithActivePlans = async (
  prisma: PrismaClient,
  ci: string,
  startOfDate: Date,
  endOfDate: Date
) => {
  const user = await prisma.user.findFirst({
    where: { ci },
    select: {
      id: true,
      name: true,
      plans: {
        where: {
          startingDate: { lte: endOfDate },
          endingDate: { gte: startOfDate },
        },
        orderBy: {
          endingDate: 'desc',
        },
        take: 1,
        include: { plan: { select: { name: true, accessType: true } } },
      },
    },
  });
  return user;
};

const getLastAccessOfDateRange = async (
  prisma: PrismaClient,
  userId: string,
  startingDate: Date,
  endingDate: Date,
  maxNumberOfRecords?: number
) => {
  const lastAccess = await prisma.accessHistory.findMany({
    where: {
      userId,
      date: {
        lte: endingDate,
        gte: startingDate,
      },
    },
    orderBy: {
      date: 'desc',
    },
    take: maxNumberOfRecords,
  });
  return lastAccess;
};

const getMinutesDifferenceBetweenDates = (date1: Date, date2: Date) => {
  const msDiff = date1.getTime() - date2.getTime();
  const minsDiff = Math.floor(msDiff / 1000 / 60);
  return minsDiff;
};

const createAccessHistory = async (
  prisma: PrismaClient,
  userId: string,
  date: Date
) => {
  const accessHistory = await prisma.accessHistory.create({
    data: {
      userId,
      date,
    },
  });

  return accessHistory;
};

const getInfoDaysUntilPlanExpires = (
  date1: Date,
  date2: Date,
  planName: string,
  planAccessType: string
) => {
  const daysUntilPlanExpires = differenceInCalendarDays(date1, date2);
  if (
    daysUntilPlanExpires <= 3 &&
    planAccessType !== PLAN_ACCESS_TYPE.OneSession
  ) {
    const footer: string = `Tu plan vence ${
      daysUntilPlanExpires === 0
        ? 'hoy'
        : `en ${daysUntilPlanExpires} día${daysUntilPlanExpires > 1 ? 's' : ''}`
    }`;
    return { bgColor: '#FFCA28', footer };
  }
  return {
    bgColor: '#66BB6A',
    footer: `Plan ${planName}`,
  };
};

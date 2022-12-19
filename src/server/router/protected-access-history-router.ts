import { PrismaClient } from '@prisma/client';
import {
  endOfWeek,
  startOfWeek,
  differenceInCalendarDays,
  isWithinInterval,
  isAfter,
  isBefore,
  addDays,
} from 'date-fns';
import {
  MINUTES_BETWEEN_ACCESS,
  PLAN_ACCESS_TYPE,
} from '../../utils/constants';
import {
  createAccessHistorySchema,
  getUserPlansSchema,
} from '../common/validation/schemas';
import { createProtectedRouter } from './protected-router';

export const protectedAccessHistoryRouter = createProtectedRouter()
  .query('getAll', {
    input: getUserPlansSchema,
    async resolve({ input, ctx }) {
      const { skip, take, userName, planName, startingDate, endingDate } =
        input;

      const newEndingDate = endingDate
        ? new Date(endingDate.valueOf())
        : undefined;
      newEndingDate?.setHours(23, 59, 59, 999);

      const accessHistory = await ctx.prisma.accessHistory.findMany({
        skip: skip && take ? skip * take : undefined,
        take,
        where: {
          userPlan: {
            user: userName
              ? {
                  name: {
                    contains: userName,
                  },
                }
              : undefined,
            plan: planName
              ? {
                  name: {
                    contains: planName,
                  },
                }
              : undefined,
          },
          date:
            startingDate || endingDate
              ? { gte: startingDate, lte: newEndingDate }
              : undefined,
        },
        orderBy: { date: 'desc' },
        select: {
          date: true,
          userPlan: {
            select: {
              user: { select: { name: true } },
              plan: { select: { name: true } },
              endingDate: true,
            },
          },
        },
      });

      const numberOfAccessHistory = await ctx.prisma.accessHistory.count({
        where: {
          userPlan: {
            user: userName
              ? {
                  name: {
                    contains: userName,
                  },
                }
              : undefined,
            plan: planName
              ? {
                  name: {
                    contains: planName,
                  },
                }
              : undefined,
          },
          date:
            startingDate || endingDate
              ? { gte: startingDate, lte: newEndingDate }
              : undefined,
        },
      });
      const pageCount = Math.ceil(numberOfAccessHistory / take!);

      return { accessHistory, pageCount };
    },
  })
  .mutation('create', {
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
        const {
          plan,
          id: userPlanId,
          startingDate,
          endingDate,
          freezedDays,
          freezedStartingDate,
        } = user.plans[0]!;

        let freezedDate = freezedStartingDate
          ? new Date(freezedStartingDate.valueOf())
          : null;

        freezedDate?.setHours(0, 0, 0, 0);

        if (
          freezedDays > 0 &&
          freezedDate &&
          isAfter(date, freezedDate) &&
          isBefore(date, addDays(freezedDate, freezedDays))
        ) {
          console.log(addDays(freezedDate, freezedDays));
          return {
            bgColor: 'authBlue',
            endingDate,
            footer: `Tu plan se encuentra congelado`,
            header: 'Lo sentimos',
            name: user.name,
            startingDate,
          };
        }

        if (plan.accessType === PLAN_ACCESS_TYPE.ThreePerWeek) {
          startOfDate = startOfWeek(date, { weekStartsOn: 1 });
          endOfDate = endOfWeek(date, { weekStartsOn: 1 });
        }

        const lastAccessOfDateRange = await getLastAccessOfDateRange(
          ctx.prisma,
          userPlanId,
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
                await createAccessHistory(ctx.prisma, date, userPlanId);
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
                  await createAccessHistory(ctx.prisma, date, userPlanId);
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
                    bgColor: 'authOrange',
                    endingDate,
                    footer: 'Has alcanzado tu límite de accesos',
                    header: 'Lo sentimos',
                    name: user.name,
                    startingDate,
                  };
                }
              case PLAN_ACCESS_TYPE.OneSession:
                return {
                  bgColor: 'authOrange',
                  endingDate,
                  footer: 'Has alcanzado tu límite de accesos',
                  header: 'Lo sentimos',
                  name: user.name,
                  startingDate,
                };
              default:
                return {
                  bgColor: 'authRed',
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
          await createAccessHistory(ctx.prisma, date, userPlanId);
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
          bgColor: 'authRed',
          endingDate: undefined,
          footer: `No cuentas con planes activos`,
          header: 'Lo sentimos',
          name: user ? user.name! : undefined,
          startingDate: undefined,
        };
      }
    },
  });

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
        select: {
          id: true,
          startingDate: true,
          endingDate: true,
          freezedDays: true,
          freezedStartingDate: true,
          plan: { select: { name: true, accessType: true } },
        },
      },
    },
  });
  return user;
};

const getLastAccessOfDateRange = async (
  prisma: PrismaClient,
  userPlanId: string,
  startingDate: Date,
  endingDate: Date,
  maxNumberOfRecords?: number
) => {
  const lastAccess = await prisma.accessHistory.findMany({
    where: {
      userPlanId,
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
  date: Date,
  userPlanId: string
) => {
  const accessHistory = await prisma.accessHistory.create({
    data: {
      date,
      userPlanId,
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
    const footer = `Tu plan vence ${
      daysUntilPlanExpires === 0
        ? 'hoy'
        : `en ${daysUntilPlanExpires} día${daysUntilPlanExpires > 1 ? 's' : ''}`
    }`;
    return { bgColor: 'authYellow', footer };
  }
  return {
    bgColor: 'authGreen',
    footer: `Plan ${planName}`,
  };
};

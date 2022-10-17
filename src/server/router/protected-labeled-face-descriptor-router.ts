import { deleteSchema } from '../common/validation/schemas';
import { createProtectedRouter } from './protected-router';

export const protectedLabeledFaceDescriptorRouter =
  createProtectedRouter().query('getAll', {
    async resolve({ ctx }) {
      const labeledFaceDescriptors =
        await ctx.prisma.labeledFaceDescriptor.findMany();

      return labeledFaceDescriptors;
    },
  });

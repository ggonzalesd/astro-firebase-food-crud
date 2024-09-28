import { serverAuth } from '@/firebase/server/config';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const auth = {
  updateRole: defineAction({
    input: z.object({
      token: z.string(),
      uid: z.string(),
      privileges: z.number(),
    }),
    handler: async ({ privileges, ...input }) => {
      const result = await serverAuth.verifyIdToken(input.token);
      const userPriv =
        typeof result.privileges === 'number' ? result.privileges : 0;

      if (userPriv <= privileges) {
        throw new Error('No allowed privileges');
      }

      await serverAuth.setCustomUserClaims(input.uid, { privileges });

      return true;
    },
  }),

  deleteUser: defineAction({
    input: z.object({
      token: z.string(),
      uid: z.string(),
    }),
    handler: async ({ token, uid }) => {
      const adminResult = await serverAuth.verifyIdToken(token);
      const userResult = await serverAuth.getUser(uid);

      const adminPriv =
        typeof adminResult.privileges === 'number' ? adminResult.privileges : 0;
      const userPriv =
        typeof userResult?.customClaims?.privileges === 'number'
          ? userResult.customClaims.privileges
          : 0;

      if (adminPriv === 6 && userPriv !== 6) {
        await serverAuth.deleteUser(uid);
        return true;
      }

      throw new Error('Not privileges');
    },
  }),
};

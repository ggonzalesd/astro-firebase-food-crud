import { getConfig, updateConfig } from '@/firebase/server';
import { serverAuth } from '@/firebase/server/config';
import { onlyPrivileges, Privileges } from '@/utils/privileges';
import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const config = {
  get: defineAction({
    handler: async (_, context) => {
      const token = context.cookies.get('user-token')?.value ?? '';
      const res = await serverAuth.verifyIdToken(token);
      const priv = typeof res.privileges === 'number' ? res.privileges : 0;

      if (!onlyPrivileges(Privileges.READ, priv)) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'Not Privileges',
        });
      }

      return await getConfig();
    },
  }),
  save: defineAction({
    input: z.object({
      // updated: z.number(),
      breakfastStart: z.number().positive().max(24),
      breakfastEnd: z.number().positive().max(24),
      lunchStart: z.number().positive().max(24),
      lunchEnd: z.number().positive().max(24),
      dinnerStart: z.number().positive().max(24),
      dinnerEnd: z.number().positive().max(24),
      open: z.boolean(),
      working: z.boolean(),
      picking: z.number(),
      delivery: z.number(),
    }),
    accept: 'form',
    handler: async (input, context) => {
      const token = context.cookies.get('user-token')?.value ?? '';
      const res = await serverAuth.verifyIdToken(token);
      const priv = typeof res.privileges === 'number' ? res.privileges : 0;

      if (!onlyPrivileges(Privileges.MOD, priv)) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'Not Privileges',
        });
      }

      const {
        breakfastEnd,
        breakfastStart,
        dinnerStart,
        dinnerEnd,
        lunchEnd,
        lunchStart,
        ...data
      } = input;

      const result = await updateConfig({
        updated: new Date().getTime(),
        breakfast: {
          start: breakfastStart,
          end: breakfastEnd,
        },
        dinner: {
          start: dinnerStart,
          end: dinnerEnd,
        },
        lunch: {
          start: lunchStart,
          end: lunchEnd,
        },
        ...data,
      });

      return result.toDate().getTime();
    },
  }),
};

import { deleteOneFood } from '@/firebase/server';
import { serverAuth } from '@/firebase/server/config';
import { onlyPrivileges, Privileges } from '@/utils/privileges';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const foods = {
  deleteOne: defineAction({
    input: z.object({
      token: z.string(),
      id: z.string(),
    }),
    handler: async (input) => {
      const result = await serverAuth.verifyIdToken(input.token);
      const priv =
        typeof result.privileges === 'number' ? result.privileges : 0;

      if (!onlyPrivileges(Privileges.DELETE, priv)) {
        throw new Error('Error not privilegies');
      }

      await deleteOneFood(input.id);

      return true;
    },
  }),
};

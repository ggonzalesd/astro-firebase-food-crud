import { setMenu } from '@/firebase/server';
import { serverAuth } from '@/firebase/server/config';
import { onlyPrivileges, Privileges } from '@/utils/privileges';
import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';

const simplefoodschema = z.object({
  slug: z.string(),
  name: z.string(),
  price: z.number(),
});

const menufoodschema = simplefoodschema.extend({
  description: z.string(),
  image: z.string(),
  extra: z.array(simplefoodschema).optional(),
});

export const menu = {
  update: defineAction({
    input: z.object({
      intro: z.array(menufoodschema),
      menu: z.array(menufoodschema),
      other: z.array(menufoodschema),
    }),
    handler: async (input, context) => {
      const token = context.cookies.get('user-token')?.value ?? '';
      const result = await serverAuth.verifyIdToken(token);
      const priv =
        typeof result.privileges === 'number' ? result.privileges : 0;

      if (!onlyPrivileges(Privileges.WRITE, priv)) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'Not Privileges',
        });
      }

      return `${await setMenu(input)}`;
    },
  }),
};

import { setMenu } from '@/firebase/server';
import { defineAction } from 'astro:actions';
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
    handler: async (input) => {
      console.log(await setMenu(input));
    },
  }),
};

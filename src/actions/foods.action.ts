import {
  deleteOneFood,
  getOneFoodBySlug,
  saveOneFood,
  uploadImageBuffer,
} from '@/firebase/server';
import { serverAuth } from '@/firebase/server/config';
import { onlyPrivileges, Privileges } from '@/utils/privileges';
import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const foods = {
  addOne: defineAction({
    input: z.object({
      name: z.string().trim(),
      slug: z
        .string()
        .min(4)
        .regex(/^[a-z0-9]+(?:[_-][a-z0-9]+)*$/, { message: 'Must to be slug' }),
      description: z.string().trim(),
      image: z.string().trim(),
      price: z.number().finite(),
      category: z.string().trim(),
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

      const exists = await getOneFoodBySlug(input.slug.trim());

      if (exists) {
        throw new ActionError({
          code: 'CONFLICT',
          message: `slug '${input.slug}' taken`,
        });
      }

      const { image, ...payload } = input;

      const imageBuffer = Buffer.from(image, 'base64');

      const imageUrl = await uploadImageBuffer(imageBuffer, payload.slug);

      const newFood = await saveOneFood({ ...payload, image: imageUrl });

      if (!newFood) {
        throw new ActionError({
          code: 'UNPROCESSABLE_CONTENT',
          message: 'Something is wrong',
        });
      }

      return newFood;
    },
  }),

  deleteOne: defineAction({
    input: z.object({
      id: z.string(),
    }),
    handler: async (input, context) => {
      const token = context.cookies.get('user-token')?.value ?? '';
      const result = await serverAuth.verifyIdToken(token);
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

import { saveImage, deleteImage } from '@/cloudinary';
import {
  deleteOneFood,
  getOneFoodBySlug,
  saveOneFood,
  updateFood,
} from '@/firebase/server';
import { serverAuth } from '@/firebase/server/config';
import { onlyPrivileges, Privileges } from '@/utils/privileges';
import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const foods = {
  updateOne: defineAction({
    input: z.object({
      id: z.string(),
      slug: z.string(),
      name: z.string().trim(),
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

      if (!onlyPrivileges(Privileges.UPDATE, priv)) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'Not Privileges',
        });
      }

      const one = await getOneFoodBySlug(input.slug);
      if (!one) {
        throw new ActionError({ code: 'NOT_FOUND', message: 'Food not found' });
      }

      if (input.image.length > 1) {
        const imageBuffer = Buffer.from(input.image, 'base64');
        const imageUrl = await saveImage(imageBuffer, one.slug);
        input.image = imageUrl ?? '';
      } else {
        input.image = one.image ?? '';
      }
      input.slug = one.slug;
      const { id, ...data } = input;

      await updateFood(id, data);

      return input;
    },
  }),

  addOne: defineAction({
    input: z.object({
      name: z.string().trim(),
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

      const slug =
        input.name
          .trim()
          .replace(/[^\x00-\x7F]+/g, 'x')
          .replace(/\s+/g, '-') + `-${Math.random() * 1e7 + 1e7}`.slice(0, 9);

      const exists = await getOneFoodBySlug(slug);

      if (exists) {
        throw new ActionError({
          code: 'CONFLICT',
          message: `slug '${slug}' taken`,
        });
      }

      const { image, ...payload } = input;

      const imageBuffer = Buffer.from(image, 'base64');
      const imageUrl = await saveImage(imageBuffer, slug);

      const newFood = await saveOneFood({
        ...payload,
        slug,
        image: imageUrl ?? '',
      });

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
      slug: z.string(),
    }),
    handler: async (input, context) => {
      const token = context.cookies.get('user-token')?.value ?? '';
      console.log(context.request.headers.get('cookie'));
      console.log(context.request.headers);
      const result = await serverAuth.verifyIdToken(token);

      const priv =
        typeof result.privileges === 'number' ? result.privileges : 0;

      if (!onlyPrivileges(Privileges.DELETE, priv)) {
        throw new Error('Error not privilegies');
      }

      await deleteOneFood(input.id);
      await deleteImage(input.slug);

      return true;
    },
  }),
};

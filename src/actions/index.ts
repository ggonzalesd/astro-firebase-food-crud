import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
  getHelloWorld: defineAction({
    input: z.object({
      name: z.string(),
    }),
    handler: async (input) => {
      const message = `Hello, ${input.name}`;

      return message;
    },
  }),
};

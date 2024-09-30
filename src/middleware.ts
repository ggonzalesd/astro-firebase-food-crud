import { defineMiddleware } from 'astro:middleware';
import { getUserPayload, onlyPrivileges, Privileges } from './utils/privileges';

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname;

  if (path.startsWith('/admin') && !path.startsWith('/admin/validate')) {
    const payload = await getUserPayload(context);
    if (!onlyPrivileges(Privileges.READ, payload)) {
      return context.redirect('/login');
    }
  }

  return next();
});

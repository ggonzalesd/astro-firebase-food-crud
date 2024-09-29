import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete('user-token', { sameSite: 'strict', secure: true });
  return redirect('/login');
};

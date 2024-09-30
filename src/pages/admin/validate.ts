import { serverAuth } from '@/firebase/server/config';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const token = url.searchParams.get('token');

  try {
    if (token) {
      await serverAuth.verifyIdToken(token);

      cookies.set('user-token', token, {
        sameSite: 'strict',
        secure: import.meta.env.PROD,
        path: '/',
        maxAge: 60 * 60,
      });

      return redirect('/admin');
    } else {
      throw new Error('No Token');
    }
  } catch (error) {
    cookies.delete('user-token');
    return redirect('/login?error=true');
  }
};

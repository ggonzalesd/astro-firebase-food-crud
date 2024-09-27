import type { AstroCookies } from 'astro';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { serverAuth } from '@/firebase/server/config';

export const enum Privileges {
  PUBLIC = 0,
  READ = 1,
  WRITE = 2,
  UPDATE = 3,
  DELETE = 4,
  MOD = 5,
  ADMIN = 6,
}

export const getUserPayload = async (Astro: { cookies: AstroCookies }) => {
  const cookieToken = Astro.cookies.get('user-token');
  if (!cookieToken || !cookieToken.value) {
    return undefined;
  }

  try {
    const token = cookieToken.value;
    const decodedtoken = await serverAuth.verifyIdToken(token);
    return decodedtoken;
  } catch (error) {
    return undefined;
  }
};

export const getPrivilegesFromPayload = (payload?: DecodedIdToken) => {
  if (
    payload &&
    payload.privileges !== undefined &&
    typeof payload.privileges === 'number'
  ) {
    return payload.privileges;
  }
  return 0;
};

export const onlyPrivileges = (
  only: Privileges,
  current: number | DecodedIdToken | undefined,
) => {
  if (current === undefined) return false;

  if (typeof current === 'number') return current >= only;

  return getPrivilegesFromPayload(current) >= only;
};

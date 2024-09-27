import type { IdTokenResult } from 'firebase/auth';
import { atom, onMount } from 'nanostores';
import Cookies from 'js-cookie';

const AUTH_KEY = 'x-auth-user';
const AUTH_TOKEN = 'user-token';

interface UserType {
  uid: string | null;
  display: string | null;
  email: string | null;
  src: string | null;
  payload: IdTokenResult;
}

type AuthState = {
  status: 'NO_AUTHENTICATED' | 'AUTHENTICATED' | 'CHECKING';
  error?: string;
  user?: UserType;
};

export const authStore = atom<AuthState>({
  user: undefined,
  status: 'NO_AUTHENTICATED',
  error: undefined,
});

onMount(authStore, () => {
  const user = JSON.parse(localStorage.getItem(AUTH_KEY) ?? '{}') as UserType;

  if (!!user && typeof user === 'object' && user.payload) {
    authStore.set({ user, status: 'AUTHENTICATED', error: undefined });
  }
});

export function authChecking() {
  localStorage.removeItem(AUTH_KEY);
  Cookies.remove(AUTH_TOKEN);
  authStore.set({ user: undefined, error: undefined, status: 'CHECKING' });
}

export function authLogin(user: UserType) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  Cookies.set(AUTH_TOKEN, user.payload.token, {
    expires: 1,
    secure: true,
    sameSite: 'strict',
  });
  authStore.set({ user, error: undefined, status: 'AUTHENTICATED' });
}

export function authLogout() {
  localStorage.removeItem(AUTH_KEY);
  Cookies.remove(AUTH_TOKEN);
  authStore.set({
    user: undefined,
    error: undefined,
    status: 'NO_AUTHENTICATED',
  });
}

export function authError(error: string) {
  localStorage.removeItem(AUTH_KEY);
  Cookies.remove(AUTH_TOKEN);
  authStore.set({ user: undefined, error, status: 'NO_AUTHENTICATED' });
}

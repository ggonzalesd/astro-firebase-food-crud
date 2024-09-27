import { atom, onMount, task } from 'nanostores';

const AUTH_KEY = 'x-auth-user';

interface UserType {
  uid: string | null;
  display: string | null;
  email: string | null;
  src: string | null;
  token: string;
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

  if (!!user && typeof user === 'object' && user.token) {
    authStore.set({ user, status: 'AUTHENTICATED', error: undefined });
  }
});

export function authChecking() {
  localStorage.removeItem(AUTH_KEY);
  authStore.set({ user: undefined, error: undefined, status: 'CHECKING' });
}

export function authLogin(user: UserType) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  authStore.set({ user, error: undefined, status: 'AUTHENTICATED' });
}

export function authLogout() {
  localStorage.removeItem(AUTH_KEY);
  authStore.set({
    user: undefined,
    error: undefined,
    status: 'NO_AUTHENTICATED',
  });
}

export function authError(error: string) {
  localStorage.removeItem(AUTH_KEY);
  authStore.set({ user: undefined, error, status: 'NO_AUTHENTICATED' });
}

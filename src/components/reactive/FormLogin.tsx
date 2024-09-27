import { useMemo, useState } from 'react';
import { useStore } from '@nanostores/react';
import cn from 'classnames';
import {
  loginWithEmailAndPassword,
  loginWithGoogle,
  registerWithEmailAndPassword,
} from '@/firebase/client';

import { authChecking, authError, authLogin, authStore } from '@/state';

import InputText from './InputText';

import googlesvg from '@/assets/logos/google.svg';

const initialState = {
  email: '',
  password: '',
  display: '',
};

export default function FormLogin() {
  const $auth = useStore(authStore);
  const disabled = useMemo(() => $auth.status === 'CHECKING', [$auth.status]);

  const [view, setView] = useState<'register' | 'login'>('register');
  const [state, setState] = useState(initialState);

  // Change Inputs
  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setState((value) => ({ ...value, [e.target.name]: e.target.value }));
  };

  // Login with Google
  const onLoginWithGoogle = async () => {
    authChecking();
    const result = await loginWithGoogle();

    if (result.ok && result.body) {
      authLogin(result.body);
      window.location.replace('/admin');
    } else {
      authError(result.error?.message ?? 'Error');
    }
  };

  // Login with Email and Password
  const onLoginSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    authChecking();
    e.preventDefault();
    const result = await loginWithEmailAndPassword(state.email, state.password);
    if (result.ok && result.body) {
      authLogin(result.body);
      window.location.replace('/admin');
    } else {
      authError(result.error?.message ?? 'Error');
    }
  };

  // Register with Email and Password
  const onRegisterSubmit: React.FormEventHandler<HTMLFormElement> = async (
    e,
  ) => {
    authChecking();
    e.preventDefault();

    const result = await registerWithEmailAndPassword(
      state.email,
      state.password,
      state.display,
    );

    if (result.ok && result.body) {
      authLogin(result.body);
      window.location.replace('/admin');
    } else {
      authError(result.error?.message ?? 'Error');
    }
  };

  return (
    <section className='flex flex-col gap-2 rounded-md bg-zinc-100 p-4'>
      <div className='grid grid-cols-2 gap-2'>
        <button
          disabled={disabled}
          type='button'
          className={cn(
            'rounded-md disabled:pointer-events-none disabled:bg-zinc-400',
            {
              ['bg-blue-600 text-white']: view === 'login',
            },
          )}
          onClick={() => setView('login')}
        >
          Login
        </button>
        <button
          disabled={disabled}
          type='button'
          className={cn(
            'rounded-md disabled:pointer-events-none disabled:bg-zinc-400',
            {
              ['bg-blue-600 text-white']: view === 'register',
            },
          )}
          onClick={() => setView('register')}
        >
          Register
        </button>
      </div>

      <form
        className='flex flex-col gap-2'
        onSubmit={view === 'login' ? onLoginSubmit : onRegisterSubmit}
      >
        {$auth.error && <span>{$auth.error}</span>}

        {view === 'register' && (
          <InputText
            disabled={disabled}
            labelName='Display'
            name='display'
            placeholder='Insert Display Name'
            value={state.display}
            onChange={onChange}
          />
        )}

        <InputText
          disabled={disabled}
          labelName='Email'
          name='email'
          placeholder='Insert Email'
          value={state.email}
          onChange={onChange}
        />

        <InputText
          disabled={disabled}
          labelName='Password'
          type='password'
          name='password'
          placeholder='Insert Password'
          value={state.password}
          onChange={onChange}
        />

        <button
          disabled={disabled}
          type='submit'
          className='my-4 rounded-md bg-sky-800 p-2 text-white disabled:pointer-events-none disabled:bg-zinc-500'
        >
          Register
        </button>
      </form>
      <div className='h-[2px] w-full bg-zinc-300' />

      <button
        disabled={disabled}
        className='flex items-center gap-2 rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:pointer-events-none disabled:bg-zinc-600'
        onClick={onLoginWithGoogle}
      >
        <div className='flex items-center justify-center rounded-md bg-white p-1'>
          <img {...googlesvg} className='inline-block' alt='google' />
        </div>
        Sign in with Google
      </button>
    </section>
  );
}

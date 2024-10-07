import React, { useMemo, useState } from 'react';
import { authStore } from '@/state';
import { useStore } from '@nanostores/react';
import type { UserRecord } from 'firebase-admin/auth';
import { actions } from 'astro:actions';

interface Props {
  uid: string;
  privileges: number;
  setUser: React.Dispatch<React.SetStateAction<UserRecord[]>>;
}

export default function DeleteButton({ uid, privileges, setUser }: Props) {
  const [disabled, setDisabled] = useState(false);
  const $auth = useStore(authStore);

  const priv = useMemo(() => {
    const p = $auth.user?.payload.claims.privileges;
    return typeof p === 'number' ? p : 0;
  }, []);

  return (
    priv === 6 && (
      <React.Fragment>
        <button
          disabled={disabled || privileges === 6}
          className='rounded-md bg-red-700 hover:bg-red-600 disabled:pointer-events-none disabled:saturate-0'
          onClick={async () => {
            setDisabled(true);
            const { error } = await actions.auth.deleteUser({
              token: $auth.user?.payload.token ?? '',
              uid: uid,
            });
            setDisabled(false);

            if (!error) {
              setUser((users) => users.filter((user) => user.uid !== uid));
            }
          }}
        >
          <span className='sr-only'>Delete User</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='size-8 text-white'
            width='1em'
            height='1em'
            viewBox='0 0 24 24'
          >
            <path
              fill='currentColor'
              d='M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z'
            />
          </svg>
        </button>
      </React.Fragment>
    )
  );
}

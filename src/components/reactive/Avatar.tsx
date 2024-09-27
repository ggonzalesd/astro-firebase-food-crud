import { authLogout, authStore } from '@/state';
import { useStore } from '@nanostores/react';

import avatarDefault from '@/assets/avatar.svg';
import { useEffect, useState } from 'react';
import { logoutFirebase } from '@/firebase/client';

export default function Avatar() {
  const [hydration, setHydration] = useState(false);
  const $auth = useStore(authStore);

  useEffect(() => {
    setHydration(true);
  }, []);

  return hydration ? (
    $auth.user ? (
      <button
        className='group flex items-center gap-2 rounded-full bg-blue-800 hover:pl-4'
        onClick={() => {
          logoutFirebase().then(() => {
            authLogout();
          });
        }}
      >
        <span className='hidden group-hover:inline'>Logout</span>
        <img
          className='aspect-square h-auto w-10 rounded-full bg-zinc-800 object-cover object-center'
          src={$auth.user?.src ?? avatarDefault.src}
          alt='Avatar'
        />
      </button>
    ) : (
      <div className='aspect-square h-auto w-10 rounded-full bg-blue-900'></div>
    )
  ) : (
    <div className='aspect-square h-auto w-10 animate-pulse rounded-full bg-zinc-600'></div>
  );
}

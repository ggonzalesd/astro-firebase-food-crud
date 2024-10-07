import type { UserRecord } from 'firebase-admin/auth';
import cn from 'classnames';
import { useMemo, useState } from 'react';
import { useStore } from '@nanostores/react';
import { authStore } from '@/state';
import { actions } from 'astro:actions';

interface Props {
  uid: string;
  privileges: number;
  setUser: React.Dispatch<React.SetStateAction<UserRecord[]>>;
}

const texts: Record<number, string> = {
  0: 'Not Allowed',
  1: 'Read',
  2: 'Write',
  3: 'Update',
  4: 'Delete',
  5: 'Mod',
  6: 'Admin',
};

const styles: Record<number, string> = {
  0: 'bg-zinc-800 text-white',
  1: 'bg-slate-600 text-white',
  2: 'bg-sky-500 text-white',
  3: 'bg-yellow-300 text-black',
  4: 'bg-indigo-600 text-white',
  5: 'bg-green-600 text-white',
  6: 'bg-red-700 text-white',
};

export default function PrivilegesTag({ uid, privileges, setUser }: Props) {
  const $auth = useStore(authStore);
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const userPriv = useMemo(() => {
    return typeof $auth.user?.payload.claims.privileges === 'number'
      ? $auth.user?.payload.claims.privileges
      : 0;
  }, [$auth]);

  const color = useMemo(() => {
    if (privileges <= 0) return 0;
    if (privileges >= 6) return 6;
    return privileges;
  }, [privileges]);

  const text = useMemo(() => {
    return texts[color] ?? 'Not Allowed';
  }, [color]);

  return (
    <div className='relative'>
      <button
        type='button'
        className={cn(
          'inline-flex w-full items-center justify-center rounded-md px-1 text-center font-bold',
          styles[color],
        )}
        onClick={() => {
          if (userPriv >= 5 && privileges < userPriv) {
            setShow((value) => !value);
          }
        }}
      >
        {text}{' '}
        <span className={cn(!error ? 'sr-only' : 'inline-block text-red-200')}>
          [{error}]
        </span>
      </button>

      {show && (
        <div className='absolute left-0 top-full z-50 grid w-full grid-cols-2 gap-2 border-[1px] border-zinc-400 bg-zinc-200 p-2'>
          {[...new Uint8Array(7)]
            .filter((_, index) => index < userPriv)
            .map((_, index) => (
              <button
                key={index}
                className={cn('rounded-md', styles[index])}
                onClick={async () => {
                  const oldPriv = privileges;
                  setUser((users) =>
                    users.map((user) => {
                      if (user.uid === uid) {
                        return {
                          ...user,
                          customClaims: { privileges: index } as any,
                        } as UserRecord;
                      }
                      return user;
                    }),
                  );
                  setError(undefined);
                  setShow(false);

                  const { error } = await actions.auth.updateRole({
                    uid,
                    privileges: index,
                    token: $auth.user?.payload.token ?? '',
                  });

                  if (error) {
                    setError(error.name);
                    setUser((users) =>
                      users.map((user) => {
                        if (user.uid === uid) {
                          return {
                            ...user,
                            customClaims: { privileges: oldPriv } as any,
                          } as UserRecord;
                        }
                        return user;
                      }),
                    );
                  }
                }}
              >
                {texts[index]}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

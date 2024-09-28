import type { UserRecord } from 'firebase-admin/auth';
import cn from 'classnames';
import { useStore } from '@nanostores/react';
import PrivilegesTag from './PrivilegesTag';
import { authStore } from '@/state';

import avatarIcon from '@/assets/avatar.svg';
import DeleteButton from './DeleteButton';

interface Props {
  user: UserRecord;
  setUser: React.Dispatch<React.SetStateAction<UserRecord[]>>;
}

export default function UserCard({ user, setUser }: Props) {
  const $auth = useStore(authStore);
  const priv = user.customClaims?.privileges ?? 0;

  return (
    <div
      className={cn(
        'relative -z-0 flex flex-col gap-2 rounded-md border-[1px] border-zinc-400 p-2',
        $auth.user?.uid === user.uid ? 'bg-green-200' : 'bg-zinc-200',
      )}
    >
      <PrivilegesTag uid={user.uid} privileges={priv} setUser={setUser} />
      <div className='flex gap-2'>
        <img
          className='aspect-square size-20 rounded-md bg-zinc-900 object-contain object-center text-white'
          src={user.photoURL ?? avatarIcon.src}
          alt={`Image of ${user.displayName}`}
        />
        <div className='flex flex-grow flex-col'>
          <span>{user.displayName ?? user.uid}</span>
          <span className='text-sm'>{user.email}</span>
          <div>
            <DeleteButton uid={user.uid} privileges={priv} setUser={setUser} />
          </div>
        </div>
      </div>
    </div>
  );
}

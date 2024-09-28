import type { UserRecord } from 'firebase-admin/auth';
import UserCard from '../reactive/UserCard';
import { useState } from 'react';

interface Props {
  users: UserRecord[];
}

export default function ListUsers({ users }: Props) {
  const [usersState, setUsers] = useState(users);

  return (
    <section className='mx-auto h-full max-w-screen-lg flex-grow'>
      <div className='grid flex-grow grid-cols-1 gap-4 border-x border-zinc-300 p-4 md:grid-cols-2 lg:grid-cols-3'>
        {usersState.map((user) => (
          <UserCard key={user.uid} user={user} setUser={setUsers} />
        ))}
      </div>
    </section>
  );
}

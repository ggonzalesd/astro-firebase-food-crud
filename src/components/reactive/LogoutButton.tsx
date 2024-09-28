import { logoutFirebase } from '@/firebase/client';
import { authLogout } from '@/state';

export default function LogoutButton() {
  return (
    <button
      className='flex w-full items-center justify-center rounded-md border-[1px] border-red-400 bg-red-300 group-hover:bg-red-200'
      onClick={() => {
        logoutFirebase().then(() => {
          authLogout();
          window.location.replace('/login');
        });
      }}
    >
      <span className='sr-only md:not-sr-only'>Logout</span>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='1em'
        height='1em'
        viewBox='0 0 24 24'
        className='size-8'
      >
        <g
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
        >
          <path d='M14 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2'></path>
          <path d='M9 12h12l-3-3m0 6l3-3'></path>
        </g>
      </svg>
    </button>
  );
}

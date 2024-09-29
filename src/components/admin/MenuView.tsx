import type { Food } from '@/models/food.model';
import { menuDisabled, menuReset, menuStore } from '@/state';

import { useStore } from '@nanostores/react';
import { actions } from 'astro:actions';
import { useEffect } from 'react';
import AddMenu from '../reactive/AddMenu';
import MenuTable from '../reactive/MenuTable';

interface Props {
  menu?: MenuType;
  foods: Food[];
}

export default function MenuView({ menu: m, foods }: Props) {
  const $menu = useStore(menuStore);

  useEffect(() => {
    menuReset(m);
  }, [m]);

  return (
    <section className='mx-auto w-full max-w-screen-md px-4 py-4 lg:max-w-screen-lg'>
      <button
        disabled={$menu.disabled}
        className='rounded-md bg-sky-800 px-2 py-1 text-white hover:bg-sky-700 disabled:pointer-events-none disabled:animate-pulse disabled:saturate-0'
        onClick={async () => {
          menuDisabled(true);
          await actions.menu.update($menu.menu);
          menuDisabled(false);
        }}
      >
        {$menu.disabled ? 'Uploading...' : 'Upload'}
      </button>

      {$menu.open && <AddMenu foods={foods} />}

      <MenuTable category='intro' />
      <MenuTable category='menu' />
      <MenuTable category='other' />
    </section>
  );
}

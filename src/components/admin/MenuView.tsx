import type { Food } from '@/models/food.model';
import {
  menuAddSelected,
  menuDelete,
  menuOpen,
  menuReset,
  menuSelect,
  menuSelection,
  menuSelectToEdit,
  menuStore,
} from '@/state';

import { useStore } from '@nanostores/react';
import { actions } from 'astro:actions';
import { useState, useEffect } from 'react';

interface Props {
  menu?: MenuType;
  foods: Food[];
}

export default function MenuView({ menu: m, foods }: Props) {
  const $menu = useStore(menuStore);

  useEffect(() => {
    menuReset(m);
  }, [m]);

  const [openMenu, setOpenMenu] = useState(false);

  return (
    <section className='mx-auto w-full max-w-screen-md px-4 lg:max-w-screen-lg'>
      <button
        onClick={async () => {
          await actions.menu.update($menu.menu);
        }}
      >
        Upload
      </button>
      <button
        onClick={() => {
          menuOpen('menu');
          setOpenMenu(true);
        }}
      >
        Add New
      </button>

      {openMenu && (
        <div className='absolute left-0 top-0 flex size-full items-center justify-center bg-black/75'>
          <div className='flex flex-col bg-zinc-300'>
            <div className='flex justify-between'>
              <span className='p-2 text-lg font-bold underline'>
                {$menu.index !== undefined ? 'Edit Food' : 'Add Food'}
              </span>
              <div className='flex items-center gap-2 px-2'>
                <button
                  className='rounded-md bg-green-500 px-1'
                  onClick={() => {
                    menuAddSelected();
                    setOpenMenu(false);
                  }}
                >
                  Add
                </button>
                <button
                  className='rounded-md bg-red-500 px-1'
                  onClick={() => setOpenMenu(false)}
                >
                  Close
                </button>
              </div>
            </div>

            {$menu.selected && (
              <div className='flex flex-col gap-2'>
                <div className='flex px-2'>
                  <button
                    className='group flex items-center overflow-hidden rounded-md bg-zinc-700 text-white hover:bg-red-950'
                    onClick={() => menuSelect()}
                  >
                    <img
                      src={$menu.selected.image}
                      width={8}
                      className='size-8'
                    />
                    <span className='inline-flex p-1 group-hover:hidden'>
                      {$menu.selected.name}
                    </span>
                    <span className='hidden px-4 group-hover:inline-flex'>
                      DELETE
                    </span>
                  </button>
                </div>
                <div className='flex gap-2 px-2'>
                  {$menu.selected.extra &&
                    $menu.selected.extra.map((ex) => (
                      <span
                        key={ex.slug}
                        className='rounded-md bg-sky-700 px-1 text-white'
                      >
                        {ex.name}
                      </span>
                    ))}
                </div>
              </div>
            )}
            <div className='grid max-h-[80vh] grid-cols-2 gap-4 overflow-y-auto p-2 md:grid-cols-3'>
              {foods
                .filter(({ category }) =>
                  $menu.selected ? category === 'extra' : category === 'menu',
                )
                .map((food, index) => (
                  <button
                    key={`${food.slug}-${index}`}
                    className='flex flex-col overflow-hidden rounded-md border-[1px] border-zinc-800 bg-zinc-700 hover:scale-105 hover:border-sky-600'
                    onClick={() => menuSelection(food, true)}
                  >
                    <span className='p-1 text-white'>{food.name}</span>
                    <img
                      className='aspect-square h-auto w-full object-cover object-center'
                      src={food.image ?? ''}
                      width={16}
                    />
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      <table className='w-full'>
        <thead className='bg-slate-400'>
          <tr>
            <th className='hidden md:static'>Slug</th>
            <th>Image</th>
            <th>Name</th>
            <th className='hidden md:static'>Description</th>
            <th className='hidden md:static'>Price</th>
            <th>Extras</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {$menu.menu.menu.map((food, index) => (
            <tr key={`${food.slug}-${index}`} className='border-b py-1'>
              <th className='hidden md:static'>{food.slug}</th>
              <th className='flex justify-center'>
                <img
                  src={food.image}
                  width={16}
                  className='size-14 rounded-md'
                />
              </th>
              <th className='text-wrap'>{food.name}</th>
              <th className='hidden md:static'>{food.description}</th>
              <th className='hidden md:static'>{food.price}</th>
              {food.extra && (
                <th>
                  <div className='flex h-full flex-wrap gap-2 bg-red-500'>
                    {food.extra.map(({ name }) => (
                      <span
                        className='rounded-md bg-yellow-400 px-2'
                        key={name}
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </th>
              )}
              <th>
                <button onClick={() => menuDelete('menu', index)}>
                  Delete
                </button>
                <button
                  onClick={() => {
                    menuSelectToEdit(food, 'menu', index);
                    setOpenMenu(true);
                  }}
                >
                  Edit
                </button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

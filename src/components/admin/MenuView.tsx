import type { Food } from '@/models/food.model';
import { useState } from 'react';

interface Props {
  menu?: MenuType;
  foods: Food[];
}

const defaultMenu: MenuType = {
  intro: [],
  menu: [],
  other: [],
};

export default function MenuView({ menu: m, foods }: Props) {
  const [menu, setMenu] = useState<MenuType>(m ?? defaultMenu);

  const [openMenu, setOpenMenu] = useState(false);

  const [selectMenu, setSelectMenu] = useState<MenuFoodType | undefined>();

  return (
    <section className='mx-auto w-full max-w-screen-md px-4 lg:max-w-screen-lg'>
      <button onClick={() => setOpenMenu(true)}>Add New</button>

      {openMenu && (
        <div className='absolute left-0 top-0 flex size-full items-center justify-center bg-black/75'>
          <div className='flex flex-col bg-zinc-300'>
            <div className='flex justify-between'>
              <span className='p-2 text-lg font-bold underline'>
                Add New Menu
              </span>
              <div className='flex items-center gap-2 px-2'>
                <button
                  className='rounded-md bg-green-500 px-1'
                  onClick={() => {
                    selectMenu &&
                      setMenu((state) => ({
                        ...state,
                        menu: [...state.menu, selectMenu],
                      }));
                    setOpenMenu(false);
                    setSelectMenu(undefined);
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

            {selectMenu && (
              <div className='flex flex-col gap-2'>
                <div className='flex px-2'>
                  <button
                    className='group flex items-center overflow-hidden rounded-md bg-zinc-700 text-white hover:bg-red-950'
                    onClick={() => setSelectMenu(undefined)}
                  >
                    <img src={selectMenu.image} width={8} className='size-8' />
                    <span className='inline-flex p-1 group-hover:hidden'>
                      {selectMenu.name}
                    </span>
                    <span className='hidden px-4 group-hover:inline-flex'>
                      DELETE
                    </span>
                  </button>
                </div>
                <div className='flex gap-2 px-2'>
                  {selectMenu.extra &&
                    selectMenu.extra.map((ex) => (
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
                  selectMenu ? category === 'extra' : category === 'menu',
                )
                .map(({ name, image, slug, description, price }, index) => (
                  <button
                    key={`${slug}-${index}`}
                    className='flex flex-col overflow-hidden rounded-md border-[1px] border-zinc-800 bg-zinc-700 hover:scale-105 hover:border-sky-600'
                    onClick={
                      selectMenu
                        ? () => {
                            const ex = selectMenu.extra ?? [];
                            const exists = ex.find((f) => f.slug === slug);
                            if (!exists) {
                              setSelectMenu(
                                (state) =>
                                  state && {
                                    ...state,
                                    extra: [...ex, { name, price, slug }],
                                  },
                              );
                            } else {
                              setSelectMenu(
                                (state) =>
                                  state && {
                                    ...state,
                                    extra: ex.filter((e) => e.slug !== slug),
                                  },
                              );
                            }
                          }
                        : () => {
                            setSelectMenu({
                              extra: [],
                              slug,
                              image: image ?? '',
                              name,
                              description: description,
                              price: price,
                            });
                          }
                    }
                  >
                    <span className='p-1 text-white'>{name}</span>
                    <img
                      className='aspect-square h-auto w-full object-cover object-center'
                      src={image ?? ''}
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
          {menu.menu.map(
            ({ slug, image, name, description, price, extra }, index) => (
              <tr key={`${slug}-${index}`} className='border-b py-1'>
                <th className='hidden md:static'>{slug}</th>
                <th className='flex justify-center'>
                  <img src={image} width={16} className='size-14 rounded-md' />
                </th>
                <th className='text-wrap'>{name}</th>
                <th className='hidden md:static'>{description}</th>
                <th className='hidden md:static'>{price}</th>
                {extra && (
                  <th>
                    {extra.map(({ name }) => (
                      <span key={name}>{name}</span>
                    ))}
                  </th>
                )}
                <th>
                  <button>Delete</button>
                </th>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </section>
  );
}

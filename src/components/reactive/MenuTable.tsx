import { menuDelete, menuOpen, menuSelectToEdit, menuStore } from '@/state';
import { useStore } from '@nanostores/react';

interface Props {
  category: 'menu' | 'intro' | 'other';
}

export default function MenuTable({ category }: Props) {
  const $menu = useStore(menuStore);

  return (
    <div className='mb-8'>
      <button
        disabled={$menu.disabled}
        className='my-1 rounded-md bg-green-400 p-1 hover:bg-green-500 disabled:pointer-events-none disabled:saturate-0'
        onClick={() => {
          menuOpen(category);
        }}
      >
        Agregar {category}
      </button>
      <table className='w-full'>
        <thead className='bg-slate-400'>
          <tr>
            <th className='hidden md:static'>Slug</th>
            <th>Image</th>
            <th>Name</th>
            <th className='hidden md:static'>Description</th>
            <th className='hidden md:static'>Price</th>
            {category === 'menu' && <th>Extras</th>}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {$menu.menu[category].map((food, index) => (
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
              {category === 'menu' && food.extra && (
                <th>
                  <div>
                    {food.extra.map(({ name }) => (
                      <span
                        className='rounded-full bg-yellow-400 px-1 text-xs'
                        key={name}
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </th>
              )}
              <th>
                <div className='flex justify-center gap-2'>
                  <button
                    disabled={$menu.disabled}
                    className='rounded-md bg-sky-700 p-1 text-white disabled:pointer-events-none disabled:saturate-0'
                    onClick={() => {
                      menuSelectToEdit(food, category, index);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    disabled={$menu.disabled}
                    className='rounded-md bg-red-600 p-1 text-white disabled:pointer-events-none disabled:saturate-0'
                    onClick={() => menuDelete(category, index)}
                  >
                    Delete
                  </button>
                </div>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
      {!$menu.menu[category]?.length && (
        <div className='flex w-full justify-center bg-zinc-200 py-2'>
          <span>No hay Nada Aún</span>
        </div>
      )}
    </div>
  );
}

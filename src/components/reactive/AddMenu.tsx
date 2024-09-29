import cn from 'classnames';
import type { Food } from '@/models/food.model';
import {
  menuAddSelected,
  menuClose,
  menuSelect,
  menuSelection,
  menuStore,
} from '@/state';
import { useStore } from '@nanostores/react';

interface Props {
  foods: Food[];
}

export default function AddMenu({ foods }: Props) {
  const $menu = useStore(menuStore);

  return (
    <div className='fixed left-0 top-0 flex size-full w-full items-center justify-center bg-black/75'>
      <div className='flex flex-col bg-zinc-300'>
        <div className='flex justify-between'>
          <span className='p-2 text-lg font-bold underline'>
            {$menu.index !== undefined ? 'Edit Food' : 'Add Food'}
          </span>
          <div className='flex items-center gap-2 px-2'>
            <button
              disabled={$menu.disabled}
              className='rounded-md bg-green-500 px-1 disabled:pointer-events-none disabled:saturate-0'
              onClick={() => menuAddSelected()}
            >
              Add
            </button>
            <button
              disabled={$menu.disabled}
              className='rounded-md bg-red-500 px-1 disabled:pointer-events-none disabled:saturate-0'
              onClick={() => menuClose()}
            >
              Close
            </button>
          </div>
        </div>

        {$menu.selected && (
          <div className='flex flex-col gap-2'>
            <div className='flex px-2'>
              <button
                disabled={$menu.disabled}
                className='group flex items-center overflow-hidden rounded-md bg-zinc-700 text-white hover:bg-red-950 disabled:pointer-events-none disabled:saturate-0'
                onClick={() => menuSelect()}
              >
                <img src={$menu.selected.image} width={8} className='size-8' />
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
              $menu.selected ? category === 'extra' : category === $menu.key,
            )
            .map((food, index) => (
              <button
                disabled={$menu.disabled}
                key={`${food.slug}-${index}`}
                className={cn(
                  'flex flex-col overflow-hidden rounded-md border-[1px] hover:scale-105 disabled:pointer-events-none disabled:saturate-0',
                  $menu.selected &&
                    $menu.selected.extra &&
                    $menu.selected.extra.find((e) => e.slug === food.slug)
                    ? 'border-zinc-800 bg-sky-700 hover:border-sky-600'
                    : 'border-zinc-800 bg-zinc-700 hover:border-sky-500',
                )}
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
  );
}

import type { Food } from '@/models/food.model';
import { actions } from 'astro:actions';
import { useState } from 'react';

import deleteSvg from '@/assets/delete.svg';
import editSvg from '@/assets/edit.svg';

interface Props {
  food: Food;
  remove: () => void;
}

export default function FoodCard({ food, remove }: Props) {
  const [disabled, setDisabled] = useState(false);

  const onDelete = async (id: string, slug: string) => {
    setDisabled(true);
    const { data } = await actions.foods.deleteOne({
      id,
      slug,
    });
    if (data) remove();
    setDisabled(false);
  };

  return (
    <div
      key={food.slug}
      className='my-4 flex flex-col rounded-md border-[1px] border-zinc-400 bg-zinc-200 p-1'
    >
      <div className='py-1'>
        <a
          href={'/admin/foods/' + food.slug}
          className='text-xs font-bold italic hover:underline'
        >
          {food.slug}
        </a>
      </div>

      <div className='flex items-center gap-2'>
        {!!food.image ? (
          <img
            width={16}
            height={16}
            src={food.image}
            className='size-14 rounded-md object-cover object-center'
            loading='lazy'
          />
        ) : (
          <div className='size-14 animate-pulse rounded-md bg-zinc-800'></div>
        )}
        <div className='flex flex-col'>
          <span className='text-lg'>{food.name}</span>
          <div className='flex gap-2'>
            <button
              disabled={disabled}
              className='rounded-sm bg-red-800 p-1 text-sm text-white hover:bg-red-700 disabled:pointer-events-none disabled:saturate-0'
              onClick={() => onDelete(food.id, food.slug)}
            >
              <span className='sr-only'>Delete</span>
              <img {...deleteSvg} />
            </button>
            <a
              aria-disabled={disabled}
              className='rounded-sm bg-green-800 p-1 text-sm text-white hover:bg-green-700 disabled:pointer-events-none disabled:saturate-0'
              href={'/admin/foods/' + food.slug}
            >
              <span className='sr-only'>Update</span>
              <img {...editSvg} />
            </a>
          </div>
        </div>
      </div>
      <div className='flex items-center gap-2 py-2'>
        <span className='rounded-full bg-green-700 px-2 text-sm text-white'>
          {food.category}
        </span>
        <span className='rounded-full bg-yellow-500 px-2 text-sm'>
          S/. {food.price}
        </span>
      </div>
      <span className='py-2 text-sm'>{food.description}</span>
    </div>
  );
}

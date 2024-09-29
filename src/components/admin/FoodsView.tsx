import { useMemo, useState } from 'react';

import InputText from '../reactive/InputText';
import AddFood from '../reactive/AddFood';
import FoodCard from '../reactive/FoodCard';

import type { Food } from '@/models/food.model';

interface Props {
  foods: Food[];
}

export default function FoodsView({ foods: foods_ }: Props) {
  const [open, setOpen] = useState(false);
  const [foods, setFoods] = useState(foods_);
  const [query, setQuery] = useState('');

  const foodsFiltered = useMemo(
    () =>
      foods.filter(
        (food) =>
          food.name.toLowerCase().includes(query.toLowerCase()) ||
          food.description.toLowerCase().includes(query.toLowerCase()),
      ),
    [query, foods],
  );

  const addFood = (food: Food) => setFoods((state) => [...state, food]);

  const removeFood = (id: string) => () =>
    setFoods((state) => state.filter((f) => f.id !== id));

  return (
    <section>
      <div className='mx-auto w-full max-w-screen-md px-4 lg:max-w-screen-lg'>
        <div>
          <span>Foods</span>
          <InputText
            name='search'
            labelName='Search'
            placeholder='Find by...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {open && <AddFood add={addFood} close={() => setOpen(false)} />}

        <div className='flex gap-2 py-2'>
          <button
            className='rounded-md bg-green-500 p-1 text-sm hover:bg-green-400'
            onClick={() => setOpen(true)}
          >
            Add New
          </button>
        </div>
        <div className='grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3'>
          {foodsFiltered.map((food) => (
            <FoodCard key={food.id} food={food} remove={removeFood(food.id)} />
          ))}
        </div>
      </div>
    </section>
  );
}

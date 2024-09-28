import type { Food } from '@/models/food.model';
import InputText from '../reactive/InputText';
import { useState } from 'react';
import { actions } from 'astro:actions';
import { useStore } from '@nanostores/react';
import { authStore } from '@/state';

interface Props {
  foods: Food[];
}

export default function FoodsView({ foods: foods_ }: Props) {
  const $auth = useStore(authStore);
  const [foods, setFoods] = useState(foods_);
  const [query, setQuery] = useState('');

  const onDelete = (id: string) => {
    return async () => {
      const { data } = await actions.foods.deleteOne({
        token: $auth.user?.payload.token ?? '',
        id,
      });

      if (data) {
        setFoods((state) => state.filter((food) => food.id !== id));
      }
    };
  };

  return (
    <section>
      <div className='mx-auto w-full max-w-screen-lg px-4'>
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
        <div className='grid grid-cols-3'>
          {foods
            .filter(
              (food) =>
                food.name.toLowerCase().includes(query.toLowerCase()) ||
                food.description.toLowerCase().includes(query.toLowerCase()),
            )
            .map((food) => (
              <div key={food.slug} className='my-4 flex flex-col'>
                <span>{food.name}</span>
                <div>
                  <button onClick={onDelete(food.id)}>Delete</button>
                </div>
                <span>{food.description}</span>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

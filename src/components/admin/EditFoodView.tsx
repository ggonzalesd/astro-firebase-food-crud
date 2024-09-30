import type { Food } from '@/models/food.model';
import { useState } from 'react';
import ImageInput from '../reactive/ImageInput';
import Selector from '../reactive/Selector';
import InputText from '../reactive/InputText';
import { actions } from 'astro:actions';

interface Props {
  food: Food;
}

export default function EditFoodView({ food: defaultFood }: Props) {
  const [disabled, setDisabled] = useState(false);
  const { slug, id, ...initialFood } = defaultFood;
  const [food, setFood] = useState({
    ...initialFood,
    image: '',
    price: `${defaultFood.price}`,
  });

  const onUpdate = async () => {
    setDisabled(true);

    const { data, error: err } = await actions.foods.updateOne({
      ...food,
      id,
      slug,
      price: parseFloat(food.price),
    });

    setDisabled(false);
    window.location.replace('/admin/foods');
  };

  return (
    <section>
      <div className='mx-auto w-full max-w-screen-md px-4 lg:max-w-screen-lg'>
        <div className='flex justify-between py-4'>
          <button
            disabled={disabled}
            className='rounded-md bg-sky-700 px-2 py-1 text-white hover:bg-sky-600 disabled:pointer-events-none disabled:saturate-0'
            onClick={onUpdate}
          >
            Update
          </button>
          <a
            aria-disabled={disabled}
            href='/admin/foods'
            className='rounded-md bg-red-700 px-2 py-1 text-white hover:bg-red-600 aria-disabled:pointer-events-none aria-disabled:saturate-0'
          >
            Cancel
          </a>
        </div>
        <InputText
          disabled={disabled}
          name='name'
          value={food.name}
          onChange={(e) =>
            setFood((state) => ({ ...state, name: e.target.value }))
          }
        />
        <InputText
          disabled={disabled}
          name='description'
          value={food.description}
          onChange={(e) =>
            setFood((state) => ({ ...state, description: e.target.value }))
          }
        />
        <InputText
          disabled={disabled}
          name='price'
          value={food.price}
          onChange={(e) =>
            setFood((state) => ({ ...state, price: e.target.value }))
          }
        />
        <ImageInput
          disabled={disabled}
          name='image'
          onChange={(base64) =>
            setFood((state) => ({ ...state, image: base64 }))
          }
          defaultSrc={defaultFood.image ?? undefined}
        />
        <Selector
          disabled={disabled}
          name='category'
          value={food.category}
          values={['menu', 'extra', 'intro', 'other']}
          onChange={(value) =>
            setFood((state) => ({ ...state, category: value }))
          }
        />
      </div>
    </section>
  );
}

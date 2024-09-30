import { useState } from 'react';
import InputText from './InputText';
import { actions, isInputError } from 'astro:actions';
import type { Food } from '@/models/food.model';
import Selector from './Selector';
import ImageInput from './ImageInput';

const newItemInitialize = {
  name: '',
  description: '',
  price: '6',
  image: '',
  category: 'menu',
};

interface Props {
  close: () => void;
  add: (food: Food) => void;
}

export default function AddFood({ close, add }: Props) {
  const [disabled, setDisabled] = useState(false);
  const [errorMsg, setErroMsg] = useState<string | undefined>();
  const [food, setFood] = useState(newItemInitialize);

  const onChangeNewFood: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFood((value) => ({ ...value, [e.target.name]: e.target.value }));
  };

  const onNew = async () => {
    setDisabled(true);
    const { data, error: err } = await actions.foods.addOne({
      ...food,
      price: parseFloat(food.price),
      image: food.image,
    });

    if (err) {
      if (isInputError(err))
        setErroMsg(
          Object.entries(err.fields)
            .map(([key, value]) => `(${key})[${value.join(', ')}]`)
            .join(' '),
        );
      else setErroMsg(err.message);
    } else {
      setErroMsg(undefined);
    }

    if (data) {
      add(data);
      close();
    }
    setDisabled(false);
  };

  const inputs: Array<keyof typeof newItemInitialize> = [
    'name',
    'description',
    'price',
  ];

  return (
    <section className='fixed left-0 top-0 z-10 flex size-full items-center justify-center bg-black/75 backdrop-blur-sm'>
      <div className='flex flex-col rounded-md bg-zinc-300 p-2'>
        <span className='text-md'>Add New Food</span>
        {errorMsg && <span className='text-sm text-red-600'>{errorMsg}</span>}
        <div className='grid grid-flow-col grid-rows-3 gap-2'>
          {inputs.map((name) => (
            <InputText
              key={name}
              disabled={disabled}
              labelName={name}
              name={name}
              value={food[name]}
              onChange={onChangeNewFood}
            />
          ))}
          <ImageInput
            name='image'
            onChange={(base64) =>
              setFood((state) => ({ ...state, image: base64 }))
            }
          />
          <Selector
            name='category'
            values={['menu', 'intro', 'extra', 'other']}
            value={food.category}
            onChange={(value) =>
              setFood((state) => ({ ...state, category: value }))
            }
          />
        </div>
        <div className='grid grid-cols-2 gap-2 p-2'>
          <button
            disabled={disabled}
            className='rounded-md bg-blue-600 p-2 text-white'
            onClick={onNew}
          >
            Add
          </button>
          <button
            disabled={disabled}
            className='rounded-md bg-zinc-400 p-2 text-zinc-800'
            onClick={close}
          >
            Close
          </button>
        </div>
      </div>
    </section>
  );
}

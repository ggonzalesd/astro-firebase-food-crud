import { actions, isInputError } from 'astro:actions';
import Checkbox from '../reactive/Checkbox';
import NumbInput from '../reactive/NumbInput';
import { useState } from 'react';

export default function ConfigView({ config }: { config?: ConfigType }) {
  const [disabled, setDisabled] = useState(false);
  const [err, setErr] = useState<string[] | undefined>();

  return (
    <div className='mx-auto my-4 w-full max-w-screen-lg'>
      <form
        className='flex w-full flex-col items-center rounded-md bg-zinc-100'
        onSubmit={async (e) => {
          e.preventDefault();
          setErr(undefined);
          setDisabled(true);
          const { data, error } = await actions.config.save(
            new FormData(e.currentTarget),
          );
          if (isInputError(error)) {
            return setErr(
              Object.entries(error.fields).map(
                ([key, errors]) => key + ': ' + errors.join(', '),
              ),
            );
          }
          setDisabled(false);
        }}
      >
        <span className='text-center text-3xl'>Update Config</span>
        <div className='flex flex-col'>
          {err &&
            err.length > 0 &&
            err.map((e) => (
              <span key={e} className='max-w-[50ch] text-red-600'>
                ERROR: {e}
              </span>
            ))}
        </div>
        <div className='flex items-center justify-center gap-4'>
          <div>
            <div className='flex flex-col'>
              <span>Breakfast</span>
              <div className='flex gap-4'>
                <label className='flex flex-col'>
                  <span>Start</span>
                  <NumbInput
                    defaultValue={config?.breakfast.start}
                    name='breakfastStart'
                  />
                </label>

                <label className='flex flex-col'>
                  <span>End</span>
                  <NumbInput
                    defaultValue={config?.breakfast.end}
                    name='breakfastEnd'
                  />
                </label>
              </div>
            </div>
            <div className='flex flex-col'>
              <span>Lunch</span>
              <div className='flex gap-4'>
                <label className='flex flex-col'>
                  <span>Start</span>
                  <NumbInput
                    defaultValue={config?.lunch.start}
                    name='lunchStart'
                  />
                </label>

                <label className='flex flex-col'>
                  <span>End</span>
                  <NumbInput defaultValue={config?.lunch.end} name='lunchEnd' />
                </label>
              </div>
            </div>
            <div className='flex flex-col'>
              <span>Dinner</span>
              <div className='flex gap-4'>
                <label className='flex flex-col'>
                  <span>Start</span>
                  <NumbInput
                    defaultValue={config?.dinner.start}
                    name='dinnerStart'
                  />
                </label>

                <label className='flex flex-col'>
                  <span>End</span>
                  <NumbInput
                    defaultValue={config?.dinner.end}
                    name='dinnerEnd'
                  />
                </label>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <div className='flex gap-4'>
              <label className='flex items-center'>
                <span>Open</span>
                <Checkbox defaultChecked={config?.open} name='open' />
              </label>
              <label className='flex items-center'>
                <span>Working</span>
                <Checkbox defaultChecked={config?.working} name='working' />
              </label>
            </div>
            <label>
              <span>Picking</span>
              <NumbInput defaultValue={config?.picking} name='picking' />
            </label>
            <label>
              <span>Delivery</span>
              <NumbInput defaultValue={config?.delivery} name='delivery' />
            </label>
          </div>
        </div>
        <button
          disabled={disabled}
          type='submit'
          className='m-4 rounded-md bg-sky-600 px-4 text-xl hover:bg-sky-500 disabled:pointer-events-none disabled:opacity-50 disabled:saturate-50'
        >
          Actualizar
        </button>
      </form>
    </div>
  );
}

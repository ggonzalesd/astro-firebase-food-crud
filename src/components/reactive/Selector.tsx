import { useState } from 'react';
import cn from 'classnames';

interface Props {
  disabled?: boolean;
  labelName?: string;
  name?: string;
  value: string;
  values: string[];
  onChange?: (value: string) => void;
}

export default function Selector({
  disabled,
  value,
  values,
  name,
  labelName,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <label className='flex flex-col gap-2'>
      <span>{labelName ?? name}</span>
      <div>
        <button
          disabled={disabled}
          type='button'
          className={cn(
            'inline-flex w-full items-center justify-normal gap-2 border-[1px] border-zinc-400 bg-zinc-300 px-2 py-1 hover:cursor-pointer hover:bg-zinc-200',
            open ? 'rounded-t-md' : 'rounded-md',
          )}
          onClick={() => setOpen((state) => !state)}
        >
          <div className='size-2 rounded-full bg-zinc-500'></div>
          <span>{value}</span>
        </button>
        {open && !disabled && (
          <div className='relative'>
            <div className='absolute left-0 top-0 flex w-full flex-col overflow-hidden rounded-b-md border-[1px] border-t-0 border-zinc-400 bg-zinc-300'>
              <div className='h-1'></div>
              {values
                .filter((v) => v !== value)
                .map((v) => (
                  <button
                    key={`option-${v}`}
                    type='button'
                    className='border-t-[1px] border-zinc-400 hover:bg-zinc-200'
                    onClick={async () => {
                      if (onChange) onChange(v);
                      setTimeout(() => setOpen(false), 1);
                    }}
                  >
                    {v}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
      <input
        className='sr-only not-sr-only'
        type='hidden'
        name={name}
        value={value}
      />
    </label>
  );
}

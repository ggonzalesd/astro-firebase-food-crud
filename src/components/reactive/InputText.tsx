import React from 'react';

interface Props
  extends Pick<
    React.HTMLProps<HTMLInputElement>,
    'id' | 'className' | 'name' | 'value' | 'value' | 'placeholder' | 'disabled'
  > {
  labelName?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  type?: 'password' | 'text';
}

const InputText = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      id,
      disabled,
      type = 'text',
      name,
      labelName,
      value,
      onChange,
      placeholder,
    }: Props,
    ref,
  ) => {
    return (
      <label className='flex flex-col gap-2'>
        <span>{labelName ?? name}</span>
        <input
          disabled={disabled}
          className='rounded-md border-[1px] border-zinc-400 bg-zinc-300 px-2 py-1 text-zinc-900 placeholder-zinc-700 disabled:pointer-events-none disabled:text-zinc-500'
          ref={ref}
          id={id}
          type={type}
          name={name}
          placeholder={placeholder ?? name}
          value={value}
          onChange={onChange}
        />
      </label>
    );
  },
);

export default InputText;

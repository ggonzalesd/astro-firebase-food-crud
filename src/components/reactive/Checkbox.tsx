import React, { forwardRef } from 'react';

interface Props
  extends Pick<
    React.InputHTMLAttributes<HTMLInputElement>,
    | 'id'
    | 'className'
    | 'style'
    | 'onChange'
    | 'disabled'
    | 'name'
    | 'defaultChecked'
  > {
  value?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, Props>(
  ({ value, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className='relative inline-flex size-5 appearance-none items-center justify-center rounded-sm border border-zinc-400 bg-zinc-300 transition-colors after:size-4 after:rounded-sm after:bg-transparent after:checked:bg-sky-600 hover:cursor-pointer disabled:pointer-events-none disabled:saturate-0'
        type='checkbox'
        checked={value}
        {...props}
      />
    );
  },
);

export default Checkbox;

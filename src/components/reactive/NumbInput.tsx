import cn from 'classnames';
import { forwardRef } from 'react';

interface Props
  extends Pick<
    React.InputHTMLAttributes<HTMLInputElement>,
    | 'id'
    | 'className'
    | 'style'
    | 'onChange'
    | 'disabled'
    | 'name'
    | 'max'
    | 'min'
    | 'defaultValue'
  > {
  step?: number;
  value?: number;
}

const NumbInput = forwardRef<HTMLInputElement, Props>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type='number'
        className={cn(
          className,
          'inline-flex rounded-md border border-zinc-400 bg-zinc-300 px-2 disabled:pointer-events-none disabled:opacity-50 disabled:saturate-0',
        )}
        {...props}
      />
    );
  },
);

export default NumbInput;

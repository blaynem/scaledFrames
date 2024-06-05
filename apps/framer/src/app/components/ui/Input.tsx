import * as React from 'react';

import { cn } from '../../../../utils/cn';

export type InputProps = {
  labelText?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, labelText, type, ...props }, ref) => {
    return (
      <div>
        {labelText && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            {labelText}
          </label>
        )}
        <div className="mt-2">
          {props.readOnly ? (
            <>{props.value || props.defaultValue || ''}</>
          ) : (
            <input
              id={props.id}
              type={type}
              className={cn(
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                className
              )}
              ref={ref}
              {...props}
            />
          )}
        </div>
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };

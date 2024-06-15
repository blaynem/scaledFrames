import * as React from 'react';

import { cn } from '../../../../utils/cn';

export type TextareaProps = {
  labelText?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, labelText, ...props }, ref) => {
    return (
      <div>
        {labelText && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
          >
            {labelText}
          </label>
        )}
        {props.readOnly ? (
          <>{props.defaultValue || ''}</>
        ) : (
          <textarea
            className={cn(
              'dark:text-black flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            ref={ref}
            {...props}
          />
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };

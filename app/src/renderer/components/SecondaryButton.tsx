import * as React from 'react';
import classnames from 'classnames';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  loading?: boolean;
};

const SecondaryButton: React.FC<Props> = ({
  children,
  className,
  disabled,
  loading,
  ...rest
}) => {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      type="button"
      className={classnames(
        className,
        { 'opacity-50': disabled || loading },
        'inline-flex items-center justify-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none'
      )}
    >
      {loading ? (
        <ArrowPathIcon className="flex-shrink-0 h-3 w-3 animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};

export default SecondaryButton;

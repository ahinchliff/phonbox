import * as React from 'react';
import classnames from 'classnames';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  loading?: boolean;
  hoverClasses?: string;
};

const Button: React.FC<Props> = ({
  children,
  className,
  disabled,
  loading,
  hoverClasses,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={classnames(
        'flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none',
        className,
        {
          'opacity-50': disabled,
          [hoverClasses]: !(disabled || loading),
        }
      )}
      disabled={disabled || loading}
    >
      {loading ? (
        <ArrowPathIcon className="mr-1 flex-shrink-0 h-4 w-4 animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};

type StyledProps = Omit<Props, 'hoverClasses'>;

export const ButtonGrey: React.FC<StyledProps> = ({ className, ...rest }) => {
  return (
    <Button
      className={`${className} bg-gray-700`}
      hoverClasses="hover:bg-gray-800"
      {...rest}
    />
  );
};

export const ButtonGreen: React.FC<StyledProps> = ({ className, ...rest }) => {
  return (
    <Button
      className={`${className} bg-cyan-600`}
      hoverClasses="hover:bg-cyan-700"
      {...rest}
    />
  );
};

import * as React from 'react';
import classnames from 'classnames';

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const SecondaryButton: React.FC<Props> = ({ children, className, ...rest }) => {
  return (
    <button
      {...rest}
      type="button"
      className={classnames(
        className,
        'inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none'
      )}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;

import * as React from 'react';
import classnames from 'classnames';
import { CreditCardIcon } from '@heroicons/react/24/outline';

type Props = {
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

const CardListItemBase: React.FC<Props> = ({
  isSelected,
  children,
  onClick,
}) => {
  return (
    <button
      className={classnames(
        {
          'bg-gray-900 text-white': isSelected,
          'text-gray-300 hover:bg-gray-700 hover:text-white': !isSelected,
        },
        'group flex items-center pr-2 pl-4 py-2 text-sm font-medium w-full rounded-md'
      )}
      onClick={() => onClick()}
    >
      <CreditCardIcon
        className={classnames(
          {
            'text-gray-300': isSelected,
            'text-gray-400 group-hover:text-gray-300': !isSelected,
          },
          'mr-3 flex-shrink-0 h-6 w-6'
        )}
        aria-hidden="true"
      />
      {children}
    </button>
  );
};

export default CardListItemBase;

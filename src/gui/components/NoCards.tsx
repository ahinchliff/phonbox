import * as React from 'react';
import { CreditCardIcon } from '@heroicons/react/24/outline';

const NoCards: React.FC = () => {
  return (
    <div className="flex flex-1 justify-center items-center h-screen bg-gray-900">
      <CreditCardIcon
        className="mr-3 h-10 w-10 text-gray-300"
        aria-hidden="true"
      />
      <span className="text-gray-300 text-lg">No cards detected :(</span>
    </div>
  );
};

export default NoCards;

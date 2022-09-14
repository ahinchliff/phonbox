import * as React from 'react';
import classnames from 'classnames';
import { CreditCardIcon } from '@heroicons/react/24/outline';
import { getPhononDisplayName } from '../../utils/format';
import { useCardStore } from '../../stores/CardStore';

const tabs: { title: string; key: Tab }[] = [
  { title: 'Phonons', key: 'phonons' },
  { title: 'Settings', key: 'settings' },
];

type Props = {
  currentTab: Tab;
  onClickTab: (newTab: Tab) => void;
};

const Header: React.FC<Props> = ({ currentTab, onClickTab }) => {
  const { selectedCard } = useCardStore();

  return (
    <div className="flex p-4 bg-white shadow  border-gray-200">
      <div
        className={classnames(
          {
            'opacity-0': !selectedCard,
          },
          'flex flex-1 justify-between'
        )}
      >
        <div className=" min-w-0 flex-1 flex items-center">
          <div className="flex items-center">
            <CreditCardIcon
              className="mr-3 flex-shrink-0 h-10 w-10"
              aria-hidden="true"
            />
            <h1 className="text-3xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
              {selectedCard ? getPhononDisplayName(selectedCard) : ''}
            </h1>
          </div>
        </div>
        <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
          {selectedCard?.unlocked && (
            <nav className="flex space-x-4" aria-label="Tabs">
              {tabs.map((tab) => {
                const isCurrent = tab.key === currentTab;

                return (
                  <button
                    key={tab.title}
                    onClick={() => onClickTab(tab.key)}
                    className={classnames(
                      {
                        'bg-gray-100 text-gray-700': isCurrent,
                        'text-gray-500 hover:text-gray-700': isCurrent,
                      },
                      'px-3 py-2 font-medium text-sm rounded-md'
                    )}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {tab.title}
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;

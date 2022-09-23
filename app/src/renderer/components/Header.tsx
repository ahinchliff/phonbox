import * as React from 'react';
import classnames from 'classnames';
import { CreditCardIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { getCardDisplayName } from '../utils/format';
import { useCardStore } from '../stores/CardStore';
import { useLocation, useNavigate } from 'react-router-dom';

const tabs: { title: string; pathname: string }[] = [
  { title: 'Phonons', pathname: '/phonons' },
  { title: 'Settings', pathname: '/settings' },
];

const Header: React.FC = () => {
  const { selectedCard } = useCardStore();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow  border-gray-200">
      <div className="flex p-4">
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
                {selectedCard ? getCardDisplayName(selectedCard) : ''}
              </h1>
            </div>
          </div>
          <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
            {selectedCard?.isUnlocked && (
              <nav className="flex space-x-4" aria-label="Tabs">
                {tabs.map((tab) => {
                  const isCurrent = tab.pathname === location.pathname;

                  return (
                    <button
                      key={tab.title}
                      onClick={() => navigate(tab.pathname)}
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
      <PairingState />
    </div>
  );
};

export default Header;

const PairingState: React.FC = () => {
  const { selectedCard, cards, closePairing } = useCardStore();

  if (!selectedCard || !selectedCard.pairing) {
    return null;
  }

  let text;

  const localCounterparty = cards.find(
    (c) => c.pairing?.type === 'local' && c.pairing.cardId === selectedCard?.id
  );

  if (selectedCard.pairing.status === 'paired') {
    text = localCounterparty
      ? `Paired locally with ${getCardDisplayName(localCounterparty)}`
      : `Paired remotely`;
  }

  if (selectedCard.pairing.status === 'disconnected') {
    text = 'Pairing...waiting for counterparty';
  }

  if (selectedCard.pairing.status === 'pairing_step_1') {
    text = 'Pairing... (1/4)';
  }

  if (selectedCard.pairing.status === 'pairing_step_2') {
    text = 'Pairing... (2/4)';
  }

  if (selectedCard.pairing.status === 'pairing_step_3') {
    text = 'Pairing... (3/4)';
  }

  if (selectedCard.pairing.status === 'pairing_step_4') {
    text = 'Pairing... (4/4)';
  }

  return (
    <div className="bg-cyan-600 w-full px-5 py-1 flex justify-between items-center">
      <span className="font-semibold text-white">{text}</span>
      <XMarkIcon
        className="text-white h-5 w-5 cursor-pointer"
        onClick={closePairing}
      />
    </div>
  );
};

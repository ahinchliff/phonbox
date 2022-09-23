import * as React from 'react';
import classnames from 'classnames';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, LockClosedIcon } from '@heroicons/react/20/solid';
import { getCardDisplayName } from '../utils/format';

type Props = {
  selectedCardId: string | undefined;
  cards: phonbox.CardDetails[];
  onChange: (newlySelectedCard: phonbox.CardDetails) => void;
};

const SelectCard: React.FC<Props> = ({ cards, selectedCardId, onChange }) => {
  const selectedCard = cards.find((card) => card.id === selectedCardId);

  return (
    <Listbox value={selectedCard} onChange={onChange}>
      {({ open }) => (
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:text-sm">
            <span className="block truncate">
              {selectedCard && getCardDisplayName(selectedCard)}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              {selectedCard && !selectedCard.isUnlocked && (
                <LockClosedIcon
                  className="h-5 w-5 text-gray-400 mr-1"
                  aria-hidden="true"
                />
              )}
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Transition
            show={open}
            as={React.Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {cards.map((card) => (
                <Listbox.Option
                  key={card.id}
                  className="text-gray-900 relative select-none py-2 pl-3 pr-9 cursor-pointer hover:bg-cyan-600 hover:text-white"
                  value={card}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={classnames(
                          {
                            'font-semibold': selected,
                            'font-normal': !selected,
                          },
                          'block truncate'
                        )}
                      >
                        {getCardDisplayName(card)}
                      </span>

                      <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                        {!card.isUnlocked && (
                          <LockClosedIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
};

export default SelectCard;

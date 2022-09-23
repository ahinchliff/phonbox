import * as React from 'react';
import classnames from 'classnames';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

export type Option = {
  id: string;
  displayText: string;
};

type Props = {
  selectedId: string | undefined;
  options: Option[];
  onChange: (option: Option) => void;
};

const Select: React.FC<Props> = ({ options, selectedId, onChange }) => {
  const selectedOptions = options.find((op) => op.id === selectedId);

  return (
    <Listbox value={selectedOptions} onChange={onChange}>
      {({ open }) => (
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
            <span className="block truncate">
              {selectedOptions?.displayText}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
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
              {options.map((option) => (
                <Listbox.Option
                  key={option.id}
                  className={({ active }) =>
                    classnames(
                      {
                        'text-white bg-indigo-600': active,
                        'text-gray-900': !active,
                      },
                      'relative cursor-default select-none py-2 pl-3 pr-9'
                    )
                  }
                  value={option}
                >
                  {({ selected, active }) => (
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
                        {option.displayText}
                      </span>

                      {selected ? (
                        <span
                          className={classnames(
                            {
                              'text-white': active,
                              'text-indigo-600': !active,
                            },
                            'absolute inset-y-0 right-0 flex items-center pr-4'
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
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

export default Select;

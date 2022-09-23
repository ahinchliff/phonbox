import classnames from 'classnames';

type Props<T extends string> = {
  active: T;
  tabs: T[];
  onChange: (tab: T) => void;
};

export default function Tabs<T extends string>({
  active,
  tabs,
  onChange,
}: Props<T>) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex justify-center" aria-label="Tabs">
        {tabs.map((tab) => (
          <span
            key={tab}
            onClick={() => onChange(tab)}
            className={classnames(
              {
                'border-cyan-500 text-cyan-600': tab === active,
                'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300':
                  tab !== active,
              },
              'w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm cursor-pointer'
            )}
            aria-current={tab === active ? 'page' : undefined}
          >
            {tab}
          </span>
        ))}
      </nav>
    </div>
  );
}

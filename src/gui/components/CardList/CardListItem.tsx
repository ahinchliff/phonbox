import * as React from 'react';
import classnames from 'classnames';
import SidebarCardBase from './CardListItemBase';
import { getPhononDisplayName, truncateString } from '../../utils/format';

type Props = {
  card: phonbox.CardDetails;
  isSelected: boolean;
  onClick: () => void;
};

const CardListItem: React.FC<Props> = ({ card, isSelected, onClick }) => {
  return (
    <SidebarCardBase isSelected={isSelected} onClick={onClick}>
      <>
        {getPhononDisplayName(card)}
        <div className="flex flex-1 justify-end">
          <span
            className={classnames(
              {
                'bg-blue-100 text-blue-800': card.certEnvironment === 'dev',
                'bg-yellow-100 text-yellow-800':
                  card.certEnvironment === 'alpha',
              },

              'inline-flex items-center rounded  px-2 py-0.5 text-xs font-medium justify-end'
            )}
          >
            {card.certEnvironment[0].toUpperCase()}
          </span>
        </div>
      </>
    </SidebarCardBase>
  );
};

export default CardListItem;

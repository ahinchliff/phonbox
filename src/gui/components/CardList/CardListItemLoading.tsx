import * as React from 'react';
import SidebarCardBase from './CardListItemBase';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

type Props = {
  isSelected: boolean;
  onClick: () => void;
};

const CardListItemLoading: React.FC<Props> = ({ isSelected, onClick }) => {
  return (
    <SidebarCardBase isSelected={isSelected} onClick={onClick}>
      <div className="flex flex-1 justify-end">
        <ArrowPathIcon className="mr-1 flex-shrink-0 h-4 w-4 animate-spin" />
      </div>
    </SidebarCardBase>
  );
};

export default CardListItemLoading;

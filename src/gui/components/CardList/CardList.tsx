import * as React from 'react';
import { useCardStore } from '../../stores/CardStore';
import CardListItem from './CardListItem';
import CardListItemLoading from './CardListItemLoading';

const CardList: React.FC = () => {
  const { cards, loadingCardIds, selectedCardId, setSelectedCardId } =
    useCardStore();

  return (
    <div className="flex w-64 h-screen flex-col bg-gray-800">
      <div className="flex flex-1 flex-col overflow-y-auto pb-4">
        <div className="flex-1 space-y-1">
          {cards.map((card) => (
            <CardListItem
              key={card.id}
              card={card}
              onClick={() => setSelectedCardId(card.id)}
              isSelected={selectedCardId === card.id}
            />
          ))}
          {loadingCardIds.map((loadingCardId) => (
            <CardListItemLoading
              key={loadingCardId}
              onClick={() => setSelectedCardId(loadingCardId)}
              isSelected={selectedCardId === loadingCardId}
            />
          ))}
        </div>
      </div>
      <div className="p-2 text-center">
        <p className="text-xs font-medium text-gray-300">Version 0.0.1</p>
      </div>
    </div>
  );
};

export default CardList;

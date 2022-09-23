import * as React from 'react';
import { useCardStore } from '../../stores/CardStore';
import CardListItem from './CardListItem';
import CardListItemLoading from './CardListItemLoading';

const CardList: React.FC = () => {
  const { cards, loadingCardIds, selectedCardId, setSelectedCardId } =
    useCardStore();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto space-y-1 px-2">
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
  );
};

export default CardList;

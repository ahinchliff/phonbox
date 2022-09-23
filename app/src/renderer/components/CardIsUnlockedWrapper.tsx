import * as React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useCardStore } from '../stores/CardStore';
import { useNavigate } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

const CardIsUnlockedWrapper: React.FC<Props> = (props) => {
  const { selectedCard, selectedCardId, loadingCardIds } = useCardStore();

  const navigate = useNavigate();

  React.useEffect(() => {
    if (selectedCard) {
      if (selectedCard.isUnlocked) {
        navigate('/phonons');
      } else {
        navigate('/');
      }
    }
  }, [selectedCard]);

  if (selectedCardId && loadingCardIds.includes(selectedCardId)) {
    return (
      <div className="flex justify-center">
        <ArrowPathIcon className="flex-shrink-0 h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{props.children}</>;
};

export default CardIsUnlockedWrapper;

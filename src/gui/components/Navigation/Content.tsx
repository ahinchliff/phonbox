import * as React from 'react';
import { useCardStore } from '../../stores/CardStore';
import UnlockCard from '../UnlockCard';
import PhononList from '../PhononList/PhononList';
import CardSettings from '../CardSettings';

type Props = {
  currentTab: Tab;
};

const Content: React.FC<Props> = ({ currentTab: tab }) => {
  const { selectedCard, loadingCardIds, selectedCardId } = useCardStore();

  if (loadingCardIds.includes(selectedCardId)) {
    return null; // todo
  }

  if (!selectedCard) {
    return null; // todo
  }

  if (!selectedCard.unlocked) {
    return <UnlockCard />;
  }

  if (tab === 'settings') {
    return <CardSettings />;
  }

  return <PhononList />;
};

export default Content;

import { useQuery } from '@tanstack/react-query';
import { useCardStore } from '../stores/CardStore';
import { api } from '../utils/safe-window';

const usePhonons = () => {
  const { selectedCard } = useCardStore();

  return useQuery(
    ['phonons', selectedCard?.id],
    () => {
      if (!selectedCard) {
        throw new Error('No selected card');
      }

      return api.getPhonons({ cardId: selectedCard.id });
    },
    {
      enabled: !!selectedCard && !!selectedCard.isUnlocked,
      networkMode: 'always',
    }
  );
};

export default usePhonons;

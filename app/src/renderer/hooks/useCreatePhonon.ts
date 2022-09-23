import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCardStore } from '../stores/CardStore';
import { api } from '../utils/safe-window';

const useCreatePhonon = () => {
  const queryClient = useQueryClient();
  const { selectedCard } = useCardStore();

  const currentPhonons = queryClient.getQueryData([
    'phonons',
    selectedCard?.id,
  ]) as phonbox.Phonon[];

  return useMutation(
    () => {
      if (!selectedCard) {
        throw new Error('No selected card');
      }
      return api.createPhonon({ cardId: selectedCard.id });
    },
    {
      networkMode: 'always',
      onSuccess: (phonon) => {
        if (!selectedCard) {
          throw new Error('No selected card');
        }
        queryClient.setQueryData(
          ['phonons', selectedCard.id],
          [...currentPhonons, phonon]
        );
      },
    }
  );
};

export default useCreatePhonon;

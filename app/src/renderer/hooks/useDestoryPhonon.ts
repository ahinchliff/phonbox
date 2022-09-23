import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCardStore } from '../stores/CardStore';
import { api } from '../utils/safe-window';

const useDestoryPhonon = (onSuccess: (privateKey: string) => void) => {
  const queryClient = useQueryClient();
  const { selectedCard } = useCardStore();

  const currentPhonons = queryClient.getQueryData([
    'phonons',
    selectedCard?.id,
  ]) as phonbox.Phonon[];

  return useMutation(
    async (keyIndex: number) => {
      if (!selectedCard) {
        throw new Error('No selected card');
      }

      return api.destoryPhonon({ cardId: selectedCard.id, keyIndex });
    },
    {
      networkMode: 'always',
      onSuccess: (data, keyIndex: number) => {
        onSuccess(data);
        if (!selectedCard) {
          throw new Error('No selected card');
        }

        queryClient.setQueryData(
          ['phonons', selectedCard.id],
          currentPhonons.filter((p) => p.keyIndex !== keyIndex)
        );
      },
    }
  );
};

export default useDestoryPhonon;

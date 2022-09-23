import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCardStore } from '../stores/CardStore';
import { api } from '../utils/safe-window';

const useSendPhonons = () => {
  const queryClient = useQueryClient();
  const { selectedCard } = useCardStore();

  const senderCurrentPhonons = queryClient.getQueryData([
    'phonons',
    selectedCard?.id,
  ]) as phonbox.Phonon[];

  return useMutation(
    async (keyIndices: number[]) => {
      if (!selectedCard) {
        throw new Error('No fromCardId');
      }

      if (!selectedCard || !selectedCard.pairing) {
        throw new Error('Card is not paired');
      }

      return api.sendPhonons({ cardId: selectedCard.id, keyIndices });
    },
    {
      networkMode: 'always',
      onSuccess: (_, keyIndices) => {
        if (!keyIndices) {
          throw new Error('No keyIndices');
        }

        queryClient.setQueryData(
          ['phonons', selectedCard?.id],
          senderCurrentPhonons.filter((p) => !keyIndices.includes(p.keyIndex))
        );
      },
    }
  );
};

export default useSendPhonons;

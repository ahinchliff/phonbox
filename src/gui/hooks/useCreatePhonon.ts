import { useMutation, useQueryClient } from '@tanstack/react-query';

const useCreatePhonon = (cardId: string) => {
  const queryClient = useQueryClient();

  const currentPhonons = queryClient.getQueryData([
    'phonons',
    cardId,
  ]) as phonbox.Phonon[];

  return useMutation(() => window.api.createPhonon({ cardId }), {
    onSuccess: (phonon) => {
      queryClient.setQueryData(
        ['phonons', cardId],
        [...currentPhonons, phonon]
      );
    },
  });
};

export default useCreatePhonon;

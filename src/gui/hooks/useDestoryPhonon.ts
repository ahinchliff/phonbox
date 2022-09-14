import { useMutation, useQueryClient } from '@tanstack/react-query';

const useDestoryPhonon = (cardId: string) => {
  const queryClient = useQueryClient();

  const currentPhonons = queryClient.getQueryData([
    'phonons',
    cardId,
  ]) as phonbox.Phonon[];

  return useMutation(
    (keyIndex: number) => window.api.destoryPhonon({ cardId, keyIndex }),
    {
      onSuccess: (_, keyIndex) => {
        queryClient.setQueryData(
          ['phonons', cardId],
          currentPhonons.filter((p) => p.keyIndex !== keyIndex)
        );
      },
    }
  );
};

export default useDestoryPhonon;

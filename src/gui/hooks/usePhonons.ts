import { useQuery } from '@tanstack/react-query';

const usePhonons = (cardId: string | undefined) => {
  return useQuery(
    ['phonons', cardId],
    () => window.api.getPhonons({ cardId: cardId }),
    {
      enabled: !!cardId,
    }
  );
};

export default usePhonons;

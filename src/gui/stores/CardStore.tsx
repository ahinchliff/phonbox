import * as React from 'react';

type CardStore = {
  cards: phonbox.CardDetails[];
  loadingCardIds: string[];
  selectedCardId: string | undefined;
  selectedCard: phonbox.CardDetails | undefined;
  setSelectedCardId: (cardId: string) => void;
  unlock: (pin: string) => Promise<void>;
  updatePin: (pin: string) => Promise<void>;
  updateName: (name: string) => Promise<void>;
};

const CardStoreContext = React.createContext<CardStore | undefined>(undefined);

export const CardStoreProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [cards, setCards] = React.useState<phonbox.CardDetails[]>([]);
  const [loadingCardIds, setLoadingCardIds] = React.useState<string[]>([]);
  const [selectedCardId, setSelectedCardId] = React.useState<string>();

  const selectedCard: phonbox.CardDetails | undefined = React.useMemo(
    () => cards.find((card) => card.id === selectedCardId),
    [selectedCardId, cards]
  );

  React.useEffect(() => {
    window.events.onCardUpdated((updatedCard: phonbox.CardDetails) => {
      setCards((currentCards) => {
        const index = currentCards.findIndex(
          (card) => card.id === updatedCard.id
        );

        if (index === -1) {
          return [...currentCards, updatedCard];
        }

        const updatedCards = [...currentCards];

        updatedCards[index] = updatedCard;

        return updatedCards;
      });

      setSelectedCardId((currentSelectedCardId) =>
        currentSelectedCardId ? currentSelectedCardId : updatedCard.id
      );

      setLoadingCardIds((currentLoadingCardIds) =>
        currentLoadingCardIds.filter((cardId) => cardId !== updatedCard.id)
      );
    });

    window.events.onCardRemoved((removedCardId: string) => {
      setCards((currentCards) => {
        const updatedCards = currentCards.filter(
          (card) => card.id !== removedCardId
        );

        return updatedCards;
      });

      setSelectedCardId((currentSelectedCardId) =>
        currentSelectedCardId === removedCardId
          ? undefined
          : currentSelectedCardId
      );

      setLoadingCardIds((currentLoadingCardIds) =>
        currentLoadingCardIds.filter((cardId) => cardId !== removedCardId)
      );
    });

    window.events.onCardLoading((loadingCardId: string) => {
      setLoadingCardIds((currentLoadingCardIds) => [
        ...currentLoadingCardIds,
        loadingCardId,
      ]);

      setSelectedCardId((currentSelectedCardId) =>
        currentSelectedCardId ? currentSelectedCardId : loadingCardId
      );
    });
  }, []);

  const unlock = React.useCallback(
    async (pin: string) => {
      await window.api.unlock({ cardId: selectedCardId, pin });
    },
    [selectedCardId]
  );

  const updateName = React.useCallback(
    async (name: string) => {
      await window.api.updateName({ cardId: selectedCardId, name });
    },
    [selectedCardId]
  );

  const updatePin = React.useCallback(
    async (pin: string) => {
      await window.api.updatePin({ cardId: selectedCardId, pin });
    },
    [selectedCardId]
  );

  const value = React.useMemo(
    () => ({
      cards,
      loadingCardIds,
      selectedCardId,
      selectedCard,
      setSelectedCardId,
      unlock,
      updatePin,
      updateName,
    }),
    [
      cards,
      loadingCardIds,
      selectedCardId,
      selectedCard,
      setSelectedCardId,
      unlock,
      updatePin,
      updateName,
    ]
  );

  return (
    <CardStoreContext.Provider value={value}>
      {children}
    </CardStoreContext.Provider>
  );
};

export const useCardStore = (): CardStore => {
  const context = React.useContext(CardStoreContext);

  if (context === undefined) {
    throw new Error('useCardStore must be used within a CardStoreProvider');
  }
  return context;
};

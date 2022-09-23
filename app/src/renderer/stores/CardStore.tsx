import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { RemotePairingRequest } from '../../types/RemotePairing';
import { handleCardResponse } from '../utils/requests';
import { events, api } from '../utils/safe-window';

type CardStore = {
  cards: phonbox.CardDetails[];
  loadingCardIds: string[];
  selectedCardId: string | undefined;
  selectedCard: phonbox.CardDetails | undefined;
  remotePairingId: string | undefined;
  remotePairingRequests: RemotePairingRequest[];
  setSelectedCardId: (cardId: string) => void;
  unlock: (cardId: string, pin: string) => Promise<void>;
  updatePin: (pin: string) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  initLocalPairing: (cardBId: string) => Promise<void>;
  sendPairingRequest: (
    counterpartyPairingCode: string,
    message: string
  ) => Promise<void>;
  acceptRemotePairing: (cardId: string, pairingCode: string) => Promise<void>;
  rejectRemotePairing: (pairingCode: string) => Promise<void>;
  closePairing: () => Promise<void>;
};

const CardStoreContext = React.createContext<CardStore | undefined>(undefined);

export const CardStoreProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [cards, setCards] = React.useState<phonbox.CardDetails[]>([]);
  const [loadingCardIds, setLoadingCardIds] = React.useState<string[]>([]);
  const [selectedCardId, setSelectedCardId] = React.useState<string>();
  const [remotePairingId, setRemotePairingId] = React.useState<string>();
  const [remotePairingRequests, setRemotePairingRequests] = React.useState<
    RemotePairingRequest[]
  >([]);

  const queryClient = useQueryClient();

  const selectedCard: phonbox.CardDetails | undefined = React.useMemo(
    () => cards.find((card) => card.id === selectedCardId),
    [selectedCardId, cards]
  );

  React.useEffect(() => {
    const onLoadingCardsUpdatedUnsub = events.onLoadingCardsUpdated(
      (loadingCardIds: string[]) => {
        setLoadingCardIds(loadingCardIds);

        setSelectedCardId((currentSelectedCardId) => {
          if (!currentSelectedCardId && loadingCardIds.length) {
            return loadingCardIds[loadingCardIds.length - 1];
          }

          return currentSelectedCardId;
        });
      }
    );

    const onCardsUpdatedUnsub = events.onCardsUpdated(
      (cards: phonbox.CardDetails[]) => {
        setCards(cards);

        setSelectedCardId((currentSelectedCardId) =>
          currentSelectedCardId ? currentSelectedCardId : cards[0]?.id
        );

        setLoadingCardIds((currentLoadingCardIds) =>
          currentLoadingCardIds.filter(
            (cardId) => cardId !== cards[cards.length - 1]?.id
          )
        );
      }
    );

    const onConnectedToRemotePairingServerUnsub =
      events.onConnectedToRemotePairingServer((userId) => {
        setRemotePairingId(userId);
      });

    const onRemotePairingRequestsUpdatedUnsub =
      events.onRemotePairingRequestsUpdated((rps) => {
        setRemotePairingRequests(rps);
      });

    const onPhononReceivedUnsub = events.onPhononReceived((cardId) =>
      queryClient.invalidateQueries(['phonons', cardId])
    );

    return () => {
      onLoadingCardsUpdatedUnsub();
      onCardsUpdatedUnsub();
      onConnectedToRemotePairingServerUnsub();
      onRemotePairingRequestsUpdatedUnsub();
      onPhononReceivedUnsub();
    };
  }, []);

  const unlock = React.useCallback(async (cardId: string, pin: string) => {
    await handleCardResponse(api.unlock({ cardId, pin }));
  }, []);

  const updateName = React.useCallback(
    async (name: string) => {
      if (!selectedCard) {
        throw new Error('No selected card');
      }

      await handleCardResponse(
        api.updateName({ cardId: selectedCard.id, name })
      );
    },
    [selectedCard]
  );

  const updatePin = React.useCallback(
    async (pin: string) => {
      if (!selectedCard) {
        throw new Error('No selected card');
      }
      await handleCardResponse(api.updatePin({ cardId: selectedCard.id, pin }));
    },
    [selectedCard]
  );

  const initLocalPairing = React.useCallback(
    async (cardBId: string) => {
      if (!selectedCardId) {
        throw new Error('No selected card id');
      }
      const pairing = { cardAId: selectedCardId, cardBId };
      await api.initLocalPairing(pairing);
    },
    [selectedCardId]
  );

  const sendPairingRequest = React.useCallback(
    async (counterpartyUserId: string, message: string) => {
      if (!selectedCardId) {
        throw new Error('No selected card id');
      }
      await api.sendPairingRequest({
        cardId: selectedCardId,
        counterpartyUserId,
        message: message,
      });
    },
    [selectedCardId]
  );

  const acceptRemotePairing = React.useCallback(
    async (cardId: string, pairingCode: string) => {
      await api.acceptRemotePairing({
        cardId,
        pairingCode,
      });
    },
    []
  );

  const rejectRemotePairing = React.useCallback(async (pairingCode: string) => {
    await api.rejectRemotePairingRequest({
      pairingCode,
    });
  }, []);

  const closePairing = React.useCallback(async () => {
    if (!selectedCardId) {
      return console.error('No selectedCardId');
    }

    await api.closePairing({
      cardId: selectedCardId,
    });
  }, [selectedCardId]);

  const value = React.useMemo(
    () => ({
      cards,
      loadingCardIds,
      selectedCardId,
      selectedCard,
      remotePairingId,
      remotePairingRequests,
      setSelectedCardId,
      unlock,
      updatePin,
      updateName,
      initLocalPairing,
      sendPairingRequest,
      acceptRemotePairing,
      rejectRemotePairing,
      closePairing,
    }),
    [
      cards,
      loadingCardIds,
      selectedCardId,
      selectedCard,
      remotePairingId,
      remotePairingRequests,
      setSelectedCardId,
      unlock,
      updatePin,
      updateName,
      initLocalPairing,
      sendPairingRequest,
      acceptRemotePairing,
      rejectRemotePairing,
      closePairing,
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

import * as React from 'react';
import { useCardStore } from '../stores/CardStore';
import { ButtonGreen } from './Button';
import SelectCard from './SelectCard';

type Props = {
  onSuccessfulPair: () => void;
};

const LocalPairForm: React.FC<Props> = ({ onSuccessfulPair }) => {
  const { initLocalPairing } = useCardStore();
  const [cardPin, setCardPin] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { cards, selectedCardId, unlock } = useCardStore();

  const cardsThatCanReceive = React.useMemo(
    () => cards.filter((card) => card.id !== selectedCardId),
    [cards, selectedCardId]
  );

  const [recipientCard, setRecipientCard] = React.useState<phonbox.CardDetails>(
    cardsThatCanReceive[0]
  );

  const needsPin = recipientCard && !recipientCard.isUnlocked;

  React.useEffect(() => {
    const defaultCard = cardsThatCanReceive[0];
    setRecipientCard(defaultCard);
  }, [cardsThatCanReceive]);

  const onSubmit = async () => {
    setIsLoading(true);
    if (needsPin) {
      if (!cardPin) {
        throw Error('No card pin');
      }
      await unlock(recipientCard.id, cardPin);
    }

    await initLocalPairing(recipientCard.id);
    onSuccessfulPair();
    setIsLoading(false);
  };

  return (
    <>
      {cardsThatCanReceive.length ? (
        <>
          <label htmlFor="pin" className="block text-sm font-semibold mb-1">
            Receiving card
          </label>
          <SelectCard
            selectedCardId={recipientCard?.id}
            cards={cardsThatCanReceive}
            onChange={(v) => setRecipientCard(v)}
          />
          {needsPin && (
            <input
              placeholder="Card pin"
              type="password"
              className="block w-full appearance-none rounded-md border border-gray-300 mt-1 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm"
              onChange={(e) => setCardPin(e.target.value)}
            />
          )}
          <ButtonGreen
            type="button"
            className="w-full mt-4 mb-6"
            onClick={onSubmit}
            loading={isLoading}
            disabled={needsPin && !cardPin}
          >
            Send
          </ButtonGreen>
        </>
      ) : (
        <p className="text-center">Please connect a second card</p>
      )}
    </>
  );
};

export default LocalPairForm;

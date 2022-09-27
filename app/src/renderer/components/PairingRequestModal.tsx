import * as React from 'react';
import { useCardStore } from '../stores/CardStore';
import { ButtonGreen } from './Button';
import Modal from './Modal';
import SelectCard from './SelectCard';

const PairingRequestModal: React.FC = () => {
  const {
    cards,
    remotePairingRequests,
    unlock,
    acceptRemotePairing,
    rejectRemotePairing,
  } = useCardStore();

  const [recipientCardId, setRecipientCardId] = React.useState<string>();

  const [cardPin, setCardPin] = React.useState<string>();
  const request = remotePairingRequests[0];

  const validCards = React.useMemo(
    () => cards.filter((c) => !c.pairing),
    [cards]
  );

  React.useEffect(() => {
    if (!recipientCardId) {
      setRecipientCardId(validCards[0]?.id);
    }
  }, [validCards]);

  const recipientCard = validCards.find((vc) => vc.id === recipientCardId);

  const needsPin = !recipientCard?.isUnlocked;

  const onSubmit = async () => {
    if (!request || !recipientCard) {
      throw new Error('no pairing request or recipientCard');
    }

    if (needsPin) {
      if (!cardPin) {
        throw Error('No card pin');
      }
      await unlock(recipientCard.id, cardPin);
    }

    await acceptRemotePairing(recipientCard?.id, request.pairingCode);
  };

  if (!request) {
    return null;
  }

  return (
    <Modal
      show={!!request}
      onClose={() => {
        rejectRemotePairing(request.pairingCode);
      }}
      title="New remote pairing request"
    >
      <div className="w-96 text-left mt-4">
        <p className="text-sm mt-3 mb-4">{request.message}</p>
        <label htmlFor="pin" className="block text-sm font-semibold mb-1">
          Receiving card
        </label>
        <SelectCard
          selectedCardId={recipientCard?.id}
          cards={validCards}
          onChange={(v) => setRecipientCardId(v.id)}
        />
        {needsPin && (
          <input
            placeholder="Card pin"
            type="password"
            className="block w-full appearance-none rounded-md border border-gray-300 mt-1 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm"
            onChange={(e) => setCardPin(e.target.value)}
          />
        )}
        <ButtonGreen onClick={onSubmit} className="w-full mt-3">
          Pair
        </ButtonGreen>
      </div>
    </Modal>
  );
};

export default PairingRequestModal;

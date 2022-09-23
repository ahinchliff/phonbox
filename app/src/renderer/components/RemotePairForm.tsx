import * as React from 'react';
import { useCardStore } from '../stores/CardStore';
import { ButtonGreen } from './Button';

type Props = {
  onSuccessfulPair: () => void;
};

const RemotePairForm: React.FC<Props> = ({ onSuccessfulPair }) => {
  const { sendPairingRequest } = useCardStore();
  const [pairingCode, setPairingCode] = React.useState<string>('');
  const [message, setMessage] = React.useState<string>('');

  return (
    <>
      <label htmlFor="pin" className="block text-sm font-semibold mb-1">
        Pairing request
      </label>
      <input
        placeholder="Recipient's pairing code"
        type="text"
        className="block w-full appearance-none rounded-md border border-gray-300 mt-1 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm"
        onChange={(e) => {
          setPairingCode(e.target.value);
        }}
        value={pairingCode}
      />
      <input
        placeholder="Message"
        type="text"
        className="block w-full appearance-none rounded-md border border-gray-300 mt-1 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm"
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        value={message}
      />
      <ButtonGreen
        type="submit"
        disabled={pairingCode === '' || message === ''}
        className="w-full mt-3"
        onClick={async () => {
          onSuccessfulPair();
          await sendPairingRequest(pairingCode, message);
        }}
      >
        Pair
      </ButtonGreen>
    </>
  );
};

export default RemotePairForm;

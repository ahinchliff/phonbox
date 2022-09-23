import * as React from 'react';
import { ArrowPathIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { truncateString } from '../../utils/format';
import SecondaryButton from '../SecondaryButton';
import useDestoryPhonon from '../../hooks/useDestoryPhonon';
import useSendPhonons from '../../hooks/useSendPhonons';
import { useCardStore } from '../../stores/CardStore';

type Props = {
  phonons: phonbox.Phonon[] | undefined;
  onDestroyPhonon: (privateKey: string) => void;
};

const PhononListContent: React.FC<Props> = ({ phonons, onDestroyPhonon }) => {
  const [actionUnderway, setActionUnderway] = React.useState<boolean>(false);

  if (!phonons) {
    return (
      <div className="flex justify-center">
        <ArrowPathIcon className="flex-shrink-0 h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!phonons.length) {
    return (
      <div className="text-center text-gray-500">
        <p>Card is empty. Create a phonon...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white min-w-full overflow-hidden overflow-x-auto align-middle shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <tbody className="divide-y divide-gray-200">
          {phonons.map((phonon) => (
            <tr key={phonon.keyIndex} className="bg-white">
              <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">
                <div className="flex">
                  <BanknotesIcon
                    className="h-5 w-5 flex-shrink-0 text-gray-400 mr-3"
                    aria-hidden="true"
                  />
                  <p className="text-gray-500">
                    {truncateString(phonon.publicKey, 8, 8)}
                  </p>
                </div>
              </td>
              <td className="w-full max-w-0 px-4">
                <ActionButtons
                  keyIndex={phonon.keyIndex}
                  onDestroyPhonon={onDestroyPhonon}
                  setActionUnderway={setActionUnderway}
                  actionIsUnderway={actionUnderway}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PhononListContent;

const ActionButtons: React.FC<{
  keyIndex: number;
  actionIsUnderway: boolean;
  onDestroyPhonon: (privateKey: string) => void;
  setActionUnderway: (isUnderway: boolean) => void;
}> = ({ keyIndex, actionIsUnderway, onDestroyPhonon, setActionUnderway }) => {
  const { selectedCard } = useCardStore();

  const { mutate: destroyPhonon, isLoading: destroyingPhonon } =
    useDestoryPhonon(onDestroyPhonon);

  const { mutate: onSendPhonon, isLoading: sendingPhonon } = useSendPhonons();

  React.useEffect(() => {
    setActionUnderway(destroyingPhonon || sendingPhonon);
    return () => setActionUnderway(false);
  }, [destroyingPhonon, sendingPhonon]);

  return (
    <div className="flex justify-end">
      <SecondaryButton
        className="mr-2 w-20"
        onClick={async () => {
          destroyPhonon(keyIndex);
        }}
        loading={destroyingPhonon}
        disabled={actionIsUnderway}
      >
        Redeem
      </SecondaryButton>
      <SecondaryButton
        className="w-20"
        onClick={() => onSendPhonon([keyIndex])}
        loading={sendingPhonon}
        disabled={!selectedCard?.pairing || actionIsUnderway}
      >
        Send
      </SecondaryButton>
    </div>
  );
};

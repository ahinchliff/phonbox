import * as React from 'react';
import { ArrowPathIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { truncateString } from '../../utils/format';
import SecondaryButton from '../SecondaryButton';
import useDestoryPhonon from '../../hooks/useDestoryPhonon';

type Props = {
  phonons: phonbox.Phonon[] | undefined;
  selectedCardId: string | undefined;
  onDestroyPhonon: (privateKey: string) => void;
};

const PhononListContent: React.FC<Props> = ({
  phonons,
  selectedCardId,
  onDestroyPhonon,
}) => {
  const { mutate: destroyPhonon, data: destoryedPrivateKey } =
    useDestoryPhonon(selectedCardId);

  React.useEffect(() => {
    if (destoryedPrivateKey) {
      onDestroyPhonon(destoryedPrivateKey);
    }
  }, [destoryedPrivateKey, onDestroyPhonon]);

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
                <div className="flex justify-end">
                  <SecondaryButton
                    className="mr-2"
                    onClick={async () => {
                      destroyPhonon(phonon.keyIndex);
                    }}
                  >
                    Redeem
                  </SecondaryButton>
                  <SecondaryButton>Send</SecondaryButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PhononListContent;

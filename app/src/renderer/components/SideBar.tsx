import * as React from 'react';
import { useCardStore } from '../stores/CardStore';
import CardList from './CardList/CardList';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { truncateString } from '../utils/format';

const SideBar: React.FC = () => {
  const { remotePairingId } = useCardStore();

  return (
    <div className="flex w-64 h-screen flex-col bg-gray-800">
      {remotePairingId && (
        <div className="flex justify-between items-center mb-4 p-4 bg-gray-900 text-white">
          <div>
            <p>Pairing code</p>
            <p className="text-xs text-gray-300">
              {truncateString(remotePairingId, 8, 8)}
            </p>
          </div>
          <ClipboardDocumentIcon
            className="text-gray-400 flex-shrink-0 h-6 w-6 hover:text-gray-500 cursor-pointer"
            aria-hidden="true"
            onClick={() => navigator.clipboard.writeText(remotePairingId)}
          />
        </div>
      )}
      <CardList />
      <div className="p-2 text-center">
        <p className="text-xs font-medium text-gray-300">Version 0.0.1</p>
      </div>
    </div>
  );
};

export default SideBar;

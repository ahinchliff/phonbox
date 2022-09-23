import * as React from 'react';
import LocalPairForm from './LocalPairForm';
import Modal from './Modal';
import RemotePairForm from './RemotePairForm';
import Tabs from './Tabs';

type Tab = 'Local' | 'Remote';

type Props = {
  show: boolean;
  onClose: () => void;
};

const PairModal: React.FC<Props> = ({ show, onClose }) => {
  const [tab, setTab] = React.useState<Tab>('Remote');

  return (
    <Modal show={show} onClose={onClose} title="Pair card">
      <Tabs<Tab> tabs={['Remote', 'Local']} active={tab} onChange={setTab} />
      <div className="w-96 text-left mt-4">
        {tab === 'Local' && <LocalPairForm onSuccessfulPair={onClose} />}
        {tab === 'Remote' && <RemotePairForm onSuccessfulPair={onClose} />}
      </div>
    </Modal>
  );
};

export default PairModal;

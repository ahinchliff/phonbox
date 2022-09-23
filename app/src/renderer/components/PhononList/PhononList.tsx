import * as React from 'react';
import { useCardStore } from '../../stores/CardStore';
import usePhonons from '../../hooks/usePhonons';
import { ButtonGreen } from '../Button';
import PhononListContent from './PhononListContent';
import useCreatePhonon from '../../hooks/useCreatePhonon';
import Modal from '../Modal';
import PairModal from '../SendPhononModal';

const PhononList: React.FC = () => {
  const { selectedCard } = useCardStore();
  const { data } = usePhonons();
  const createPhonon = useCreatePhonon();
  const [showPairModal, setShowPairModal] = React.useState<boolean>(false);
  const [destroyedPrivateKey, setDestroyedPrivateKey] =
    React.useState<string>();

  return (
    <>
      <div className="mx-auto px-4">
        <div className="flex justify-end mb-4">
          <ButtonGreen
            onClick={() => setShowPairModal(true)}
            className="mr-3 w-36"
            disabled={!!selectedCard?.pairing}
          >
            Pair Card
          </ButtonGreen>
          <ButtonGreen
            onClick={() => createPhonon.mutate()}
            loading={createPhonon.isLoading}
            className="w-36"
          >
            Create Phonon
          </ButtonGreen>
        </div>
        <PhononListContent
          onDestroyPhonon={setDestroyedPrivateKey}
          phonons={data}
        />
      </div>
      <Modal
        show={!!destroyedPrivateKey}
        onClose={() => setDestroyedPrivateKey(undefined)}
        title="Private key"
      >
        <div>
          <p>{destroyedPrivateKey}</p>
        </div>
      </Modal>
      <PairModal show={showPairModal} onClose={() => setShowPairModal(false)} />
    </>
  );
};

export default PhononList;

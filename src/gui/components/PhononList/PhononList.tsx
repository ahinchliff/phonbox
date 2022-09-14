import * as React from 'react';
import { useCardStore } from '../../stores/CardStore';
import usePhonons from '../../hooks/usePhonons';
import { ButtonGreen } from '../Button';
import PhononListContent from './PhononListContent';
import useCreatePhonon from '../../hooks/useCreatePhonon';
import Modal from '../Modal';

const PhononList: React.FC = () => {
  const { selectedCard } = useCardStore();
  const { data, isLoading } = usePhonons(selectedCard?.id);
  const createPhonon = useCreatePhonon(selectedCard?.id);

  const [destroyedPrivateKey, setDestroyedPrivateKey] =
    React.useState<string>();

  return (
    <>
      <div className="mx-auto px-4 mt-5">
        <div className="flex justify-end mb-4">
          <ButtonGreen
            disabled={isLoading}
            onClick={() => createPhonon.mutate()}
            loading={createPhonon.isLoading}
          >
            Create Phonon
          </ButtonGreen>
        </div>
        <PhononListContent
          onDestroyPhonon={setDestroyedPrivateKey}
          phonons={data}
          selectedCardId={selectedCard?.id}
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
    </>
  );
};

export default PhononList;

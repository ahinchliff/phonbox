declare namespace phonbox {
  type PreloadEvents = {
    onCardLoading: (callback: (cardId: string) => void) => void;
    onCardRemoved: (callback: (cardId: string) => void) => void;
    onCardUpdated: (callback: (card: CardDetails) => void) => void;
  };

  type GetPhononsFunction = (args: { cardId: string }) => Promise<Phonon[]>;

  type UnlockFunction = (args: {
    cardId: string;
    pin: string;
  }) => Promise<void>;

  type UpdateNameFunction = (args: {
    cardId: string;
    name: string;
  }) => Promise<void>;

  type UpdatePinFunction = (args: {
    cardId: string;
    pin: string;
  }) => Promise<void>;

  type CreatePhononFunction = (args: { cardId: string }) => Promise<Phonon>;

  type DestoryPhononFunction = (args: {
    cardId: string;
    keyIndex: number;
  }) => Promise<string>;

  type PreloadApi = {
    getPhonons: GetPhononsFunction;
    unlock: UnlockFunction;
    createPhonon: CreatePhononFunction;
    destoryPhonon: DestoryPhononFunction;
    updateName: UpdateNameFunction;
    updatePin: UpdatePinFunction;
  };
}

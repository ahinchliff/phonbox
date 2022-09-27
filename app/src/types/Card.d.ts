declare namespace phonbox {
  type CertEnvironment = 'dev' | 'alpha';

  type PairigStatus =
    | 'disconnected'
    | 'pairing_step_1'
    | 'pairing_step_2'
    | 'pairing_step_3'
    | 'pairing_step_4'
    | 'paired';

  type LocalPairing = {
    type: 'local';
    status: PairigStatus;
    cardId: string;
  };

  type RemotePairing = {
    type: 'remote';
    status: PairigStatus;
  };

  type CardDetails = {
    id: string;
    isInitialised: boolean;
    publicKey: string;
    isUnlocked: boolean;
    friendlyName: string | undefined;
    certEnvironment: CertEnvironment | undefined;
    pairing: LocalPairing | RemotePairing | undefined;
  };
}

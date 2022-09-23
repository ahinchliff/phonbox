export type SocketError = 'NO_COUNTERPARTY_FOUND' | 'PAIRING_DOESNT_EXIST';

export type SocketOn = {
  REGISTER: (userId: string) => void;
  DEREGISTER: (userId: string) => void;
  CREATE_PAIRING_REQUEST: (
    counterpartyPairingCode: string,
    message: string
  ) => void;
  REJECT_PAIRING_REQUEST: (counterpartyPairingCode: string) => void;
  ACCEPT_PAIRING_REQUEST: (
    counterpartyPairingCode: string,
    cardCert: string
  ) => void;
  PAIR_STEP_TWO: (counterpartyPairingCode: string, pairingDate: string) => void;
  PAIR_STEP_THREE: (
    counterpartyPairingCode: string,
    pairingDate: string
  ) => void;
  PAIR_STEP_FOUR: (
    counterpartyPairingCode: string,
    pairingDate: string
  ) => void;
  PAIRING_SUCCESSFUL: (counterpartyPairingCode: string) => void;
};

export type SocketEmit = {
  REGISTERED: () => void;
  ERROR: (counterpartyPairingCode: string, error: SocketError) => void;
  NEW_PAIRING_REQUEST: (
    counterpartyPairingCode: string,
    message: string
  ) => void;
  PAIRING_REQUEST_REJECTED: (counterpartyPairingCode: string) => void;
  PAIRING_REQUEST_ACCEPTED: (
    counterpartyPairingCode: string,
    cardCert: string
  ) => void;
  PAIR_STEP_TWO: (counterpartyPairingCode: string, pairingDate: string) => void;
  PAIR_STEP_THREE: (
    counterpartyPairingCode: string,
    pairingDate: string
  ) => void;
  PAIR_STEP_FOUR: (
    counterpartyPairingCode: string,
    pairingDate: string
  ) => void;
  PAIRING_SUCCESSFUL: (counterpartyPairingCode: string) => void;
};

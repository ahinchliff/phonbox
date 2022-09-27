import {
  ChangeFriendlyNameResponse,
  ChangePinResponse,
  UnlockResponse,
} from 'phonon-utils/build/apdu/responses';
import { RemotePairingRequest } from './RemotePairing';
export type GetPhononsFunction = (args: {
  cardId: string;
}) => Promise<phonbox.Phonon[]>;

export type UnlockFunction = (args: {
  cardId: string;
  pin: string;
}) => Promise<UnlockResponse>;

export type InitialiseCardFunction = (args: {
  cardId: string;
  pin: string;
}) => Promise<void>;

export type UpdateNameFunction = (args: {
  cardId: string;
  name: string;
}) => Promise<ChangeFriendlyNameResponse>;

export type UpdatePinFunction = (args: {
  cardId: string;
  pin: string;
}) => Promise<ChangePinResponse>;

export type CreatePhononFunction = (args: {
  cardId: string;
}) => Promise<phonbox.Phonon>;

export type DestoryPhononFunction = (args: {
  cardId: string;
  keyIndex: number;
}) => Promise<string>;

export type InitLocalPairingFunction = (args: {
  cardAId: string;
  cardBId: string;
}) => Promise<void>;

export type SendPhononsFunction = (args: {
  cardId: string;
  keyIndices: number[];
}) => Promise<void>;

export type SendPairingRequestFunction = (args: {
  cardId: string;
  counterpartyUserId: string;
  message: string;
}) => Promise<void>;

export type AcceptRemotePairingFunction = (args: {
  cardId: string;
  pairingCode: string;
}) => Promise<void>;

export type RejectRemotePairingRequestFunction = (args: {
  pairingCode: string;
}) => Promise<void>;

export type ClosePairingFunction = (args: { cardId: string }) => Promise<void>;

export type PreloadApi = {
  getPhonons: GetPhononsFunction;
  initialiseCard: InitialiseCardFunction;
  unlock: UnlockFunction;
  createPhonon: CreatePhononFunction;
  destoryPhonon: DestoryPhononFunction;
  initLocalPairing: InitLocalPairingFunction;
  sendPhonons: SendPhononsFunction;
  updateName: UpdateNameFunction;
  updatePin: UpdatePinFunction;
  sendPairingRequest: SendPairingRequestFunction;
  acceptRemotePairing: AcceptRemotePairingFunction;
  rejectRemotePairingRequest: RejectRemotePairingRequestFunction;
  closePairing: ClosePairingFunction;
};

export type PreloadEvents = {
  onLoadingCardsUpdated: (callback: (cardIds: string[]) => void) => () => void;
  onCardsUpdated: (
    callback: (cards: phonbox.CardDetails[]) => void
  ) => () => void;
  onConnectedToRemotePairingServer: (
    callback: (userId: string) => void
  ) => () => void;
  onRemotePairingRequestsUpdated: (
    callback: (remotePairings: RemotePairingRequest[]) => void
  ) => () => void;
  onPhononReceived: (callback: (cardId: string) => void) => () => void;
};

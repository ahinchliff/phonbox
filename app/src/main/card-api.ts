// @ts-ignore
import * as smartcard from 'smartcard';
import { BrowserWindow, ipcMain } from 'electron';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import PhononCard from 'phonon-utils';
import RemotePairing from 'phonon-utils/build/RemotePairing';
import { createSendCommand } from 'phonon-utils/build/adapters';
import { getCardEnvironment } from './utils';
import {
  GetPhononsFunction,
  UnlockFunction,
  UpdateNameFunction,
  UpdatePinFunction,
  CreatePhononFunction,
  DestoryPhononFunction,
  SendPhononsFunction,
  InitLocalPairingFunction,
  SendPairingRequestFunction,
  AcceptRemotePairingFunction,
  RejectRemotePairingRequestFunction,
  ClosePairingFunction as ClosePairingFunction,
} from '../types/IPC';
import { RemotePairingRequest } from '../types/RemotePairing';

type Pairing = {
  sendPhonons: (keyIndicies: number[]) => Promise<void>;
  unpair: () => void;
};

const SOCKET_SERVER = 'https://lionfish-app-8rdaq.ondigitalocean.app';

const cards = new Map<string, PhononCard>();
const cardDetails = new Map<string, phonbox.CardDetails>();
const pairings = new Map<string, Pairing>();
let loadingCardIds: string[] = [];

let remotePairingRequests: RemotePairingRequest[] = [];
const remotePairingUserId = uuidv4();

export const initCardApi = (window: BrowserWindow) => {
  const pushCardsToFrontEnd = () => {
    window.webContents.send('CARDS_UPDATED', Array.from(cardDetails.values()));
  };

  const pushRemotePairingRequestsToFrontEnd = () => {
    window.webContents.send(
      'REMOTE_PAIRING_REQUESTS_UPDATED',
      remotePairingRequests
    );
  };

  const pushLoadingCardsToFrontEnd = () => {
    window.webContents.send('LOADING_CARDS_UPDATED', loadingCardIds);
  };

  const socket: Socket = io(SOCKET_SERVER);

  socket.on('connect', () => {
    socket.emit('REGISTER', remotePairingUserId);
    socket.on('REGISTER', () => {
      window.webContents.send(
        'CONNECTED_TO_REMOTE_PAIRING_SERVER',
        remotePairingUserId
      );
    });

    socket.on('NEW_PAIRING_REQUEST', (pairingCode: string, message: string) => {
      remotePairingRequests.push({
        pairingCode,
        message,
      });
      pushRemotePairingRequestsToFrontEnd();
    });
  });

  const devices = new smartcard.Devices();
  devices.on('device-activated', (event: any) => {
    const cardId = uuidv4();
    event.device.on('card-inserted', async (event: any) => {
      try {
        loadingCardIds = [...loadingCardIds, cardId];
        pushLoadingCardsToFrontEnd();

        const sendCommand = createSendCommand(event.card);
        const phononCard = new PhononCard(sendCommand);
        await phononCard.pair();
        const friendlyName = await phononCard.getFriendlyName();
        const certEnvironment = await getCardEnvironment(phononCard);
        const publicKey = Buffer.from(phononCard.getPublicKey()).toString(
          'hex'
        );

        const cardDetail: phonbox.CardDetails = {
          id: cardId,
          publicKey,
          friendlyName,
          isUnlocked: false,
          certEnvironment,
          pairing: undefined,
        };

        cards.set(cardId, phononCard);
        cardDetails.set(cardId, cardDetail);
        loadingCardIds = loadingCardIds.filter((lc) => lc !== cardId);
        pushCardsToFrontEnd();
        pushLoadingCardsToFrontEnd();
      } catch (error) {
        // Mostly likely to error if invalid phonon card or user removes card during pairing.
        // todo - deal with invalid phonon card in a better manner
        console.error(error);
        cards.delete(cardId);
        cardDetails.delete(cardId);
        pushCardsToFrontEnd();
        loadingCardIds = loadingCardIds.filter((lc) => lc !== cardId);
        pushCardsToFrontEnd();
      }
    });

    event.device.on('card-removed', (event: any) => {
      if (!event.card) {
        return;
      }
      cards.delete(cardId);
      cardDetails.delete(cardId);
      loadingCardIds = loadingCardIds.filter((lc) => lc !== cardId);
      pushCardsToFrontEnd();
      pushLoadingCardsToFrontEnd();
    });
  });

  const getPhonons: GetPhononsFunction = async ({ cardId }) => {
    const card = cards.get(cardId);
    if (!card) {
      throw new Error(`Could not find card with id: ${cardId}`);
    }

    const phononsWithoutPublicKey = await card.listPhonons();

    const phonons: phonbox.Phonon[] = [];

    for (const phonon of phononsWithoutPublicKey) {
      const publicKey = await card.getPhononPublicKey(phonon.keyIndex);

      phonons.push({
        ...phonon,
        publicKey: Buffer.from(publicKey.publicKey).toString('hex'),
      });
    }
    return phonons;
  };

  const unlock: UnlockFunction = async ({ cardId, pin }) => {
    const card = cards.get(cardId);
    if (!card) {
      throw new Error(`Could not find card with id: ${cardId}`);
    }

    const result = await card.unlock(pin);

    if (result.success) {
      updateCardDetails(cardId, {
        isUnlocked: true,
      });

      pushCardsToFrontEnd();
    }

    return result;
  };

  const updateName: UpdateNameFunction = async ({ cardId, name }) => {
    const card = cards.get(cardId);
    if (!card) {
      throw new Error(`Could not find card with id: ${cardId}`);
    }

    const result = await card.changeFriendlyName(name);

    if (result.success) {
      updateCardDetails(cardId, {
        friendlyName: name,
      });

      pushCardsToFrontEnd();
    }

    return result;
  };

  const updatePin: UpdatePinFunction = async ({ cardId, pin }) => {
    const card = cards.get(cardId);
    if (!card) {
      throw new Error(`Could not find card with id: ${cardId}`);
    }

    return card.changePin(pin);
  };

  const createPhonon: CreatePhononFunction = async ({ cardId }) => {
    const card = cards.get(cardId);
    if (!card) {
      throw new Error(`Could not find card with id: ${cardId}`);
    }

    const phonon = await card.createPhonon('secp256k1');

    const publicKey = await card.getPhononPublicKey(phonon.keyIndex);

    return {
      ...phonon,
      publicKey: Buffer.from(publicKey.publicKey).toString('hex'),
    };
  };

  const destroyPhonon: DestoryPhononFunction = async ({ cardId, keyIndex }) => {
    const card = cards.get(cardId);
    if (!card) {
      throw new Error(`Could not find card with id: ${cardId}`);
    }

    const result = await card.destroyPhonon(keyIndex);

    return Buffer.from(result.privateKey).toString('hex');
  };

  const initLocalPairing: InitLocalPairingFunction = async ({
    cardAId,
    cardBId,
  }) => {
    const cardA = cards.get(cardAId);
    if (!cardA) {
      throw new Error(`Could not find card with id: ${cardAId}`);
    }

    const cardB = cards.get(cardBId);
    if (!cardB) {
      throw new Error(`Could not find card with id: ${cardBId}`);
    }

    const { cardA: cardAPairing, cardB: cardBPairing } =
      await createLocalPairing(cardA, cardB);
    pairings.set(cardAId, cardAPairing);
    pairings.set(cardBId, cardBPairing);

    updateCardDetails(cardAId, {
      pairing: {
        type: 'local',
        status: 'paired',
        cardId: cardBId,
      },
    });

    updateCardDetails(cardBId, {
      pairing: {
        type: 'local',
        status: 'paired',
        cardId: cardAId,
      },
    });

    pushCardsToFrontEnd();
  };

  const sendPhonons: SendPhononsFunction = async ({ cardId, keyIndices }) => {
    const pairing = getPairing(cardId);
    await pairing.sendPhonons(keyIndices);
  };

  const sendPairingRequest: SendPairingRequestFunction = async ({
    cardId,
    counterpartyUserId,
    message,
  }) => {
    const card = getCard(cardId);
    const pairingCode = uuidv4();
    updateCardDetails(cardId, {
      pairing: {
        status: 'disconnected',
        type: 'remote',
      },
    });
    pushCardsToFrontEnd();

    const remotePairing = new RemotePairing(card, SOCKET_SERVER, {
      onStatusChange: (newStatus: phonbox.PairigStatus) => {
        updateCardDetails(cardId, {
          pairing: {
            status: newStatus,
            type: 'remote',
          },
        });
        pushCardsToFrontEnd();
      },
      onPhononReceived: () => {
        window.webContents.send('PHONON_RECEIVED', cardId);
      },
      onUnpair: () => {
        closePairing({ cardId });
      },
    });

    socket.emit(
      'NEW_PAIRING_REQUEST',
      counterpartyUserId,
      pairingCode,
      message
    );

    await remotePairing.pair(pairingCode);
    pairings.set(cardId, remotePairing);
  };

  const acceptRemotePairing: AcceptRemotePairingFunction = async ({
    cardId,
    pairingCode,
  }) => {
    removeRemotePairingRequest({ pairingCode });
    const card = getCard(cardId);

    updateCardDetails(cardId, {
      pairing: {
        status: 'disconnected',
        type: 'remote',
      },
    });
    pushCardsToFrontEnd();

    const remotePairing = new RemotePairing(card, SOCKET_SERVER, {
      onStatusChange: (newStatus: phonbox.PairigStatus) => {
        updateCardDetails(cardId, {
          pairing: {
            status: newStatus,
            type: 'remote',
          },
        });
        pushCardsToFrontEnd();
      },
      onPhononReceived: () => {
        window.webContents.send('PHONON_RECEIVED', cardId);
      },
      onUnpair: () => {
        closePairing({ cardId });
      },
    });

    pushCardsToFrontEnd();

    await remotePairing.pair(pairingCode);
    pairings.set(cardId, remotePairing);
  };

  const removeRemotePairingRequest: RejectRemotePairingRequestFunction =
    async ({ pairingCode }) => {
      remotePairingRequests = remotePairingRequests.filter(
        (rpr) => rpr.pairingCode !== pairingCode
      );

      pushRemotePairingRequestsToFrontEnd();
    };

  const closePairing: ClosePairingFunction = async ({ cardId }) => {
    const cardDetail = getCardDetail(cardId);
    const pairing = getPairing(cardId);

    if (cardDetail.pairing?.type === 'local') {
      const counterpartyCardId = cardDetail.pairing.cardId;
      const localCounterparty = getPairing(counterpartyCardId);
      localCounterparty.unpair();
      updateCardDetails(counterpartyCardId, {
        pairing: undefined,
      });
      pairings.delete(counterpartyCardId);
    }

    pairing.unpair();
    updateCardDetails(cardId, {
      pairing: undefined,
    });
    pairings.delete(cardId);

    pushCardsToFrontEnd();
  };

  ipcMain.handle('GET_PHONONS', (_, args) => getPhonons(args));
  ipcMain.handle('UNLOCK', (_, args) => unlock(args));
  ipcMain.handle('CREATE_PHONON', (_, args) => createPhonon(args));
  ipcMain.handle('DESTORY_PHONON', (_, args) => destroyPhonon(args));
  ipcMain.handle('SEND_PHONONS', (_, args) => sendPhonons(args));
  ipcMain.handle('UPDATE_NAME', (_, args) => updateName(args));
  ipcMain.handle('UPDATE_PIN', (_, args) => updatePin(args));
  ipcMain.handle('INIT_LOCAL_PAIRING', (_, args) => initLocalPairing(args));
  ipcMain.handle('SEND_PAIRING_REQUEST', (_, args) => sendPairingRequest(args));
  ipcMain.handle('ACCEPT_REMOTE_PAIRING', (_, args) =>
    acceptRemotePairing(args)
  );
  ipcMain.handle('REJECT_REMOTE_PAIRING_REQUEST', (_, args) =>
    removeRemotePairingRequest(args)
  );
  ipcMain.handle('CLOSE_PAIRING', (_, args) => closePairing(args));
};

const createLocalPairing = async (
  cardA: PhononCard,
  cardB: PhononCard
): Promise<{
  cardA: Pairing;
  cardB: Pairing;
}> => {
  const pairStepOneResonse = await cardA.cardPairStepOne(
    cardB.getCertificate()
  );

  if (pairStepOneResonse.success === false) {
    throw Error('Send phonons command failed');
  }

  const pairStepTwoResponse = await cardB.cardPairStepTwo(
    pairStepOneResonse.data.pairingData
  );

  if (pairStepTwoResponse.success === false) {
    throw Error('Send phonons command failed');
  }

  const pairStepThreeResponse = await cardA.cardPairStepThree(
    pairStepTwoResponse.data.pairingData
  );

  if (pairStepThreeResponse.success === false) {
    throw Error('Send phonons command failed');
  }

  await cardB.cardPairStepFour(pairStepThreeResponse.data.pairingData);

  const unpair = () => console.log('todo');

  return {
    cardA: {
      sendPhonons: async (keyIndicies: number[]) => {
        const sendResponse = await cardA.sendPhonons(keyIndicies);

        if (sendResponse.success === false) {
          throw Error('Send phonons command failed');
        }

        await cardB.receivePhonons(sendResponse.data.transferPackets);
      },
      unpair,
    },
    cardB: {
      sendPhonons: async (keyIndicies: number[]) => {
        const sendResponse = await cardB.sendPhonons(keyIndicies);

        if (sendResponse.success === false) {
          throw Error('Send phonons command failed');
        }

        await cardA.receivePhonons(sendResponse.data.transferPackets);
      },
      unpair,
    },
  };
};

const getCard = (cardId: string) => {
  const card = cards.get(cardId);
  if (!card) {
    throw new Error(`Could not find card with id: ${cardId}`);
  }
  return card;
};

const getCardDetail = (cardId: string) => {
  const card = cardDetails.get(cardId);
  if (!card) {
    throw new Error(`Could not find card details with id: ${cardId}`);
  }
  return card;
};

const getPairing = (cardId: string) => {
  const pairing = pairings.get(cardId);
  if (!pairing) {
    throw new Error(`Could not find a pairing for card with id: ${cardId}`);
  }
  return pairing;
};

const updateCardDetails = (
  cardId: string,
  updatedDetails: Partial<phonbox.CardDetails>
) => {
  const details = getCardDetail(cardId);

  const updatedCardDetails: phonbox.CardDetails = {
    ...details,
    ...updatedDetails,
  };

  cardDetails.set(cardId, updatedCardDetails);
};

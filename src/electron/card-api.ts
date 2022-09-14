// @ts-ignore
import * as smartcard from 'smartcard';
import { BrowserWindow, ipcMain } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import PhononCard from 'phonon-utils';
import { createSendCommand } from 'phonon-utils/build/adapters';
import { getCardEnvironment } from './utils';

const cardCollection = new Map<string, PhononCard>();
const cardDetailsCollection = new Map<string, phonbox.CardDetails>();

const mergeCardDetailsAndUpdate = (
  cardId: string,
  newDetails: Partial<phonbox.CardDetails>
): phonbox.CardDetails => {
  const card = cardDetailsCollection.get(cardId);
  if (!card) {
    throw new Error("Trying to merge card details with a card that isn't set");
  }

  const updatedCard = {
    ...card,
    ...newDetails,
  };

  cardDetailsCollection.set(cardId, updatedCard);

  return updatedCard;
};

export const initCardApi = (window: BrowserWindow) => {
  const devices = new smartcard.Devices();
  devices.on('device-activated', (event: any) => {
    const id = uuidv4();
    event.device.on('card-inserted', async (event: any) => {
      window.webContents.send('CARD_LOADING', id);

      try {
        const sendCommand = createSendCommand(event.card);
        const phononCard = new PhononCard(sendCommand);
        await phononCard.pair();
        const friendlyName = await phononCard.getFriendlyName();
        const certEnvironment = await getCardEnvironment(phononCard);
        const publicKey = Buffer.from(phononCard.getPublicKey()).toString(
          'hex'
        );

        const card: phonbox.CardDetails = {
          id,
          publicKey,
          friendlyName,
          unlocked: false,
          unlockTriesRemaining: undefined,
          certEnvironment,
        };

        cardCollection.set(id, phononCard);
        cardDetailsCollection.set(id, card);

        window.webContents.send('CARD_UPDATED', card);
      } catch (error) {
        // Mostly likely to error if invalid phonon card or user removes card during pairing.
        // todo - deal with invalid phonon card in a better manner
        console.error(error);
      }
    });

    event.device.on('card-removed', (event: any) => {
      if (!event.card) {
        return;
      }

      cardCollection.delete(id);
      cardDetailsCollection.delete(id);

      window.webContents.send('CARD_REMOVED', id);
    });
  });

  const getPhonons: phonbox.GetPhononsFunction = async ({ cardId }) => {
    const card = cardCollection.get(cardId);
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

  const unlock: phonbox.UnlockFunction = async ({ cardId, pin }) => {
    const card = cardCollection.get(cardId);
    if (!card) {
      throw new Error(`Could not find card with id: ${cardId}`);
    }

    const result = await card.unlock(pin);

    const updatedCard =
      result.success === true
        ? mergeCardDetailsAndUpdate(cardId, {
            unlocked: true,
            unlockTriesRemaining: undefined,
          })
        : mergeCardDetailsAndUpdate(cardId, {
            unlocked: false,
            unlockTriesRemaining: result.triesRemaining,
          });

    window.webContents.send('CARD_UPDATED', updatedCard);

    // todo - return or throw error so foundend can respond
  };

  const updateName: phonbox.UpdateNameFunction = async ({ cardId, name }) => {
    const card = cardCollection.get(cardId);
    if (!card) {
      throw new Error(`Could not find card with id: ${cardId}`);
    }

    const result = await card.changeFriendlyName(name);

    if (result.success) {
      const updatedCard = mergeCardDetailsAndUpdate(cardId, {
        friendlyName: name,
      });
      window.webContents.send('CARD_UPDATED', updatedCard);
    }

    // todo - return or throw error so foundend can respond
  };

  const updatePin: phonbox.UpdatePinFunction = async ({ cardId, pin }) => {
    const card = cardCollection.get(cardId);
    if (!card) {
      throw new Error(`Could not find card with id: ${cardId}`);
    }

    await card.changePin(pin);

    // todo - return or throw error so foundend can respond
  };

  const createPhonon: phonbox.CreatePhononFunction = async ({ cardId }) => {
    const card = cardCollection.get(cardId);
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

  const destroyPhonon: phonbox.DestoryPhononFunction = async ({
    cardId,
    keyIndex,
  }) => {
    const card = cardCollection.get(cardId);
    if (!card) {
      throw new Error(`Could not find card with id: ${cardId}`);
    }

    const result = await card.destroyPhonon(keyIndex);

    return Buffer.from(result.privateKey).toString('hex');
  };

  ipcMain.handle('GET_PHONONS', (_, args) => getPhonons(args));
  ipcMain.handle('UNLOCK', (_, args) => unlock(args));
  ipcMain.handle('CREATE_PHONON', (_, args) => createPhonon(args));
  ipcMain.handle('DESTORY_PHONON', (_, args) => destroyPhonon(args));
  ipcMain.handle('UPDATE_NAME', (_, args) => updateName(args));
  ipcMain.handle('UPDATE_PIN', (_, args) => updatePin(args));
};

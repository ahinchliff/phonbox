import { contextBridge, ipcRenderer } from 'electron';

const events: phonbox.PreloadEvents = {
  onCardLoading: (callback: (cardId: string) => void) =>
    ipcRenderer.on('CARD_LOADING', (_, id) => callback(id)),
  onCardUpdated: (callback: (card: phonbox.CardDetails) => void) =>
    ipcRenderer.on('CARD_UPDATED', (_, card) => callback(card)),
  onCardRemoved: (callback: (cardId: string) => void) =>
    ipcRenderer.on('CARD_REMOVED', (_, id) => callback(id)),
};

const api: phonbox.PreloadApi = {
  getPhonons: async (args: { cardId: string }): Promise<phonbox.Phonon[]> =>
    ipcRenderer.invoke('GET_PHONONS', args),
  createPhonon: async (args: { cardId: string }): Promise<phonbox.Phonon> =>
    ipcRenderer.invoke('CREATE_PHONON', args),
  destoryPhonon: async (args: {
    cardId: string;
    keyIndex: number;
  }): Promise<string> => ipcRenderer.invoke('DESTORY_PHONON', args),
  unlock: async (args: { cardId: string; pin: string }): Promise<void> =>
    ipcRenderer.invoke('UNLOCK', args),
  updateName: async (args: { cardId: string; name: string }): Promise<void> =>
    ipcRenderer.invoke('UPDATE_NAME', args),
  updatePin: async (args: { cardId: string; pin: string }): Promise<void> =>
    ipcRenderer.invoke('UPDATE_PIN', args),
};

contextBridge.exposeInMainWorld('events', events);
contextBridge.exposeInMainWorld('api', api);

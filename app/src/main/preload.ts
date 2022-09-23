import { contextBridge, ipcRenderer } from 'electron';
import { PreloadApi, PreloadEvents } from '../types/IPC';

const hookUpEvent =
  (eventName: string): any =>
  (cb: Function): Function => {
    const subscription = (_: any, ...args: any) => cb(...args);
    ipcRenderer.on(eventName, subscription);
    return () => ipcRenderer.removeListener('PHONON_RECEIVED', subscription);
  };

const events: PreloadEvents = {
  onLoadingCardsUpdated: hookUpEvent('LOADING_CARDS_UPDATED'),
  onCardsUpdated: hookUpEvent('CARDS_UPDATED'),
  onConnectedToRemotePairingServer: hookUpEvent(
    'CONNECTED_TO_REMOTE_PAIRING_SERVER'
  ),
  onRemotePairingRequestsUpdated: hookUpEvent(
    'REMOTE_PAIRING_REQUESTS_UPDATED'
  ),
  onPhononReceived: hookUpEvent('PHONON_RECEIVED'),
};

const api: PreloadApi = {
  getPhonons: async (args) => ipcRenderer.invoke('GET_PHONONS', args),
  createPhonon: async (args) => ipcRenderer.invoke('CREATE_PHONON', args),
  destoryPhonon: async (args) => ipcRenderer.invoke('DESTORY_PHONON', args),
  initLocalPairing: async (args) =>
    ipcRenderer.invoke('INIT_LOCAL_PAIRING', args),
  sendPhonons: async (args) => ipcRenderer.invoke('SEND_PHONONS', args),
  unlock: async (args) => ipcRenderer.invoke('UNLOCK', args),
  updateName: async (args) => ipcRenderer.invoke('UPDATE_NAME', args),
  updatePin: async (args) => ipcRenderer.invoke('UPDATE_PIN', args),
  sendPairingRequest: async (args) =>
    ipcRenderer.invoke('SEND_PAIRING_REQUEST', args),
  acceptRemotePairing: async (args) =>
    ipcRenderer.invoke('ACCEPT_REMOTE_PAIRING', args),
  rejectRemotePairingRequest: async (args) =>
    ipcRenderer.invoke('REJECT_REMOTE_PAIRING_REQUEST', args),
  closePairing: async (args) => ipcRenderer.invoke('CLOSE_PAIRING', args),
};

contextBridge.exposeInMainWorld('events', events);
contextBridge.exposeInMainWorld('api', api);

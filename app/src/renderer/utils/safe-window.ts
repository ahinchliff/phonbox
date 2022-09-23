import { PreloadApi, PreloadEvents } from '../../types/IPC';

export const events = (window as any).events as PreloadEvents;
export const api = (window as any).api as PreloadApi;

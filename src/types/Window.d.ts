declare global {
  interface Window {
    events: phonbox.PreloadEvents;
    api: phonbox.PreloadApi;
  }
}

export {};

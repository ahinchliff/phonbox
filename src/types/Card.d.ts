declare namespace phonbox {
  type CertEnvironment = 'dev' | 'alpha';

  type CardDetails = {
    id: string;
    publicKey: string;
    unlocked: boolean;
    unlockTriesRemaining: number | undefined;
    friendlyName: string | undefined;
    certEnvironment: CertEnvironment | undefined;
  };
}

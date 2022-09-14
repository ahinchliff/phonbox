import PhononCard from 'phonon-utils';
import {
  PHONON_CA_PUBLIC_KEY_ALPHA,
  PHONON_CA_PUBLIC_KEY_DEV,
} from 'phonon-utils/build/constants';

// todo - there is probably a much easier and more efficient way to achieve this.
export const getCardEnvironment = async (
  phononCard: PhononCard
): Promise<phonbox.CertEnvironment | undefined> => {
  const certNameToCert: Record<phonbox.CertEnvironment, Uint8Array> = {
    dev: PHONON_CA_PUBLIC_KEY_DEV,
    alpha: PHONON_CA_PUBLIC_KEY_ALPHA,
  };

  const certsNames = Object.keys(certNameToCert) as phonbox.CertEnvironment[];

  for (const certName of certsNames) {
    const result = await phononCard.verifyCard(certNameToCert[certName]);

    if (result.valid) {
      return certName;
    }
  }
};

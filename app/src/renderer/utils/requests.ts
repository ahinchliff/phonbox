import { ParseResponse } from 'phonon-utils/build/apdu/responses';

export const handleCardResponse = async <Success, Error>(
  responsePromise: Promise<ParseResponse<Success, Error>>
): Promise<Success> => {
  const response = await responsePromise;
  if (response.success === false) {
    throw response.error;
  }

  return response.data;
};

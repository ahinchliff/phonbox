import * as dotenv from 'dotenv';

dotenv.config();

const getConfig = () => {
  const config: Config = {
    env: getEnvVariable('NODE_ENV'),
    port: getEnvVariable('PORT'),
  };

  return config;
};

export default getConfig;

const getEnvVariable = (property: string, canBeUndefined = false): any => {
  const value = process.env[property];

  if (!canBeUndefined && !value) {
    throw new Error(`${property} environment variable is not set`);
  }

  return value;
};

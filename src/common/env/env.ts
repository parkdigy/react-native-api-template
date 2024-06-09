/********************************************************************************************************************
 * ENV 모듈
 * ******************************************************************************************************************/

import { Env } from './env.types';

const env: Env = {
  $$routerCount: 0,

  isLocal: process.env.APP_ENV === 'local',
  isDevelopment: process.env.APP_ENV === 'development',
  isStaging: process.env.APP_ENV === 'staging',
  isProduction: process.env.APP_ENV === 'production',
};

export default env;

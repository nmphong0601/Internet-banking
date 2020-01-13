// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  AUX_BENEFICIARY: '',
  AUX_URL: '',
  BASE_URL: '',
  AUTH_API: '',
  CUST_SERV: '',
  TRANSF_SERV: '',
  REQ_SERV: '',
  PAYMENTS_SERV: '',
  CHANNEL: '',
  CHANNEL_SHORTNAME: '',
  ENV_NAME: 'localhost:4200',
  ATM_LIMIT: '',
  PUB_ENC_KEY: ``,
  PUB_IBANK_ENC_KEY1: ``,
  PUB_IBANK_ENC_KEY: ``,
 
  PRIV_ENC_KEY: `-----BEGIN RSA PRIVATE KEY-----
  
  -----END RSA PRIVATE KEY-----`
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

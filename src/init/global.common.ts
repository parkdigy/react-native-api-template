import _aes256 from '../common/aes256';
import _aws from '../common/aws';
import _crypt from '../common/crypt';
import _env from '../common/env';
import _util from '../common/util';
import _param from '../common/param';
import _mail from '../common/mail';
import _jwt from '../common/jwt';

import _db from '../db';
import _api from '../common/api';

/* eslint-disable */
declare global {
  var aes256: typeof _aes256;
  var aws: typeof _aws;
  var crypt: typeof _crypt;
  var env: typeof _env;
  var util: typeof _util;
  var param: typeof _param;
  var mail: typeof _mail;
  var jwt: typeof _jwt;

  var db: typeof _db;
  var api: typeof _api;
}
/* eslint-enable */

globalThis.aes256 = _aes256;
globalThis.aws = _aws;
globalThis.crypt = _crypt;
globalThis.env = _env;
globalThis.util = _util;
globalThis.param = _param;
globalThis.mail = _mail;
globalThis.jwt = _jwt;

globalThis.db = _db;
globalThis.api = _api;

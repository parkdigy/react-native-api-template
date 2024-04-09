import PdgUtil from '@pdg/util';
import file from './file';
import ip from './ip';
import md5 from './md5';
import password from './password';
import slack from './slack';
import sha1 from './sha1';
import sha256 from './sha256';

const util = {
  ...PdgUtil,
  file,
  ip,
  md5,
  password,
  slack,
  sha1,
  sha256,
};

export default util;

export { util };

import base64URLEncode from './helpers/base64URLEncode';
import crypt from 'crypto-js';
import Cookies from 'universal-cookie';

import * as AuthConst from './helpers/AuthConstants';

const AuthCodeRequest = () => {
    const cookies = new Cookies();
    const codeVerifier = base64URLEncode(crypt.lib.WordArray.random(45).toString());
    const codeChallenge = crypt.SHA256(codeVerifier);
    cookies.set("code_verifier", codeVerifier, { path: '/' });
    window.location = `${AuthConst.identity}/authorize?client_id=${AuthConst.client_id}&response_type=code&code_challenge=${codeChallenge}&redirect_uri=${encodeURI(AuthConst.redirect_uri)}`;
}

export default AuthCodeRequest;
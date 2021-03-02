import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import _ from 'lodash';

import { AuthConsumer } from '../authContext';
import * as AuthConst from './helpers/AuthConstants';

const OauthRedirect = () => (
    <AuthConsumer>
        {
            ( ) => {
                const authCode = window.location.href.substring(
                    window.location.href.indexOf("code=") + 5,
                    window.location.href.length
                );
                const cookies = new Cookies();
                const code_verifier = cookies.get('code_verifier');

                const requestBody = {
                    grant_type: "authorization_code",
                    code: authCode,
                    redirect_uri: AuthConst.redirect_uri,
                    code_verifier: code_verifier
                };

                axios.post(`${AuthConst.identity}/token`, requestBody , {headers:AuthConst.headers})
                    .then(response => {
                        const accessToken = response.data.access_token;
                        const accessTokenExpiry = response.data.access_token_expiry;
                        const refreshToken = response.data.refresh_token;
                        const refreshTokenExpiry = response.data.refresh_token_expiry;
                        cookies.remove("access_token");
                        cookies.remove("refresh_token");
                        cookies.set("access_token", accessToken, { path: "/", expires: new Date(accessTokenExpiry) });
                        cookies.set("refresh_token", refreshToken, { path: "/", expires: new Date(refreshTokenExpiry) });
                        
                        if(!_.isEmpty(response.data.referer)){
                            window.location = response.data.referer
                        }else{
                            window.location.href = '/';
                        }
                    })   
                    .catch((error) => {
                        console.log('[Failed Access-Token Request - Error: ] ' + error);   
                    });
            }
        }
    </AuthConsumer>
);

export default OauthRedirect;
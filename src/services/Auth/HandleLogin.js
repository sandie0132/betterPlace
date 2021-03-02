import React from 'react';
import { AuthConsumer } from '../authContext';
import Cookies from 'universal-cookie';

const HandleLogin = () => (
  <AuthConsumer>
    {
      ({ initiateLogin }) => {
        let authCode = window.location.search.substring(1);
        
        if(authCode!==undefined && authCode.length >0 && authCode.indexOf("code=")>=0){
          return null;
        }

        const cookies = new Cookies();
        const refresh_token = cookies.get('refresh_token');
        const access_token = cookies.get('access_token');

        if(!access_token && !refresh_token){
          initiateLogin()
        }
      }
    }
  </AuthConsumer>
);

export default HandleLogin;
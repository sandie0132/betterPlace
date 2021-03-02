import base64 from 'base-64';

export const identity = process.env.REACT_APP_IDENTITY_BASE_URL;
export const redirect_uri = process.env.REACT_APP_IDENTITY_REDIRECT_URL;
export const client_id = process.env.REACT_APP_CLIENT_KEY;

const auth = "Basic " + base64.encode(client_id);
export const headers = {
   "Content-Type": "application/json",
    "Authorization": auth
};
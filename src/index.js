/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';
import Cookies from 'universal-cookie';

import { Route, BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import {
  createStore, combineReducers, compose, applyMiddleware,
} from 'redux';
import thunk from 'redux-thunk';

import './index.module.scss';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import * as serviceWorker from './serviceWorker';

import * as AuthConst from './services/Auth/helpers/AuthConstants';
import Auth from './services/Auth/Auth';
import OauthRedirect from './services/Auth/OauthRedirect';
import SendLink from './containers/SendLinkTmplt/SendLinkTmplt';
import AuthReducer from './services/Auth/Store/reducer';
import UserReducer from './containers/User/Store/reducer';
import downloadFilesReducer from './containers/DownloadFiles/Store/reducer';
import imageStoreReducer from './containers/Home/Store/reducer';
import notificationsReducer from './containers/CustomerMgmt/Notifications/Store/reducer';

import orgMgmtReducer from './containers/CustomerMgmt/OrgMgmt/OrgMgmtStore/reducer';
import tagMgmtReducer from './containers/CustomerMgmt/TagMgmt/TagMgmtStore/reducer';
// import empMgmt from "./containers/CustomerMgmt/EmpMgmt/EmpMgmtStore/reducer";
import onboardingMgmt from './containers/CustomerMgmt/EmpMgmt/EmpMgmtStore/reducer';
import tagSearchReducer from './containers/TagSearch/Store/reducer';
import employeeSearchReducer from './containers/EmpSearch/Store/reducer';
import tagTraverseReducer from './containers/TagSearch/TagTraverse/Store/reducer';
import opsHomeReducer from './containers/Home/OpsHome/Store/reducer';
import workloadMgmtReducer from './containers/WorkloadMgmt/Store/reducer';
import vendorMgmtReducer from './containers/CustomerMgmt/VendorMgmt/VendorMgmtStore/reducer';
import sendLinkReducer from './containers/SendLinkTmplt/Store/reducer';
import vendorSearchReducer from './containers/VendorSearch/Store/reducer';
import ErrorPage from './components/Molecule/ErrorHandler/ErrorPage/ErrorPage';
import SessionExpired from './components/Molecule/SessionExpired/SessionExpired';
import 'react-crux/dist/index.css';
import i18n from './i18next';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  auth: AuthReducer,
  user: UserReducer,
  imageStore: imageStoreReducer,
  downloadFiles: downloadFilesReducer,
  notifications: notificationsReducer,
  orgMgmt: orgMgmtReducer,
  tagMgmt: tagMgmtReducer,
  empMgmt: onboardingMgmt,
  tagSearch: tagSearchReducer,
  employeeSearch: employeeSearchReducer,
  tagTraverse: tagTraverseReducer,
  opsHome: opsHomeReducer,
  workloadMgmt: workloadMgmtReducer,
  vendorMgmt: vendorMgmtReducer,
  verification: sendLinkReducer,
  vendorSearch: vendorSearchReducer,
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk)),
);

const app = (
  <I18nextProvider i18n={i18n}>
    <Suspense fallback={(<div> Loading ~~~~~~  </div>)}>
      <Provider store={store}>
        <BrowserRouter>
          <Auth>
            <App />
            <Route path="/oauth-redirect" component={OauthRedirect} />
            <Route path="/verification" component={SendLink} />
          </Auth>
        </BrowserRouter>
      </Provider>
    </Suspense>
  </I18nextProvider>
);

axios.interceptors.request.use((config) => {
  const cookies = new Cookies();
  const access_token = cookies.get('access_token');
  if (access_token !== undefined && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  return config;
});

let isAlreadyFetchingAccessToken = false;
let subscribers = [];

function onAccessTokenFetched(access_token) {
  subscribers = subscribers.filter((callback) => callback(access_token));
}

function addSubscriber(callback) {
  subscribers.push(callback);
}

axios.interceptors.response.use((response) => response, (error) => {
  const { config, response: { status } } = error;
  const originalRequest = config;

  const api = config.url.split('/');
  if (status > 499 || status === 403) {
    ReactDOM.render(
      <Provider store={store}>
        <BrowserRouter>
          <ErrorPage errorCode={error.response.status} />
        </BrowserRouter>
      </Provider>,
      document.getElementById('root'),
    );
  } else if ((status === 401) && (api[api.length - 1] !== 'token')) {
    if (!isAlreadyFetchingAccessToken) {
      isAlreadyFetchingAccessToken = true;
      const cookies = new Cookies();
      const refreshToken = cookies.get('refresh_token');
      if (refreshToken && refreshToken !== undefined) {
        const requestBody = {
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        };
        axios.post(`${AuthConst.identity}/token`, requestBody, { headers: AuthConst.headers })
          .then((response) => {
            if (response.status === 200 || response.status === 201) {
              const newAccessToken = response.data.access_token;
              const accessTokenExpiry = response.data.access_token_expiry;
              const newRefreshToken = response.data.refresh_token;
              const refreshTokenExpiry = response.data.refresh_token_expiry;
              cookies.set('access_token', newAccessToken, { path: '/', expires: new Date(accessTokenExpiry) });
              cookies.set('refresh_token', newRefreshToken, { path: '/', expires: new Date(refreshTokenExpiry) });
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              isAlreadyFetchingAccessToken = false;
              onAccessTokenFetched(newAccessToken);
            }
          })
          .catch(() => {
            ReactDOM.render(
              <Provider store={store}>
                <BrowserRouter>
                  <Auth>
                    <SessionExpired />
                  </Auth>
                </BrowserRouter>
              </Provider>,
              document.getElementById('root'),
            );
          });
      } else {
        ReactDOM.render(
          <Provider store={store}>
            <BrowserRouter>
              <Auth>
                <SessionExpired />
              </Auth>
            </BrowserRouter>
          </Provider>,
          document.getElementById('root'),
        );
      }
    }
    const retryOriginalRequest = new Promise((resolve) => {
      addSubscriber((access_token) => {
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        resolve(axios(originalRequest));
      });
    });
    return retryOriginalRequest;
  }
  return Promise.reject(error);
});

ReactDOM.render(app, document.getElementById('root'));
serviceWorker.unregister();

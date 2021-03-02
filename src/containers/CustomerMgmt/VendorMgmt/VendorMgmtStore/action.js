import _ from 'lodash';
import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as initData from './StaticInitData';

const PLATFORM_SERVICES = process.env.REACT_APP_PLATFORM_API_URL;

export const initState = () => (dispatch) => {
  dispatch({
    type: actionTypes.INIT_VENDOR_MGMT_STATE,
  });
};

// Get StaticDataList Action Dispatch
export const getStaticDataList = () => {
  const { data } = initData;
  const vendorMgmtStaticData = { ...initData.vendorMgmtStaticData };
  return (dispatch) => {
    dispatch({
      type: actionTypes.GET_VENDOR_STATIC_DATA_LOADING,
    });
    axios.post(`${PLATFORM_SERVICES}/staticdata`, data)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          _.forEach(response.data, (object) => {
            _.forEach(object, (value, key) => {
              vendorMgmtStaticData[key] = value;
            });
          });
          dispatch({
            type: actionTypes.GET_VENDOR_STATIC_DATA_SUCCESS,
            staticData: vendorMgmtStaticData,
          });
        }
      })
      .catch((error) => {
        let errMsg = error;
        if (error.response && error.response.data && error.response.data.errorMessage) {
          errMsg = error.response.data.errorMessage;
        }
        dispatch({
          type: actionTypes.GET_VENDOR_STATIC_DATA_ERROR,
          error: errMsg,
        });
      });
  };
};

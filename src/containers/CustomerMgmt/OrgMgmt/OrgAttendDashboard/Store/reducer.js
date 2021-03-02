import { combineReducers } from 'redux';
import * as actionTypes from './actionTypes';
import updateObject from './utility';

import siteShiftMgmtReducer from '../SiteShiftMgmt/Store/reducer';
import roasterMgmt from '../RoasterMgmt/Store/reducer';

const initialState = {
  orgData: null,
  getOrgProfileState: 'INIT',
};

// GET ORG PROFILE REDUCERS
const getOrgDataLoading = (state) => updateObject(state, {
  getOrgProfileState: 'LOADING',
});

const getOrgDataSuccess = (state, action) => updateObject(state, {
  getOrgProfileState: 'SUCCESS',
  orgData: action.data,
  error: null,
});

const getOrgDataError = (state, action) => updateObject(state, {
  getOrgProfileState: 'ERROR',
  error: action.error,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ORG_DATA_LOADING: return getOrgDataLoading(state, action);
    case actionTypes.GET_ORG_DATA_SUCCESS: return getOrgDataSuccess(state, action);
    case actionTypes.GET_ORG_DATA_ERROR: return getOrgDataError(state, action);

    default: return state;
  }
};

const orgAttendDashboardReducer = combineReducers({
  siteShiftMgmt: siteShiftMgmtReducer,
  roasterMgmt,
  orgAttendDashboard: reducer,
});

export default orgAttendDashboardReducer;

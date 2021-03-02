/* eslint-disable arrow-body-style */
import { combineReducers } from 'redux';
import { updateObject } from '../../OrgMgmtStore/utility';
import orgLevelConfigReducer from '../OrgLevelConfig/Store/reducer';
import holidayConfigReducer from '../HolidayConfig/Store/reducer';
import {
  ORG_CONFIG_LOADING, ORG_CONFIG_SUCCESS, ORG_CONFIG_ERROR, INIT_STATE,
} from './actionTypes';
import siteConfigReducer from '../SiteConfig/Store/reducer';
import betterplaceSpocConfigReducer from '../BetterplaceSpocConfig/Store/reducer';
import clientSpocConfigReducer from '../ClientSpocConfig/Store/reducer';
import leaveConfigReducer from '../LeaveConfig/Store/reducer';

const initialState = {
  error: null,
};

//  INIT STATE REDUCERS
const initState = () => {
  return initialState;
};

const getOrgConfigLoading = (state) => updateObject(state, {
  attendConfigState: 'LOADING',
  error: null,
});

const getOrgConfigSuccess = (state, action) => updateObject(state, {
  attendConfigState: 'SUCCESS',
  attendConfig: action.data,
  error: null,
});

const getOrgConfigError = (state, action) => updateObject(state, {
  attendConfigState: 'ERROR',
  error: action.error,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case INIT_STATE: return initState();
    case ORG_CONFIG_LOADING: return getOrgConfigLoading(state, action);
    case ORG_CONFIG_SUCCESS: return getOrgConfigSuccess(state, action);
    case ORG_CONFIG_ERROR: return getOrgConfigError(state, action);

    default: return state;
  }
};

const orgAttendConfigReducer = combineReducers({
  attendConfig: reducer,
  orgLevelConfig: orgLevelConfigReducer,
  siteConfig: siteConfigReducer,
  bpSpocConfig: betterplaceSpocConfigReducer,
  holidayConfig: holidayConfigReducer,
  clientSpoc: clientSpocConfigReducer,
  leaveConfig: leaveConfigReducer,

});

export default orgAttendConfigReducer;

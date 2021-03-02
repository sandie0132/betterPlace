import { updateObject } from './utility';

import * as actionTypes from './actionTypes';

const initialState = {
  error: null,
  postOrgAttendanceConfigState: 'INIT',
  getOrgAttendanceConfigState: 'INIT',
  orgAttendanceConfig: null,
};

/// //post org config
const postOrgAttendanceConfigLoading = (state) => updateObject(state, {
  postOrgAttendanceConfigState: 'LOADING',
});

const postOrgAttendanceConfigSuccess = (state, action) => updateObject(state, {
  postOrgAttendanceConfigState: 'SUCCESS',
  orgAttendanceConfig: action.data,
});

const postOrgAttendanceConfigError = (state, action) => updateObject(state, {
  postOrgAttendanceConfigState: 'ERROR',
  error: action.error,
});

/// ////get org attendance config
const getOrgAttendanceConfigLoading = (state) => updateObject(state, {
  getOrgAttendanceConfigState: 'LOADING',
});

const getOrgAttendanceConfigSuccess = (state, action) => updateObject(state, {
  getOrgAttendanceConfigState: 'SUCCESS',
  orgAttendanceConfig: action.data,
});

const getOrgAttendanceConfigError = (state, action) => updateObject(state, {
  getOrgAttendanceConfigState: 'ERROR',
  error: action.error,
});

const getAttendanceConfigHistory = (state, action) => updateObject(state, {
  attendanceConfigHistory: action.data,
  attendanceConfigHistoryStatus: 'SUCCESS',
});

const getAttendanceConfigHistoryErr = (state, action) => updateObject(state, {
  error: action.error,
  attendanceConfigHistoryStatus: 'ERROR',
});

const getAttendanceConfigHistoryEditedBy = (state, action) => updateObject(state, {
  [`attendanceConfigHistoryEditedBy${action.id}`]: action.data,
  attendanceConfigHistoryEditedByStatus: 'SUCCESS',
});

const getAttendanceConfigHistoryEditedByErr = (state, action) => updateObject(state, {
  error: action.error,
  attendanceConfigHistoryEditedByStatus: 'ERROR',
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.POST_ORG_ATTENDANCE_CONFIG_LOADING:
      return postOrgAttendanceConfigLoading(state);
    case actionTypes.POST_ORG_ATTENDANCE_CONFIG_SUCCESS:
      return postOrgAttendanceConfigSuccess(state, action);
    case actionTypes.POST_ORG_ATTENDANCE_CONFIG_ERROR:
      return postOrgAttendanceConfigError(state, action);

    case actionTypes.GET_ORG_ATTENDANCE_CONFIG_LOADING:
      return getOrgAttendanceConfigLoading(state);
    case actionTypes.GET_ORG_ATTENDANCE_CONFIG_SUCCESS:
      return getOrgAttendanceConfigSuccess(state, action);
    case actionTypes.GET_ORG_ATTENDANCE_CONFIG_ERROR:
      return getOrgAttendanceConfigError(state, action);
    case actionTypes.ORG_ATTD_CONFIG_HISTORY:
      return getAttendanceConfigHistory(state, action);
    case actionTypes.ORG_ATTD_CONFIG_HISTORY_ERR:
      return getAttendanceConfigHistoryErr(state, action);
    case actionTypes.ORG_HISTORY_EDITED_BY:
      return getAttendanceConfigHistoryEditedBy(state, action);
    case actionTypes.ORG_HISTORY_EDITED_BY_ERR:
      return getAttendanceConfigHistoryEditedByErr(state, action);

    default: return state;
  }
};

export default reducer;

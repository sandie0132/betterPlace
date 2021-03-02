import { updateObject } from './utility';

import * as actionTypes from './actionTypes';

const initialState = {
  error: null,
  postHolidayConfigState: 'INIT',
  putHolidayConfigState: 'INIT',
  getHolidayConfigListState: 'INIT',
  getHolidayConfigByIdState: 'INIT',
  deleteHolidayConfigState: 'INIT',
  getTagInfoState: 'INIT',
  tagList: [],
  holidayConfigList: [],
  holidayConfigData: null,

};
// initState
const initState = () => initialState;

/// //post holiday config
const postHolidayConfigLoading = (state) => updateObject(state, {
  postHolidayConfigState: 'LOADING',
});

const postHolidayConfigSuccess = (state, action) => updateObject(state, {
  postHolidayConfigState: 'SUCCESS',
  holidayConfigData: action.data,
  error: null,
});

const postHolidayConfigError = (state, action) => updateObject(state, {
  postHolidayConfigState: 'ERROR',
  error: action.error,
});

/// //get holiday config by id
const getHolidayConfigByIdLoading = (state) => updateObject(state, {
  getHolidayConfigByIdState: 'LOADING',
});

const getHolidayConfigByIdSuccess = (state, action) => updateObject(state, {
  getHolidayConfigByIdState: 'SUCCESS',
  holidayConfigData: action.data,
  error: null,
});

const getHolidayConfigByIdError = (state, action) => updateObject(state, {
  getHolidayConfigByIdState: 'ERROR',
  error: action.error,
});

/// //put holiday config
const putHolidayConfigLoading = (state) => updateObject(state, {
  putHolidayConfigState: 'LOADING',
});

const putHolidayConfigSuccess = (state, action) => updateObject(state, {
  putHolidayConfigState: 'SUCCESS',
  holidayConfigData: action.data,
  error: null,
});

const putHolidayConfigError = (state, action) => updateObject(state, {
  putHolidayConfigState: 'ERROR',
  error: action.error,
});

/// //delete holiday config
const deleteHolidayConfigLoading = (state) => updateObject(state, {
  deleteHolidayConfigState: 'LOADING',
});

const deleteHolidayConfigSuccess = (state) => updateObject(state, {
  deleteHolidayConfigState: 'SUCCESS',
  error: null,
});

const deleteHolidayConfigError = (state, action) => updateObject(state, {
  deleteHolidayConfigState: 'ERROR',
  error: action.error,
});

/// //get holiday config
const getHolidayConfigLoading = (state) => updateObject(state, {
  getHolidayConfigListState: 'LOADING',
});

const getHolidayConfigSuccess = (state, action) => updateObject(state, {
  getHolidayConfigListState: 'SUCCESS',
  holidayConfigList: action.data,
  error: null,
});

const getHolidayConfigError = (state, action) => updateObject(state, {
  getHolidayConfigListState: 'ERROR',
  error: action.error,
});

// GET TAGINFODATA
const getTagInfoDataLoading = (state) => updateObject(state, {
  getTagInfoState: 'LOADING',
});

const getTagInfoDataSuccess = (state, action) => updateObject(state, {
  getTagInfoState: 'SUCCESS',
  tagList: action.tagList,
  error: null,
});

const getTagInfoDataError = (state, action) => updateObject(state, {
  getTagInfoState: 'ERROR',
  error: action.error,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_STATE: return initState();
    case actionTypes.POST_HOLIDAY_CONFIGURATION_LOADING:
      return postHolidayConfigLoading(state);
    case actionTypes.POST_HOLIDAY_CONFIGURATION_SUCCESS:
      return postHolidayConfigSuccess(state, action);
    case actionTypes.POST_HOLIDAY_CONFIGURATION_ERROR:
      return postHolidayConfigError(state, action);
    case actionTypes.GET_HOLIDAY_CONFIGURATION_BY_ID_LOADING:
      return getHolidayConfigByIdLoading(state);
    case actionTypes.GET_HOLIDAY_CONFIGURATION_BY_ID_SUCCESS:
      return getHolidayConfigByIdSuccess(state, action);
    case actionTypes.GET_HOLIDAY_CONFIGURATION_BY_ID_ERROR:
      return getHolidayConfigByIdError(state, action);
    case actionTypes.PUT_HOLIDAY_CONFIGURATION_LOADING:
      return putHolidayConfigLoading(state);
    case actionTypes.PUT_HOLIDAY_CONFIGURATION_SUCCESS:
      return putHolidayConfigSuccess(state, action);
    case actionTypes.PUT_HOLIDAY_CONFIGURATION_ERROR:
      return putHolidayConfigError(state, action);
    case actionTypes.DELETE_HOLIDAY_CONFIGURATION_LOADING:
      return deleteHolidayConfigLoading(state);
    case actionTypes.DELETE_HOLIDAY_CONFIGURATION_SUCCESS:
      return deleteHolidayConfigSuccess(state, action);
    case actionTypes.DELETE_HOLIDAY_CONFIGURATION_ERROR:
      return deleteHolidayConfigError(state, action);
    case actionTypes.GET_HOLIDAY_CONFIGURATION_LOADING:
      return getHolidayConfigLoading(state);
    case actionTypes.GET_HOLIDAY_CONFIGURATION_SUCCESS:
      return getHolidayConfigSuccess(state, action);
    case actionTypes.GET_HOLIDAY_CONFIGURATION_ERROR:
      return getHolidayConfigError(state, action);
    case actionTypes.GET_TAG_INFO_LOADING:
      return getTagInfoDataLoading(state);
    case actionTypes.GET_TAG_INFO_SUCCESS:
      return getTagInfoDataSuccess(state, action);
    case actionTypes.GET_TAG_INFO_ERROR:
      return getTagInfoDataError(state, action);

    default: return state;
  }
};

export default reducer;

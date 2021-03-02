import * as actionTypes from './actionTypes';
import { updateObject } from '../../Store/utility';

const initialState = {
  error: null,
  postAttendSiteConfigState: 'INIT',
  getAttendSiteConfigState: 'INIT',
  deleteAttendSiteConfigState: 'INIT',
  putAttendSiteConfigState: 'INIT',
  siteConfigData: null,
  postTagInfoState: 'INIT',
  tagList: [],
  getAttendSiteConfigCountState: 'INIT',
  getAttendSiteConfigListState: 'INIT',
  siteConfigList: null,
  noSitesConfigured: true,
  dataCount: 0,
  prevSiteName: '',
};

// INIT STATE
const initState = () => initialState;

// POST SITE CONFIG
const postAttendSiteConfigLoading = (state) => updateObject(state, {
  postAttendSiteConfigState: 'LOADING',
});

const postAttendSiteConfigSuccess = (state, action) => updateObject(state, {
  postAttendSiteConfigState: 'SUCCESS',
  siteConfigData: action.data,
  prevSiteName: action.prevSiteName,
});

const postAttendSiteConfigError = (state, action) => updateObject(state, {
  postAttendSiteConfigState: 'ERROR',
  error: action.error,
});

// PUT SITE CONFIG
const putAttendSiteConfigLoading = (state) => updateObject(state, {
  putAttendSiteConfigState: 'LOADING',
});

const putAttendSiteConfigSuccess = (state, action) => updateObject(state, {
  putAttendSiteConfigState: 'SUCCESS',
  siteConfigData: action.data,
});

const putAttendSiteConfigError = (state, action) => updateObject(state, {
  putAttendSiteConfigState: 'ERROR',
  error: action.error,
});

// GET SITE CONFIG
const getAttendSiteConfigLoading = (state) => updateObject(state, {
  getAttendSiteConfigState: 'LOADING',
});

const getAttendSiteConfigSuccess = (state, action) => updateObject(state, {
  getAttendSiteConfigState: 'SUCCESS',
  siteConfigData: action.data,
});

const getAttendSiteConfigError = (state, action) => updateObject(state, {
  getAttendSiteConfigState: 'ERROR',
  error: action.error,
});

// DELETE SITE CONFIG
const deleteAttendSiteConfigLoading = (state) => updateObject(state, {
  deleteAttendSiteConfigState: 'LOADING',
});

const deleteAttendSiteConfigSuccess = (state, action) => updateObject(state, {
  deleteAttendSiteConfigState: 'SUCCESS',
  prevSiteName: action.prevSiteName,
});

const deleteAttendSiteConfigError = (state, action) => updateObject(state, {
  deleteAttendSiteConfigState: 'ERROR',
  error: action.error,
});

// GET SITE CONFIG LIST
const getAttendSiteConfigListLoading = (state) => updateObject(state, {
  getAttendSiteConfigListState: 'LOADING',
});

const getAttendSiteConfigListSuccess = (state, action) => updateObject(state, {
  getAttendSiteConfigListState: 'SUCCESS',
  siteConfigList: action.siteConfigList,
});

const getAttendSiteConfigListError = (state, action) => updateObject(state, {
  getAttendSiteConfigListState: 'ERROR',
  error: action.error,
});

// GET SITE CONFIG COUNT
const getAttendSiteConfigCountLoading = (state) => updateObject(state, {
  getAttendSiteConfigCountState: 'LOADING',
});

const getAttendSiteConfigCountSuccess = (state, action) => updateObject(state, {
  getAttendSiteConfigCountState: 'SUCCESS',
  dataCount: action.dataCount,
  noSitesConfigured: action.noSitesConfigured,
});

const getAttendSiteConfigCountError = (state, action) => updateObject(state, {
  getAttendSiteConfigCountState: 'ERROR',
  error: action.error,
});

// POST TAGINFODATA REDUCERS
const postTagInfoDataLoading = (state) => updateObject(state, {
  postTagInfoState: 'LOADING',
});

const postTagInfoDataSuccess = (state, action) => updateObject(state, {
  postTagInfoState: 'SUCCESS',
  tagList: action.tagList,
  error: null,
});

const postTagInfoDataError = (state, action) => updateObject(state, {
  postTagInfoState: 'ERROR',
  error: action.error,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_STATE: return initState();

    case actionTypes.POST_ATTEND_SITE_CONFIG_LOADING: return postAttendSiteConfigLoading(state);
    case actionTypes.POST_ATTEND_SITE_CONFIG_SUCCESS:
      return postAttendSiteConfigSuccess(state, action);
    case actionTypes.POST_ATTEND_SITE_CONFIG_ERROR: return postAttendSiteConfigError(state, action);

    case actionTypes.PUT_ATTEND_SITE_CONFIG_LOADING: return putAttendSiteConfigLoading(state);
    case actionTypes.PUT_ATTEND_SITE_CONFIG_SUCCESS:
      return putAttendSiteConfigSuccess(state, action);
    case actionTypes.PUT_ATTEND_SITE_CONFIG_ERROR: return putAttendSiteConfigError(state, action);

    case actionTypes.GET_ATTEND_SITE_CONFIG_LOADING: return getAttendSiteConfigLoading(state);
    case actionTypes.GET_ATTEND_SITE_CONFIG_SUCCESS:
      return getAttendSiteConfigSuccess(state, action);
    case actionTypes.GET_ATTEND_SITE_CONFIG_ERROR: return getAttendSiteConfigError(state, action);

    case actionTypes.DELETE_ATTEND_SITE_CONFIG_LOADING:
      return deleteAttendSiteConfigLoading(state);
    case actionTypes.DELETE_ATTEND_SITE_CONFIG_SUCCESS:
      return deleteAttendSiteConfigSuccess(state, action);
    case actionTypes.DELETE_ATTEND_SITE_CONFIG_ERROR:
      return deleteAttendSiteConfigError(state, action);

    case actionTypes.GET_ATTEND_SITE_CONFIG_LIST_LOADING:
      return getAttendSiteConfigListLoading(state);
    case actionTypes.GET_ATTEND_SITE_CONFIG_LIST_SUCCESS:
      return getAttendSiteConfigListSuccess(state, action);
    case actionTypes.GET_ATTEND_SITE_CONFIG_LIST_ERROR:
      return getAttendSiteConfigListError(state, action);

    case actionTypes.GET_ATTEND_SITE_CONFIG_COUNT_LOADING:
      return getAttendSiteConfigCountLoading(state);
    case actionTypes.GET_ATTEND_SITE_CONFIG_COUNT_SUCCESS:
      return getAttendSiteConfigCountSuccess(state, action);
    case actionTypes.GET_ATTEND_SITE_CONFIG_COUNT_ERROR:
      return getAttendSiteConfigCountError(state, action);

    case actionTypes.POST_TAG_INFO_DATA_LOADING: return postTagInfoDataLoading(state, action);
    case actionTypes.POST_TAG_INFO_DATA_SUCCESS: return postTagInfoDataSuccess(state, action);
    case actionTypes.POST_TAG_INFO_DATA_ERROR: return postTagInfoDataError(state, action);

    default: return state;
  }
};

export default reducer;

import { combineReducers } from 'redux';
import * as actionTypes from './actionTypes';
import updateObject from '../../Store/utility';
import CreateShiftReducer from '../CreateShift/Store/reducer';
import SiteDetailsReducer from '../SiteDetails/Store/reducer';

const initialState = {
  error: null,
  getAttendSiteListState: 'INIT',
  getAttendSiteCountState: 'INIT',
  siteList: null,
  dataCount: 0,
  postTagInfoState: 'INIT',
  tagList: [],
};

// INIT STATE
const initState = () => initialState;

// GET SITE CONFIG LIST
const getAttendSiteListLoading = (state) => updateObject(state, {
  getAttendSiteListState: 'LOADING',
});

const getAttendSiteListSuccess = (state, action) => updateObject(state, {
  getAttendSiteListState: 'SUCCESS',
  siteList: action.siteList,
});

const getAttendSiteListError = (state, action) => updateObject(state, {
  getAttendSiteListState: 'ERROR',
  error: action.error,
});

// GET SITE CONFIG COUNT
const getAttendSiteCountLoading = (state) => updateObject(state, {
  getAttendSiteCountState: 'LOADING',
});

const getAttendSiteCountSuccess = (state, action) => updateObject(state, {
  getAttendSiteCountState: 'SUCCESS',
  dataCount: action.dataCount,
  noSitesConfigured: action.noSitesConfigured,
});

const getAttendSiteCountError = (state, action) => updateObject(state, {
  getAttendSiteCountState: 'ERROR',
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

    case actionTypes.GET_ATTEND_SITE_LIST_LOADING:
      return getAttendSiteListLoading(state);
    case actionTypes.GET_ATTEND_SITE_LIST_SUCCESS:
      return getAttendSiteListSuccess(state, action);
    case actionTypes.GET_ATTEND_SITE_LIST_ERROR:
      return getAttendSiteListError(state, action);

    case actionTypes.GET_ATTEND_SITE_COUNT_LOADING:
      return getAttendSiteCountLoading(state);
    case actionTypes.GET_ATTEND_SITE_COUNT_SUCCESS:
      return getAttendSiteCountSuccess(state, action);
    case actionTypes.GET_ATTEND_SITE_COUNT_ERROR:
      return getAttendSiteCountError(state, action);

    case actionTypes.POST_TAG_INFO_DATA_LOADING: return postTagInfoDataLoading(state, action);
    case actionTypes.POST_TAG_INFO_DATA_SUCCESS: return postTagInfoDataSuccess(state, action);
    case actionTypes.POST_TAG_INFO_DATA_ERROR: return postTagInfoDataError(state, action);

    default: return state;
  }
};

const ShiftManagementReducer = combineReducers({
  siteShiftMgmt: reducer,
  siteDetails: SiteDetailsReducer,
  createShift: CreateShiftReducer,
});

export default ShiftManagementReducer;

import * as actionTypes from './actionTypes';
import updateObject from './utility';

const initialState = {
  error: null,
  siteDetails: null,
  getAttendSiteDetailsState: 'INIT',
  shiftList: [],
  getSiteShiftListState: 'INIT',
  getTagInfoState: 'INIT',
  tagDetails: null,

};

// GET SITE CONFIG
const getAttendSiteDetailsLoading = (state) => updateObject(state, {
  getAttendSiteDetailsState: 'LOADING',
  getSiteShiftListState: 'INIT',
  shiftList: [],
});

const getAttendSiteDetailsSuccess = (state, action) => updateObject(state, {
  getAttendSiteDetailsState: 'SUCCESS',
  siteDetails: action.data,
});

const getAttendSiteDetailsError = (state, action) => updateObject(state, {
  getAttendSiteDetailsState: 'ERROR',
  error: action.error,
});

// GET SITE SHIFT LIST
const getSiteShiftListLoading = (state) => updateObject(state, {
  getSiteShiftListState: 'LOADING',
});

const getSiteShiftListSuccess = (state, action) => updateObject(state, {
  getSiteShiftListState: 'SUCCESS',
  shiftList: action.data,
});

const getSiteShiftListError = (state, action) => updateObject(state, {
  getSiteShiftListState: 'ERROR',
  error: action.error,
});

// POST TAGINFODATA REDUCERS
const getTagInfoDataLoading = (state) => updateObject(state, {
  getTagInfoState: 'LOADING',
  tagDetails: null,
});

const getTagInfoDataSuccess = (state, action) => updateObject(state, {
  getTagInfoState: 'SUCCESS',
  tagDetails: action.data,
  error: null,
});

const getTagInfoDataError = (state, action) => updateObject(state, {
  getTagInfoState: 'ERROR',
  error: action.error,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ATTEND_SITE_CONFIG_LOADING:
      return getAttendSiteDetailsLoading(state);
    case actionTypes.GET_ATTEND_SITE_CONFIG_SUCCESS:
      return getAttendSiteDetailsSuccess(state, action);
    case actionTypes.GET_ATTEND_SITE_CONFIG_ERROR:
      return getAttendSiteDetailsError(state, action);
    case actionTypes.GET_SITE_SHIFT_LIST_LOADING:
      return getSiteShiftListLoading(state, action);
    case actionTypes.GET_SITE_SHIFT_LIST_SUCCESS:
      return getSiteShiftListSuccess(state, action);
    case actionTypes.GET_SITE_SHIFT_LIST_ERROR:
      return getSiteShiftListError(state, action);
    case actionTypes.GET_TAG_INFO_DATA_LOADING:
      return getTagInfoDataLoading(state, action);
    case actionTypes.GET_TAG_INFO_DATA_SUCCESS:
      return getTagInfoDataSuccess(state, action);
    case actionTypes.GET_TAG_INFO_DATA_ERROR:
      return getTagInfoDataError(state, action);
    default: return state;
  }
};

export default reducer;

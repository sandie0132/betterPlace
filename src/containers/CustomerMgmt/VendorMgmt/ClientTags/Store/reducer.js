/* eslint-disable max-len */
import * as actionTypes from './actionTypes';
import updateObject from '../../VendorMgmtStore/utility';

const initialState = {
  error: null,
  getOrgName: '',
  getOrgNameState: 'INIT',
  getClientDataState: 'INIT',
  getClientData: null,
  getClientTagsCount: 0,
  getClientTagsCountState: 'INIT',
  clientTagsState: 'INIT',
  clientTags: [],
};

const initState = () => initialState;

const getOrgNameLoading = (state) => updateObject(state, {
  getOrgNameState: 'LOADING',
  error: null,
});

const getOrgNameSuccess = (state, action) => updateObject(state, {
  getOrgNameState: 'SUCCESS',
  getOrgName: action.orgName,
  error: null,
});

const getOrgNameError = (state, action) => updateObject(state, {
  getOrgNameState: 'ERROR',
  error: action.error,
});

const getClientDataLoading = (state) => updateObject(state, {
  getClientDataState: 'LOADING',
  error: null,
});

const getClientDataSuccess = (state, action) => updateObject(state, {
  getClientDataState: 'SUCCESS',
  getClientData: action.clientData,
  error: null,
});

const getClientDataError = (state, action) => updateObject(state, {
  getClientDataState: 'ERROR',
  error: action.error,
});

const getClientTagsCountLoading = (state) => updateObject(state, {
  getClientTagsCountState: 'LOADING',
  error: null,
});

const getClientTagsCountSuccess = (state, action) => updateObject(state, {
  getClientTagsCountState: 'SUCCESS',
  getClientTagsCount: action.clientTagsCount,
  error: null,
});

const getClientTagsCountError = (state, action) => updateObject(state, {
  getClientTagsCountState: 'ERROR',
  error: action.error,
});

const getClientTagsLoading = (state) => updateObject(state, {
  clientTagsState: 'LOADING',
});

const getClientTagsSuccess = (state, action) => updateObject(state, {
  clientTagsState: 'SUCCESS',
  clientTags: action.clientTags,
});

const getClientTagsError = (state, action) => updateObject(state, {
  clientTagsState: 'ERROR',
  error: action.error,
});

const getSelectedFilterTagDetailsLoading = (state) => updateObject(state, {
  selectedFilterTagState: 'LOADING',
  error: null,
});

const getSelectedFilterTagDetailsSuccess = (state, action) => updateObject(state, {
  selectedFilterTagState: 'SUCCESS',
  selectedFilterTagData: action.selectedFilterTagDetails,
  error: null,
});

const getSelectedFilterTagDetailsError = (state, action) => updateObject(state, {
  selectedFilterTagState: 'ERROR',
  error: action.error,
});

const getSelectedFilterTagCountLoading = (state) => updateObject(state, {
  selectedFilterTagCountState: 'LOADING',
  error: null,
});

const getSelectedFilterTagCountSuccess = (state, action) => updateObject(state, {
  selectedFilterTagCountState: 'SUCCESS',
  selectedFilterTagCount: action.selectedFilterTagCount,
  error: null,
});

const getSelectedFilterTagCountError = (state, action) => updateObject(state, {
  selectedFilterTagCountState: 'ERROR',
  error: action.error,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_CLIENT_TAGS_STATE: return initState();

    case actionTypes.GET_ORG_NAME_LOADING: return getOrgNameLoading(state);
    case actionTypes.GET_ORG_NAME_SUCCESS: return getOrgNameSuccess(state, action);
    case actionTypes.GET_ORG_NAME_ERROR: return getOrgNameError(state, action);

    case actionTypes.GET_CLIENT_DATA_LOADING: return getClientDataLoading(state, action);
    case actionTypes.GET_CLIENT_DATA_SUCCESS: return getClientDataSuccess(state, action);
    case actionTypes.GET_CLIENT_DATA_ERROR: return getClientDataError(state, action);

    case actionTypes.GET_CLIENT_TAGS_COUNT_LOADING: return getClientTagsCountLoading(state, action);
    case actionTypes.GET_CLIENT_TAGS_COUNT_SUCCESS: return getClientTagsCountSuccess(state, action);
    case actionTypes.GET_CLIENT_TAGS_COUNT_ERROR: return getClientTagsCountError(state, action);

    case actionTypes.GET_CLIENT_TAGS_LOADING: return getClientTagsLoading(state);
    case actionTypes.GET_CLIENT_TAGS_SUCCESS: return getClientTagsSuccess(state, action);
    case actionTypes.GET_CLIENT_TAGS_ERROR: return getClientTagsError(state, action);

    case actionTypes.POST_SELECTED_FILTERS_TAG_DETAILS_LOADING: return getSelectedFilterTagDetailsLoading(state, action);
    case actionTypes.POST_SELECTED_FILTERS_TAG_DETAILS_SUCCESS: return getSelectedFilterTagDetailsSuccess(state, action);
    case actionTypes.POST_SELECTED_FILTERS_TAG_DETAILS_ERROR: return getSelectedFilterTagDetailsError(state, action);

    case actionTypes.POST_SELECTED_FILTERS_TAG_COUNT_LOADING: return getSelectedFilterTagCountLoading(state, action);
    case actionTypes.POST_SELECTED_FILTERS_TAG_COUNT_SUCCESS: return getSelectedFilterTagCountSuccess(state, action);
    case actionTypes.POST_SELECTED_FILTERS_TAG_COUNT_ERROR: return getSelectedFilterTagCountError(state, action);

    default: return state;
  }
};

export default reducer;

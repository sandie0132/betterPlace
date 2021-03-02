import * as actionTypes from './actionTypes';
import { updateObject } from '../../../../EmpMgmtStore/utility';

const initialState = {
  searchedVendorList: [],
  searchedVendorListState: 'INIT',
  searchedClientList: [],
  searchedClientListState: 'INIT',
  subVendorList: [],
  subVendorListState: 'INIT',
  superClientList: [],
  superClientListState: 'INIT',
  error: null,
};

const initState = () => initialState;

const searchVendorListLoading = (state) => updateObject(state, {
  searchedVendorListState: 'LOADING',
});

const searchVendorListSuccess = (state, action) => updateObject(state, {
  searchedVendorListState: 'SUCCESS',
  searchedVendorList: action.searchedVendorList,
  error: null,
});

const searchVendorListError = (state, action) => updateObject(state, {
  searchedVendorListState: 'ERROR',
  error: action.error,
});

const searchClientListLoading = (state) => updateObject(state, {
  searchedClientListState: 'LOADING',
});

const searchClientListSuccess = (state, action) => updateObject(state, {
  searchedClientListState: 'SUCCESS',
  searchedClientList: action.searchedClientList,
  error: null,
});

const searchClientListError = (state, action) => updateObject(state, {
  searchedClientListState: 'ERROR',
  error: action.error,
});

const getSubVendorLoading = (state) => updateObject(state, {
  subVendorListState: 'LOADING',
});

const getSubVendorSuccess = (state, action) => updateObject(state, {
  subVendorListState: 'SUCCESS',
  subVendorList: action.subVendorList,
  error: null,
});

const getSubVendorError = (state, action) => updateObject(state, {
  subVendorListState: 'ERROR',
  error: action.error,
});

const getSuperClientLoading = (state) => updateObject(state, {
  superClientListState: 'LOADING',
});

const getSuperClientSuccess = (state, action) => updateObject(state, {
  superClientListState: 'SUCCESS',
  superClientList: action.superClientList,
  error: null,
});

const getSuperClientError = (state, action) => updateObject(state, {
  superClientListState: 'ERROR',
  error: action.error,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_VENDOR_FILTERS: return initState(state, action);

    case actionTypes.SEARCH_VENDOR_LIST_LOADING: return searchVendorListLoading(state, action);
    case actionTypes.SEARCH_VENDOR_LIST_SUCCESS: return searchVendorListSuccess(state, action);
    case actionTypes.SEARCH_VENDOR_LIST_ERROR: return searchVendorListError(state, action);

    case actionTypes.SEARCH_CLIENT_LIST_LOADING: return searchClientListLoading(state, action);
    case actionTypes.SEARCH_CLIENT_LIST_SUCCESS: return searchClientListSuccess(state, action);
    case actionTypes.SEARCH_CLIENT_LIST_ERROR: return searchClientListError(state, action);

    case actionTypes.GET_SUBVENDOR_LIST_LOADING: return getSubVendorLoading(state, action);
    case actionTypes.GET_SUBVENDOR_LIST_SUCCESS: return getSubVendorSuccess(state, action);
    case actionTypes.GET_SUBVENDOR_LIST_ERROR: return getSubVendorError(state, action);

    case actionTypes.GET_SUPERCLIENT_LIST_LOADING: return getSuperClientLoading(state, action);
    case actionTypes.GET_SUPERCLIENT_LIST_SUCCESS: return getSuperClientSuccess(state, action);
    case actionTypes.GET_SUPERCLIENT_LIST_ERROR: return getSuperClientError(state, action);

    default: return state;
  }
};

export default reducer;

import { combineReducers } from 'redux';
import * as actionTypes from './actionTypes';
import updateObject from './utility';

const initialState = {
  getAssociatedOrgListState: 'INIT',
  associatedList: {},
  subVendorList: [],
  subVendorListState: 'INIT',
  superClientList: [],
  superClientListState: 'INIT',
  error: null,
};

const initState = () => initialState;

// GET DATA REDUCERS
const getAssociatedOrgListLoading = (state) => updateObject(state, {
  getAssociatedOrgListState: 'LOADING',
});

const getAssociatedOrgListSuccess = (state, action) => updateObject(state, {
  getAssociatedOrgListState: 'SUCCESS',
  associatedList: { ...state.associatedList, ...action.associatedList },
  error: null,
});

const getAssociatedOrgListError = (state, action) => updateObject(state, {
  getAssociatedOrgListState: 'ERROR',
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
    case actionTypes.INIT_STATE: return initState();

    case actionTypes.GET_ASSOCIATED_ORG_LIST_LOADING:
      return getAssociatedOrgListLoading(state, action);
    case actionTypes.GET_ASSOCIATED_ORG_LIST_SUCCESS:
      return getAssociatedOrgListSuccess(state, action);
    case actionTypes.GET_ASSOCIATED_ORG_LIST_ERROR:
      return getAssociatedOrgListError(state, action);

    case actionTypes.GET_SUBVENDOR_LIST_LOADING: return getSubVendorLoading(state, action);
    case actionTypes.GET_SUBVENDOR_LIST_SUCCESS: return getSubVendorSuccess(state, action);
    case actionTypes.GET_SUBVENDOR_LIST_ERROR: return getSubVendorError(state, action);

    case actionTypes.GET_SUPERCLIENT_LIST_LOADING: return getSuperClientLoading(state, action);
    case actionTypes.GET_SUPERCLIENT_LIST_SUCCESS: return getSuperClientSuccess(state, action);
    case actionTypes.GET_SUPERCLIENT_LIST_ERROR: return getSuperClientError(state, action);

    default: return state;
  }
};

const vendorSearch = combineReducers({
  associatedOrgList: reducer,
});

export default vendorSearch;

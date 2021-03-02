import * as actionTypes from './actionTypes';
import { updateObject } from '../../../OrgMgmtStore/utility';

const initialState = {
  getContactListState: 'INIT',
  getContactList: [],
  error: null,
  postSelectedSpocs: 'INIT',
  getPostedSpocs: 'INIT',
  putSelectedSpocs: 'INIT',
  postedContacts: [],
  // configuredData: null,

  empDetails: '',
  empDetailsState: 'INIT',
  tagData: '',
  tagDataState: 'INIT',
  singleEmpData: '',
  singleEmpDataState: 'INIT',
};

const getInitState = () => initialState;

const getContactListLoading = (state) => updateObject(state, {
  error: null,
  getContactListState: 'LOADING',
});

const getContactListSuccess = (state, action) => updateObject(state, {
  error: null,
  getContactList: action.contactList,
  getContactListState: 'SUCCESS',
});

const getContactListError = (state, action) => updateObject(state, {
  error: action.error,
  getContactListState: 'ERROR',
});

const postSelectedSpocsLoading = (state) => updateObject(state, {
  postSelectedSpocs: 'LOADING',
});

const postSelectedSpocsSuccess = (state) => updateObject(state, {
  error: null,
  postSelectedSpocs: 'SUCCESS',
});

const postSelectedSpocsError = (state, action) => updateObject(state, {
  postSelectedSpocs: 'ERROR',
  error: action.error,
});

const getSelectedSpocsLoading = (state) => updateObject(state, {
  getPostedSpocs: 'LOADING',
});

const getSelectedSpocsSuccess = (state, action) => updateObject(state, {
  getPostedSpocs: 'SUCCESS',
  error: null,
  postedContacts: action.selectedSpocs,
  // configuredData: action.configuredData,
});

const getSelectedSpocsError = (state, action) => updateObject(state, {
  getPostedSpocs: 'ERROR',
  error: action.error,
});

const getEmployeeDetailsLoading = (state) => updateObject(state, {
  empDetailsState: 'LOADING',
  error: null,
});

const getEmployeeDetailsSuccess = (state, action) => updateObject(state, {
  empDetailsState: 'SUCCESS',
  empDetails: action.empDetails,
  error: null,
});

const getEmployeeDetailsError = (state, action) => updateObject(state, {
  empDetailsState: 'ERROR',
  error: action.error,
});

const getTagNameLoading = (state) => updateObject(state, {
  error: null,
  tagDataState: 'LOADING',
});

const getTagNameSuccess = (state, action) => updateObject(state, {
  error: null,
  tagDataState: 'SUCCESS',
  tagData: action.tagData,
});

const getTagNameError = (state, action) => updateObject(state, {
  error: action.error,
  tagDataState: 'ERROR',
});

const getSingleEmpDataLoading = (state) => updateObject(state, {
  singleEmpDataState: 'LOADING',
});

const getSingleEmpDataSuccess = (state, action) => updateObject(state, {
  singleEmpDataState: 'SUCCESS',
  singleEmpData: action.empData,
  error: null,
});

const getSingleEmpDataError = (state, action) => updateObject(state, {
  singleEmpDataState: 'ERROR',
  error: action.error,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_INIT_STATE: return getInitState(state);

    case actionTypes.GET_BPCONTACT_LIST_LOADING: return getContactListLoading(state, action);
    case actionTypes.GET_BPCONTACT_LIST_SUCCESS: return getContactListSuccess(state, action);
    case actionTypes.GET_BPCONTACT_LIST_ERROR: return getContactListError(state, action);

    case actionTypes.POST_ATTEND_BP_SPOCS_LOADING: return postSelectedSpocsLoading(state, action);
    case actionTypes.POST_ATTEND_BP_SPOCS_SUCCESS: return postSelectedSpocsSuccess(state, action);
    case actionTypes.POST_ATTEND_BP_SPOCS_ERROR: return postSelectedSpocsError(state, action);

    case actionTypes.GET_ATTEND_BP_SPOCS_LOADING: return getSelectedSpocsLoading(state, action);
    case actionTypes.GET_ATTEND_BP_SPOCS_SUCCESS: return getSelectedSpocsSuccess(state, action);
    case actionTypes.GET_ATTEND_BP_SPOCS_ERROR: return getSelectedSpocsError(state, action);

    case actionTypes.GET_BPEMP_LOADING: return getEmployeeDetailsLoading(state, action);
    case actionTypes.GET_BPEMP_SUCCESS: return getEmployeeDetailsSuccess(state, action);
    case actionTypes.GET_BPEMP_ERROR: return getEmployeeDetailsError(state, action);

    case actionTypes.GET_TAG_NAME_LOADING: return getTagNameLoading(state, action);
    case actionTypes.GET_TAG_NAME_SUCCESS: return getTagNameSuccess(state, action);
    case actionTypes.GET_TAG_NAME_ERROR: return getTagNameError(state, action);

    case actionTypes.GET_BPEMP_DATA_LOADING: return getSingleEmpDataLoading(state, action);
    case actionTypes.GET_BPEMP_DATA_SUCCESS: return getSingleEmpDataSuccess(state, action);
    case actionTypes.GET_BPEMP_DATA_ERROR: return getSingleEmpDataError(state, action);

    default: return state;
  }
};

export default reducer;

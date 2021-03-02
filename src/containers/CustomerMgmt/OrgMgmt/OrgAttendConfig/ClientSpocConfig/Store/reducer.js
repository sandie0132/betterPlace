import * as actionTypes from './actionTypes';
import { updateObject } from '../../../OrgMgmtStore/utility';

const initialState = {
  getContactList: 'INIT',
  getPostedSpocs: 'INIT',
  postSelectedSpocs: 'INIT',
  orgContacts: [{
    fullName: '',
    designation: '',
    emailAddress: '',
    phoneNumber: null,
    uuid: null,
    isSelected: false,
  }],
  error: null,
  postedContacts: [],
  clientSpocId: null,
  configuredData: null,
};

const getInitState = () => initialState;

const getContactsListSuccess = (state, action) => updateObject(state, {
  getContactList: 'SUCCESS',
  error: null,
  orgContacts: action.orgContacts,
});

const getContactsListError = (state, action) => updateObject(state, {
  getContactList: 'ERROR',
  error: action.error,
});

const getContactsListLoading = (state) => updateObject(state, {
  getContactList: 'LOADING',
});

const postSelectedSpocsLoading = (state) => updateObject(state, {
  postSelectedSpocs: 'LOADING',
});

const postSelectedSpocsError = (state, action) => updateObject(state, {
  postSelectedSpocs: 'ERROR',
  error: action.error,
});

const postSelectedSpocsSuccess = (state) => updateObject(state, {
  error: null,
  postSelectedSpocs: 'SUCCESS',
});

const getSelectedSpocsLoading = (state) => updateObject(state, {
  getPostedSpocs: 'LOADING',
});
const getSelectedSpocsError = (state, action) => updateObject(state, {
  getPostedSpocs: 'ERROR',
  error: action.error,
});

const getSelectedSpocsSuccess = (state, action) => {
  const emptyArray = [];
  return updateObject(state, {
    getPostedSpocs: 'SUCCESS',
    error: null,
    postedContacts: action.selectedSpocs !== undefined ? action.selectedSpocs : emptyArray,
    configuredData: action.configuredData,
  });
};

const updatePostedSpocs = (state, action) => updateObject(state, {
  postedContacts: action.postSpocs,
});

const resetError = (state) => updateObject(state, {
  error: null,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_INIT_STATE: return getInitState(state);
    case actionTypes.RESET_ERROR: return resetError(state, action);

    case actionTypes.GET_CONTACTS_LIST_SUCCESS: return getContactsListSuccess(state, action);
    case actionTypes.GET_CONTACTS_LIST_ERROR: return getContactsListError(state, action);
    case actionTypes.GET_CONTACTS_LIST_LOADING: return getContactsListLoading(state, action);

    case actionTypes.UPDATE_POSTED_SPOCS: return updatePostedSpocs(state, action);

    case actionTypes.POST_CLIENT_SPOCS_LOADING: return postSelectedSpocsLoading(state, action);
    case actionTypes.POST_CLIENT_SPOCS_ERROR: return postSelectedSpocsError(state, action);
    case actionTypes.POST_CLIENT_SPOCS_SUCCESS: return postSelectedSpocsSuccess(state, action);

    case actionTypes.GET_CLIENT_SPOCS_LOADING: return getSelectedSpocsLoading(state, action);
    case actionTypes.GET_CLIENT_SPOCS_ERROR: return getSelectedSpocsError(state, action);
    case actionTypes.GET_CLIENT_SPOCS_SUCCESS: return getSelectedSpocsSuccess(state, action);

    default: return state;
  }
};

export default reducer;

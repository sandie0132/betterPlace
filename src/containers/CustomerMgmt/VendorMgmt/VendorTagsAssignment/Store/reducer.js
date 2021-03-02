import * as actionTypes from './actionTypes';
import updateObject from '../../VendorMgmtStore/utility';

const initialState = {
  error: null,

  postAssignedTags: [],
  selectedClient: '',
  postAssignedTagsState: 'INIT',
};

const initState = () => initialState;

const postAssignedTagsLoading = (state) => updateObject(state, {
  postAssignedTagsState: 'LOADING',
  error: null,
});

const postAssignedTagsSuccess = (state, action) => updateObject(state, {
  postAssignedTagsState: 'SUCCESS',
  postAssignedTags: action.assignedTags,
  selectedClient: action.selectedClient,
  error: null,
});

const postAssignedTagsError = (state, action) => updateObject(state, {
  postAssignedTagsState: 'ERROR',
  error: action.error,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_VENDOR_TAGS_STATE: return initState();

    case actionTypes.POST_ASSIGN_VENDOR_TAGS_LOADING: return postAssignedTagsLoading(state, action);
    case actionTypes.POST_ASSIGN_VENDOR_TAGS_SUCCESS: return postAssignedTagsSuccess(state, action);
    case actionTypes.POST_ASSIGN_VENDOR_TAGS_ERROR: return postAssignedTagsError(state, action);

    default: return state;
  }
};

export default reducer;

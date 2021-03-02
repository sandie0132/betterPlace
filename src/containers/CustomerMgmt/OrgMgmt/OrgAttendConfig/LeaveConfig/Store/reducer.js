const {
  POST_LEAVE_CONFIG_ERR,
  POST_LEAVE_CONFIG,
  POST_LEAVE_CONFIG_LOADING,
  RESET_LEAVE_CONFIG,
  GET_LEAVE_CONFIG_LOADING,
  GET_LEAVE_CONFIG_ERR,
  GET_LEAVE_CONFIG,
  POST_COMPOFF,
  GET_SUGGESTED_LEAVES,
  CONFIG_ERROR,
  UPDATE_LOCAL,
  GET_CURRENT_LEAVE,
} = require('./actionTypes');

const initialState = {
  error: false,
  loading: false,
  suggestedLeaves: [],
  configuredLeaves: [],
  compoffLeaves: [],
  localConfiguredLeaves: [],
  localSuggestedLeaves: [],
  localCompoffLeaves: [],
  getErrorMsg: false,
  configError: false,
  allLeaves: [],
  localSuggestedLeavesCopy: [],
  notification: {
    message: false,
    timeout: 0,
    type: 'info',
  },
  orgId: null,
};

const postSuccess = (state, data) => ({
  ...state,
  loading: false,
  error: false,
  localConfiguredLeaves: data.localConfiguredLeaves,
  localSuggestedLeaves: data.localSuggested,
});

const postCompoffSuccess = (state, data) => ({
  ...state,
  loading: false,
  error: false,
  localCompoffLeaves: data.localCompoffLeaves,
});

const postError = (state, { error }) => ({
  ...state,
  loading: false,
  error,
});

const postLoading = (state) => ({
  ...state,
  loading: true,
});

const reset = (state) => ({
  ...state,
  localCompoffLeaves: [],
  localConfiguredLeaves: [],
  localSuggestedLeaves: state.localSuggestedLeavesCopy,
});

const getSuccess = (state, data) => ({
  ...state,
  allLeaves: data.res,
  localConfiguredLeaves: [],
  localCompoffLeaves: [],
  loading: false,
  getErrorMsg: null,
  // notification: data.notification || initialState.notification,
  orgId: data.orgId,
});

const getError = (state, error) => ({
  ...state,
  loading: false,
  getErrorMsg: error,
});

const getSuggestedLeaves = (state, data) => ({
  ...state,
  localSuggestedLeaves: data,
  localSuggestedLeavesCopy: data,
});

const configError = (state, error) => ({
  ...state,
  notification: {
    message: error,
    timeout: 0,
    type: 'warning',
  },
  loading: false,
});

const updateLocalLeaves = (state, data) => ({
  ...state,
  localCompoffLeaves: data.compoffLeaves,
  localConfiguredLeaves: data.configuredLeaves,
  localSuggestedLeaves: data.suggestedLeaves,
  loading: false,
});

const currentLeave = (state) => ({
  ...state,
  loading: false,
});

const reducer = (state = initialState, action) => {
  const { type, data, error } = action;
  switch (type) {
    case POST_LEAVE_CONFIG: return postSuccess(state, data);
    case POST_COMPOFF: return postCompoffSuccess(state, data);
    case POST_LEAVE_CONFIG_ERR: return postError(state, { error });
    case POST_LEAVE_CONFIG_LOADING: return postLoading(state);
    case RESET_LEAVE_CONFIG: return reset(state);
    case GET_LEAVE_CONFIG: return getSuccess(state, data);
    case GET_LEAVE_CONFIG_LOADING: return postLoading(state);
    case GET_LEAVE_CONFIG_ERR: return getError(state, error);
    case GET_SUGGESTED_LEAVES: return getSuggestedLeaves(state, data);
    case CONFIG_ERROR: return configError(state, error);
    case UPDATE_LOCAL: return updateLocalLeaves(state, data);
    case GET_CURRENT_LEAVE: return currentLeave(state);
    default:
      return state;
  }
};

export default reducer;

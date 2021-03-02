import * as actionTypes from './actionTypes';
import { updateObject } from '../../../../EmpMgmtStore/utility';

const initialState = {
  TagInfoData: [],
  getFilterTagState: 'INIT',
  error: null,
};

const getFilterTagLoading = (state) => updateObject(state, {
  getFilterTagState: 'LOADING',
});

const getFilterTagSuccess = (state, action) => updateObject(state, {
  getFilterTagState: 'SUCCESS',
  TagInfoData: action.TagInfoData,
  error: null,
});

const getFilterTagError = (state, action) => updateObject(state, {
  getFilterTagState: 'ERROR',
  error: action.error,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    // case actionTypes.INIT_TAG_LIST_STATE: return initState(state, action);

    case actionTypes.GET_FILTER_TAG_MAP_LIST_LOADING: return getFilterTagLoading(state, action);
    case actionTypes.GET_FILTER_TAG_MAP_LIST_SUCCESS: return getFilterTagSuccess(state, action);
    case actionTypes.GET_FILTER_TAG_MAP_LIST_ERROR: return getFilterTagError(state, action);
    default: return state;
  }
};

export default reducer;

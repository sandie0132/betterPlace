import * as actionTypes from './actionTypes';
import updateObject from './utility';

const initialState = {
  error: null,
  shiftDetails: null,
  getShiftDetailsByIdState: 'INIT',
  putShiftDetailsByIdState: 'INIT',
  postShiftDetailsByIdState: 'INIT',
  deleteShiftDetailsByIdState: 'INIT',
};

// INIT STATE
const initState = () => initialState;

// GET SITE DETAILS BY ID
const getShiftDetailsByIdLoading = (state) => updateObject(state, {
  getShiftDetailsByIdState: 'LOADING',
  shiftDetails: null,
});

const getShiftDetailsByIdSuccess = (state, action) => updateObject(state, {
  getShiftDetailsByIdState: 'SUCCESS',
  shiftDetails: action.data,
});

const getShiftDetailsByIdError = (state, action) => updateObject(state, {
  getShiftDetailsByIdState: 'ERROR',
  error: action.error,
});

// POST SITE DETAILS BY ID
const postShiftDetailsByIdLoading = (state) => updateObject(state, {
  postShiftDetailsByIdState: 'LOADING',
});

const postShiftDetailsByIdSuccess = (state, action) => updateObject(state, {
  postShiftDetailsByIdState: 'SUCCESS',
  shiftDetails: action.data,
});

const postShiftDetailsByIdError = (state, action) => updateObject(state, {
  postShiftDetailsByIdState: 'ERROR',
  error: action.error,
});

// PUT SITE DETAILS BY ID
const putShiftDetailsByIdLoading = (state) => updateObject(state, {
  putShiftDetailsByIdState: 'LOADING',
});

const putShiftDetailsByIdSuccess = (state, action) => updateObject(state, {
  putShiftDetailsByIdState: 'SUCCESS',
  shiftDetails: action.data,
});

const putShiftDetailsByIdError = (state, action) => updateObject(state, {
  putShiftDetailsByIdState: 'ERROR',
  error: action.error,
});

// DELETE SITE DETAILS BY ID
const deleteShiftDetailsByIdLoading = (state) => updateObject(state, {
  deleteShiftDetailsByIdState: 'LOADING',
});

const deleteShiftDetailsByIdSuccess = (state) => updateObject(state, {
  deleteShiftDetailsByIdState: 'SUCCESS',
});

const deleteShiftDetailsByIdError = (state, action) => updateObject(state, {
  deleteShiftDetailsByIdState: 'ERROR',
  error: action.error,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_STATE: return initState();

    case actionTypes.GET_SHIFT_DETAILS_BY_ID_LOADING:
      return getShiftDetailsByIdLoading(state, action);
    case actionTypes.GET_SHIFT_DETAILS_BY_ID_SUCCESS:
      return getShiftDetailsByIdSuccess(state, action);
    case actionTypes.GET_SHIFT_DETAILS_BY_ID_ERROR:
      return getShiftDetailsByIdError(state, action);

    case actionTypes.POST_SHIFT_DETAILS_BY_ID_LOADING:
      return postShiftDetailsByIdLoading(state, action);
    case actionTypes.POST_SHIFT_DETAILS_BY_ID_SUCCESS:
      return postShiftDetailsByIdSuccess(state, action);
    case actionTypes.POST_SHIFT_DETAILS_BY_ID_ERROR:
      return postShiftDetailsByIdError(state, action);

    case actionTypes.PUT_SHIFT_DETAILS_BY_ID_LOADING:
      return putShiftDetailsByIdLoading(state, action);
    case actionTypes.PUT_SHIFT_DETAILS_BY_ID_SUCCESS:
      return putShiftDetailsByIdSuccess(state, action);
    case actionTypes.PUT_SHIFT_DETAILS_BY_ID_ERROR:
      return putShiftDetailsByIdError(state, action);

    case actionTypes.DELETE_SHIFT_DETAILS_BY_ID_LOADING:
      return deleteShiftDetailsByIdLoading(state, action);
    case actionTypes.DELETE_SHIFT_DETAILS_BY_ID_SUCCESS:
      return deleteShiftDetailsByIdSuccess(state, action);
    case actionTypes.DELETE_SHIFT_DETAILS_BY_ID_ERROR:
      return deleteShiftDetailsByIdError(state, action);

    default: return state;
  }
};

export default reducer;

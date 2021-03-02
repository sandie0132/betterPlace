import * as actionTypes from './actionTypes';
import { updateObject } from './utility';

const initialState = {
    postResetDataState: 'INIT',
    responseData: {},
}

//INIT STATE REDUCER
const initState = () => {
    return initialState;
}

//RESET DATA STATE
const postResetDataLoading = (state) => {
    return updateObject(state, {
        postResetDataState: 'LOADING'
    });
}

const postResetDataSuccess = (state, action) => {
    return updateObject(state, {
        postResetDataState:'SUCCESS',
        responseData: action.responseData,
        error: null
    });
};

const postResetDataError = (state, action) => {
    return updateObject(state, {
        postResetDataState: 'ERROR',
        error: action.error,
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_STATE: return initState();

        case actionTypes.RESET_PASSWORD_LOADING: return postResetDataLoading(state);
        case actionTypes.RESET_PASSWORD_SUCCESS: return postResetDataSuccess(state, action);
        case actionTypes.RESET_PASSWORD_ERROR: return postResetDataError(state, action);

        default: return state;
    }
};

export default reducer;


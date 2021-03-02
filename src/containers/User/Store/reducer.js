import * as actionTypes from './actionTypes';
import { updateObject } from './utility';
import { combineReducers } from 'redux';
import ResetPasswordReducer from "../ResetPassword/Store/reducer";

const initialState = {
    getUserProfileDataState: 'INIT',
    profile: {},
}

const initState = () => {
    return initialState;
}

const getUserDataLoading = (state) => {
    return updateObject(state, {
        getUserProfileDataState: 'LOADING'
    });
}

const getUserDataSuccess = (state, action) => {
    return updateObject(state, {
        getUserProfileDataState:'SUCCESS',
        profile: action.userProfile,
        error: null
    });
};

const getUserDataError = (state, action) => {
    return updateObject(state, {
        getUserProfileDataState: 'ERROR',
        error: action.error,
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_STATE: return initState();

        case actionTypes.GET_USER_PROFILE_LOADING: return getUserDataLoading(state);
        case actionTypes.GET_USER_PROFILE_SUCCESS: return getUserDataSuccess(state, action);
        case actionTypes.GET_USER_PROFILE_ERROR: return getUserDataError(state, action);

        default: return state;
    }
};

const userProfile = combineReducers({
    userProfile: reducer,
    resetPassword: ResetPasswordReducer
});

export default userProfile;
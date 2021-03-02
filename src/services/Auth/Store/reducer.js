import * as actionTypes from './actionTypes';
import { updateObject } from './utility';

const initialState = {
    getUserInfoState: 'INIT',
    logoutState: 'INIT',
    user: {},
    policies: [],
    error: null,
    errorCode: null
};

//Init State
const initAuth = () => {
    return initialState;
}

//Get UserInfo Reducers
const getUserInfoLoading = (state) => {
    return updateObject( state, {
        getUserInfoState: 'LOADING'
    });
}

const getUserInfoSuccess = (state, action) => {
    return updateObject( state, {
        getUserInfoState: 'SUCCESS',
        user: action.user,
        policies: action.policies
    });
}

const getUserInfoError = (state, action) => {
    return updateObject( state, {
        getUserInfoState: 'ERROR',
        error: action.error
    });
}

//Logout Reducers
const logoutLoading = (state) => {
    return updateObject( state, {
        logoutState: 'LOADING'
    });
}

const logoutSuccess = (state) => {
    return updateObject( state, {
        logoutState: 'SUCCESS'
    });
}

const logoutError = (state, action) => {
    return updateObject( state, {
        logoutState: 'ERROR',
        error: action.error
    });
}

//Auth Reducer
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_AUTH: return initAuth(state, action);

        case actionTypes.GET_USER_INFO_LOADING: return getUserInfoLoading( state, action );
        case actionTypes.GET_USER_INFO_SUCCESS: return getUserInfoSuccess( state, action );
        case actionTypes.GET_USER_INFO_ERROR: return getUserInfoError( state, action );

        case actionTypes.LOGOUT_LOADING: return logoutLoading( state, action );
        case actionTypes.LOGOUT_SUCCESS: return logoutSuccess( state, action );
        case actionTypes.LOGOUT_ERROR: return logoutError( state, action );
        
        default: return state;
    }
};

export default reducer;
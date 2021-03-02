import * as actionTypes from './actionTypes';
import { updateObject } from '../../../../EmpMgmtStore/utility';

const initialState = {
    searchEmployeeState: 'INIT',
    searchedEmployeeList: [],
    error: null
}

const getInitState = (state) => {
    return initialState;
}

const searchEmployeeLoading = (state, action) => {
    return updateObject(state, {
        error: null,
        searchEmployeeState: 'LOADING'
    })
}

const searchEmployeeSuccess = (state, action) => {
    return updateObject(state, {
        error: null,
        searchedEmployeeList: action.searchedEmployeeList,
        searchEmployeeState: 'SUCCESS'
    })
}

const searchEmployeeerror = (state, action) => {
    return updateObject(state, {
        error: null,
        searchEmployeeState: 'ERROR'
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.GET_INIT_STATE: return getInitState(state);

        case actionTypes.SEARCH_EMPLOYEE_LOADING: return searchEmployeeLoading(state, action);
        case actionTypes.SEARCH_EMPLOYEE_SUCCESS: return searchEmployeeSuccess(state, action);
        case actionTypes.SEARCH_EMPLOYEE_ERROR: return searchEmployeeerror(state, action);

        default: return state;
    }
}

export default reducer;
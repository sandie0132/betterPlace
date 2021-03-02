import * as actionTypes from './actionTypes';
import { updateObject } from '../../EmpMgmtStore/utility';


const initialState = {
    entityTerminateState: 'INIT',
    terminateResponseData: '',
    error: null,
    entityData: '',
    selectedEmp: ''
}

// const getInitState = () => {
//     return initialState
// }

const setInitState =(state) => {
    return updateObject(state, {
       entityData: ''
    })
}

const entityTerminateLoading = (state, action) => {
    return updateObject(state, {
        entityTerminateState: 'LOADING'
    })
}

const entityTerminateSuccess = (state, action) => {
    return updateObject(state, {
        entityTerminateState: 'SUCCESS',
        terminateResponseData: action.data,
        selectedEmp: action.selectedEmp
    })
}

const entityTerminateError = (state, action) => {
    return updateObject(state, {
        entityTerminateState: 'ERROR',
        error: action.error
    })
}

const saveEntityData = (state, action) => {
    return updateObject(state, {
        entityData: action.data
    })
}

const resetError = (state, action) => {
    return updateObject(state, {
        error: null
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.GET_TERMINATE_INIT_STATE: return setInitState(state);

        case actionTypes.ENTITY_TERMINATE_LOADING: return entityTerminateLoading(state, action);
        case actionTypes.ENTITY_TERMINATE_SUCCESS: return entityTerminateSuccess(state, action);
        case actionTypes.ENTITY_TERMINATE_ERROR: return entityTerminateError(state, action);

        case actionTypes.SAVE_ENTITY_DATA: return saveEntityData(state, action);

        case actionTypes.RESET_ERROR: return resetError(state, action);

        default: return state;
    }
};

export default reducer;
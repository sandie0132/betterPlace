import { updateObject } from "../../Store/utility";
import * as actionTypes from './actionTypes';

const initialState = {

    documentProcessState: "INIT",
    error: null

}


//INIT STATE REDUCERS
const initState = () => {
    return initialState;
}


////document processing

const documentProcessLoading = (state, action) => {
    return updateObject(state, {
        documentProcessState: "LOADING"
    })
};

const documentProcessSuccess = (state, action) => {
    return updateObject(state, {
        documentProcessState: "SUCCESS",
    })
};

const documentProcessError = (state, action) => {
    return updateObject(state, {
        documentProcessState: "ERROR",
        error: action.error
    })
};



const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_STATE: return initState();

        case actionTypes.DOCUMENT_PROCESS_LOADING: return documentProcessLoading(state, action);
        case actionTypes.DOCUMENT_PROCESS_SUCCESS: return documentProcessSuccess(state, action);
        case actionTypes.DOCUMENT_PROCESS_ERROR: return documentProcessError(state, action);

        default: return state;
    }
}

export default reducer;
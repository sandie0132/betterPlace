import * as actionTypes from './actionTypes';
import { updateObject } from './utility';

const initialState={
    refIdValid: null,
    refIdValidState:"INIT",
    error:null,
    getRefIdDetailsState: "INIT",
    getRefIdDetails: null,
    putRefIdDetailsState: 'INIT',
    // tagDetails: null,
    // getTagDetailsState: 'INIT'
}

// const getInitState = () => {
//     return initialState;
// }

const refIdValidateLoading=(state,action)=>{
    return updateObject(state,{
        refIdValidState: "LOADING"
    })
}

const refIdValidateSuccess=(state,action)=>{
    return updateObject(state,{
        refIdValidState: "SUCCESS",
        refIdValid:action.data.isValid
    })
}

const refIdValidateError=(state,action)=>{
    return updateObject(state,{
        refIdValidState: "ERROR",
        error: action.error
    })
}

const getRefIdDetailsLoading=(state,action)=>{
    return updateObject(state,{
        getRefIdDetailsState : "LOADING"
    })
}
const getRefIdDetailsSuccess=(state,action)=>{
    return updateObject(state,{
        getRefIdDetailsState : "SUCCESS",
        getRefIdDetails: action.data

    })
}
const getRefIdDetailsError=(state,action)=>{
    return updateObject(state,{
        getRefIdDetailsState : "ERROR",
        error: action.error
    })
}

const putRefIdDetailsLoading=(state,action)=>{
    return updateObject(state,{
        putRefIdDetailsState : "LOADING"
    })
}
const putRefIdDetailsSuccess=(state,action)=>{
    return updateObject(state,{
        putRefIdDetailsState : "SUCCESS"
    })
}
const putRefIdDetailsError=(state,action)=>{
    return updateObject(state,{
        putRefIdDetailsState : "ERROR",
        error: action.error
    })
}

// const getTagDetailsLoading=(state,action)=>{
//     return updateObject(state,{
//         getTagDetailsState: "LOADING",
//     })
// }

// const getTagDetailsSuccess=(state,action)=>{
//     return updateObject(state,{
//         getTagDetailsState: "SUCCESS",
//         tagDetails: action.tagData
//     })
// }


// const getTagDetailsError=(state,action)=>{
//     return updateObject(state,{
//         getTagDetailsState: "ERROR",
//         error: action.error
//     })
// }




const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.REFID_VALIDATE_LOADING : return refIdValidateLoading(state,action);
        case actionTypes.REFID_VALIDATE_SUCCESS : return refIdValidateSuccess(state,action);
        case actionTypes.REFID_VALIDATE_ERROR : return refIdValidateError(state,action);

        case actionTypes.GET_REFID_DETAILS_LOADING : return getRefIdDetailsLoading(state,action);
        case actionTypes.GET_REFID_DETAILS_SUCCESS : return getRefIdDetailsSuccess(state,action);
        case actionTypes.GET_REFID_DETAILS_ERROR : return getRefIdDetailsError(state,action);

        case actionTypes.PUT_REFID_DETAILS_LOADING : return putRefIdDetailsLoading(state,action);
        case actionTypes.PUT_REFID_DETAILS_SUCCESS : return putRefIdDetailsSuccess(state,action);
        case actionTypes.PUT_REFID_DETAILS_ERROR : return putRefIdDetailsError(state,action);

        // case actionTypes.GET_TAG_NAME_LOADING : return getTagDetailsLoading(state,action);
        // case actionTypes.GET_TAG_NAME_SUCCESS : return getTagDetailsSuccess(state,action);
        // case actionTypes.GET_TAG_NAME_ERROR : return getTagDetailsError(state,action);

        default: return state;
    }
}

export default reducer;
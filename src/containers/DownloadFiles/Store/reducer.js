import * as actionTypes from './actionTypes';
import { updateObject } from './utility';

const initialState = {
    downloadFileState: "INIT"
}

//INIT DATA REDUCERS
const initState = () => {
    return initialState
}

//DOWNLOAD FILE REDUCER
const downloadFileLoading = (state) => {
    return updateObject (state, {
        downloadFileState : 'LOADING'
    })
}

const downloadFileSuccess = (state) => {
    return updateObject (state, {
        downloadFileState : 'SUCCESS',
    })
}

const downloadFileError = (state, action) => {
    return updateObject (state, {
        downloadFileState : 'ERROR',
        error : action.error
    })
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.INIT_STATE : return initState()

        case actionTypes.DOWNLOAD_EMP_BGV_PDF_LOADING : return downloadFileLoading(state)
        case actionTypes.DOWNLOAD_EMP_BGV_PDF_SUCCESS : return downloadFileSuccess(state, action)
        case actionTypes.DOWNLOAD_EMP_BGV_PDF_ERROR : return downloadFileError(state, action)

        default : return state
    }
}

export default reducer

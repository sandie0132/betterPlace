import * as actionTypes from './actionTypes';
import { updateObject } from '../../EmpMgmtStore/utility';
// import _ from 'lodash';

const initialState = {
    getDataIdState: 'INIT',
    error: null,
    cardtype: '',
    idNo: '',
    idImage: '',
    showModal: false,
    entityCheckState: 'INIT',
    entityData: '',
    getTagState:'INIT',
    tagData:'',
    getDataState:'INIT',
    orgName: '',

    downloadExcelTemplateState: 'INIT'
    

}

const getInitState = () => {
    return initialState
}

const setDataId = (state, action) => {
    return updateObject(state, {
        getDataIdState: 'SUCCESS',
        cardtype : action.cardtype,
        idNo: action.idNo,
        idImage: action.idImage,
        showModal:action.showModal,
        error: null
    });
};

const entityCheckLoading = (state,action)=>{
    return updateObject(state,{
        entityCheckState: 'LOADING'
    })
}

const entityCheckSuccess = (state,action)=>{
    return updateObject(state,{
        entityCheckState: 'SUCCESS',
        entityData: action.entityData,
        cardtype: action.docType
    })
}

const entityCheckError = (state,action)=>{
    return updateObject(state,{
        entityCheckState: 'ERROR'
    })
}

const getTagLoading = (state) => {
    return updateObject(state, {
        getTagState: 'LOADING'
    });
}

const getTagSuccess = (state, action) => {
    // let roleTag = null;
    // if (!_.isEmpty(action.tagData)) {
    //     _.forEach(action.tagData, function (value) {
    //         if (value.category === 'functional') {
    //             roleTag = value.name;
    //         }
    //     })
    // }
    return updateObject(state, {
        getTagState: 'SUCCESS',
        tagData: action.tagData,
        error: null
    });
};

const getTagError = (state, action) => {
    return updateObject(state, {
        getTagState: 'ERROR',
        error: action.error,
    });
};

const getDataLoading = (state) => {
    return updateObject(state, {
        getDataState: 'LOADING'
    });
}

const getDataSuccess = (state, action) => {
    return updateObject(state, {
        getDataState: 'SUCCESS',
        orgName: action.data.name,
        error: null
    });
};

const getDataError = (state, action) => {
    return updateObject(state, {
        getDataState: 'ERROR',
        error: action.error,
    });
};

const downloadExcelTemplateLoading = (state, action) => {
    return updateObject(state, {
        downloadExcelTemplateState: 'LOADING'
    })
}

const downloadExcelTemplateSuccess = (state, action) => {
    return updateObject(state, {
        downloadExcelTemplateState: 'SUCCESS'
    })
}

const downloadExcelTemplateError = (state, action) => {
    return updateObject(state, {
        downloadExcelTemplateState: 'ERROR',
        error: action.error
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_ID_DATA: return setDataId(state, action);
        case actionTypes.GET_INIT_STATE: return getInitState(state, action);

        case actionTypes.ENTITY_CHECK_LOADING: return entityCheckLoading(state, action);
        case actionTypes.ENTITY_CHECK_SUCCESS: return entityCheckSuccess(state, action);
        case actionTypes.ENTITY_CHECK_ERROR: return entityCheckError(state, action);

        case actionTypes.GET_TAG_LOADING: return getTagLoading(state);
        case actionTypes.GET_TAG_SUCCESS: return getTagSuccess(state, action);
        case actionTypes.GET_TAG_ERROR: return getTagError(state, action);

        case actionTypes.GET_DATA_LOADING: return getDataLoading(state, action);
        case actionTypes.GET_DATA_SUCCESS: return getDataSuccess(state, action);
        case actionTypes.GET_DATA_ERROR: return getDataError(state, action);

        case actionTypes.DOWNLOAD_EXCEL_TEMPLATE_LOADING: return downloadExcelTemplateLoading(state, action);
        case actionTypes.DOWNLOAD_EXCEL_TEMPLATE_SUCCESS: return downloadExcelTemplateSuccess(state, action);
        case actionTypes.DOWNLOAD_EXCEL_TEMPLATE_ERROR: return downloadExcelTemplateError(state, action);

        default: return state;
    }
};
export default reducer;
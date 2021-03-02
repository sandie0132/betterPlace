import { combineReducers } from 'redux';
import empStatusListReducer from '../EmpStatusList/Store/reducer';
import insightsReducer from '../Insights/Store/reducer';
import { updateObject } from '../../OrgMgmtStore/utility';
import * as actionTypes from './actionTypes';

const initialState = {
    getDataState : "INIT",
    orgName : '',
    getAllEmpListState : "INIT",
    empListAll : [],
    tagData: null,
    getTagIdInfoState : "INIT",
    downloadCustomReportState : "INIT"
}

const getInitState = () => {
    return initialState;
}

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

const getAllempListLoading = (state,action) => {
    return updateObject(state,{
        getAllEmpListState: "LOADING"
    })
}

const getAllempListSuccess = (state, action) => {
    return updateObject(state, {
        getAllEmpListState: 'SUCCESS',
        empListAll:action.empList,
        allError: null
    });
};

const getAllempListError = (state, action) => {
    return updateObject(state, {
        getAllEmpListState: 'ERROR',
        allError: action.error,
    });
};

const getTagIdInfoLoading = (state,action) => {
    return updateObject(state,{
        getTagIdInfoState: "LOADING"
    })
}

const getTagIdInfoSuccess = (state, action) => {
    return updateObject(state, {
        getTagIdInfoState: 'SUCCESS',
        tagData:action.tagData,
        allError: null
    });
};

const getTagIdInfoError = (state, action) => {
    return updateObject(state, {
        getTagIdInfoState: 'ERROR',
        allError: action.error,
    });
};


const downloadCustomReportLoading = (state) =>{
    return updateObject(state, {
          downloadCustomReportState: "LOADING"
    })
}

const downloadCustomReportSuccess = (state) =>{
    return updateObject(state, {
          downloadCustomReportState: "SUCCESS"
    })
}


const downloadCustomReportError = (state,action) =>{
    return updateObject(state, {
          downloadCustomReportState: "ERROR",
          error: action.error
    })
}



const reducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.GET_DATA_LOADING: return getDataLoading(state, action);
        case actionTypes.GET_DATA_SUCCESS: return getDataSuccess(state, action);
        case actionTypes.GET_DATA_ERROR: return getDataError(state, action);

        case actionTypes.GET_ALL_EMP_LIST_LOADING: return getAllempListLoading(state, action);
        case actionTypes.GET_ALL_EMP_LIST_SUCCESS: return getAllempListSuccess(state, action);
        case actionTypes.GET_ALL_EMP_LIST_ERROR: return getAllempListError(state, action);

        case actionTypes.GET_TAG_ID_INFO_LOADING: return getTagIdInfoLoading(state, action);
        case actionTypes.GET_TAG_ID_INFO_SUCCESS: return getTagIdInfoSuccess(state, action);
        case actionTypes.GET_TAG_ID_INFO_ERROR: return getTagIdInfoError(state, action);

        case actionTypes.DOWNLOAD_CUSTOM_PDF_REPORT_LOADING: return downloadCustomReportLoading(state);
        case actionTypes.DOWNLOAD_CUSTOM_PDF_REPORT_SUCCESS: return downloadCustomReportSuccess(state);
        case actionTypes.DOWNLOAD_CUSTOM_PDF_REPORT_ERROR: return downloadCustomReportError(state,action);

        case actionTypes.GET_INIT_STATE: return getInitState();
        default: return state;
    }
}

const orgBgvStatusReducer = combineReducers({
    empStatusList : empStatusListReducer,
    bgvInsights : insightsReducer,
    orgBgvDashboard : reducer
})

export default orgBgvStatusReducer;
import * as actionTypes from './actionTypes';
import updateObject from '../../VendorMgmtStore/utility';

const initialState = {
    error: null,
    vendorTagsState: 'INIT',
    postVendorTagState: 'INIT',
    postResponse: '',
    deleteVendorTagStatus: 'INIT',
    getOrgName: '',
    getOrgNameState: 'INIT',
    getVendorDataState: 'INIT',
    getVendorData: ''
}

const getVendorTagsLoading = (state) =>{
    return updateObject(state, {
        vendorTagsState: 'LOADING'
    })
}

const getVendorTagsSuccess = (state, action) =>{
    return updateObject(state, {
        vendorTagsState: 'SUCCESS',
        vendorTags: action.vendorTags

    })
}

const getVendorTagsError = (state, action) =>{
    return updateObject(state, {
        vendorTagsState: 'ERROR',
        error: action.error
    })
}

const getOrgNameLoading = (state, action) => {
    return updateObject(state, {
        getOrgNameState: 'LOADING',
        error: null
    })
}

const getOrgNameSuccess = (state, action) => {
    return updateObject(state, {
        getOrgNameState: 'SUCCESS',
        getOrgName: action.orgName,
        error: null
    })
}

const getOrgNameError = (state, action) => {
    return updateObject(state, {
        getOrgNameState: 'ERROR',
        error: action.error
    })
}

const getVendorDataLoading = (state, action) => {
    return updateObject (state, {
        getVendorDataState: 'LOADING',
        error: null
    })
}

const getVendorDataSuccess = (state, action) => {
    return updateObject (state, {
        getVendorDataState: 'SUCCESS',
        getVendorData: action.data,
        error: null
    })
}

const getVendorDataError = (state, action) => {
    return updateObject (state, {
        getVendorDataState: 'ERROR',
        error: action.error
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_VENDOR_TAGS_LOADING: return getVendorTagsLoading(state);
        case actionTypes.GET_VENDOR_TAGS_SUCCESS: return getVendorTagsSuccess(state, action);
        case actionTypes.GET_VENDOR_TAGS_ERROR: return getVendorTagsError(state, action);

        case actionTypes.GET_ORG_NAME_LOADING: return getOrgNameLoading(state);
        case actionTypes.GET_ORG_NAME_SUCCESS: return getOrgNameSuccess(state, action);
        case actionTypes.GET_ORG_NAME_ERROR: return getOrgNameError(state, action);

        case actionTypes.GET_VENDOR_DATA_LOADING: return getVendorDataLoading(state, action);
        case actionTypes.GET_VENDOR_DATA_SUCCESS: return getVendorDataSuccess(state, action);
        case actionTypes.GET_VENDOR_DATA_ERROR: return getVendorDataError(state, action);

        default: return state;
    }
};

export default reducer;
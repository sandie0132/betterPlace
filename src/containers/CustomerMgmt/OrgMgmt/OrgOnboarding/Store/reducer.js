import * as actionTypes from './actionTypes';
import { updateObject } from '../../OrgMgmtStore/utility';

const initialState = {
    getDataIdState: 'INIT',
    error: null,
    cardtype: '',
    idNo: '',
    idImage: '',
    showModal: false,
    orgCheckState: 'INIT',
    orgData: null
}

const getInitState = () => {
    return initialState
}

const orgSetDataId = (state, action) => {
    return updateObject(state, {
        getDataIdState: 'SUCCESS',
        cardtype : action.cardtype,
        idNo: action.idNo,
        idImage: action.idImage,
        showModal:action.showModal,
        error: null
    });
};

const orgResetDataId = (state ) => {
    return updateObject(state, {
        getDataIdState: 'INIT',
        cardtype : '',
        idNo: '',
        idImage: '',
        showModal: false,
        error: null
    });
};

const orgCheckLoading = (state,action)=>{
    return updateObject(state,{
        orgCheckState: 'LOADING'
    })
}

const orgCheckSuccess = (state,action)=>{
    return updateObject(state,{
        orgCheckState: 'SUCCESS',
        orgData: action.OrgData
    })
}

const orgCheckError = (state,action)=>{
    return updateObject(state,{
        orgCheckState: 'ERROR'
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ORG_SET_ID_DATA: return orgSetDataId(state, action);
        case actionTypes.ORG_RESET_ID_DATA: return orgResetDataId(state, action);
        case actionTypes.GET_INIT_STATE: return getInitState(state, action);

        case actionTypes.ORG_CHECK_LOADING: return orgCheckLoading(state, action);
        case actionTypes.ORG_CHECK_SUCCESS: return orgCheckSuccess(state, action);
        case actionTypes.ORG_CHECK_ERROR: return orgCheckError(state, action);


        default: return state;
    }
};
export default reducer;
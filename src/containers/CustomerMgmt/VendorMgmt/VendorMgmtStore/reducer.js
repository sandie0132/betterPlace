import { combineReducers } from 'redux';
import * as actionTypes from './actionTypes';
import updateObject from './utility';
import * as initData from './StaticInitData';
import vendorListReducer from '../VendorList/Store/reducer';
import vendorDetailsReducer from '../VendorDetails/Store/reducer';
import vendorOnboardingReducer from '../VendorOnboarding/Store/reducer';
import vendorTagsReducer from '../VendorTags/Store/reducer';
import vendorTagsAssignReducer from '../VendorTagsAssignment/Store/reducer';
import vendorProfileReducer from '../VendorProfile/Store/reducer';
import clientProfileReducer from '../clientProfile/Store/reducer';
import clientTagsReducer from '../ClientTags/Store/reducer';
import vendorTagTraverseReducer from '../TagSearch/TagTraverse/Store/reducer';

const initialState = {
  getDataState: 'INIT',
  vendorMgmtStaticData: { ...initData.vendorMgmtStaticData },
  error: null,
};

// INIT STATE REDUCERS
const initState = () => initialState;

// GET STATIC DATA REDUCERS
const getDataListLoading = (state) => updateObject(state, {
  getDataState: 'LOADING',
});
const getDataListSuccess = (state, action) => updateObject(state, {
  getDataState: 'SUCCESS',
  vendorMgmtStaticData: action.staticData,
  error: null,
});

const getDataListError = (state, action) => updateObject(state, {
  getDataState: 'ERROR',
  error: action.error,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_VENDOR_MGMT_STATE: return initState();
    case actionTypes.GET_VENDOR_STATIC_DATA_LOADING: return getDataListLoading(state, action);
    case actionTypes.GET_VENDOR_STATIC_DATA_SUCCESS: return getDataListSuccess(state, action);
    case actionTypes.GET_VENDOR_STATIC_DATA_ERROR: return getDataListError(state, action);

    default: return state;
  }
};

const vendorMgmt = combineReducers({
  staticData: reducer,
  vendorList: vendorListReducer,
  vendorDetails: vendorDetailsReducer,
  vendorOnboarding: vendorOnboardingReducer,
  vendorTags: vendorTagsReducer,
  vendorTagsAssign: vendorTagsAssignReducer,
  vendorProfile: vendorProfileReducer,
  clientProfile: clientProfileReducer,
  clientTags: clientTagsReducer,
  vendorTagTraverse: vendorTagTraverseReducer,
});

export default vendorMgmt;

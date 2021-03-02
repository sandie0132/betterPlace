import { combineReducers } from 'redux';
import {
  EMP_LEAVES,
  EMP_PIC,
  EMP_SHIFT,
  GET_EMPLOYEE,
  GET_EMP_COUNT,
  GET_EXPECTED_EMP_COUNT,
  GET_HOLIDAYS,
  GET_TAG_INFO_ROSTER,
  LOADING,
  POST_EMP_COUNT,
  ROASTER_ERROR,
  VENDOR_LIST,
} from './actionTypes';

const initialState = {
  empList: [],
  tagList: [],
  error: {},
  loading: null,
  shiftList: [],
  empPics: {},
  vendorData: [],
  empCountData: [],
  totalEmpCountData: [],
  holidays: {},
  leaves: [],
};

const empList = (state, data, key) => ({
  ...state,
  empList: data,
  loading: null,
  error: {
    ...state.error,
    [key]: null,
  },
});

const loading = (state, data) => ({
  ...state,
  loading: data,
});

const employeeShift = (state, data, key) => ({
  ...state,
  shiftList: data,
  loading: null,
  error: {
    ...state.error,
    [key]: null,
  },
});

const employeeProfilePic = (state, data, key) => ({
  ...state,
  empPics: data,
  error: {
    ...state.error,
    [key]: null,
  },
  loading: null,
});

const getVendorDataListSuccess = (state, action, key) => ({
  ...state,
  vendorData: action.data,
  error: {
    ...state.error,
    [key]: null,
  },
  loading: null,
});

const postEmpCountSuccess = (state, action, key) => ({
  ...state,
  error: {
    ...state.error,
    [key]: null,
  },
  loading: null,
});

const getEmpCountSuccess = (state, action, key) => ({
  ...state,
  empCountData: action.data,
  error: {
    ...state.error,
    [key]: null,
  },
  loading: null,
});

const getTotalEmpCountSuccess = (state, action, key) => ({
  ...state,
  totalEmpCountData: action.data,
  error: {
    ...state.error,
    [key]: null,
  },
  loading: null,
});

const getError = (state, error, key) => ({
  ...state,
  error: {
    ...state.error,
    [key]: error,
  },
  loading: null,
});

const getTagInfoDataSuccess = (state, action, key) => ({
  ...state,
  tagList: action.data,
  error: {
    ...state.error,
    [key]: null,
  },
  loading: null,
});

const updateHolidays = (state, data, key) => ({
  ...state,
  error: {
    ...state.error,
    [key]: null,
  },
  loading: null,
  holidays: {
    ...state.holidays,
    ...data,
  },

});

const updateLeaves = (state, data, key) => ({
  ...state,
  error: {
    ...state.error,
    [key]: null,
  },
  loading: null,
  leaves: data,
});

const roasterMgmt = (state = initialState, action) => {
  const {
    type, data, error, key,
  } = action;
  switch (type) {
    case GET_EMPLOYEE: return empList(state, data, key);

    case GET_TAG_INFO_ROSTER: return getTagInfoDataSuccess(state, action, key);
    case VENDOR_LIST:
      return getVendorDataListSuccess(state, action, key);

    case POST_EMP_COUNT:
      return postEmpCountSuccess(state, action, key);

    case GET_EXPECTED_EMP_COUNT:
      return getEmpCountSuccess(state, action, key);

    case GET_EMP_COUNT:
      return getTotalEmpCountSuccess(state, action, key);

    case LOADING: return loading(state, data);
    case EMP_SHIFT: return employeeShift(state, data, key);
    case EMP_LEAVES: return updateLeaves(state, data, key);
    case EMP_PIC: return employeeProfilePic(state, data, key);
    case GET_HOLIDAYS: return updateHolidays(state, data, key);
    case ROASTER_ERROR: return getError(state, error, key);
    default: return state;
  }
};

const RoasterManagementReducer = combineReducers({
  roasterMgmt,
});

export default RoasterManagementReducer;

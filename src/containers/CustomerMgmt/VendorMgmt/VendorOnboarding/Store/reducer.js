import * as actionTypes from './actionTypes';
import updateObject from '../../VendorMgmtStore/utility';

const initialState = {
  error: null,
  docType: '',
  docNumber: '',
  orgData: '',
  orgCheck: 'INIT',
  showModal: false,
  searchVendorState: 'INIT',
  vendorSearchResults: [],
};

const initState = () => initialState;

const getOrgData = (state, action) => updateObject(state, {
  docType: action.docType,
  docNumber: action.docNumber,
  docCard: action.docCard,
  error: null,
  // showModal: action.showModal
});

const checkOrgDataLoading = (state) => updateObject(state, {
  orgCheck: 'LOADING',
  error: null,
});

const checkOrgDataSuccess = (state, action) => updateObject(state, {
  orgData: action.orgData[0],
  docType: action.docType,
  docNumber: action.docNumber,
  docCard: action.docCard,
  orgCheck: 'SUCCESS',
  showModal: action.showModal,
  error: null,
});

const checkOrgDataError = (state, action) => updateObject(state, {
  orgCheck: 'ERROR',
  error: action.error,
});

const handleShowModal = (state, action) => updateObject(state, {
  showModal: action.showModal,
  error: null,
});

const searchVendorLoading = (state) => updateObject(state, {
  searchVendorState: 'LOADING',
  error: null,
});

const searchVendorSuccess = (state, action) => updateObject(state, {
  searchVendorState: 'SUCCESS',
  vendorSearchResults: action.orgData,
  error: null,
});

const searchVendorError = (state, action) => updateObject(state, {
  searchVendorState: 'ERROR',
  error: action.error,
});

const addOrgDataLoading = (state) => updateObject(state, {
  orgCheck: 'INIT',
  error: null,
});

const addOrgDataSuccess = (state, action) => updateObject(state, {
  orgCheck: 'SUCCESS',
  orgData: action.orgData,
  docType: 'VENDOR',
  docNumber: action.vendorName,
  showModal: action.showModal,
  error: null,
});

// const addOrgDataError = (state, action) => {
//     return updateObject(state, {
//         orgCheck : "ERROR",
//         error : action.error
//     })
// }

// const addOrgDataError = (state, action) => {
//     return updateObject(state, {
//         orgCheck : "ERROR",
//         error : action.error
//     })
// }

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_INIT_STATE: return initState();
    case actionTypes.GET_ORG_DATA: return getOrgData(state, action);

    case actionTypes.CHECK_ORG_DATA_SUCCESS: return checkOrgDataSuccess(state, action);
    case actionTypes.CHECK_ORG_DATA_LOADING: return checkOrgDataLoading(state, action);
    case actionTypes.CHECK_ORG_DATA_ERROR: return checkOrgDataError(state, action);

    case actionTypes.SEARCH_VENDOR_SUCCESS: return searchVendorSuccess(state, action);
    case actionTypes.SEARCH_VENDOR_LOADING: return searchVendorLoading(state, action);
    case actionTypes.SEARCH_VENDOR_ERROR: return searchVendorError(state, action);

    case actionTypes.ADD_ORG_DATA_LOADING: return addOrgDataLoading(state, action);
    case actionTypes.ADD_ORG_DATA_SUCCESS: return addOrgDataSuccess(state, action);
      // case actionTypes.ADD_ORG_DATA_ERROR: return addOrgDataError(state, action);

    case actionTypes.SHOW_MODAL_TYPE: return handleShowModal(state, action);

    default: return state;
  }
};

export default reducer;

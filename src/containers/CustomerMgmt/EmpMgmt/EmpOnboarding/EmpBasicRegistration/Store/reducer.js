import * as actionTypes from "./actionTypes";
import { updateObject } from "../../../EmpMgmtStore/utility";


const initialState = {
    postDataState: "INIT",
    contactDetails: null,
    getProfilePicUrlState: "INIT",
    deleteProfilePicState:"INIT",
    profilePicUrl: null,
    getConsentState: "INIT",
    deleteConsentState: "INIT",
    consentUrl: null,
    error: null,
    downloadConsentState: 'INIT',
    downloadFileState: 'INIT',
    getEmpProfilePicState: 'INIT',
    empProfilePic: null,
    newCreatedEmpId: null
  };

  const initState = () => {
    return initialState;
  };

//////Profile Pic reducers
const getProfilePicSucess = (state, action) => {
    return updateObject(state, {
      profilePicUrl: action.profilePicUrl,
      error: null,
      getProfilePicUrlState: "SUCCESS"
    });
  };
  
  const getProfilePicError = (state, action) => {
    return updateObject(state, {
      error: action.error,
      getProfilePicUrlState: "ERROR"
    });
  };
  
  const getProfilePicLoading = (state, action) => {
    return updateObject(state, {
      getProfilePicUrlState: "LOADING"
    });
  };
  
  ////////Consent Reducers
  
  const getConsentSucess = (state, action) => {
    return updateObject(state, {
      consentUrl: action.consentUrl,
      error: null,
      getConsentState: "SUCCESS"
    });
  };
  
  const getConsentError = (state, action) => {
    return updateObject(state, {
      error: action.error,
      getConsentState: "ERROR"
    });
  };
  
  const getConsentLoading = (state, action) => {
    return updateObject(state, {
      getConsentState: "LOADING"
    });
  };
  
  ///////////
  const deleteConsentSucess = (state, action) => {
    return updateObject(state, {
      consentUrl: action.consentUrl,
      error: null,
      deleteConsentState: 'SUCCESS'
    });
  };
  
  const deleteConsentError = (state, action) => {
    return updateObject(state, {
      error: action.error,
      deleteConsentState: 'ERROR'
    });
  };
  
  const deleteConsentLoading = (state, action) => {
    return updateObject(state, {
      deleteConsentState: 'LOADING'
    });
  };
  
  /////////
  const deleteProfilePicSucess = (state, action) => {
    return updateObject(state, {
      profilePicUrl: null,
      error: null,
      deleteProfilePicState: "SUCCESS"
    });
  };
  
  const deleteProfilePicError = (state, action) => {
    return updateObject(state, {
      error: action.error,
      deleteProfilePicState: "ERROR"
    });
  };
  
  const deleteProfilePicLoading = (state, action) => {
    return updateObject(state, {
      deleteProfilePicState: "LOADING"
    });
  };

  const downloadConsentPolicyLoading = (state, action) => {
    return updateObject(state, {
      downloadConsentState: "LOADING"
    });
  };
  
  const downloadConsentPolicySuccess = (state, action) => {
    return updateObject(state, {
      downloadConsentState: "SUCCESS"
    });
  };
  
  const downloadConsentPolicyError = (state, action) => {
    return updateObject(state, {
      downloadConsentState: "ERROR"
    });
  };
  
  //download uploaded files
  const downloadFileLoading = (state, action) => {
    return updateObject(state, {
        downloadFileState: 'LOADING'
    })
  }
  
  const downloadFileSuccess = (state, action) => {
    return updateObject(state, {
        downloadFileState: 'SUCCESS'
    })
  }
  
  const downloadFileError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        downloadFileState: 'ERROR'
    })
  }


  //POST DATA REDUCERS
const postDataLoading = state => {
  return updateObject(state, {
    postDataState: "LOADING"
  });
};

const postDataSuccess = (state, action) => {
  return updateObject(state, {
    postDataState: "SUCCESS",
    newCreatedEmpId: action.empId,
    error: null
  });
};

const postDataError = (state, action) => {
  return updateObject(state, {
    postDataState: "ERROR",
    error: action.error
  });
};

//GET EMP PIC REDUCERS
const getEmpPicLoading = (state) => {
  return updateObject(state, {
      getEmpProfilePicState: 'LOADING'
  });
}

const getEmpPicSuccess = (state, action) => {
  return updateObject(state, {
      getEmpProfilePicState: 'SUCCESS',
      empProfilePic: action.empProfilePic,
      error: null
  });
};

const getEmpPicError = (state, action) => {
  return updateObject(state, {
      getEmpProfilePicState: 'ERROR',
      error: action.error,
  });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.INIT_STATE: return initState();

      case actionTypes.POST_DATA_LOADING: return postDataLoading(state, action);
      case actionTypes.POST_DATA_SUCCESS: return postDataSuccess(state, action);
      case actionTypes.POST_DATA_ERROR: return postDataError(state, action);
  
      case actionTypes.GET_PROFILEPIC_LOADING: return getProfilePicLoading(state, action);
      case actionTypes.GET_PROFILEPIC_SUCCESS: return getProfilePicSucess(state, action);
      case actionTypes.GET_PROFILEPIC_ERROR: return getProfilePicError(state, action);
  
      case actionTypes.DELETE_PROFILEPIC_LOADING: return deleteProfilePicLoading(state, action);
      case actionTypes.DELETE_PROFILEPIC_SUCCESS: return deleteProfilePicSucess(state, action);
      case actionTypes.DELETE_PROFILEPIC_ERROR: return deleteProfilePicError(state, action);
  
      case actionTypes.GET_CONSENT_LOADING: return getConsentLoading(state, action);
      case actionTypes.GET_CONSENT_SUCCESS: return getConsentSucess(state, action);
      case actionTypes.GET_CONSENT_ERROR: return getConsentError(state, action);
  
      case actionTypes.DELETE_CONSENT_LOADING: return deleteConsentLoading(state, action);
      case actionTypes.DELETE_CONSENT_SUCCESS: return deleteConsentSucess(state, action);
      case actionTypes.DELETE_CONSENT_ERROR: return deleteConsentError(state, action);
  
      case actionTypes.DOWNLOAD_CONSENT_POLICY_LOADING: return downloadConsentPolicyLoading(state, action);
      case actionTypes.DOWNLOAD_CONSENT_POLICY_SUCCESS: return downloadConsentPolicySuccess(state, action);
      case actionTypes.DOWNLOAD_CONSENT_POLICY_ERROR: return downloadConsentPolicyError(state, action);

      case actionTypes.GET_EMPLOYEE_PROFILE_PIC_LOADING: return getEmpPicLoading(state, action);
      case actionTypes.GET_EMPLOYEE_PROFILE_PIC_SUCCESS: return getEmpPicSuccess(state, action);
      case actionTypes.GET_EMPLOYEE_PROFILE_PIC_ERROR: return getEmpPicError(state, action);
  
      case actionTypes.DOWNLOAD_FILE_LOADING: return downloadFileLoading(state, action);
      case actionTypes.DOWNLOAD_FILE_SUCCESS: return downloadFileSuccess(state, action);
      case actionTypes.DOWNLOAD_FILE_ERROR:   return downloadFileError(state, action);
  
      default: return state;
    }
  };
  
  export default reducer;
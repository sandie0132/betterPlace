import { updateObject } from "../../Store/utility";
import * as actionTypes from './actionTypes';
// import { setCurrentDocument } from "./action";
// import _ from 'lodash';


const initialState = {

    error: null,

    percentCompleted: 0,
    uploadOrgOnboardDocumentState: "INIT",
    downloadURL: null,
    fileProcessState: "INIT",
    fileProcessedData: null,

    currentDocumentType: null,
    currentDocumentLabel: "",

    downloadFileState: "INIT",
    downloadTemplateFileState: "INIT"

}


//INIT STATE REDUCERS
const initState = () => {
    return initialState;
}



//   ////////upload Reducers

const uploadOrgOnboardDocumentSucess = (state, action) => {
    return updateObject(state, {
        downloadURL: action.downloadURL,
        error: null,
        uploadOrgOnboardDocumentState: "SUCCESS"
    });
};

const uploadOrgOnboardDocumentError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        uploadOrgOnboardDocumentState: "ERROR"
    });
};

const uploadOrgOnboardDocumentLoading = (state, action) => {
    return updateObject(state, {
        uploadOrgOnboardDocumentState: "LOADING",
        percentCompleted: action.percentCompleted
    });
};


////file processing

const fileProcessLoading = (state, action) => {
    return updateObject(state, {
        fileProcessState: "LOADING"
    })
};

const fileProcessSuccess = (state, action) => {
    return updateObject(state, {
        fileProcessState: "SUCCESS",
        fileProcessedData: action.data
    })
};

const fileProcessError = (state, action) => {
    return updateObject(state, {
        fileProcessState: "ERROR",
        error: action.error
    })
};

///SET CURRENT DOC
const setCurrentDocument = (state, action) => {
    return updateObject(state, {
        currentDocumentType: action.currentDocument,
        currentDocumentLabel: action.documentLabel
    })
}

///RESET CURRENT DOC
const resetCurrentDocument = (state) => {
    return updateObject(state, {
        currentDocumentType: null,
        currentDocumentLabel: ""
    })
}


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

    //download template files
    const downloadTemplateFileLoading = (state, action) => {
        return updateObject(state, {
            downloadTemplateFileState: 'LOADING'
        })
      }
      
      const downloadTemplateFileSuccess = (state, action) => {
        return updateObject(state, {
            downloadTemplateFileState: 'SUCCESS'
        })
      }
      
      const downloadTemplateFileError = (state, action) => {
        return updateObject(state, {
            error: action.error,
            downloadTemplateFileState: 'ERROR'
        })
      }

  //POST ORG ONBOARD CONFIG REDUCERs
const postOrgOnboardConfigLoading = (state) => {
    return updateObject(state, {
        postOrgOnboardConfigState: 'LOADING',
    });
}

const postOrgOnboardConfigSuccess = (state, action) => {
    return updateObject(state, {
        postOrgOnboardConfigState: 'SUCCESS',
        orgOnboardConfig: action.data
    });
}

const postOrgOnboardConfigError = (state, action) => {
    return updateObject(state, {
        postOrgOnboardConfigState: 'ERROR',
        error: action.error
    });
}

//UPDATE SECTION STATUS REDUCER
// const updateSectionStatus = (state, action) => {
//     return updateObject(state, {
//         sectionStatus: action.sectionStatus,
//     });
// };



const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_STATE: return initState();

        case actionTypes.UPLOAD_ORG_ONBOARD_DOCUMENT_LOADING: return uploadOrgOnboardDocumentLoading(state, action);
        case actionTypes.UPLOAD_ORG_ONBOARD_DOCUMENT_SUCCESS: return uploadOrgOnboardDocumentSucess(state, action);
        case actionTypes.UPLOAD_ORG_ONBOARD_DOCUMENT_ERROR: return uploadOrgOnboardDocumentError(state, action);

        case actionTypes.FILE_PROCESS_LOADING: return fileProcessLoading(state, action);
        case actionTypes.FILE_PROCESS_SUCCESS: return fileProcessSuccess(state, action);
        case actionTypes.FILE_PROCESS_ERROR: return fileProcessError(state, action);

        case actionTypes.SET_CURRENT_DOCUMENT: return setCurrentDocument(state, action);
        case actionTypes.RESET_CURRENT_DOCUMENT: return resetCurrentDocument(state, action);

        case actionTypes.DOWNLOAD_FILE_LOADING: return downloadFileLoading(state, action);
        case actionTypes.DOWNLOAD_FILE_SUCCESS: return downloadFileSuccess(state, action);
        case actionTypes.DOWNLOAD_FILE_ERROR: return downloadFileError(state, action);

        case actionTypes.DOWNLOAD_TEMPLATE_FILE_LOADING: return downloadTemplateFileLoading(state, action);
        case actionTypes.DOWNLOAD_TEMPLATE_FILE_SUCCESS: return downloadTemplateFileSuccess(state, action);
        case actionTypes.DOWNLOAD_TEMPLATE_FILE_ERROR: return downloadTemplateFileError(state, action);

        case actionTypes.POST_ORG_ONBOARD_CONFIG_LOADING: return postOrgOnboardConfigLoading(state);
        case actionTypes.POST_ORG_ONBOARD_CONFIG_SUCCESS: return postOrgOnboardConfigSuccess(state, action);
        case actionTypes.POST_ORG_ONBOARD_CONFIG_ERROR: return postOrgOnboardConfigError(state, action);

        // case actionTypes.UPDATE_SECTION_STATUS: return updateSectionStatus(state, action);
        

        default: return state;
    }
}

export default reducer;
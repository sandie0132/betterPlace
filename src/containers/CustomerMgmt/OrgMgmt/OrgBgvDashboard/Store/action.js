import * as actionTypes from './actionTypes';
import axios from 'axios';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;
const BGV_PDF_REPORT = process.env.REACT_APP_BGV_REPORT_PDF;


export const getInitState = () => {
    return dispatch => {
        dispatch({
            type : actionTypes.GET_INIT_STATE
        })
    }
}

export const customPdfReportDownload= (orgId, type, from, to) =>{
    return dispatch =>{
        dispatch({
            type: actionTypes.DOWNLOAD_CUSTOM_PDF_REPORT_LOADING
        })
        let url = BGV_PDF_REPORT+"/org/"+orgId+"/custom-report/"+type+"/pdf";
        if(type!=="overall"){ url += "?from="+from+"&to="+to ; }

        axios.get((url), { responseType: 'blob'})
        .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data],{type: "application/pdf"}));
            const link = document.createElement('a');
            link.href = url;
            link.download = 'verify_insights_report.pdf'; // "BPSS_"+orgId+"_"+type+"_report.pdf";
            link.click();
           

            if (response.status === 200 || response.status === 201) {
                dispatch({
                    type: actionTypes.DOWNLOAD_CUSTOM_PDF_REPORT_SUCCESS
                })
            }
        })
        .catch(error => {
            let errMsg = error;
            if (error.response.data && error.response.data.errorMessage) {
                errMsg = error.response.data.errorMessage;
            }
            dispatch({
                type: actionTypes.DOWNLOAD_CUSTOM_PDF_REPORT_ERROR,
                error: errMsg
            });
        });

    }

}

export const getDataById = (orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_DATA_LOADING
        })
        axios.get(CUST_MGMT+'/org/' + orgId)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_DATA_SUCCESS,
                        data: response.data,
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_DATA_ERROR,
                    error: errMsg
                });
            });
    };
};

export const getEmpList = (filter,orgId) => {
    return dispatch => {
        dispatch({
            type : actionTypes.GET_ALL_EMP_LIST_LOADING
        })
        let url = CUST_MGMT+'/org/' + orgId+"/employee";
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_ALL_EMP_LIST_SUCCESS,
                        empList: response.data,
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_ALL_EMP_LIST_ERROR,
                    error: errMsg,
                });
            });
    }
}


//Get Tag Info Action Dispatch
export const getTagIdInfo = (tagId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_TAG_ID_INFO_LOADING
        })
        let url = CUST_MGMT + `/tag?tagId=${tagId}`;
        
        axios.get(url)
            .then(response => {                
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_TAG_ID_INFO_SUCCESS,
                        tagData: response.data,
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }else {
                    errMsg = error.message
                }
                dispatch({
                    type: actionTypes.GET_TAG_ID_INFO_ERROR,
                    error: errMsg
                });
            });
    };
};
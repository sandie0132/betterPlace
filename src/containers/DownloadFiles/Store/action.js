import * as actionTypes from './actionTypes';
import axios from 'axios';

const BGV_REPORT_PDF = process.env.REACT_APP_BGV_REPORT_PDF

//Init State Action Dispatch
export const initState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.INIT_STATE
        })
    };
};

//Download Employee Bgv Pdf
export const downloadEmpBgvPdf = (orgId, empId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.DOWNLOAD_EMP_BGV_PDF_LOADING
        })
        axios.get((BGV_REPORT_PDF + '/org/' + orgId + '/employee/' + empId + '/report/pdf'), {
            responseType: 'blob'
        })
        .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }));
            const link = document.createElement('a');

            let fileName = response.headers['content-disposition'].split(/foo/);
            fileName = fileName[0].split(' ');
            fileName = fileName[1].split('=');
            fileName = fileName[1].split('.');

            link.href = url;
            link.setAttribute('download', fileName[0]);
            document.body.appendChild(link);
            link.click();
            if (response.status === 200 || response.status === 201) {
                dispatch({
                    type: actionTypes.DOWNLOAD_EMP_BGV_PDF_SUCCESS
                })
            }
        })
        .catch(error => {
            let errMsg = error;
            if (error.response.data && error.response.data.errorMessage) {
                errMsg = error.response.data.errorMessage;
            }
            dispatch({
                type: actionTypes.DOWNLOAD_EMP_BGV_PDF_ERROR,
                error: errMsg
            });
        })

    }
}
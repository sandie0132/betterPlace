import * as actionTypes from './actionTypes';
import axios from 'axios';
import _ from 'lodash';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

export const setId = (idValue, idState, idImage) => {
    return dispatch => {
        dispatch({
            type: actionTypes.SET_ID_DATA,
            cardtype: idState,
            idNo: idValue,
            idImage: idImage,
            showModal: true
        })
    };
}

export const initState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_INIT_STATE
        })
    };
}

export const entityCheck = (orgId, docType, docNumber) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.ENTITY_CHECK_LOADING
        })

        let url = CUST_MGMT + `/org/${orgId}/check/document?`;
        if(docType==="Mobile"){ url+=`mobileNumber=` + docNumber;}
        else{
            url+=`docNumber=` + docNumber;
        }
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.ENTITY_CHECK_SUCCESS,
                        entityData: response.data,
                        docType: docType
                    })

                    let entityData = response.data[0];
                    _.forEach(response.data, function(value,key){
                        if(!_.isEmpty(value.orgId)){
                            entityData = value
                        }
                    })

                    if(!_.isEmpty(entityData.orgId)){
                        dispatch(getOrgNameById(entityData.orgId))
                    }

                    if(!_.isEmpty(entityData.tags)){
                        dispatch(getTagData(entityData.tags))
                    }
                }
            })
            .catch(error => {
                dispatch({
                    type: actionTypes.ENTITY_CHECK_ERROR,
                    error: error
                })
            })
    }
};

export const getTagData = (tagIds) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_TAG_LOADING
        });

        let url = CUST_MGMT + '/tag?';
        _.forEach(tagIds, function (id, index) {
            if (index === tagIds.length - 1) url = url + 'tagId=' + id;
            else url = url + 'tagId=' + id + '&';
        })

        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_TAG_SUCCESS,
                        tagData: response.data
                    });
                }

            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_TAG_ERROR,
                    error: errMsg
                });

            })

    }

};

export const getOrgNameById = (orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_DATA_LOADING
        })
        axios.get(CUST_MGMT + '/org/' + orgId)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_DATA_SUCCESS,
                        data: response.data,
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_DATA_ERROR,
                    error: errMsg
                });
            });
    };
};

export const downloadExcelTemplate = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.DOWNLOAD_EXCEL_TEMPLATE_LOADING,
        })
        let url = CUST_MGMT + '/excel/template/download';
        axios.get((url), {
            responseType: 'blob'
        })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }));
                const link = document.createElement('a');

                // let fileName = response.headers['content-disposition'].split(/foo/);
                // fileName = fileName[0].split(' ');
                // fileName = fileName[1].split('=');
                // fileName = fileName[1].split('.');

                link.href = url;
                link.setAttribute('download', 'bpss_excel_onboarding');
                // link.setAttribute('download', fileName[0]);
                document.body.appendChild(link);
                link.click();

                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.DOWNLOAD_EXCEL_TEMPLATE_SUCCESS
                    })
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.DOWNLOAD_EXCEL_TEMPLATE_ERROR,
                    error: errMsg
                });
            });
    };
}
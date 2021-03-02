import * as actionTypes from './actionTypes';
import axios from 'axios';
import _ from 'lodash';

const BGV = process.env.REACT_APP_BGV_CONFIG_URL;
const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;
const PLATFORM = process.env.REACT_APP_PLATFORM_API_URL;

export const getInitState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_INIT_STATE
        })
    };
}

export const getContactList = (orgId, input) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_BPCONTACT_LIST_LOADING
        })
        let url = PLATFORM + '/spoc/search?';
        if (input) {
            url += 'key=' + input;
        }
        axios.get(url)
            .then(response => {
                dispatch({
                    type: actionTypes.GET_BPCONTACT_LIST_SUCCESS,
                    contactList: response.data
                })
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_BPCONTACT_LIST_ERROR,
                    error: errMsg
                });
            })
    }
}


export const postSelectedSpocs = (data, orgId, from, to, viaUrl) => {
    return dispatch => {
        dispatch({
            type: actionTypes.POST_BPSELECTED_SPOCS_LOADING
        })
        let url = BGV + '/config/' + orgId;
        if(!_.isEmpty(from) && !_.isEmpty(to)){
            url = `${BGV}/config/from/${from}/to/${to}/share_config`;
        }
        if(!_.isEmpty(viaUrl)){
            url += `?${viaUrl}`;
        }
        axios.post(url, data)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.POST_BPSELECTED_SPOCS_SUCCESS,
                        Id: response.data._id
                    })
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data && error.response.data.errorMessage) {
                    errMsg = error.errorMessage;
                } else {
                    errMsg = error.message
                }
                dispatch({
                    type: actionTypes.POST_BPSELECTED_SPOCS_ERROR,
                    error: errMsg
                })
            })
    }
}

export const getSelectedSpocs = (orgId, from, to, viaUrl) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_BPSELECTED_SPOCS_LOADING
        })
        let url = BGV + '/config/' + orgId;
        if(!_.isEmpty(from) && !_.isEmpty(to)){
            url = `${BGV}/config/from/${from}/to/${to}/shared_config`;
        }
        if(!_.isEmpty(viaUrl)){
            url += `?${viaUrl}`;
        }
        axios.get(url)
            .then(response => {
                let checkLevelRules=null, sectionLevelRules=null, profileLevelRules=null;
                if(!_.isEmpty(response.data.statusManagement)){
                    if(!_.isEmpty(response.data.statusManagement.checkLevelRules)){
                        checkLevelRules= response.data.statusManagement.checkLevelRules;
                    }

                    if(!_.isEmpty(response.data.statusManagement.sectionLevelRules)){
                        sectionLevelRules= response.data.statusManagement.sectionLevelRules;
                    }

                    if(!_.isEmpty(response.data.statusManagement.profileLevelRules)){
                        profileLevelRules= response.data.statusManagement.profileLevelRules;
                    }
                }

                let isStatusMgmtConfigured = (!_.isEmpty(checkLevelRules)) &&
                                            (!_.isEmpty(sectionLevelRules)) && 
                                            (!_.isEmpty(profileLevelRules))
                if (response.status === 200 || response.status === 201) {
                    let data = response.data.betterplaceSpocs ? response.data.betterplaceSpocs[0] : '';
                    dispatch({
                        type: actionTypes.GET_BPSELECTED_SPOCS_SUCCESS,
                        selectedSpocs: data,
                        configuredData: response.data
                    });
                    dispatch({
                        type: 'SET_BGV_CONFIG_STATUS',
                        servicesConfigured: response.data.servicesEnabled !== undefined,
                        tagMappingConfigured: response.data.tagMappedServices !== undefined,
                        tatMappingConfigured: response.data.tatMappedServices !== undefined,
                        clientSpocConfigured: response.data.clientSpocs !== undefined,
                        betterPlaceSpocConfigured: response.data.betterplaceSpocs !== undefined,
                        statusMgmtConfigured: isStatusMgmtConfigured
                    })
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data && error.response.data.errorMessage) {
                    errMsg = error.errorMessage;
                } else {
                    errMsg = error.message
                }
                dispatch({
                    type: actionTypes.GET_BPSELECTED_SPOCS_ERROR,
                    error: errMsg
                })
            })
    }
}

export const getEmployeeById = (orgId, empId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_BPEMP_LOADING
        })
        let url = PLATFORM + '/spoc/details?uuid=' + empId;
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_BPEMP_SUCCESS,
                        empDetails: response.data
                    })
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data && error.response.data.errorMessage) {
                    errMsg = error.errorMessage;
                } else {
                    errMsg = error.message
                }
                dispatch({
                    type: actionTypes.GET_BPEMP_ERROR,
                    error: errMsg
                })
            })
    }
}

export const getTagName = (tagId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_TAG_NAME_LOADING
        })

        let url = CUST_MGMT + '/tag?';
        _.forEach(tagId, function (id, index) {
            if (index === tagId.length - 1) url = url + `tagId=${id}`;
            else url = url + 'tagId=' + id + '&';
        })

        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_TAG_NAME_SUCCESS,
                        tagData: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                } else {
                    errMsg = error.message
                }
                dispatch({
                    type: actionTypes.GET_TAG_NAME_ERROR,
                    error: errMsg
                });
            });
    };
};

export const getOneEmpById = (empId, betterplaceOrgId) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_BPEMP_DATA_LOADING
        })
        let url = PLATFORM + '/spoc/details?uuid=' + empId;
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_BPEMP_DATA_SUCCESS,
                        empData: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response && error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_BPEMP_DATA_ERROR,
                    error: errMsg
                });
            });
    };
};
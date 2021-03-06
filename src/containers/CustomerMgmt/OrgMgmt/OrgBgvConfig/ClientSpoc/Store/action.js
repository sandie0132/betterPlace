import * as actionTypes from '../Store/actionTypes';
import axios from 'axios';
import _ from 'lodash';

const BGV = process.env.REACT_APP_BGV_CONFIG_URL;
const CUSTOMER_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

export const getInitState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_INIT_STATE
        })
    };
}

export const getContactsListById = (orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_CONTACTS_LIST_LOADING,
        })

        let url = CUSTOMER_MGMT + '/org/' + orgId + '/contactperson'
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_CONTACTS_LIST_SUCCESS,
                        orgContacts: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }else {
                    errMsg = error.message
                }
                dispatch({
                    type: actionTypes.GET_CONTACTS_LIST_ERROR,
                    error: errMsg
                });
            });
    };
};

export const updatePostedSpocs = (updatedPostedSpocs) => {
    return dispatch => {
        dispatch ({
            type :actionTypes.UPDATE_POSTED_SPOCS,
            postSpocs : updatedPostedSpocs
        })
    }
}

export const postSelectedSpocs = (payloadData, orgId, from, to, viaUrl) => {
    return dispatch => {
        dispatch({
            type: actionTypes.POST_SELECTED_SPOCS_LOADING
        })
        let url = BGV + '/config/' + orgId;
        if(!_.isEmpty(from) && !_.isEmpty(to)){
            url = `${BGV}/config/from/${from}/to/${to}/share_config`;
        }
        if(!_.isEmpty(viaUrl)){
            url += `?${viaUrl}`;
        }
        axios.post(url, payloadData)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.POST_SELECTED_SPOCS_SUCCESS
                    })
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data.errorMessage) {
                    errMsg = error.errorMessage;
                }else {
                    errMsg = error.message
                }
                dispatch({
                    type: actionTypes.POST_SELECTED_SPOCS_ERROR,
                    error: errMsg
                })
            })
    }
}

export const getSelectedSpocs = (orgId, from, to, viaUrl) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_SELECTED_SPOCS_LOADING
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
                    let data = response.data.clientSpocs;
                    dispatch({
                        type: actionTypes.GET_SELECTED_SPOCS_SUCCESS,
                        selectedSpocs: data,
                        configuredData: response.data
                    })
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
                if (error.response && error.response.data.errorMessage) {
                    errMsg = error.errorMessage;
                }else {
                    errMsg = error.message
                }
                dispatch({
                    type: actionTypes.GET_SELECTED_SPOCS_ERROR,
                    error: errMsg
                })

            })
    }
}
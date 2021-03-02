import * as actionTypes from './actionTypes';
import _ from 'lodash';
import axios from 'axios';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

export const initState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.INIT_STATE
        })
    };
};

export const getDataList = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_DATA_LIST_LOADING
        })
        axios.get(CUST_MGMT + '/org')
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_DATA_LIST_SUCCESS,
                        orgList: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_DATA_LIST_ERROR,
                    error: errMsg
                });
            });
    };
};

export const setPaginatorCount = (count) => {
    return dispatch => {
        dispatch({
            type: actionTypes.SET_PAGINATOR_COUNT,
            paginatorCount: count
        })
    }
};

export const setPageNumber = (pageNumber) => {
    return dispatch => {
        dispatch({
            type: actionTypes.SET_PAGE_NUMBER,
            pageNumber: pageNumber
        })
    }
}

export const searchOrgList = (searchParam) => {
    return dispatch => {
        axios.get(CUST_MGMT + '/org/search?key=' + searchParam)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_ORG_LIST_PAGINATION_DATA_SUCCESS,
                        paginationData: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_DATA_LIST_ERROR,
                    error: errMsg
                });
            });
    };
};

export const getOrgListPaginationCount = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_ORG_LIST_PAGINATION_COUNT_LOADING
        })

        let url = CUST_MGMT + '/org?isCount=true';
        axios.get(url)
            .then(response => {
                dispatch({
                    type: actionTypes.GET_ORG_LIST_PAGINATION_COUNT_SUCCESS,
                    paginationCount: response.data
                });
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_ORG_LIST_PAGINATION_COUNT_ERROR,
                    error: errMsg
                });
            });
    };

};

export const getOrgListPaginationData = (targetUrl, pageSize) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_ORG_LIST_PAGINATION_DATA_LOADING
        })
        let apiUrl = CUST_MGMT + `/org` + targetUrl;

        if (pageSize && targetUrl.length !== 0) {
            apiUrl = apiUrl + `&pageSize=${pageSize}`
        }
        axios.get(apiUrl)
            .then(response => {
                // dispatch(getStarredOrgList(true));
                dispatch({
                    type: actionTypes.GET_ORG_LIST_PAGINATION_DATA_SUCCESS,
                    paginationData: response.data
                });
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_ORG_LIST_PAGINATION_DATA_ERROR,
                    error: errMsg
                });
            });
    };

};

export const getStarredOrgList = (keepPaginationData) => {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes.GET_STARRED_ORG_LIST_LOADING
        })
        const userId = getState().auth.user.userId;

        axios.get(CUST_MGMT + '/starredorg/' + userId)
            .then(response => {
                let starredOrgIds = [];
                let starredCount = 0;
                let paginationData = _.cloneDeep(getState().orgMgmt.orgList.paginationData);
                if (response.status === 200 || response.status === 201) {
                    starredCount = response.data.count;
                    if (response.data && response.data.orgList) {
                        starredOrgIds = response.data.orgList.map((org) => {
                            return org.uuid;
                        });
                    }
                }
                if (!keepPaginationData) {
                    paginationData = response.data.orgList;
                }
                dispatch({
                    type: actionTypes.GET_STARRED_ORG_LIST_SUCCESS,
                    starredCount: starredCount,
                    starredOrgIds: starredOrgIds,
                    paginationData: paginationData
                });
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_STARRED_ORG_LIST_ERROR,
                    error: errMsg
                });
            });
    };
};

export const postStarredOrgList = (orgId, filter) => {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes.POST_STARRED_ORG_LOADING
        })
        const userId = getState().auth.user.userId;
        axios.post(CUST_MGMT + '/starredorg/' + userId + '/' + orgId)
            .then(response => {
                let starredOrgIds = [];
                let starredCount = 0;
                let paginationData = getState().orgMgmt.orgList.paginationData;
                if (response.status === 200 || response.status === 201) {
                    starredCount = response.data.count;
                    starredOrgIds = response.data.orgList.map((org) => {
                        return org.uuid;
                    });
                }
                if (filter === 'starred') {
                    paginationData = response.data.orgList
                }
                dispatch({
                    type: actionTypes.POST_STARRED_ORG_SUCCESS,
                    starredCount: starredCount,
                    starredOrgIds: starredOrgIds,
                    paginationData: paginationData
                });
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.POST_STARRED_ORG_ERROR,
                    error: errMsg
                })
            });
    };

};

export const deleteStarredOrg = (orgId, filter) => {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes.DELETE_STARRED_ORG_LOADING
        })
        const userId = getState().auth.user.userId;
        axios.delete(CUST_MGMT + '/starredorg/' + userId + '/' + orgId)
            .then(response => {
                let starredOrgIds = [];
                let starredCount = 0;
                let paginationData = getState().orgMgmt.orgList.paginationData;
                if (response.status === 200 || response.status === 201) {
                    if (response.data && response.data.orgList) {
                        starredCount = response.data.count;
                        starredOrgIds = response.data.orgList.map((org) => {
                            return org.uuid;
                        });
                    }
                }
                if (filter === 'starred') {
                    paginationData = response.data.orgList
                }
                dispatch({
                    type: actionTypes.DELETE_STARRED_ORG_SUCCESS,
                    starredCount: starredCount,
                    starredOrgIds: starredOrgIds,
                    paginationData: paginationData
                });
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.DELETE_STARRED_ORG_ERROR,
                    error: errMsg
                });
            });
    };
};
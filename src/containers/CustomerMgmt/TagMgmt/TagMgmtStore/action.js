import * as actionTypes from './actionTypes';
import { insertItemInArray, removeItemsInArray, updateArrayItem} from './utility';
import axios from 'axios';
import _ from 'lodash';
import * as initData from './StaticDataInitData'


const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;
const PLATFORM_SERVICES = process.env.REACT_APP_PLATFORM_API_URL;

export const getInitState = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_INIT_STATE
        })
    }
}

export const getStaticDataList = () => {
    const data = initData.data;
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_STATIC_LIST_LOADING
        })

            axios.post(PLATFORM_SERVICES+`/staticdata`, data)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_STATIC_LIST_SUCCESS,
                        staticData: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_STATIC_LIST_ERROR,
                    error: errMsg
                });
            });
        }
    
};

//Search static tags

export const searchStaticData = (key, query) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_SEARCH_TAG_LOADING
        })
        let url = PLATFORM_SERVICES+'/staticdata?location='+key+'&filter='+query
        axios.post(url)
        .then(response => {
            if (response.status === 200 || response.status === 201) {
                dispatch({
                    type: actionTypes.GET_SEARCH_TAG_SUCCESS,
                    searchStaticResult: response.data
                });
            }
        })
        .catch(error => {
            let errMsg  = error;
            if(error.response.data && error.response.data.errorMessage){
                errMsg= error.response.data.errorMessage;
            }
            dispatch({
                type: actionTypes.GET_SEARCH_TAG_ERROR,
                error: errMsg
            });
        });
    }
}
//Set Org and Category Action Dispatch
export const setOrgAndCategory = (orgId, category, categoryUrlName, businessFunction) => {
    return dispatch => {
        dispatch({
            type: actionTypes.SET_ORG_AND_CATEGORY,
            orgId: orgId,
            category: category,
            categoryUrlName: categoryUrlName,
            businessFunction: businessFunction
        })
    }
}

//New TagType Action Dispatch
export const newTagType = (tagType, tagId) => {
    return (dispatch, getState) => {
        const updatedArrayItem = {
            selectedId: null,
            selectedTag: null,
            tagId: tagId,
            tagType: tagType,
            tagList: []
        }
        let updatedTagArray = getState().tagMgmt.tagsArray;
        updatedTagArray = updateArrayItem(updatedTagArray, updatedTagArray.length-1, updatedArrayItem);
        dispatch({
            type: actionTypes.NEW_TAG_TYPE,
            tagsArray: updatedTagArray
        })
    }
}

//Get TagList Action Dispatch
export const getTagList = (orgId, category) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_TAGS_LIST_LOADING
        })
        axios.get(CUST_MGMT+`/org/${orgId}/tag?category=${category}`)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    const updatedTagArray = [{
                        selectedId: null,
                        selectedTag: null,
                        tagId: null,
                        tagType: response.data.type,
                        tagList: _.cloneDeep(response.data.tagList)
                    }];
                    dispatch({
                        type: actionTypes.GET_TAGS_LIST_SUCCESS,
                        tagsArray: updatedTagArray
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_TAGS_LIST_ERROR,
                    error: errMsg
                });
            });
    };
};

//Get TagInfo Action Dispatch
export const getTagDetails = (tagId, orgId, category) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_TAG_LOADING
        })
        axios.get(CUST_MGMT+`/org/${orgId}/tag/${tagId}?category=${category}`)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_TAG_SUCCESS,
                        currentTag: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_TAG_ERROR,
                    error: errMsg
                });
            });
    };
};

//Post TagInfo Action Dispatch
export const postTag = (orgId, category, tag) => {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes.POST_TAG_LOADING
        })
        axios.post(CUST_MGMT+`/org/${orgId}/tag?category=${category}`, tag)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    let updatedTagArray =  _.cloneDeep(getState().tagMgmt.tagsArray);
                    updatedTagArray[0].tagList = insertItemInArray(updatedTagArray[0].tagList, response.data);
                    dispatch({
                        type: actionTypes.POST_TAG_SUCCESS,
                        tagsArray: updatedTagArray
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.POST_TAG_ERROR,
                    error: errMsg
                })
            });
    };
};

//Put TagInfo Action Dispatch
export const putTag = (arrayIndex ,tagId, tag, orgId, category) => {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes.PUT_TAG_LOADING
        })
        axios.put(CUST_MGMT+`/org/${orgId}/tag/${tagId}?category=${category}`, tag)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    let updatedTagArray =  _.cloneDeep(getState().tagMgmt.tagsArray);
                    const updatedTagList = updatedTagArray[arrayIndex]['tagList'].map(item => {
                        if(item.uuid === response.data.uuid){
                            return(response.data);
                        }
                        return item;
                    })
                    updatedTagArray[arrayIndex].tagList = updatedTagList;
                    dispatch({
                        type: actionTypes.PUT_TAG_SUCCESS,
                        tagsArray: updatedTagArray,
                        currentTag: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.PUT_TAG_ERROR,
                    error: errMsg
                })
            });
    };
};

//Delete TagInfo Action Dispatch
export const deleteTag = (arrayIndex ,tagId, orgId) => {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes.DELETE_TAG_LOADING
        })
        axios.delete(CUST_MGMT+`/org/${orgId}/tag/${tagId}`)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    let updatedTagArray =  _.cloneDeep(getState().tagMgmt.tagsArray);
                    const updatedTagList = updatedTagArray[arrayIndex].tagList.filter( item => {
                        if(item.uuid !== tagId){
                            return(item);
                        }
                    return null });
                    updatedTagArray[arrayIndex].tagList = updatedTagList;
                    if(tagId === updatedTagArray[arrayIndex].selectedId){
                        updatedTagArray[arrayIndex].selectedId = null;
                        updatedTagArray[arrayIndex].selectedTag = null;
                        updatedTagArray[arrayIndex].tagId = null;
                        updatedTagArray = removeItemsInArray(updatedTagArray, arrayIndex);
                    }
                    dispatch({
                        type: actionTypes.DELETE_TAG_SUCCESS,
                        tagsArray: updatedTagArray
                    });
                    
                }
            })
            .catch(error => {
                dispatch({
                    type: actionTypes.DELETE_TAG_ERROR,
                    error: error.response.status,
                    deleteTagId: tagId
                })
            });
    };
};

//Get SubTagList Action Dispatch
export const getSubTagList = (arrayIndex, tagId, tagName, orgId, category) => {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes.GET_SUBTAGS_LIST_LOADING
        })
        axios.get(CUST_MGMT+`/org/${orgId}/tag/${tagId}/subtag?category=${category}`)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    let updatedTagArray = _.cloneDeep(getState().tagMgmt.tagsArray);
                    updatedTagArray[arrayIndex]['selectedId'] = tagId;
                    updatedTagArray[arrayIndex]['selectedTag'] = tagName;
                    updatedTagArray = removeItemsInArray(updatedTagArray, arrayIndex);
                    const newArrayItem = {
                        selectedId: null,
                        selectedTag: null,
                        tagId: tagId,
                        tagType: response.data.type,
                        tagList: response.data.tagList
                    };
                    updatedTagArray = insertItemInArray(updatedTagArray, newArrayItem);
                    dispatch({
                        type: actionTypes.GET_SUBTAGS_LIST_SUCCESS,
                        tagsArray: updatedTagArray
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_SUBTAGS_LIST_ERROR,
                    error: errMsg
                });
            });
    };
};

//Post SubTagInfo Action Dispatch
export const postSubTag = (arrayIndex, tagId, subTag, orgId, category) => {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes.POST_SUBTAG_LOADING
        })
        axios.post(CUST_MGMT+`/org/${orgId}/tag/${tagId}/subtag?category=${category}`, subTag)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    const subTag = response.data;
                    let updatedTagArray = _.cloneDeep(getState().tagMgmt.tagsArray);
                    const updatedTagList = insertItemInArray(updatedTagArray[arrayIndex].tagList, subTag);
                    updatedTagArray[arrayIndex].tagList = updatedTagList;
                    dispatch({
                        type: actionTypes.POST_SUBTAG_SUCCESS,
                        tagsArray: updatedTagArray
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.POST_SUBTAG_ERROR,
                    error: errMsg
                })
            });
    };
};

//Get the searched geo tags.
// export const getSearchedGeoTag = (keyType, query) => {
//     return (dispatch) => {
//         dispatch({
//             type: actionTypes.GET_SEARCHED_GEO_TAGS_LOAING
//         })
//         axios.post(CUST_MGMT+`/tag/${tagId}`, subTag)
//             .then(response => {
//                 if (response.status === 200 || response.status === 201) {
//                     const subTag = response.data;
//                     let updatedTagArray = _.cloneDeep(getState().tagMgmt.tagsArray);
//                     const updatedTagList = insertItemInArray(updatedTagArray[arrayIndex].tagList, subTag);
//                     updatedTagArray[arrayIndex].tagList = updatedTagList;
//                     dispatch({
//                         type: actionTypes.GET_SEARCHED_GEO_TAGS_SUCCESS,
//                         tagsArray: updatedTagArray
//                     });
//                 }
//             })
//             .catch(error => {
//                 let errMsg  = error;
//                 if(error.response.data && error.response.data.errorMessage){
//                     errMsg= error.response.data.errorMessage;
//                 }
//                 dispatch({
//                     type: actionTypes.GET_SEARCHED_GEO_TAGS_ERROR,
//                     error: errMsg
//                 })
//             });
//     };
// }

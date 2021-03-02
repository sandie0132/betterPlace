import * as actionTypes from './actionTypes';
import { updateObject } from './utility';

const initialState = {
    tagListState : 'INIT',    
    tagGetState : 'INIT',
    tagPostState : 'INIT',
    tagPutState : 'INIT',
    tagDeleteState : 'INIT',

    subTagList : 'INIT',
    subTagPostState : 'INIT',
    subTagDeleteState : 'INIT',

    orgId: '',
    category: '',
    categoryUrlName: '',
    businessFunction: '',
    tagsArray : [{
        'tagId' : null,
        'tagType' : null,
        'selectedId' : null,
        'tagList' : []
    }],
    currentTag : {},
    error : null,
    deleteTagId : null,
    staticDataState: 'INIT',
    staticData: [],
    searchStaticResult: [],
    searchStaticDataState: 'INIT'
    
}

const getInitState = () => {
    return initialState;
    
}

const getSearchStaticDataLoading = (state) => {
    return updateObject(state, {
        searchStaticDataState: 'LOADING'
    })
}

const getSearchStaticDataSuccess = (state, action) => {
    return updateObject(state, {
        searchStaticDataState: 'SUCCESS',
        searchStaticResult: action.searchStaticResult
    })
}

const getSearchStaticDataError = (state) => {
    return updateObject(state, {
        searchStaticDataState: 'ERROR'
    })
}
const getStaticDataStateLoading = (state) => {
    return updateObject(state, {
        staticDataState:'LOADING'
    })
}

const getStaticDataStateSuccess = (state, action) => {
    return updateObject(state, {
        staticDataState:'SUCCESS',
        staticData: action.staticData,
    })
}

const getStaticDataStateError = (state, action) => {
    return updateObject(state, {
        staticDataState:'ERROR',
        error: action.error
    })
}
//INIT TAGMGMT STATE
const initTagMgmtState = (state) => {
    return updateObject(state, initialState);
}

//SET ORG AND CATEGORY REDUCER
const setOrgAndCategory = (state, action) => {
    return updateObject(state, {
        orgId: action.orgId,
        category: action.category,
        categoryUrlName: action.categoryUrlName,
        businessFunction: action.businessFunction
    });
}

//NEW TAGTYPE REDUCER
const newTagType = (state, action) => {
    return updateObject(state, {
        tagsArray: action.tagsArray,
    });
}

//TAGS LIST REDUCERS
const getTagsListLoading = (state) => {
    return updateObject(state, {
        tagListState: 'LOADING'
    });
};

const getTagsListSuccess = (state, action) => {
    return updateObject(state, {
        tagListState: 'SUCCESS',
        tagsArray: action.tagsArray,
        error: null
    });
};

const getTagsListError = (state, action) => {
    return updateObject(state, {
        tagListState: 'ERROR',
        error: action.error
    });
};

//GET TAG REDUCERS
const getTagLoading = (state) => {
    return updateObject(state, {
        tagGetState: 'LOADING',
    });
};


const getTagSuccess = (state, action) => {
    return updateObject(state, {
        tagGetState: 'SUCCESS',
        currentTag: action.currentTag,
        error: null
    })
};

const getTagError = (state, action) => {
    return updateObject(state, {
        tagGetState: 'ERROR',
        error: action.error
    });
};

//POST TAG REDUCERS
const postTagLoading = (state) => {
    return updateObject(state, {
        tagPostState: 'LOADING',
    });
};

const postTagSuccess = (state, action) => {
    return updateObject(state, {
        tagPostState: 'SUCCESS',
        tagsArray: action.tagsArray,
        error: null
    })
};

const postTagError = (state, action) => {
    return updateObject(state, {
        tagPostState: 'ERROR',
        error: action.error
    });
};

//PUT TAG REDUCERS
const putTagLoading = (state) => {
    return updateObject(state, {
        tagPutState: 'LOADING',
    });
};

const putTagSuccess = (state, action) => {
    return updateObject(state, {
        tagPutState: 'SUCCESS',
        tagsArray: action.tagsArray,
        currentTag: action.currentTag,
        error: null
    })
};

const putTagError = (state, action) => {
    return updateObject(state, {
        tagPutState: 'ERROR',
        error: action.error
    });
};

//DELETE TAG REDUCERS
const deleteTagLoading = (state) => {
    return updateObject(state, {
        tagDeleteState: 'LOADING',
        error: null,
        deleteTagId: null
    });
};

const deleteTagSuccess = (state, action) => {
    return updateObject(state, {
        tagDeleteState: 'SUCCESS',
        tagsArray: action.tagsArray,
        error: null
    })
};

const deleteTagError = (state, action) => {
    return updateObject(state, {
        tagDeleteState: 'ERROR',
        error: action.error,
        deleteTagId: action.deleteTagId
    });
};

//SUBTAGS LIST REDUCERS
const getSubTagsListLoading = (state) => {
    return updateObject(state, {
        subTagListState: 'LOADING'
    });
};

const getSubTagsListSuccess = (state, action) => {
    return updateObject(state, {
        subTagListState: 'SUCCESS',
        tagsArray: action.tagsArray,
        error: null
    });
};

const getSubTagsListError = (state, action) => {
    return updateObject(state, {
        subTagListState: 'ERROR',
        error: action.error
    });
};

//POST SUBTAG REDUCERS
const postSubTagLoading = (state) => {
    return updateObject(state, {
        subTagPostState: 'LOADING',
    });
};

const postSubTagSuccess = (state, action) => {
    return updateObject(state, {
        subTagPostState: 'SUCCESS',
        tagsArray: action.tagsArray,
        error: null,
    })
};

const postSubTagError = (state, action) => {
    return updateObject(state, {
        subTagPostState: 'ERROR',
        error: action.error,
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        //INIT TAGMGMT STATE
        case actionTypes.INIT_TAGMGMT_STATE: return initTagMgmtState(state, action);

        //SET ORG AND CATEGORY
        case actionTypes.SET_ORG_AND_CATEGORY: return setOrgAndCategory(state, action);
        //GET INIT STATE
        case actionTypes.GET_INIT_STATE: return getInitState();

        //NEW TAG TYPE
        case actionTypes.NEW_TAG_TYPE: return newTagType(state, action);

        //TAGS LIST REDUCERS
        case actionTypes.GET_TAGS_LIST_LOADING: return getTagsListLoading(state, action);
        case actionTypes.GET_TAGS_LIST_SUCCESS: return getTagsListSuccess(state, action);
        case actionTypes.GET_TAGS_LIST_ERROR: return getTagsListError(state, action);

        //TAG CRUD REDUCERS
        case actionTypes.GET_TAG_LOADING: return getTagLoading(state, action);
        case actionTypes.GET_TAG_SUCCESS: return getTagSuccess(state, action);
        case actionTypes.GET_TAG_ERROR: return getTagError(state, action);

        case actionTypes.POST_TAG_LOADING: return postTagLoading(state, action);
        case actionTypes.POST_TAG_SUCCESS: return postTagSuccess(state, action);
        case actionTypes.POST_TAG_ERROR: return postTagError(state, action);

        case actionTypes.PUT_TAG_LOADING: return putTagLoading(state, action);
        case actionTypes.PUT_TAG_SUCCESS: return putTagSuccess(state, action);
        case actionTypes.PUT_TAG_ERROR: return putTagError(state, action);

        case actionTypes.DELETE_TAG_LOADING: return deleteTagLoading(state, action);
        case actionTypes.DELETE_TAG_SUCCESS: return deleteTagSuccess(state, action);
        case actionTypes.DELETE_TAG_ERROR: return deleteTagError(state, action);

        //SUBTAGS LIST REDUCERS
        case actionTypes.GET_SUBTAGS_LIST_LOADING: return getSubTagsListLoading(state, action);
        case actionTypes.GET_SUBTAGS_LIST_SUCCESS: return getSubTagsListSuccess(state, action);
        case actionTypes.GET_SUBTAGS_LIST_ERROR: return getSubTagsListError(state, action);

        //SUBTAG POST REDUCERS
        case actionTypes.POST_SUBTAG_LOADING: return postSubTagLoading(state, action);
        case actionTypes.POST_SUBTAG_SUCCESS: return postSubTagSuccess(state, action);
        case actionTypes.POST_SUBTAG_ERROR: return postSubTagError(state, action);
    
        //STATIC DATA REDUCRES
        case actionTypes.GET_STATIC_LIST_LOADING: return getStaticDataStateLoading(state, action);
        case actionTypes.GET_STATIC_LIST_SUCCESS: return getStaticDataStateSuccess(state, action);
        case actionTypes.GET_STATIC_LIST_ERROR: return getStaticDataStateError(state, action);

        case actionTypes.GET_SEARCH_TAG_LOADING: return getSearchStaticDataLoading(state, action);
        case actionTypes.GET_SEARCH_TAG_SUCCESS: return getSearchStaticDataSuccess(state, action);
        case actionTypes.GET_SEARCH_TAG_ERROR: return getSearchStaticDataError(state, action);

        default: return state;
    }
};

export default reducer;
import { combineReducers } from 'redux';

import EmpDocumentsReducer from '../EmpDocuments/Store/reducer';
import EmpEducationReducer from '../EmpEducation/Store/reducer';
import EmpEmploymentReducer from '../EmpEmployment/Store/reducer';

const initialState = {
    
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
      default: return state;
    }
};
  
const empAdditionalDetailsReducer = combineReducers({
    default: reducer,
    empDocuments: EmpDocumentsReducer,
    empEducation: EmpEducationReducer,
    empEmployment: EmpEmploymentReducer
});

export default empAdditionalDetailsReducer;
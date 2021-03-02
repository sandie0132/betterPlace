import _ from 'lodash';

export const validation = {

    terminationDate: {
        isRequiredField: value => !_.isEmpty(value),
    }

};

export const message = {

    terminationDate: {
        isRequiredField: 'this field is required.',
    }
}
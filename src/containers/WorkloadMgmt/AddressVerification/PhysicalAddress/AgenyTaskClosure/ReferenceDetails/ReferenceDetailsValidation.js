import _ from 'lodash';

export const validation = {
    name: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        isRequiredField: value => !_.isEmpty(value)
    },
    mobile: {
        validPhoneNumber: value => _.isEmpty(value) || /^([+][9][1]|[9][1]|[0]){0,1}([ ]{0,1})([0-9]{1})([0-9]{9})$/.test(value),
        isRequiredField: value => !_.isEmpty(value)
    }
};

export const message = {
    name: {
        maxLength: 'maximum characters allowed are 256.',
        isRequiredField: 'this field is required.'
    },
    mobile: {
        validPhoneNumber: 'enter valid phone number.',
        isRequiredField: 'this field is required.'
    }
};
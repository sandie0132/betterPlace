import _ from 'lodash';

export const validation = {
    designation: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        isRequiredField: value => !_.isEmpty(value)
    },
    fullName: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        isRequiredField: value => !_.isEmpty(value)
    },
    phoneNumber: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        validPhoneNumber: value => /^([+][9][1]|[9][1]|[0]){0,1}([ ]{0,1})([0-9]{1})([0-9]{9})$/.test(value),
        isRequiredField: value => !_.isEmpty(value)
    },
    emailAddress: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        // eslint-disable-next-line
        validEmailAddress: value => /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(value)
    }
};

export const message = {
    designation: {
        maxLength: 'maximum characters allowed are 256.',
        isRequiredField: 'this field is required'
    },
    fullName: {
        maxLength: 'maximum characters allowed are 256.',
        isRequiredField: 'this field is required'
    },
    phoneNumber: {
        maxLength: 'maximum characters allowed are 256.',
        validPhoneNumber: 'enter a valid phone number',
        isRequiredField: 'this field is required'
    },
    emailAddress: {
        maxLength: 'maximum characters allowed are 256.',
        validEmailAddress: 'enter a valid email address',
        isRequiredField: 'this field is required'
    }
};
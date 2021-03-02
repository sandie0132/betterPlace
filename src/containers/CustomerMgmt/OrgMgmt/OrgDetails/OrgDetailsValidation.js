import _ from 'lodash';

export const validation = {
    name: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        isRequiredField: value => !_.isEmpty(value)
    },
    legalName: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        isRequiredField: value => !_.isEmpty(value)
    },
    website: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        // eslint-disable-next-line
        validWebsite: value => !_.isEmpty(value) ? /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/ig.test(value) : true
    },
    addressLine1: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        isRequiredField: value => !_.isEmpty(value)
    },
    city: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        isRequiredField: value => !_.isEmpty(value)
    },
    pincode: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        totalLength: value => (value.length === 6),
        shouldBeNumbers: value => /^\d+$/.test(value),
        isRequiredField: value => !_.isEmpty(value)
    },
    state: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        isRequiredField: value => !_.isEmpty(value)
    },
    country: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        isRequiredField: value => !_.isEmpty(value)
    },
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
    name: {
        maxLength: 'maximum characters allowed are 256.',
        isRequiredField: 'this field is required'
    },
    legalName: {
        maxLength: 'maximum characters allowed are 256.',
        isRequiredField: 'this field is required'
    },
    website: {
        maxLength: 'maximum characters allowed are 256.',
        validWebsite: 'enter a valid website'
    },
    addressLine1: {
        maxLength: 'maximum characters allowed are 256.',
        isRequiredField: 'this field is required'
    },
    city: {
        maxLength: 'maximum characters allowed are 256.',
        isRequiredField: 'this field is required'
    },
    pincode: {
        maxLength: 'maximum characters allowed are 256.',
        totalLength: 'pincode must be 6 characters long',
        shouldBeNumbers: 'pincode must contain only numbers',
        isRequiredField: 'this field is required'
    },
    state: {
        maxLength: 'maximum characters allowed are 256.',
        isRequiredField: 'this field is required'
    },
    country: {
        maxLength: 'maximum characters allowed are 256.',
        isRequiredField: 'this field is required'
    },
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
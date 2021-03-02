import _ from 'lodash';

export const validation = {
    addressLine1: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        isRequiredField: value => !_.isEmpty(value)
    },
    addressLine2: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        isRequiredField: value => !_.isEmpty(value)
    },
    city: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        isRequiredField: value => !_.isEmpty(value)
    },
    state: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        isRequiredField: value => !_.isEmpty(value)
    },
    pincode: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        totalLength: value => (value.length === 6),
        shouldBeNumbers: value => /^\d+$/.test(value),
        isRequiredField: value => !_.isEmpty(value)
    },
    country: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        isRequiredField: value => !_.isEmpty(value)
    },
    label: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        isRequiredField: value => !_.isEmpty(value)
    }
};

export const message = {
    addressLine1: {
        maxLength: 'maximum characters allowed are 256.',
        isRequiredField: 'this field is required'
    },
    addressLine2: {
        maxLength: 'maximum characters allowed are 256.',
        isRequiredField: 'this field is required'
    },
    city: {
        maxLength: 'maximum characters allowed are 256.',
        isRequiredField: 'this field is required'
    },
    state: {
        maxLength: 'maximum characters allowed are 256.',
        isRequiredField: 'this field is required'
    },
    pincode: {
        maxLength: 'maximum characters allowed are 256.',
        totalLength: 'pincode must be 6 characters long',
        shouldBeNumbers: 'pincode must contain only numbers',
        isRequiredField: 'this field is required'
    },
    country: {
        maxLength: 'maximum characters allowed are 256.',
        isRequiredField: 'this field is required'
    },
    label: {
        maxLength: 'maximum characters allowed are 256.',
        isRequiredField: 'this field is required'
    }
};
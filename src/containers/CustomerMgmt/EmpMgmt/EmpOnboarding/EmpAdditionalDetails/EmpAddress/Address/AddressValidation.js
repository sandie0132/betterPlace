import _ from 'lodash';

export const validation = {
    addressLine1: {
        maxLength:  value  => (value.length < 256)
    },
    addressLine2: {
        maxLength:  value  => (value.length < 256)
    },
    landmark: {
        maxLength:  value  => (value.length < 256)
    },
    pincode: {
        validPinCode:  value  => _.isEmpty(value) || /^\d+$/.test(value),
        maxLength:  value  => _.isEmpty(value) || (value.length === 6)
    },
    city: {
        maxLength:  value  => (value.length < 256)
    },
    district: {
        maxLength:  value  => (value.length < 256)
    },
    state: {
        maxLength:  value  => (value.length < 256)
    },
    country: {
        maxLength:  value  => (value.length < 256)
    }
};

export const message = {
    addressLine1: {
        maxLength: 'maximum characters allowed are 256.'
    },
    addressLine2: {
        maxLength: 'maximum characters allowed are 256.'
    },
    landmark: {
        maxLength: 'maximum characters allowed are 256.'
    },
    pincode: {
        validPinCode: 'pincode must contain only numbers.',
        maxLength: 'pincode must be 6 characters long.'
    },
    city: {
        maxLength: 'maximum characters allowed are 256.'
    },
    district: {
        maxLength: 'maximum characters allowed are 256.'
    },
    state: {
        maxLength: 'maximum characters allowed are 256.'
    },
    country: {
        maxLength: 'maximum characters allowed are 256.'
    },
};
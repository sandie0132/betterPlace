import _ from 'lodash';

export const validation = {
    primaryMobile: {
        validPhoneNumber: value => _.isEmpty(value) || /^([+][9][1]|[9][1]|[0]){0,1}([ ]{0,1})([0-9]{1})([0-9]{9})$/.test(value),
        maxLength:  value  => _.isEmpty(value) || (value.length < 256)
    },
    secondaryMobile: {
        validPhoneNumber:  value  => _.isEmpty(value) || /^([+][9][1]|[9][1]|[0]){0,1}([ ]{0,1})([0-9]{1})([0-9]{9})$/.test(value),
        maxLength:  value  => _.isEmpty(value) || (value.length < 256)
    },
    primaryEmail: {
        // eslint-disable-next-line
        validEmailAddress:  value  => _.isEmpty(value) || /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(value),
        maxLength:  value  => _.isEmpty(value) || (value.length < 256)
    },
    secondaryEmail: {
        // eslint-disable-next-line
        validEmailAddress: value  => _.isEmpty(value) || /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(value),
        maxLength:  value  => _.isEmpty(value) || (value.length < 256)
    }
};

export const message = {
    primaryMobile: {
        validPhoneNumber: 'enter valid phone number.',
        maxLength: 'maximum characters allowed are 256.'
    },
    secondaryMobile: {
        validPhoneNumber: 'enter valid phone number.',
        maxLength: 'maximum characters allowed are 256.'
    },
    primaryEmail: {
        validEmailAddress: 'enter valid email address.',
        maxLength: 'maximum characters allowed are 256.'
    },
    secondaryEmail: {
        validEmailAddress: 'enter valid email address.',
        maxLength: 'maximum characters allowed are 256.'
    }
};
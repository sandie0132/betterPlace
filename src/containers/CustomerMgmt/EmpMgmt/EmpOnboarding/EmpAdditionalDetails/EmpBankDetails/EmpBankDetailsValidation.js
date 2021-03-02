import _ from 'lodash';

export const validation = {
    bankName: {
        maxLength:  value  => _.isEmpty(value) || (value.length < 256)
    },
    accountNumber: {
        // eslint-disable-next-line
        validAccountNumber:  value  => _.isEmpty(value) || /^(\d{9,18})$/.test(value),
    },
    ifscCode: {
        // eslint-disable-next-line
        validIfscCode:  value  => _.isEmpty(value) || /^([A-Z]{4}0[A-Z0-9]{6})$/.test(value),
    },
    holderName: {
        maxLength:  value  => _.isEmpty(value) || (value.length < 256)
    },
    branchName:{
        maxLength:  value  => _.isEmpty(value) || (value.length < 256)
    }
};

export const message = {
    bankName: {
        maxLength: 'maximum characters allowed are 256.'
    },
    accountNumber: {
        validAccountNumber: 'enter valid account number.',
    },
    ifscCode: {
        validIfscCode: 'enter valid IFSC code.',
    },
    holderName: {
        maxLength: 'maximum characters allowed are 256.'
    },
    branchName:{
        maxLength: 'maximum characters allowed are 256.'
    }
};
import _ from 'lodash';

export const validation = {
    fatherName: {
        maxLength:  value  => _.isEmpty(value) || (value.length < 256)
    },
    motherName: {
        maxLength:  value  => _.isEmpty(value) || (value.length < 256)
    }
};

export const message = {
    fatherName: {
        maxLength: 'maximum characters allowed are 256.'
    },
    motherName: {
        maxLength: 'maximum characters allowed are 256.'
    }
};
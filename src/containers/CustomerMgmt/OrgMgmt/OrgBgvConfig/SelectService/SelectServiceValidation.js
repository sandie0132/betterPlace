import _ from 'lodash';

export const validation = {
    PAN: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    DL: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    AADHAAR: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    RC: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    VOTER: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    PERMANENT_ADDRESS: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    CURRENT_ADDRESS: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    ADDRESS_AGENCY_VERIFICATION: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    CRC_CURRENT_ADDRESS: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    CRC_PERMANENT_ADDRESS: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    POLICE_VERIFICATION: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    EMPLOYMENT: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    EDUCATION: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    HEALTH: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    REFERENCE: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    }
};

export const message = {
    PAN: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'days must contain only numbers'
    },
    DL: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'days must contain only numbers'
    },
    AADHAAR: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'days must contain only numbers'
    },
    RC: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'days must contain only numbers'
    },
    VOTER: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'days must contain only numbers'
    },
    PERMANENT_ADDRESS: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'days must contain only numbers'
    },
    CURRENT_ADDRESS: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'days must contain only numbers'
    },
    ADDRESS_AGENCY_VERIFICATION: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'days must contain only numbers'
    },
    CRC_CURRENT_ADDRESS: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'days must contain only numbers'
    },
    CRC_PERMANENT_ADDRESS: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'days must contain only numbers'
    },
    POLICE_VERIFICATION: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'days must contain only numbers'
    },
    EMPLOYMENT: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'days must contain only numbers'
    },
    EDUCATION: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'days must contain only numbers'
    },
    HEALTH: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'days must contain only numbers'
    },
    REFERENCE: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'days must contain only numbers'
    }
};
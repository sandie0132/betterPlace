import _ from 'lodash';

export const validation = {
    PAN_DOCUMENT_TAT: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    DL_DOCUMENT_TAT: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    AADHAAR_DOCUMENT_TAT: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    RC_DOCUMENT_TAT: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    VOTER_DOCUMENT_TAT: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    PERMANENT_ADDRESS_ADDRESS_TAT: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    CURRENT_ADDRESS_ADDRESS_TAT: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    ADDRESS_AGENCY_VERIFICATION_ADDRESS_TAT: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    CRC_CURRENT_ADDRESS_LEGAL_TAT: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    CRC_PERMANENT_ADDRESS_LEGAL_TAT: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    POLICE_VERIFICATION_LEGAL_TAT: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    EMPLOYMENT_CAREER_TAT: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    EDUCATION_CAREER_TAT: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    HEALTH_TAT: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    },
    REFERENCE_TAT: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => /^[1-9]{1}\d{0,2}$/.test(value)
    }
};

export const message = {
    PAN_DOCUMENT_TAT: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'TAT must contain only numbers'
    },
    DL_DOCUMENT_TAT: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'TAT must contain only numbers'
    },
    AADHAAR_DOCUMENT_TAT: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'TAT must contain only numbers'
    },
    RC_DOCUMENT_TAT: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'TAT must contain only numbers'
    },
    VOTER_DOCUMENT_TAT: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'TAT must contain only numbers'
    },
    PERMANENT_ADDRESS_ADDRESS_TAT: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'TAT must contain only numbers'
    },
    CURRENT_ADDRESS_ADDRESS_TAT: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'TAT must contain only numbers'
    },
    ADDRESS_AGENCY_VERIFICATION_ADDRESS_TAT: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'TAT must contain only numbers'
    },
    CRC_CURRENT_ADDRESS_LEGAL_TAT: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'TAT must contain only numbers'
    },
    CRC_PERMANENT_ADDRESS_LEGAL_TAT: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'TAT must contain only numbers'
    },
    POLICE_VERIFICATION_LEGAL_TAT: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'TAT must contain only numbers'
    },
    EMPLOYMENT_CAREER_TAT: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'TAT must contain only numbers'
    },
    EDUCATION_CAREER_TAT: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'TAT must contain only numbers'
    },
    HEALTH_TAT: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'TAT must contain only numbers'
    },
    REFERENCE_TAT: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'TAT must contain only numbers'
    }
};
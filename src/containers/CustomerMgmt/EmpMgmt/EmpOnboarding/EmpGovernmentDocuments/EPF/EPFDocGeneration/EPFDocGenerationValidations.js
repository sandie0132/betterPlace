import _ from 'lodash';

const isPastDate = (date) => {
    let returnValue = true;
    if (date.length === 10) {
        const pastDate = new Date('1900-01-01');
        const inputDate = new Date(date);
        return inputDate > pastDate
    }
    return returnValue;
}

const isFutureDate = (date) => {
    if (date.length === 10) {
        const today = new Date();
        const inputDate = new Date(date);
        return today > inputDate
    }
    return true;
}

export const validation = {
    title: {
        maxLength: value => (value.length < 256)
    },
    name: {
        validString: value => /^[a-zA-Z][a-zA-Z\s]*$/.test(value),
        maxLength: value => (value.length < 256)
    },
    dob: {
        pastDate: value => isPastDate(value),
        futureDate: value => isFutureDate(value)
    },
    employeePhoneNumber: {
        // eslint-disable-next-line
        validPhoneNumber: value => _.isEmpty(value) || /^\d{10}$/.test(value)
    },
    fatherOrHusbandName: {
        validString: value =>  /^[a-zA-Z][a-zA-Z\s]*$/.test(value),
        maxLength: value => (value.length < 256)
    },
    joiningDate: {
        pastDate: value => isPastDate(value)
    },
    aadhaarNumber: {
        totalLength: value => _.isEmpty(value) || value.length === 12,
        validAadhaarNumber: value => _.isEmpty(value) || /^\d{12}$/.test(value) || /^[X]{8}\d{4}$/.test(value)
    },
    uanNumber: {
        maxLength: value => (value.length < 256)
    },
    nameOnPassport: {
        validString: value =>  /^[a-zA-Z][a-zA-Z\s]*$/.test(value),
        maxLength: value => (value.length < 256)
    },
    passportNumber: {
        totalLength: value => _.isEmpty(value) || (value.length === 8),
        validDocumentNumber: value => _.isEmpty(value) || /^[A-Z]{1}[0-9]{7}$/.test(value)
    },
    passportValidFrom: {
        pastDate: value => isPastDate(value),
        futureDate: value => isFutureDate(value)
    },
    passportValidTill: {
        pastDate: value => isPastDate(value)
    }
};

export const message = {
    title: {
        maxLength: 'maximum characters allowed are 256.'
    },
    name: {
        validString: 'name should only contain letters.',
        maxLength: 'maximum characters allowed are 256.'
    },
    dob: {
        pastDate: 'enter date after 01-01-1900.',
        futureDate: 'do not enter future date.'
    },
    employeePhoneNumber: {
        validPhoneNumber: 'enter valid phone number.'
    },
    fatherOrHusbandName: {
        validString: 'name should only contain letters.',
        maxLength: 'maximum characters allowed are 256.'
    },
    joiningDate: {
        pastDate: 'enter date after 01-01-1900.'
    },
    aadhaarNumber: {
        totalLength: 'aadhaar number must be 12 character long.',
        validAadhaarNumber: 'enter a valid aadhaar number.',
    },
    uanNumber: {
        maxLength: 'maximum characters allowed are 256.'
    },
    nameOnPassport: {
        validString: 'name should only contain letters.',
        maxLength: 'maximum characters allowed are 256.'
    },
    passportNumber: {
        totalLength: 'passport number must be 8 character long.',
        validDocumentNumber: 'enter a valid passport number.'
    },
    passportValidFrom: {
        pastDate: 'enter date after 01-01-1900.',
        futureDate: 'do not enter future date.',
    },
    passportValidTill: {
        pastDate: 'enter date after 01-01-1900.'
    }
};
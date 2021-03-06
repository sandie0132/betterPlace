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
    documentNumber: {
        totalLength: value => _.isEmpty(value) || (value.length === 8),
        validDocumentNumber: value => _.isEmpty(value) || /^[A-Z]{1}[0-9]{7}$/.test(value)
    },
    dob: {
        pastDate: value => isPastDate(value),
        futureDate: value => isFutureDate(value)
    },
    issuedOn: {
        pastDate: value => isPastDate(value),
        futureDate: value => isFutureDate(value)
    },
    validFrom: {
        pastDate: value => isPastDate(value),
        futureDate: value => isFutureDate(value)
    },
    validUpto: {
        pastDate: value => isPastDate(value)
    },
    pincode: {
        totalLength: value => _.isEmpty(value) || (value.length === 6),
        shouldBeNumbers: value => _.isEmpty(value) || /^\d+$/.test(value)
    },
    name: {
        maxLength: value => _.isEmpty(value) || (value.length < 256)
    },
    fatherName: {
        maxLength: value => _.isEmpty(value) || (value.length < 256)
    },
    addressLine1: {
        maxLength: value => _.isEmpty(value) || (value.length < 256)
    },
    addressLine2: {
        maxLength: value => _.isEmpty(value) || (value.length < 256)
    }
}


export const message = {
    documentNumber:{
        totalLength: 'passport number must be 8 character long.',
        validDocumentNumber: 'enter a valid passport number.'
    },
    dob: {
        pastDate: 'enter date after 01-01-1900.',
        futureDate: 'do not enter future date.'
    },
    issuedOn: {
        pastDate: 'enter date after 01-01-1900.',
        futureDate: 'do not enter future date.'
    },
    validFrom: {
        pastDate: 'enter date after 01-01-1900.',
        futureDate: 'do not enter future date.',
    },
    validUpto: {
        pastDate: 'enter date after 01-01-1900.'
    },
    pincode: {
        totalLength: 'pincode must be 6 characters long.',
        shouldBeNumbers: 'pincode must contain only numbers.'
    },
    name: {
        maxLength: 'maximum characters allowed are 256.'
    },
    fatherName: {
        maxLength: 'maximum characters allowed are 256.'
    },
    addressLine1: {
        maxLength: 'maximum characters allowed are 256.'
    },
    addressLine2: {
        maxLength: 'maximum characters allowed are 256.'
    }
}

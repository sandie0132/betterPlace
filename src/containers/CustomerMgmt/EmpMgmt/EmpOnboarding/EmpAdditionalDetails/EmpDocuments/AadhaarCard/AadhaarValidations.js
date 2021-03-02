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
        totalLength: value => _.isEmpty(value) || value.length === 12,
        validAadhaarNumber: value => _.isEmpty(value) || /^\d{12}$/.test(value) || /^[X]{8}\d{4}$/.test(value)
    },
    dob: {
        pastDate: value => isPastDate(value),
        futureDate: value => isFutureDate(value)
    },
    pincode: {
        totalLength: value => !_.isEmpty(value) ? (value.length === 6) : true,
        shouldBeNumbers: value => !_.isEmpty(value) ? /^\d+$/.test(value) : true,

    },
    name: {
        maxLength: value => _.isEmpty(value) || (value.length < 256)
    },
    yob: {
        maxLength: value => _.isEmpty(value) || (value.length === 4)
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
    documentNumber: {
        totalLength: 'aadhaar number must be 12 character long.',
        validAadhaarNumber: 'enter a valid aadhaar number.',
    },
    dob: {
        pastDate: 'enter date after 01-01-1900.',
        futureDate: 'do not enter future date.'
    },
    pincode: {
        totalLength: 'pincode must be 6 characters long',
        shouldBeNumbers: 'pincode must contain only numbers'
    },
    name: {
        maxLength: 'maximum characters allowed are 256.'
    },
    yob: {
        maxLength: 'enter a valid year.'
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

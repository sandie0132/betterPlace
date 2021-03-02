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

export const validation = {
    documentNumber: {
        validDocumentNumber: value => _.isEmpty(value) || /^[A-Z]{2}[ -]{0,1}[0-9]{1,2}[ -]{0,1}[A-Z]{1,3}[ -]{0,1}[0-9]{4}$/.test(value)
    },
    insuranceUpto: {
        pastDate: value => isPastDate(value)
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
    },
    chassisNumber: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => _.isEmpty(value) || /^\d+$/.test(value)
    },
    engineNumber:{
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        shouldBeNumbers: value => _.isEmpty(value) || /^\d+$/.test(value)
    }

}


export const message = {
    documentNumber: {
        validDocumentNumber: 'enter a valid vehicle number'
    },
    insuranceUpto: {
        pastDate: 'enter date after 01-01-1900.'
    },
    validUpto: {
        pastDate: 'enter a valid date',
    },
    pincode: {
        totalLength: 'pincode must be 6 characters long',
        shouldBeNumbers: 'pincode must contain only numbers'
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
    },
    chassisNumber: {
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'chassis number must contain only numbers'
    },
    engineNumber:{
        maxLength: 'maximum characters allowed are 256.',
        shouldBeNumbers: 'engine number must contain only numbers'
    }
}

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
    dob: {
        pastDate: value => isPastDate(value),
        futureDate: value => isFutureDate(value),
    },
    name: {
        maxLength: value => _.isEmpty(value) || (value.length < 256)
    },
    mobile: {
        validPhoneNumber: value => _.isEmpty(value) || /^([+][9][1]|[9][1]|[0]){0,1}([ ]{0,1})([0-9]{1})([0-9]{9})$/.test(value)
    }
};

export const message = {
    dob: {
        pastDate: 'enter date after 01-01-1900.',
        futureDate: 'do not enter future date.'
    },
    name: {
        maxLength: 'maximum characters allowed are 256.'
    },
    mobile: {
        validPhoneNumber: 'enter valid phone number.'
    }
};
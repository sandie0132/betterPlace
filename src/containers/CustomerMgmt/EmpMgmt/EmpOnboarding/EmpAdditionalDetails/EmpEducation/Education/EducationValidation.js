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

var isPastYear = (date) => {
    let returnValue = true;
    if (date.length === 4) {
        let pastYear = 1900;
        let currentYear = parseInt(date);
        if (pastYear > currentYear) { returnValue = false; }
    }
    return returnValue;
}

var isFutureYear = (date) => {
    let returnValue = true;
    if (date.length === 4) {
        var today = new Date();
        let currentYear = today.getFullYear();
        let inputedYear = date;
        if (inputedYear > currentYear) { returnValue = false; }
    }
    return returnValue;
}

var cgpaLimit = (value) => {
    let returnValue = true;
    if (!_.isEmpty(value)) {
        let cgpaValue = parseFloat(value);
        if (cgpaValue > 100) { returnValue = false }
    }
    return returnValue;
}


export const validation = {
    from: {
        pastDate: value => isPastDate(value),
        futureDate: value => isFutureDate(value)
    },
    to: {
        pastDate: value => isPastDate(value),
        futureDate: value => isFutureDate(value)
    },
    passedYear: {
        totalLength: value => _.isEmpty(value) || value.length === 4,
        futureDate: value => _.isEmpty(value) || isFutureYear(value),
        pastDate: value => _.isEmpty(value) || isPastYear(value),
        shouldBeNumber: value => _.isEmpty(value) || /^\d+$/.test(value)
    },
    cgpa_percentage: {
        shouldBeNumber: value => _.isEmpty(value) || /^\d{1,3}(\.\d{1,2})?$/.test(value),
        limit: value => _.isEmpty(value) || cgpaLimit(value)
    },
    school_college:{
        maxLength: value => _.isEmpty(value) || (value.length < 256)
    },
    board_university:{
        maxLength: value => _.isEmpty(value) || (value.length < 256)
    },
    course:{
        maxLength: value => _.isEmpty(value) || (value.length < 256)
    }
};

export const message = {
    from: {
        pastDate: 'enter date after 01-01-1900.',
        futureDate: 'do not enter future date.'
    },
    to: {
        pastDate: 'enter date after 01-01-1900.',
        futureDate: 'do not enter future date.'
    },
    passedYear: {
        totalLength: 'enter a valid year.',
        shouldBeNumber: 'enter in number format.',
        futureDate: 'do not enter future date.',
        pastDate: 'enter a year after 1900.',
    },
    cgpa_percentage: {
        shouldBeNumber: 'enter in a valid number format.',
        limit: 'cgpa/percentage should not be more than 100'
    },
    school_college:{
        maxLength: 'maximum characters allowed are 256.'
    },
    board_university:{
        maxLength: 'maximum characters allowed are 256.'
    },
    course:{
        maxLength: 'maximum characters allowed are 256.'
    }
};
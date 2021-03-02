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
    residenceSince: {
        pastDate: value => isPastDate(value),
        futureDate: value => isFutureDate(value)
    },
    residenceTill: {
        pastDate: value => isPastDate(value),
        futureDate: value => isFutureDate(value)
    },
    latitude: {
        validLatitude : value => _.isEmpty(value) || /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/.test(value)
    },
    longitude: {
        validLongitude : value => _.isEmpty(value) || /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/.test(value)
    }
};

export const message = {
    residenceSince: {
        pastDate: 'enter date after 01-01-1900.',
        futureDate: 'do not enter future date.'
    },
    residenceTill: {
        pastDate: 'enter date after 01-01-1900.',
        futureDate: 'do not enter future date.'
    },
    latitude: {
        validLatitude: 'enter a valid latitude'
    },
    longitude: {
        validLongitude: 'enter a valid longitude'
    }
};
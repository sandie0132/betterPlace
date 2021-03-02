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
    organisation:{
        maxLength: value => _.isEmpty(value) || (value.length < 256)
    },

    hrName:{
        maxLength: value => _.isEmpty(value) || (value.length < 256)
    },
    hrMobile: {
        // eslint-disable-next-line
        validPhoneNumber: value => _.isEmpty(value) || /^([+][9][1]|[9][1]|[0]){0,1}([ ]{0,1})([0-9]{1})([0-9]{9})$/.test(value)
    },
    hrEmail: {
        // eslint-disable-next-line
        validEmailId: value => _.isEmpty(value) || /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(value)
    },
    reportingManagerName:{
        maxLength: value => _.isEmpty(value) || (value.length < 256)
    },
    reportingManagerMobile: {
        // eslint-disable-next-line
        validPhoneNumber: value => _.isEmpty(value) || /^([+][9][1]|[9][1]|[0]){0,1}([ ]{0,1})([0-9]{1})([0-9]{9})$/.test(value)
    },
    reportingManagerEmail: {
        // eslint-disable-next-line
        validEmailId: value => _.isEmpty(value) || /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(value)
    },

    designation:{
        maxLength: value => _.isEmpty(value) || (value.length < 256)
    },
    employeeId:{
        maxLength: value => _.isEmpty(value) || (value.length < 256)
    },
    joinedFrom: {
        pastDate: value => _.isEmpty(value) || isPastDate(value),
        futureDate: value => _.isEmpty(value) || isFutureDate(value)
    },
    workedUntil: {
        pastDate: value => _.isEmpty(value) || isPastDate(value),
        futureDate: value => _.isEmpty(value) || isFutureDate(value)
    },
    salary: {
        validSalary: value => _.isEmpty(value) || /^[0-9]*$/.test(value)
    }
};

export const message = {

    organisation:{
        maxLength: 'maximum characters allowed are 256.'
    },

    hrName:{
        maxLength: 'maximum characters allowed are 256.'
    },
    hrMobile: {
        validPhoneNumber: 'enter a valid phone number.'
    },
    hrEmail: {
        validEmailId: 'enter valid email address.'
    },
    reportingManagerName:{
        maxLength: 'maximum characters allowed are 256.'
    },
    reportingManagerMobile: {
        validPhoneNumber: 'enter a valid phone number.'
    },
    reportingManagerEmail: {
        validEmailId: 'enter valid email address.'
    },

    designation:{
        maxLength: 'maximum characters allowed are 256.'
    },
    employeeId:{
        maxLength: 'maximum characters allowed are 256.'
    },
    joinedFrom: {
        pastDate: 'enter date after 01-01-1900.',
        futureDate: 'do not enter future date.'
    },
    workedUntil: {
        pastDate: 'enter date after 01-01-1900.',
        futureDate: 'do not enter future date.'
    }, 
    salary: {
        validSalary: 'enter in number format.'
    },
    
}

import _ from 'lodash';

const isPastDate = (date) => {
    let returnValue = true;
    if ( !_.isEmpty(date) && date.length === 10) {
        const pastDate = new Date('1900-01-01');
        const inputDate = new Date(date);
        return inputDate > pastDate
    }
    return returnValue;
}

const isFutureDate = (date) => {
    if (!_.isEmpty(date) && date.length === 10) {
        const today = new Date();
        const inputDate = new Date(date);
        return today > inputDate
    }
    return true;
}

const isDateExceedDays = (date) =>{
    if (!_.isEmpty(date) && date.length === 10) {
        const today = new Date().getTime();
        const inputDate = new Date(date).getTime();
        const intervalDays = (today-inputDate)/(1000 * 3600 * 24);
        
        return intervalDays <= 10
    }
    return true;
}


export const validation = {
    dob: {
        isRequiredField: value => !_.isEmpty(value),
        pastDate: value => isPastDate(value),
        futureDate: value => isFutureDate(value)
    },
    joiningDate:{
        isRequiredField: value => !_.isEmpty(value),
        pastDate: value => isDateExceedDays(value),
        futureDate: value => isFutureDate(value)
    },
    maxLength: {
        maxLength: value => !_.isEmpty(value) ? value.length < 256 : true
    },

    addressMaxLength:{
        maxLength: value => !_.isEmpty(value) ? value.length < 100 : true
    },

    mobileNumber: {
        validMobileNumber: value => _.isEmpty(value) || /^([0-9]{1})([0-9]{9})$/.test(value),
        maxLength: value => _.isEmpty(value) || (value.length === 10)
    },

    stdCode:{
        validStdCode: value => _.isEmpty(value) || /^([0-9]{3,5})$/.test(value)
    },
    phoneNumber: {
        validPhoneNumber: value => _.isEmpty(value) || /^([0-9]{6,10})$/.test(value)
    },

    pincode: {
        validPinCode: value => _.isEmpty(value) || /^\d+$/.test(value),
        maxLength: value => _.isEmpty(value) || (value.length === 6)
    },

    email: {
        // eslint-disable-next-line
        validEmailAddress: value => _.isEmpty(value) || /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(value),
        maxLength: value => _.isEmpty(value) || (value.length < 256)
    },

    accountNumber: {
        validAccountNumber: value => _.isEmpty(value) || /^(\d{9,18})$/.test(value),
    },

    ifscCode: {
        validIfscCode: value => _.isEmpty(value) || /^([A-Z]{4}0[A-Z0-9]{6})$/.test(value),
    }
}

export const message = {
    dob: {
        isRequiredField: 'this is required field',
        pastDate: 'can not put date before 01-01-1990',
        futureDate: 'should not be future date'
    },
    joiningDate:{
        isRequiredField: 'this is required field',
        pastDate: 'online esic registration can only happen within 10 days of appointment, if there has been a delay please reach out to your nearest esic center',
        futureDate: 'should not be future date'
    },

    maxLength: {
        maxLength: 'maximum characters allowed are 256.'
    },
    addressMaxLength:{
        maxLength: 'maximum characters allowed are 100.'
    },

    mobileNumber: {
        validMobileNumber: 'enter valid mobile number.',
        maxLength: 'maximum characters allowed are 10.'
    },

    stdCode:{
        validStdCode: "enter valid std code"
    },
    phoneNumber: {
        validPhoneNumber: "enter valid phone number"
    },

    pincode: {
        validPinCode: 'pincode must contain only numbers.',
        maxLength: 'pincode must be 6 characters long.'
    },
    email: {
        validEmailAddress: 'enter valid email address.',
        maxLength: 'maximum characters allowed are 256.'
    },
    accountNumber: {
        validAccountNumber: 'enter valid account number.',
    },
    ifscCode: {
        validIfscCode: 'enter valid IFSC code.',
    }
}
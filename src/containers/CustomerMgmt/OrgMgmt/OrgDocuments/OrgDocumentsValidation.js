import _ from 'lodash';

var isPastDate = (date) => {
    let returnValue = true;
    if (date.length === 14) {
        let pastYear = 1900;
        let currentYear = parseInt(date.substr(date.length - 4));
        if (pastYear > currentYear) { returnValue = false; }
    }
    return returnValue;
}

var isFutureDate = (date) => {
    let returnValue = true;
    if (date.length === 14) {
        var today = new Date();
        let currentYear = today.getFullYear();
        let currentMonth = today.getMonth() + 1;
        let currentDate = today.getDate();
        let inputedYear = parseInt(date.substr(date.length - 4));
        let inputedMonth = parseInt(date.substr(5, 6));
        let inputedDate = parseInt(date.substr(0, 2));
        if (inputedYear > currentYear) { returnValue = false; }
        else if ((inputedYear === currentYear) && (inputedMonth > currentMonth)) { returnValue = false; }
        else if ((inputedYear === currentYear) && (inputedMonth === currentMonth) && ((inputedDate > currentDate))) { returnValue = false; }
    }
    return returnValue;
}

var dateComparison = (date, get) => {
    let returnValue = true;
    let fromDate = get(['validFrom', 'value'])
    if (!_.isEmpty(fromDate) && !_.isEmpty(date)) {
        if (fromDate.length === 14 && date.length === 14) {
            fromDate = fromDate.split(' • ')
            fromDate = fromDate[2] + "-" + fromDate[1] + "-" + fromDate[0];

            let toDate = date.split(" • ");
            toDate = toDate[2] + "-" + toDate[1] + "-" + toDate[0];


            let from = new Date(fromDate);
            let to = new Date(toDate);
            if (to < from) { returnValue = false; }
            else if (+to === +from) { returnValue = false; }
        }
    }
    return returnValue;
}

export const validation = {
    PANdocumentNumber: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        isRequiredField: value => !_.isEmpty(value),
        shouldBePAN: value => /^[a-zA-Z]{3}[PHABCGJLFT]{1}[a-zA-Z]{1}\d{4}[a-zA-Z]{1}$/.test(value)
    },
    GSTdocumentNumber: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        isRequiredField: value => !_.isEmpty(value),
        shouldBeGSTIN: value => /^\d{2}[a-zA-Z]{5}\d{4}[a-zA-Z]{1}\d{1}[a-zA-Z]{1}\d{1}$/.test(value)
    },
    LLPINdocumentNumber: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        isRequiredField: value => !_.isEmpty(value),
        shouldBeLLPIN: value => /^[a-zA-Z]{3}\d{4}$/.test(value)
    },
    CINdocumentNumber: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        isRequiredField: value => !_.isEmpty(value),
        shouldBeCIN: value => /^[a-zA-Z]{1}\d{5}[a-zA-Z]{2}\d{4}[a-zA-Z]{3}\d{6}$/.test(value)
    },
    TANdocumentNumber: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        isRequiredField: value => !_.isEmpty(value),
        shouldBeTAN: value => /^[a-zA-Z]{4}\d{5}[a-zA-Z]{1}$/.test(value)
    },
    PANpincode: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        totalLength: value => (value.length === 6),
        shouldBeNumbers: value => /^\d+$/.test(value)
    },
    GSTpincode: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        totalLength: value => (value.length === 6),
        shouldBeNumbers: value => /^\d+$/.test(value)
    },
    LLPINpincode: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        totalLength: value => (value.length === 6),
        shouldBeNumbers: value => /^\d+$/.test(value)
    },
    CINpincode: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        totalLength: value => (value.length === 6),
        shouldBeNumbers: value => /^\d+$/.test(value)
    },
    TANpincode: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        totalLength: value => (value.length === 6),
        shouldBeNumbers: value => /^\d+$/.test(value)
    },
    issuedOn: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        pastDate: value => isPastDate(value),
        futureDate: value => isFutureDate(value)
    },
    validFrom: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        pastDate: value => isPastDate(value),
        // futureDate: value => isFutureDate(value)
    },
    validUntil: {
        maxLength: value => _.isEmpty(value) || (value.length < 256),
        pastDate: value => isPastDate(value),
        dateCompare: ({ value, get }) => dateComparison(value, get)
    }
};

export const message = {
    PANdocumentNumber: {
        maxLength: 'maximum characters allowed are 256.',
        isRequiredField: 'this field is required',
        shouldBePAN: 'enter a valid PAN number'
    },
    GSTdocumentNumber: {
        maxLength: 'maximum characters allowed are 256.',
        isRequiredField: 'this field is required',
        shouldBeGSTIN: 'enter a valid GSTIN number'
    },
    LLPINdocumentNumber: {
        maxLength: 'maximum characters allowed are 256.',
        isRequiredField: 'this field is required',
        shouldBeLLPIN: 'enter a valid LLPIN number'
    },
    CINdocumentNumber: {
        maxLength: 'maximum characters allowed are 256.',
        isRequiredField: 'this field is required',
        shouldBeCIN: 'enter a valid CIN number'
    },
    TANdocumentNumber: {
        maxLength: 'maximum characters allowed are 256.',
        isRequiredField: 'this field is required',
        shouldBeTAN: 'enter a valid TAN number'
    },
    PANpincode: {
        maxLength: 'maximum characters allowed are 256.',
        totalLength: 'pincode must be 6 characters long',
        shouldBeNumbers: 'pincode must contain only numbers'
    },
    GSTpincode: {
        maxLength: 'maximum characters allowed are 256.',
        totalLength: 'pincode must be 6 characters long',
        shouldBeNumbers: 'pincode must contain only numbers'
    },
    LLPINpincode: {
        maxLength: 'maximum characters allowed are 256.',
        totalLength: 'pincode must be 6 characters long',
        shouldBeNumbers: 'pincode must contain only numbers'
    },
    CINpincode: {
        maxLength: 'maximum characters allowed are 256.',
        totalLength: 'pincode must be 6 characters long',
        shouldBeNumbers: 'pincode must contain only numbers'
    },
    TANpincode: {
        maxLength: 'maximum characters allowed are 256.',
        totalLength: 'pincode must be 6 characters long',
        shouldBeNumbers: 'pincode must contain only numbers'
    },
    issuedOn: {
        maxLength: 'maximum characters allowed are 256.',
        totalLength: 'enter a valid date format',
        pastDate: 'enter date after 01-01-1900',
        futureDate: 'do not enter future date'
    },
    validFrom: {
        maxLength: 'maximum characters allowed are 256.',
        totalLength: 'enter a valid date format',
        pastDate: 'enter date after 01-01-1900',
        // futureDate: 'do not enter future date'
    },
    validUntil: {
        maxLength: 'maximum characters allowed are 256.',
        totalLength: 'enter a valid date format',
        pastDate: 'enter date after 01-01-1900',
        dateCompare: 'valid upto date must be greater than valid from date'
    }
}
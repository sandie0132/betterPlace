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
    organisationName: {
        maxLength: value => (value.length < 256)
    },
    employeeName: {
        maxLength: value => (value.length < 256)
    },
    employeePhoneNumber: {
        // eslint-disable-next-line
        validPhoneNumber: value => /^([+][9][1]|[9][1]|[0]){0,1}([ ]{0,1})([0-9]{1})([0-9]{9})$/.test(value)
    },
    employeeEmail: {
        // eslint-disable-next-line
        validEmailAddress: value => /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(value)
    },
    employeeCurrentAddress: {
        maxLength: value => (value.length < 256)
    },
    employeePermanentAddress: {
        maxLength: value => (value.length < 256)
    },
    employeeOtherAddress: {
        maxLength: value => (value.length < 256)
    },
    employeeType: {
        maxLength: value => (value.length < 256)
    },
    employeeId: {
        maxLength: value => (value.length < 256)
    },
    employeeRole: {
        maxLength: value => (value.length < 256)
    },
    employeeLocation: {
        maxLength: value => (value.length < 256)
    },
    employeeDateOfJoining: {
        pastDate: value => isPastDate(value)
    },
    employeeReportingManager: {
        maxLength: value => (value.length < 256)
    },
    employeeFatherName: {
        maxLength: value => (value.length < 256)
    },
    employeeMotherName: {
        maxLength: value => (value.length < 256)
    },
    employeeSpouseName: {
        maxLength: value => (value.length < 256)
    },
    dateOfIssue: {
        pastDate: value => isPastDate(value)
    }
};

export const message = {
    organisationName: {
        maxLength: 'maximum characters allowed are 256.'
    },
    employeeName: {
        maxLength: 'maximum characters allowed are 256.'
    },
    employeePhoneNumber: {
        validPhoneNumber: 'enter valid phone number.'
    },
    employeeEmail: {
        validEmailAddress: 'enter valid email address.',
    },
    employeeCurrentAddress: {
        maxLength: 'maximum characters allowed are 256.'
    },
    employeePermanentAddress: {
        maxLength: 'maximum characters allowed are 256.'
    },
    employeeOtherAddress: {
        maxLength: 'maximum characters allowed are 256.'
    },
    employeeType: {
        maxLength: 'maximum characters allowed are 256.'
    },
    employeeId: {
        maxLength: 'maximum characters allowed are 256.'
    },
    employeeRole: {
        maxLength: 'maximum characters allowed are 256.'
    },
    employeeLocation: {
        maxLength: 'maximum characters allowed are 256.'
    },
    employeeDateOfJoining: {
        pastDate: 'enter date after 01-01-1900.'
    },
    employeeReportingManager: {
        maxLength: 'maximum characters allowed are 256.'
    },
    employeeFatherName: {
        maxLength: 'maximum characters allowed are 256.'
    },
    employeeMotherName: {
        maxLength: 'maximum characters allowed are 256.'
    },
    employeeSpouseName: {
        maxLength: 'maximum characters allowed are 256.'
    },
    dateOfIssue: {
        pastDate: 'enter date after 01-01-1900.'
    }
};
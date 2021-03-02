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
  firstName: {
    maxLength: value => _.isEmpty(value) || (value.length < 256),
    isRequiredField: value => !_.isEmpty(value),
  },
  middleName: {
    maxLength: value => _.isEmpty(value) || (value.length < 256)
  },
  lastName: {
    maxLength: value => _.isEmpty(value) || (value.length < 256),
    isRequiredField: value => !_.isEmpty(value),
  },
  dob: {
    isRequiredField: value => !_.isEmpty(value),
    pastDate: value => isPastDate(value),
    futureDate: value => isFutureDate(value)
  }

};

export const message = {
  firstName: {
    maxLength: 'maximum characters allowed are 256.',
    isRequiredField: 'this field is required.',
  },
  middleName: {
    maxLength: 'maximum characters allowed are 256.'
  },
  lastName: {
    maxLength: 'maximum characters allowed are 256.',
    isRequiredField: 'this field is required.',
  },
  dob: {
    isRequiredField: 'this field is required.',
    pastDate: 'enter date after 01-01-1900.',
    futureDate: 'do not enter future date.'
  }
}
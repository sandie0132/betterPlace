import _ from 'lodash';
import moment from 'moment';

const isPastDate = (date) => {
  const returnValue = true;
  if (date.length === 10) {
    const pastDate = new Date('1900-01-01');
    const inputDate = new Date(date);
    return inputDate > pastDate;
  }
  return returnValue;
};

const dateComparison = (fromDate, toDate) => {
  let updatedFromDate = fromDate;
  if (!_.isEmpty(updatedFromDate)) {
    updatedFromDate = updatedFromDate.split('-');
    if (updatedFromDate[0] && updatedFromDate[0].length === 2) {
      updatedFromDate = updatedFromDate.reverse().join('-');
    } else {
      updatedFromDate = updatedFromDate.join('-');
    }
  }
  if (!_.isEmpty(updatedFromDate) && !_.isEmpty(toDate) && updatedFromDate.length === 10
  && toDate.length === 10) {
    return moment(updatedFromDate).isSameOrBefore(toDate, 'day');
  }
  return true;
};

export const validation = {
  kitNumber: {
    shouldBeNumbers: (value) => (!_.isEmpty(value) ? /^\d+$/.test(value) : true),
    maxLength: (value) => _.isEmpty(value) || (value.length < 256),
  },
  joiningDate: {
    pastDate: (value) => isPastDate(value),
  },
  empJoiningDate: {
    pastDate: (value) => isPastDate(value),
  },
  moveInDate: {
    pastDate: (value) => isPastDate(value),
  },
  moveOutDate: {
    pastDate: (value) => isPastDate(value),
  },
  employeeId: {
    maxLength: (value) => _.isEmpty(value) || (value.length < 256),
  },
  deploymentStartDate: {
    pastDate: (value) => isPastDate(value),
  },
  deploymentEndDate: {
    pastDate: (value) => isPastDate(value),
    dateCompare: (value, ...custom) => dateComparison(custom[0], custom[1]),
  },
  contractorId: {
    maxLength: (value) => _.isEmpty(value) || (value.length < 256),
  },
};

export const message = {
  kitNumber: {
    shouldBeNumbers: 'kit number should contain number only.',
    maxLength: 'maximum characters allowed are 256.',
  },
  joiningDate: {
    pastDate: 'enter date after 01-01-1900.',
  },
  empJoiningDate: {
    pastDate: 'enter date after 01-01-1900.',
  },
  moveInDate: {
    pastDate: 'enter date after 01-01-1900.',
  },
  moveOutDate: {
    pastDate: 'enter date after 01-01-1900.',
  },
  employeeId: {
    maxLength: 'maximum characters allowed are 256.',
  },
  startDate: {
    pastDate: 'enter date after 01-01-1900.',
  },
  endDate: {
    pastDate: 'enter date after 01-01-1900.',
    dateCompare: 'to date must be greater than from date.',
  },
  contractorId: {
    maxLength: 'maximum characters allowed are 256.',
  },
};

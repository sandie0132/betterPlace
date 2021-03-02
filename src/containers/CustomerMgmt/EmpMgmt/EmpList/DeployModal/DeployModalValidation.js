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
  deploymentFromDate: {
    pastDate: (value) => isPastDate(value),
  },
  deploymentToDate: {
    pastDate: (value) => isPastDate(value),
    dateCompare: (value, ...custom) => dateComparison(custom[0], custom[1]),
  },
};

export const message = {
  deploymentFromDate: {
    pastDate: 'enter date after 01-01-1900.',
  },
  deploymentToDate: {
    pastDate: 'enter date after 01-01-1900.',
    dateCompare: 'to date must be greater than from date.',
  },
};

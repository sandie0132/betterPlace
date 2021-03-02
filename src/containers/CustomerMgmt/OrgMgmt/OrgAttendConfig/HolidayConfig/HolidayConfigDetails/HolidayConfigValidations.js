import isEmpty from 'lodash/isEmpty';

const isPastStartDate = (startDate, endDate) => {
  if (!isEmpty(startDate) && !isEmpty(endDate)) {
    return new Date(startDate) <= new Date(endDate);
  }
  return true;
};

const checkSameYearDate = (value, selectedYear) => {
  if (!isEmpty(value) && !isEmpty(selectedYear)) {
    return new Date(value).getFullYear() === parseInt(selectedYear, 10);
  }
  return true;
};

export const validation = {
  startDate: {
    futureDate: (value, ...custom) => checkSameYearDate(value, custom[0]),
  },
  endDate: {
    pastStartDate: (value, ...custom) => isPastStartDate(custom[0], value),
    futureDate: (value, ...custom) => checkSameYearDate(value, custom[2]),
  },
};

export const message = {
  startDate: {
    futureDate: 'holiday dates can be configured only from the year selected',
  },
  endDate: {
    pastStartDate: 'end date should not before start date',
    futureDate: 'holiday dates can be configured only from the year selected',
  },
};

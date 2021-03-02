export const validation = {

  percentage: {
    percentageError: (val) => /^[1-9][0-9]?$|^100$/.test(val),
  },
  days: {
    daysError: (val) => /^[0-9]*$/.test(val),
  },
  carryForward: {
    daysError: (val) => /^[0-9]*$/.test(val),
    moreThanAssigned: (val, ...custom) => {
      if (custom && custom[0] === null) return true;
      return custom && parseInt(custom[0], 10) > parseInt(val, 10);
    },
  },

};

export const errorMessage = {
  percentage: {
    percentageError: 'Value should be between 0 and 100, without decimals',
  },
  days: {
    daysError: 'Value should be integer',
  },
  carryForward: {
    daysError: 'Value should be integer',
    moreThanAssigned: 'carry forward leaves should be less than assigned',
  },
};

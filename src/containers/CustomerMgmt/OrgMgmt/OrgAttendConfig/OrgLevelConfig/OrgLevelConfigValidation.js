/* eslint-disable max-len */
import { isEmpty } from 'lodash';

const checkMminuteRange = (minutes) => {
  if (!isEmpty(minutes)) {
    const intMin = parseInt(minutes, 10);
    if (intMin < 0 || intMin >= 60) return false;
    return true;
  }
  return true;
};

const timeToleranceCheck = (pValue, timeToleranceValue) => {
  const pvalueHours = !isEmpty(pValue.hours) ? pValue.hours : '0';
  const pvalueMinutes = !isEmpty(pValue.minutes) ? pValue.minutes : '0';
  const timeTolerance = !isEmpty(timeToleranceValue.minutes) ? timeToleranceValue.minutes : '0';
  if (parseInt(pvalueHours, 10) * 60 + parseInt(pvalueMinutes, 10) < parseInt(timeTolerance, 10)) {
    return false;
  }
  return true;
};

const ispValueExceed = ({ hours, minutes }) => {
  // if(parseInt(hours)*60 + parseInt(minutes) > 720 || !(minutes && hours)) return false
  const newHour = hours || '0'; const newMin = minutes || '0';
  if (parseInt(newHour, 10) * 60 + parseInt(newMin, 10) > 720) return false;
  return true;
};

const ishValueExceed = (pValue, hValue) => {
  const pvalueHours = !isEmpty(pValue.hours) ? pValue.hours : '0';
  const pvalueMinutes = !isEmpty(pValue.minutes) ? pValue.minutes : '0';
  const hvalueHours = !isEmpty(hValue.hours) ? hValue.hours : '0';
  const hvalueMinutes = !isEmpty(hValue.minutes) ? hValue.minutes : '0';

  if (parseInt(pvalueHours, 10) * 60 + parseInt(pvalueMinutes, 10) < parseInt(hvalueHours, 10) * 60 + parseInt(hvalueMinutes, 10)) return false;
  return true;
};

const isMaxOvertimeExceed = ({ hours, minutes }) => {
  const overtimeHours = hours || '0'; const overtimeMinutes = minutes || '0';
  if (parseInt(overtimeHours, 10) * 60 + parseInt(overtimeMinutes, 10) > 2880) return false;
  return true;
};

export const validation = {
  pValue: {
    validpValue: (value, ...custom) => ispValueExceed(custom[0]),
    validHour: (value, ...custom) => isEmpty(custom[0].hours) || /^[0-9]{0,2}$/.test(custom[0].hours),
    minuteRange: (value, ...custom) => checkMminuteRange(custom[0].minutes),
    validMinute: (value, ...custom) => isEmpty(custom[0].minutes) || /^[0-9]{0,2}$/.test(custom[0].minutes),
  },

  hValue: {
    validhValue: (value, ...custom) => ishValueExceed(custom[0], custom[1]),
    minuteRange: (value, ...custom) => checkMminuteRange(custom[1].minutes),
    validHour: (value, ...custom) => isEmpty(custom[1].hours) || /^[0-9]{0,2}$/.test(custom[1].hours),
    validMinute: (value, ...custom) => isEmpty(custom[1].minutes) || /^[0-9]{0,2}$/.test(custom[1].minutes),

  },
  maxOvertime: {
    maxOvertimeLimit: (value, ...custom) => isMaxOvertimeExceed(custom[0]),
    minuteRange: (value, ...custom) => checkMminuteRange(custom[0].minutes),
    validHour: (value, ...custom) => isEmpty(custom[0].hours) || /^[0-9]{0,2}$/.test(custom[0].hours),
    validMinute: (value, ...custom) => isEmpty(custom[0].minutes) || /^[0-9]{0,2}$/.test(custom[0].minutes),
  },

  minutes: {
    minuteRange: (value) => checkMminuteRange(value),
    validMinute: (value) => isEmpty(value) || /^[0-9]{2}$/.test(value),
  },
  timeTolerance: {
    validMinute: (value) => isEmpty(value) || /^[0-9]*$/.test(value),
    valueGreaterPvalue: (value, ...custom) => isEmpty(value) || timeToleranceCheck(custom[0], custom[1]),
  },
  daysToEditLogHistory: {
    validDays: (value) => isEmpty(value) || /^[0-9]*$/.test(value),
  },
};

export const message = {
  pValue: {
    validpValue: 'p value should not exceed 12 hours',
    validHour: 'enter a valid hour',
    minuteRange: 'minute value should be between 0 - 59 ',
    validMinute: 'enter a valid minute',
  },
  hValue: {
    minuteRange: 'minute value should be between 0 - 59 ',
    validMinute: 'enter a valid minute',
    validHour: 'enter a valid hour',
    validhValue: 'h value should not exceed p value',
  },
  maxOvertime: {
    maxOvertimeLimit: 'maximum overtime value should be 48 hours',
    minuteRange: 'minute value should be between 0 - 59 ',
    validHour: 'enter a valid hour',
    validMinute: 'enter a valid minute',
  },
  minutes: {
    minuteRange: 'value should be between 0 - 59 ',
    validMinute: 'enter a valid minute',
  },
  timeTolerance: {
    validMinute: 'enter a valid minute',
    valueGreaterPvalue: 'time tolerance value should not exceed p value',
  },
  daysToEditLogHistory: {
    validDays: 'enter a valid number',
  },

};

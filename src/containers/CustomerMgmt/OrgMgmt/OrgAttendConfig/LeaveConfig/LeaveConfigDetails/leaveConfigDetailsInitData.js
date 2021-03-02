import { isArray } from 'lodash';
import { Input } from 'react-crux';
import CustomSelect from '../../../../../../components/Atom/CustomSelect/CustomSelect';
import CheckboxGroup from '../../../../../../components/Molecule/CheckboxGroup/checkboxGroup';
import RadioButtonGroup from '../../../../../../components/Organism/RadioButtonGroup/RadioButtonGroup';
import { errorMessage, validation } from './leaveConfigFormRule';

export const INIT = {
  leave: {
    category: 'LEAVE',
    leaveName: null,
    leaveType: 'PAID',
    leavePolicy: null,
    numberOfdaysToForward: null,
    encashmentPercentage: null,
    numberOfDaysAssigned: null,
    advanceNoticeDays: null,
    description: null,
    allTags: true,
    includeTags: [],
    excludeTags: [],
    newLeaveName: null,
  },
  compoff: {
    category: 'COMP_OFF',
    allTags: true,
    includeTags: [],
    excludeTags: [],
    retentionPeriod: null,
    earningCriteria: [],
    calculationCriteria: [],
  },
};
const getLeaveType = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('leaveType') && urlParams.get('leaveType').toLowerCase();
};

const leaveOptions = [{ label: 'select any one', value: null },
  { label: 'sick leaves', value: 'SICK LEAVES' },
  { label: 'maternity leave', value: 'MATERNITY LEAVE' },
  { label: 'paternity leave', value: 'PATERNITY LEAVE' },
  { label: '+ add new leave', value: 'ADD NEW LEAVE' }];

export const generateForm = () => ({
  leave: {
    heading: 'configure new leave',
    feilds: [[{
      name: 'leaveName',
      className: 'col-12',
      label: 'leave name',
      required: true,
      disabled: Boolean(getLeaveType()),
      options: getLeaveType() ? [
        { label: getLeaveType(), value: getLeaveType() },
        [...leaveOptions],
      ] : [...leaveOptions],
      value: 'leaveName',
      condition: { isValid: true },
      Component: CustomSelect,
    },
    {
      name: 'newLeaveName',
      placeholder: 'enter leave name',
      className: 'col-12 pt-0',
      value: 'newLeaveName',
      label: 'new leave name',
      required: true,
      condition: { isValid: false, key: 'leaveName', value: 'ADD NEW LEAVE' },
      Component: Input,
    }],
    [{
      className: 'pl-3 pr-3 d-flex flex-row mt-2',
      name: 'leaveType',
      wrapperClass: 'pl-3',
      label: 'type',
      required: true,
      selectItems: [
        { value: 'PAID', label: 'paid' },
        { value: 'UNPAID', label: 'unpaid' },
      ],
      value: 'leaveType',
      type: 'simple',
      Component: RadioButtonGroup,
      condition: { isValid: true },
    }, {
      name: 'leavePolicy',
      className: 'col-12',
      label: 'leave policies',
      required: true,
      options: [
        { label: 'select leave policy', value: null },
        { label: 'lapse all leave at year end', value: 'LAPSE' },
        { label: 'encash leaves', value: 'ENCASH' },
        { label: 'carry forward leaves', value: 'CARRY_FORWARD' },
      ],
      value: 'leavePolicy',
      condition: { isValid: true },
      Component: CustomSelect,
    }, {
      name: 'encashmentPercentage',
      placeholder: 'enter encashment percentage',
      className: 'col-12 pt-0',
      value: 'encashmentPercentage',
      label: 'percentage(%) of encashment',
      required: true,
      condition: { isValid: false, key: 'leavePolicy', value: 'ENCASH' },
      validation: validation.percentage,
      message: errorMessage.percentage,
      Component: Input,
    }, {
      name: 'numberOfdaysToForward',
      placeholder: 'enter no. of days',
      className: 'col-12 pt-0',
      value: 'numberOfdaysToForward',
      label: 'max no. of (days) to forward next year',
      required: true,
      condition: { isValid: false, key: 'leavePolicy', value: 'CARRY_FORWARD' },
      validation: validation.carryForward,
      message: errorMessage.carryForward,
      customValidators: ['numberOfDaysAssigned'],
      trigger: 'numberOfDaysAssigned',
      Component: Input,
    }],
    [{
      name: 'numberOfDaysAssigned',
      placeholder: 'enter no. of days',
      className: 'col-12 pt-0',
      value: 'numberOfDaysAssigned',
      label: 'number of day(s) assigned/year',
      required: true,
      condition: { isValid: true },
      validation: validation.days,
      message: errorMessage.days,
      Component: Input,
    },
    {
      name: 'advanceNoticeDays',
      placeholder: 'enter no. of days',
      className: 'col-12 pt-0',
      value: 'advanceNoticeDays',
      label: 'advance notice day(s)',
      required: true,
      condition: { isValid: true },
      validation: validation.days,
      message: errorMessage.days,
      Component: Input,
    },
    {
      name: 'description',
      placeholder: 'add short description',
      className: 'col-12 pt-0',
      value: 'description',
      label: 'description',
      condition: { isValid: true },
      Component: Input,
    }]],
  },
  compoff: {
    heading: 'configure new comp-off',
    feilds: [[
      {
        name: 'retentionPeriod',
        placeholder: 'enter no. of days',
        className: 'col-12 pt-0',
        value: 'retentionPeriod',
        label: 'retention period in day(s)',
        required: true,
        condition: { isValid: true },
        validation: validation.days,
        message: errorMessage.days,
        Component: Input,
      },
      {
        label: 'earning criteria or worked on',
        wrapperClass: 'pt-0',
        required: true,
        name: 'earningCriteria',
        value: 'earningCriteria',
        type: 'medium',
        options: [{ label: 'NFH', value: 'NFH' }, { label: 'weekly off', value: 'WEEK_OFF' }, { label: 'holiday', value: 'HOLIDAY' }],
        condition: { isValid: true },
        Component: CheckboxGroup,
      }],
    [{
      label: 'caluclation criteria',
      divClass: 'col-12',
      wrapperClass: 'pt-0',
      required: true,
      name: 'calculationCriteria',
      value: 'calculationCriteria',
      type: 'medium',
      options: [{ label: 'pay double the daily wage', value: '2XWAGE' }, { label: 'grant paid holiday on another working day', value: 'HOLIDAY' }],
      condition: { isValid: true },
      Component: CheckboxGroup,
    }]],
  },
});

export const convertFeildsToNumbers = (obj, feilds) => {
  const converted = {};
  Object.entries(obj).forEach(([key, val]) => {
    if (feilds.includes(key) && val) {
      converted[key] = parseInt(val, 10);
    } else if (val) {
      converted[key] = val;
    }
  });
  return converted;
};

export const convertFeildsToString = (obj, feilds) => {
  const converted = {};
  if (obj) {
    Object.entries(obj).forEach(([key, val]) => {
      if (feilds.includes(key) && val) {
        converted[key] = val.toString();
      } else if (val) {
        converted[key] = val;
      }
    });
  }
  return converted;
};

export const numberFeilds = {
  leave: ['numberOfDaysAssigned', 'advanceNoticeDays', 'encashmentPercentage', 'numberOfdaysToForward'],
  compoff: ['retentionPeriod'],
};

export const sortAllArray = (obj) => {
  const result = {};
  Object.entries(obj).forEach(([key, val]) => {
    if (isArray(val)) {
      result[key] = val.sort();
    } else {
      result[key] = val;
    }
  });
  return result;
};

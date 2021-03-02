/* eslint-disable max-len */
/* eslint-disable import/prefer-default-export */
import moment from 'moment';
import React from 'react';
import { Button, Pill } from 'react-crux';
import styles from './leaveConfig.module.scss';
import warning from '../../../../../assets/icons/yellowExclamation.svg';

export const tableConfiguration = [
  {
    tableHeading: 'suggested leaves',
    isConfig: true,
    displayCondition: {
      key: 'leaveCycle', notValue: 'select leave period', default: false, minLength: 1,
    },
    footer: {
      className: styles.suggestedFooter,
      text: 'most common have been added you can configure the same or new ones afterwards as well',
      minDataLength: 1,
      maxDataLength: Infinity,
      img: warning,
    },
    data: 'localSuggestedLeaves',
    addButtonText: 'add new leave',
    search: 'type=leave',
    isLocal: false,
    columns: [{
      name: 'leave name',
      value: 'leaveName',
    },
    {
      name: 'leave no. - type',
      value: 'numberOfDaysAssigned, - leaveType',
    },
    {
      name: 'included locations',
    },
    {
      name: 'excluded locations',
    },
    {
      name: '',
    }],
  },
  {
    addButtonText: 'add new leave',
    tableHeading: 'configured leaves',
    data: 'localConfiguredLeaves',
    search: 'type=leave',
    isLocal: true,
    displayCondition: {
      key: 'leaveCycle', notValue: 'select leave period', default: false, minLength: 1,
    },
    footer: { element: null, minDataLength: 1, maxDataLength: Infinity },
    columns: [{
      name: 'leave name',
    },
    {
      name: 'leave no. - type',
    },
    {
      name: 'included locations',
    },
    {
      name: 'excluded locations',
    },
    {
      name: '',
    }],
  },
  {
    tableHeading: 'configured comp-off',
    data: 'localCompoffLeaves',
    displayCondition: {
      key: 'leaveCycle', notValue: 'select leave period', default: false, minLength: 0,
    },
    footer: {
      className: styles.compoffFooter,
      text: 'there is no compoff leave added yet',
      minDataLength: 0,
      maxDataLength: 0,
    },
    addButtonText: 'add compoff leave',
    search: 'type=compoff',
    isLocal: true,
    columns: [{
      name: 'comp-off name',
    },
    {
      name: 'calculation criteria',
    },
    {
      name: 'included locations',
    },
    {
      name: 'excluded locations',
    },
    {
      name: '',
    }],
  }];

export const monthOptions = () => moment.months().map((month) => ({ option: month.toLocaleLowerCase(), optionLabel: month.toLocaleLowerCase() }));

export const yearOptions = (val) => {
  let years = [moment().format('YYYY'),
    moment().add(1, 'year').format('YYYY'),
    moment().add(2, 'year').format('YYYY'),
    moment().add(3, 'year').format('YYYY'),
    moment().add(4, 'year').format('YYYY'),
  ];
  years = val && !years.includes(val) ? [val, ...years] : [...years];
  return years.map((year) => ({ option: year, optionLabel: year }));
};

export const Add = ({ text, onClick }) => (
  <span>
    <span role="button" tabIndex="0" aria-hidden onClick={onClick} className={styles.addText}>{text}</span>
    <Button type="add" isSecondary className={styles.addButton} clickHandler={onClick} label="" />
  </span>
);

export const getLabel = (val) => {
  if (val.saveAs === 'DRAFT') return <Pill text="draft" backgroundColor="#FFCE06" />;
  if (val.isActive) return <Pill text="active" backgroundColor="#4BB752" />;
  return false;
};

const checkLeaveOverlap = (start1, end1, start2, end2) => {
  if (start1.isAfter(start2) && start1.isBefore(end2)) return true;
  if (start1.isAfter(end2)) return false;
  if (end1.isBefore(end2)) return true;
  return false;
};

export const checkOverlap = (startCycle, endCycle, leaves) => leaves.some((leave) => checkLeaveOverlap(
  moment(startCycle, 'MMMM yyyy').add(1, 'days'),
  moment(endCycle, 'MMMM yyyy'),
  moment(leave.startDate, 'YYYY-MM-DD'),
  moment(leave.endDate, 'YYYY-MM-DD'),
));

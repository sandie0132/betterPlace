import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { useEffect, useRef } from 'react';
import { last } from 'lodash';
import styles from './RoasterMgmt.module.scss';
import afternoon from '../../../../../assets/icons/afternoon shift.svg';
import morning from '../../../../../assets/icons/morning shift.svg';
import evening from '../../../../../assets/icons/evening shift.svg';

export const getDateRange = (startDate) => {
  const range = [];
  for (let i = 0; i < 7; i++) {
    range.push(moment(startDate, 'MMM DD YYYY').add(i, 'days'));
  }
  return range;
};

export const isToday = (date) => moment().isSame(date, 'days');

export const getShiftTime = ({ hours = '', minutes = '', period = '' }) => {
  if (hours !== '' && minutes !== '' && period) {
    return moment(`${hours} ${minutes} ${period}`, 'hh mm A').format('hh:mm A').toLowerCase();
  }
  return '';
};

export const colorPallete = [
  {
    color: '#7C2E9E',
    backgroundColor: '#F1EAF5',
  },
  {
    color: '#798337',
    backgroundColor: '#F1F2EB',
  },
  {
    color: '#1B2B4C',
    backgroundColor: '#E8E9ED',
  },
  {
    color: '#8D6D55',
    backgroundColor: '#F3F0EE',
  },
  {
    color: '#A84567',
    backgroundColor: '#F6ECEF',
  },
  {
    color: '#FF3B4A',
    backgroundColor: '#FFEBEC',
  },
  {
    color: '#FFA200',
    backgroundColor: '#FFF5E5',
  },
  {
    color: '#72CEDF',
    backgroundColor: '#F0FAFB',
  },
];

const shiftColors = {};

export const assignShiftColors = (id, index) => {
  const number = index < 7 ? index : 7;
  shiftColors[id] = colorPallete[number];
};

export const getShiftColor = (id) => shiftColors[id];

export const isPastDate = (date) => date.isBefore(moment(), 'days');

export const isShiftTimeElapsed = ({ hours, minutes, period }, date) => {
  if (!isPastDate(date) && !isToday(date)) {
    return false;
  }
  if (isToday(date)) return moment(`${hours} ${minutes} ${period}`, 'hh mm A').isBefore(moment(), 'minutes');
  return true;
};

export const isTodaySelected = (dates) => dates.some((date) => isToday(moment(date, 'MM-DD-YYYY')));

export const sortDates = (dates) => dates.sort((a, b) => moment(a, 'MM-DD-YYYY') - moment(b, 'MM-DD-YYYY'));

export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const cellCommonStyles = ({ isHoliday, isColumnSelectedForPublish, date }) => ({
  [`${styles.tdCellToday}`]: !isColumnSelectedForPublish[0] && isToday(date),
  [`${styles.holiday}`]: isHoliday,
  [`${styles.tdCellPublishThinRight}`]: isColumnSelectedForPublish[1] && isColumnSelectedForPublish[0],
  [`${styles.tdCellPublishThinLeft}`]: isColumnSelectedForPublish[2] && isColumnSelectedForPublish[0],
  [`${styles.tdCellPublish}`]: isColumnSelectedForPublish[0],
});

export const fetchCountData = ({ shiftId, date, totalEmpCountData }) => {
  let returnObj = {};
  if (!isEmpty(totalEmpCountData)) {
    const shiftObj = totalEmpCountData.filter((shft) => shft._id === shiftId);
    if (shiftObj.length !== 0 && !isEmpty(shiftObj[0].expectedEmpCountDetails)) {
      const [countObj] = shiftObj[0].expectedEmpCountDetails
        .filter((count) => moment(date).isSame(moment(count.assignDate)));
      returnObj = countObj;
    }
  }
  return returnObj;
};

export const getSourceImage = ({ startTime }) => {
  const { hours, minutes, period } = startTime;
  const hour = moment(`${hours} ${minutes} ${period}`, 'hh mm A').format('HH');
  if (hour > 0 && hour <= 11) return morning;
  if (hour > 11 && hour <= 16) return afternoon;
  if (hour > 16 && hour <= 24) return evening;
  return morning;
};

export const getTodayAndFuture = (calendarRange) => {
  const updatedDayList = [];
  calendarRange.forEach((day) => {
    if (!isPastDate(day)) {
      updatedDayList.push(day.format('MM-DD-YYYY'));
    }
  });
  return updatedDayList;
};

export const filterAndPush = (prev, val) => {
  if (prev.includes(val)) {
    return prev.filter((value) => value !== val);
  }
  return [...prev, val];
};

export const isConsequetiveDates = (dateList) => {
  if (moment(last(dateList), 'MM-DD-YYYY').diff(moment(dateList[0], 'MM-DD-YYYY'), 'days') === dateList.length - 1) {
    return {
      isConsequetive: true,
    };
  }

  for (let i = 0; i < dateList.length - 1; i++) {
    if (moment(dateList[i + 1], 'MM-DD-YYYY').diff(moment(dateList[i], 'MM-DD-YYYY'), 'days') > 1) {
      return {
        isConsequetive: false,
        errorDateIndex: i,
        errorDate: dateList[i + 1],
      };
    }
  }
  return {};
};

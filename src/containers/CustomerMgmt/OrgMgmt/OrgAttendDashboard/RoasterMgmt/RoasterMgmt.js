/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
import React, {
  useEffect, useMemo, useState, useCallback, useRef,
} from 'react';
import cx from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';
import isArray from 'lodash/isArray';
import debounce from 'lodash/debounce';
import { useRouteMatch, useLocation } from 'react-router';
import moment from 'moment';
import { Input, Tooltip } from 'react-crux';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import styles from './RoasterMgmt.module.scss';
import Loader from '../../../../../components/Organism/Loader/Loader';
import ArrowLink from '../../../../../components/Atom/ArrowLink/ArrowLink';
import { getAttendSiteDetails } from '../SiteShiftMgmt/SiteDetails/Store/action';
import calendar from '../../../../../assets/icons/dateCalender.svg';
import {
  assignShiftColors,
  getDateRange, getShiftColor, getShiftTime, isShiftTimeElapsed, isToday, isPastDate, usePrevious, cellCommonStyles, fetchCountData, getSourceImage, filterAndPush,
} from './roasterHelper';
import expectedCount from '../../../../../assets/icons/expectedCount.svg';
import DayCell from './helper/dayCell/dayCell';
import PublishCell from './helper/publishCell/publishCell';
import CountCell from './helper/countCell/countCell';
import CollapsedCountCell from './helper/collpase/collapsedCounts';
import EmpCell from './helper/empCell/empCell';
import form from '../../../../../assets/icons/form.svg';
import resetIcon from '../../../../../assets/icons/resetIcon.svg';
import resetDisabled from '../../../../../assets/icons/resetDisable.svg';
import paste from '../../../../../assets/icons/paste.svg';
import pasteDisable from '../../../../../assets/icons/pasteDisable.svg';
import filter from '../../../../../assets/icons/filterCupIcon.svg';
import formChecked from '../../../../../assets/icons/formChecked.svg';
import eraser from '../../../../../assets/icons/eraser.svg';
import eraseDisable from '../../../../../assets/icons/eraseDisable.svg';
import deleteIcon from '../../../../../assets/icons/deleteWithBg.svg';
import emptyShift from '../../../../../assets/icons/emptyPlaceHolder.svg';
import AssignShift from './helper/assignShift/assignShift';
import {
  getEmployee,
  updateRoaster,
  deleteShiftData,
  getEmployeeProfilePic,
  getVendorData,
  getTotalExpectedEmpCount,
  postExpectedEmpCount,
  getHolidays,
  clearRoster,
  deleteExpectedEmpCount,
  applyLeave,
  clearError,
} from './Store/actions';
import WarningPopUp from '../../../../../components/Molecule/WarningPopUp/WarningPopUp';
import blueTick from '../../../../../assets/icons/blueLightTick.svg';
import arrow from '../../../../../assets/icons/rightArrow.svg';
import arrowLeft from '../../../../../assets/icons/arrowLeft.svg';
import dropdownArrow from '../../../../../assets/icons/arrowUp.svg';
import noFilter from '../../../../../assets/icons/filterEmptyState.svg';
import noEmp from '../../../../../assets/icons/emptyLeaveConfig.svg';
import noSearch from '../../../../../assets/icons/NoResultFound.svg';
import doubleTick from '../../../../../assets/icons/doubleTickGreen.svg';
import togglePink from '../../../../../assets/icons/togglePink.svg';
import copy from '../../../../../assets/icons/copy.svg';
import copyDisable from '../../../../../assets/icons/copyDisable.svg';
import RosterFilter from './RosterFilter/RosterFilter';
import defaultEmpPic from '../../../../../assets/icons/defaultPic.svg';
import EmpShiftCell from './helper/empShiftCell/EmpShiftCell';
import RosterEmpCount from './RoasterEmpCount/RosterEmpCountPopup';
import ConfigDropDown from './helper/copyDropDown/copyDropDown';
import { getDataById } from '../../OrgMgmtStore/action';
import yellowWarning from '../../../../../assets/icons/yellowWarningTriangle.svg';

const copyOptions = [
  {
    value: 'copy only counts',
  },
  {
    value: 'copy only shifts',
  },
  {
    value: 'copy week off',
  },
  {
    hide: true,
    value: 'copy entire week',
  },
];

const eraseOptions = [
  {
    value: 'clear counts only',
  },
  {
    value: 'clear shifts only',
  },
];

const loaderEmpCount = ['holidays', 'empCount', 'employee', 'vendorList'];
const loaderShift = ['INIT', 'LOADING'];

const initialState = {
  startDate: moment().startOf('week').add(1, 'd').format('MMM DD YYYY')
    .toLowerCase(),
  endDate: moment().endOf('week').add(1, 'd').format('MMM DD, YYYY')
    .toLowerCase(),
  calendarRange: getDateRange(moment().startOf('week').add(1, 'd')),
  searchValue: '',
  debouncedVal: '',
  isCountExpanded: false,
  showFilter: false,
  filterCount: 0,
  publishDate: false,
  showShiftAssign: false,
  focus: [],
  selectedEmp: {},
  selectedDate: '',
  vendorDataList: {},
  showEmpCountPopup: false,
  empCountDetails: {},
  selectedColumn: [],
  publishWarning: false,
  eraseWarning: false,
  isPublished: false,
  copyText: '',
  pasteText: 'select columns to paste',
  copiedData: {
    shift: [],
    count: [],
    weekOff: [],
  },
  displayCopyOptions: false,
  copyConfiguration: ['copy only counts', 'copy only shifts', 'copy week off'],
  eraseConfiguration: ['clear counts only', 'clear shifts only'],
  pasteMessageXPostion: [],
  isPastedSuccesfully: false,
  displayEraseOptions: false,
  leaveWarning: false,
  offWarning: false,
  shiftWarning: false,
};

const Roaster = () => {
  const [state, setState] = useState(initialState);
  const leavePostData = useRef({});
  const offPostData = useRef([]);
  const empLeaveData = useRef({});
  const shiftPostData = useRef({});
  const {
    startDate,
    endDate,
    calendarRange,
    searchValue,
    isCountExpanded,
    showFilter,
    filterCount,
    showShiftAssign,
    focus,
    selectedEmp,
    selectedDate,
    vendorDataList,
    showEmpCountPopup,
    empCountDetails,
    selectedColumn,
    publishWarning,
    isPublished,
    copyText,
    copiedData,
    pasteText,
    displayCopyOptions,
    copyConfiguration,
    pasteMessageXPostion,
    isPastedSuccesfully,
    displayEraseOptions,
    eraseConfiguration,
    eraseWarning,
    debouncedVal,
    leaveWarning,
    offWarning,
    shiftWarning,
  } = state;

  const match = useRouteMatch();
  const dispatch = useDispatch();
  const orgMgmtRState = useSelector((rstate) => get(rstate, 'orgMgmt', {}), shallowEqual);
  const { servicesEnabled } = get(orgMgmtRState, 'staticData', {});
  const { tagDetails = {}, shiftList, getSiteShiftListState } = get(orgMgmtRState, 'orgAttendDashboard.siteShiftMgmt.siteDetails', {});
  const {
    empList, empPics, totalEmpCountData, vendorData, loading, holidays, error,
  } = get(orgMgmtRState, 'orgAttendDashboard.roasterMgmt.roasterMgmt', {});
  const siteName = get(tagDetails, 'name', '').toLowerCase();
  const prevLoader = usePrevious(loading);
  const { siteId, uuid: orgId } = match.params;
  const location = useLocation();

  useEffect(() => {
    if (isEmpty(servicesEnabled)) {
      dispatch(getDataById(orgId));
    }
  },
  // eslint-disable-next-line
  []);

  const weekChange = (isNext) => {
    let start;
    let end;
    empLeaveData.current = {};
    if (isNext) {
      start = moment(startDate, 'MMM DD YYYY').add(1, 'week').format('MMM DD YYYY').toLowerCase();
      end = moment(endDate, 'MMM DD YYYY').add(1, 'week').format('MMM DD, YYYY').toLowerCase();
    } else {
      start = moment(startDate, 'MMM DD YYYY').subtract(1, 'week').format('MMM DD YYYY').toLowerCase();
      end = moment(endDate, 'MMM DD YYYY').subtract(1, 'week').format('MMM DD, YYYY').toLowerCase();
    }
    dispatch(getEmployee({
      orgId,
      siteId,
      startDate: moment(start, 'MMM DD YYYY').format('YYYY-MM-DD'),
      endDate: moment(end, 'MMM DD YYYY').format('YYYY-MM-DD'),
    }));
    setState((prev) => ({
      ...prev,
      startDate: start,
      endDate: end,
      calendarRange: getDateRange(moment(start, 'MMM DD YYYY')),
      selectedColumn: [],
    }));
  };
  const debouncedSearch = debounce(() => {
    setState((prev) => ({
      ...prev,
      debouncedVal: prev.searchValue,
    }));
  }, 700, { trailing: true });

  const search = (e) => {
    setState((prev) => ({
      ...prev,
      searchValue: e,
    }));
    debouncedSearch();
  };

  const expandCountTable = () => {
    setState((prev) => ({
      ...prev,
      isCountExpanded: !prev.isCountExpanded,
    }));
  };

  const toggleEmpCountPopup = (countData, resetStatus) => {
    setState((prev) => ({
      ...prev,
      showEmpCountPopup: !prev.showEmpCountPopup,
      empCountDetails: countData,
    }));
    if (resetStatus) {
      dispatch(getTotalExpectedEmpCount({
        orgId,
        siteId,
        startDate: moment(startDate, 'MMM DD YYYY').format('YYYY-MM-DD'),
        endDate: moment(endDate, 'MMM DD, YYYY').format('YYYY-MM-DD'),
      }));
    }
  };

  useEffect(() => {
    const targetUrl = location.search;
    const urlSearchParams = new URLSearchParams(targetUrl);
    const tagId = urlSearchParams.get('tags');
    const vendorId = urlSearchParams.get('vendor');
    dispatch(getEmployee({
      orgId,
      siteId,
      startDate: moment(startDate, 'MMM DD YYYY').format('YYYY-MM-DD'),
      endDate: moment(endDate, 'MMM DD YYYY').format('YYYY-MM-DD'),
      tagId,
      vendorId,
      key: debouncedVal,
    }));
    // eslint-disable-next-line
  }, [location.search, debouncedVal])

  useEffect(() => {
    if (!siteName) dispatch(getAttendSiteDetails(orgId, siteId));
    dispatch(getVendorData(orgId));
    if (moment(startDate, 'MMM DD YYYY').format('YYYY') === moment(endDate, 'MMM DD YYYY').format('YYYY')) {
      dispatch(getHolidays({ orgId, siteId, year: moment(startDate, 'MMM DD YYYY').format('YYYY') }));
    } else {
      dispatch(getHolidays({ orgId, siteId, year: moment(startDate, 'MMM DD YYYY').format('YYYY') }));
      dispatch(getHolidays({ orgId, siteId, year: moment(endDate, 'MMM DD YYYY').format('YYYY') }));
    }
    // eslint-disable-next-line
  }, [])

  // assign shift colors based on shift length
  useMemo(() => {
    for (let i = 0; i < shiftList.length; i++) {
      assignShiftColors(shiftList[i]._id, i);
    }
  }, [shiftList]);

  useEffect(() => {
    const targetUrl = location.search;
    const urlSearchParams = new URLSearchParams(targetUrl);
    const urlTags = urlSearchParams.get('tags');
    const urlVendors = urlSearchParams.get('vendor');
    let count = 0;
    if (!isEmpty(urlTags)) {
      count = urlTags.split(',').length;
    }
    if (!isEmpty(urlVendors)) {
      count += urlVendors.split(',').length;
    }
    setState((prev) => ({
      ...prev,
      filterCount: count,
    }));
  }, [location.search]);

  useEffect(() => {
    const pics = empList.map((emp) => ({ uuid: emp.uuid, pic: emp.profilePicUrl }));
    dispatch(getEmployeeProfilePic(pics));
    // eslint-disable-next-line
  }, [empList.length]);

  const onPublish = ({ type }) => {
    if (type === 'publish' || type === 'reset') {
      const empIds = [];
      const assignDates = selectedColumn.map((date) => moment(date, 'MM-DD-YYYY').format('YYYY-MM-DD'));
      empList.forEach((emp) => get(emp, 'rosterData', []).forEach((roster) => {
        if (assignDates.includes(roster.assignDate) && !empIds.includes(roster.empId)) empIds.push(roster.empId);
      }));
      dispatch(updateRoaster({
        type: `${type}`,
        empIds,
        orgId,
        siteId,
        startDate: moment(startDate, 'MMM DD YYYY').format('YYYY-MM-DD'),
        endDate: moment(endDate, 'MMM DD YYYY').format('YYYY-MM-DD'),
        loading: type,
        assignDates,
      }));
    }
    setState((prev) => ({
      ...prev,
      publishWarning: false,
    }));
  };

  const onClickEmpShiftCell = ({
    type, emp, date, id,
  }) => {
    let udpatedState = {};
    const empId = emp.uuid;
    switch (type) {
      case 'addFirst': udpatedState = {
        showShiftAssign: 'add',
        focus: [{ emp, date }],
        selectedEmp: emp,
        selectedDate: date,
      };
        break;
      case 'edit': udpatedState = {
        showShiftAssign: 'edit',
        focus: [{ emp, date }],
        selectedEmp: emp,
        selectedDate: date,
      };
        break;
      case 'delete':
        dispatch(deleteShiftData({
          empId,
          id,
          siteId,
          orgId,
          date: moment(date, 'MM-DD-YYYY').format('YYYY-MM-DD'),
          startDate: moment(startDate, 'MMM DD YYYY').format('YYYY-MM-DD'),
          endDate: moment(endDate, 'MMM DD YYYY').format('YYYY-MM-DD'),
        }));
        break;
      default: break;
    }
    setState((prev) => ({
      ...prev,
      ...udpatedState,
    }));
  };

  const onClickAssignShift = ({ type, dateList, val }) => {
    let udpatedState = {};
    const newFocus = [];
    switch (type) {
      case 'cancel': udpatedState = {
        showShiftAssign: false,
        focus: [],
      };
        break;
      case 'assign': udpatedState = {
        showShiftAssign: false,
        focus: [],
      };
        break;
      case 'calendar':
        dateList.forEach((date) => newFocus.push({ emp: selectedEmp, date }));
        udpatedState = {
          focus: newFocus,
        };
        break;
      case 'leave':
        leavePostData.current = val;
        udpatedState = {
          leaveWarning: true,
        };
        break;
      case 'off':
        offPostData.current = val;
        udpatedState = {
          offWarning: true,
        };
        break;
      case 'shift':
        shiftPostData.current = val;
        udpatedState = {
          shiftWarning: true,
        };
        break;
      default: break;
    }
    setState((prev) => ({
      ...prev,
      ...udpatedState,
    }));
  };

  const handleRemoveFilter = () => {
    setState((prev) => ({
      ...prev,
      showFilter: false,
    }));
  };

  const handleToggleFilter = () => {
    setState({
      ...state,
      showFilter: !showFilter,
    });
  };

  const vendorDataCreation = useCallback(() => {
    const vendorObj = {};
    if (!isEmpty(vendorData.vendors)) {
      vendorData.vendors.forEach((vendor) => {
        vendorObj[vendor._id] = vendor.name.toLowerCase();
      });
    }
    setState((prev) => ({
      ...prev,
      vendorDataList: vendorObj,
    }));
  }, [vendorData]);

  useEffect(() => {
    vendorDataCreation();
    // eslint-disable-next-line
  }, [vendorData]);

  const onDateClick = ({ date, ref }) => {
    if (copiedData.shift.length || copiedData.weekOff.length || copiedData.count.length) {
      setState((prev) => ({
        ...prev,
        selectedColumn: filterAndPush(prev.selectedColumn, date).sort((a, b) => moment(a, 'MM-DD-YYYY') - moment(b, 'MM-DD-YYYY')),
        pasteMessageXPostion: filterAndPush(prev.pasteMessageXPostion, ref.getBoundingClientRect().x),
      }));
    } else {
      setState((prev) => ({
        ...prev,
        selectedColumn: filterAndPush(prev.selectedColumn, date).sort((a, b) => moment(a, 'MM-DD-YYYY') - moment(b, 'MM-DD-YYYY')),
      }));
    }
  };

  const displayWarning = (val) => {
    setState((prev) => ({
      ...prev,
      [val]: true,
      displayEraseOptions: false,
    }));
  };

  useEffect(() => {
    // loader logic for publish and reset
    const listenLoader = ['publish', 'reset'];
    if (!listenLoader.includes(loading) && listenLoader.includes(prevLoader)) {
      setState((prev) => ({
        ...prev,
        selectedColumn: [],
        isPublished: prevLoader === 'publish',
      }));
    }
    // loader logic for employee count
    const maskLoader = ['vendorList', 'expectedEmpCount', null, 'empCountPost', 'deleteExpectedCount'];
    if (showEmpCountPopup && !maskLoader.includes(loading)) {
      setState((prev) => ({
        ...prev,
        showEmpCountPopup: false,
      }));
    }
    // loader logic for pasting
    if (loading === null && prevLoader === 'paste') {
      setState((prev) => ({
        ...prev,
        isPastedSuccesfully: true,
      }));
    }
  },
  // eslint-disable-next-line
  [loading]);

  // display publish success for 5 seconds
  useEffect(() => {
    if (isPublished) {
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          isPublished: false,
        }));
      }, 5000);
    }
  }, [isPublished]);

  // display paste success for 5 seconds
  useEffect(() => {
    if (isPastedSuccesfully) {
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          isPastedSuccesfully: false,
          pasteMessageXPostion: [],
        }));
      }, 5000);
    }
  }, [isPastedSuccesfully]);

  const onCopy = (selectedValues) => {
    const data = [];
    const countData = [];
    const weekOffData = [];
    let cText = '';
    let pText = 'select columns to paste';
    const isValidSelection = moment(last(selectedValues), 'MM-DD-YYYY').diff(moment(selectedValues[0], 'MM-DD-YYYY'), 'days') === selectedValues.length - 1;
    if (isValidSelection) {
      selectedValues.forEach((date, dIndex) => {
        if (copyConfiguration.includes('copy only shifts')) {
          empList.forEach((emp) => {
            const shifts = [];
            get(emp, 'rosterData', [])
              .forEach((roster) => {
                if (moment(roster.assignDate, 'YYYY-MM-DD').format('MM-DD-YYYY') === date && roster.shiftId) {
                  shifts.push(roster.shiftId);
                }
              });
            if (shifts.length) {
              data.push({
                empId: emp.uuid, source_org: emp.source_org, shiftIds: shifts, assignDate: moment(date, 'MM-DD-YYYY').format('YYYY-MM-DD'), dIndex,
              });
            }
          });
        }
        if (copyConfiguration.includes('copy only counts')) {
          totalEmpCountData.forEach((count) => {
            get(count, 'expectedEmpCountDetails', []).forEach((details) => {
              if (moment(details.assignDate, 'YYYY-MM-DD').format('MM-DD-YYYY') === date && isArray(details.vendors)) {
                countData.push({
                  expectedEmpCount: details.expectedEmpCount,
                  assignDates: [details.assignDate],
                  vendors: [...details.vendors],
                  shiftIds: [details.shiftId],
                });
              }
            });
          });
        }
        if (copyConfiguration.includes('copy week off')) {
          empList.forEach((emp) => {
            get(emp, 'rosterData', [])
              .forEach((roster) => {
                if (moment(roster.assignDate, 'YYYY-MM-DD').format('MM-DD-YYYY') === date && (roster.type === 'WEEKLY_OFF' || roster.type === 'REST_DAY')) {
                  weekOffData.push({
                    empId: emp.uuid, assignDate: moment(date, 'MM-DD-YYYY').format('YYYY-MM-DD'), dIndex, type: roster.type,
                  });
                }
                // } else if (moment(roster.assignDate, 'YYYY-MM-DD').format('MM-DD-YYYY') === date) weekOffData.push(null);
              });
          });
        }
      });

      const value = selectedValues.length > 1 ? `${moment(selectedValues[0], 'MM-DD-YYYY').format('ddd')}-
      ${moment(last(selectedValues), 'MM-DD-YYYY').format('ddd')} of week ${moment(startDate).format('MMM DD').toLowerCase()} `
        : `${moment(selectedValues[0], 'MM-DD-YYYY').format('ddd')} of week ${moment(startDate).format('MMM DD').toLowerCase()} `;
      cText = `entire columns for is ${value} copied`;
      pText = selectedValues.length ? `click to paste columns of ${value}` : `select any coulns to paste entire columns from ${value}`;
    } else {
      cText = 'invalid selection, select continues dates';
    }
    setState((prev) => ({
      ...prev,
      copyText: cText,
      pasteText: pText,
      selectedColumn: [],
      copiedData: { shift: data, count: countData, weekOff: weekOffData },
      displayCopyOptions: false,
    }));
  };

  const onPaste = () => {
    let date = '';
    const pasteValue = [];
    const pastCountValue = [];
    const pasteWeekValue = [];
    let data = [];
    const { shift, count, weekOff } = copiedData;
    for (let i = 0; i < shift.length; i++) {
      if (date === shift[i].assignDate) {
        data.push(shift[i]);
        date = shift[i].assignDate;
      } else {
        if (data.length) pasteValue.push(data);
        data = [];
        data.push(shift[i]);
        date = shift[i].assignDate;
      }
    }
    pasteValue.push(data);
    data = [];
    date = '';
    for (let i = 0; i < count.length; i++) {
      if (count[i].assignDates.includes(date)) {
        data.push(count[i]);
        date = count[i].assignDates[0];
      } else {
        if (data.length) pastCountValue.push(data);
        data = [];
        data.push(count[i]);
        date = count[i].assignDates[0];
      }
    }
    pastCountValue.push(data);
    data = [];
    date = '';
    for (let i = 0; i < weekOff.length; i++) {
      if (get(weekOff[i], 'assignDate', '') === date) {
        data.push(weekOff[i]);
        date = weekOff[i].assignDate;
      } else if (get(weekOff[i], 'assignDate', '')) {
        if (data.length) pasteWeekValue.push(data);
        data = [];
        data.push(weekOff[i]);
        date = weekOff[i].assignDate;
      }
    }
    pasteWeekValue.push(data);

    const pasteData = [];
    const pasteCountData = [];
    const pasteWeekOffDate = [];
    const pasteRestDay = [];

    pasteValue.forEach((pData, index) => {
      if (index < selectedColumn.length) {
        pData.forEach((val) => {
          if (moment(selectedColumn[val.dIndex], 'MM-DD-YYYY').isValid()) {
            const obj = { ...val, assignDate: moment(selectedColumn[val.dIndex], 'MM-DD-YYYY').format('YYYY-MM-DD') };
            delete obj.dIndex;
            pasteData.push(obj);
          }
        });
      }
    });
    pastCountValue.forEach((cData, index) => {
      cData.forEach((val) => {
        pasteCountData.push({ ...val, assignDates: [moment(selectedColumn[index], 'MM-DD-YYYY').format('YYYY-MM-DD')] });
      });
    });
    pasteWeekValue.forEach((cData, index) => {
      if (index <= selectedColumn.length) {
        cData.forEach((val) => {
          if (moment(selectedColumn[val.dIndex], 'MM-DD-YYYY').isValid()) {
            const obj = { ...val, assignDate: moment(selectedColumn[val.dIndex], 'MM-DD-YYYY').format('YYYY-MM-DD') };
            delete obj.dIndex;
            if (obj.type === 'WEEKLY_OFF') {
              delete obj.type;
              pasteWeekOffDate.push(obj);
            } else if (obj.type === 'REST_DAY') {
              delete obj.type;
              pasteRestDay.push(obj);
            }
          }
        });
      }
    });
    const payload = {
      expectedEmpCountList: pasteCountData,
    };
    dispatch(updateRoaster({
      type: 'draft',
      orgId,
      siteId,
      shiftList: pasteData,
      weeklyOffList: pasteWeekOffDate,
      restDayList: pasteRestDay,
      startDate: moment(startDate, 'MMM DD YYYY').format('YYYY-MM-DD'),
      endDate: moment(endDate, 'MMM DD YYYY').format('YYYY-MM-DD'),
      loading: 'paste',
      isCopy: true,
    }));
    if (pasteCountData.length) dispatch(postExpectedEmpCount(orgId, siteId, payload, moment(startDate, 'MMM DD YYYY').format('YYYY-MM-DD'), moment(endDate, 'MMM DD YYYY').format('YYYY-MM-DD'), 'paste'));
    setState((prev) => ({
      ...prev,
      selectedColumn: [],
      copiedData: {
        shift: [],
        count: [],
        weekOff: [],
      },
      copyText: '',
      pasteText: 'select columns to paste',
    }));
  };

  const onOption = (val) => {
    setState((prev) => ({
      ...prev,
      [val]: !prev[val],
    }));
  };

  const onChangeConfig = (value) => {
    let config = [...copyConfiguration];
    config = filterAndPush(config, value);
    if (value === 'copy entire week') {
      const selected = calendarRange.map((date) => date.format('MM-DD-YYYY'));
      onCopy(selected);
    } else {
      setState((prev) => ({
        ...prev,
        copyConfiguration: config,
      }));
    }
  };

  const onChangeEraseConfig = (value) => {
    let config = [...eraseConfiguration];
    config = filterAndPush(config, value);
    setState((prev) => ({
      ...prev,
      eraseConfiguration: config,
    }));
  };

  const onEraseConfirm = ({ type }) => {
    const empIds = [];
    let assignDates;
    let shiftIds;
    switch (type) {
      case 'erase':
        assignDates = selectedColumn.map((date) => moment(date, 'MM-DD-YYYY').format('YYYY-MM-DD'));
        if (eraseConfiguration.includes('clear shifts only')) {
          empList.forEach((emp) => get(emp, 'rosterData', []).forEach((roster) => {
            if (assignDates.includes(roster.assignDate) && !empIds.includes(roster.empId)) empIds.push(roster.empId);
          }));
          if (empIds.length) {
            dispatch(clearRoster({
              orgId,
              siteId,
              startDate: moment(startDate, 'MMM DD YYYY').format('YYYY-MM-DD'),
              endDate: moment(endDate, 'MMM DD YYYY').format('YYYY-MM-DD'),
              empIds,
              assignDates,
            }));
          }
        }
        if (eraseConfiguration.includes('clear counts only')) {
          shiftIds = shiftList.map(({ _id }) => _id);
          dispatch(deleteExpectedEmpCount({
            orgId,
            siteId,
            shiftIds,
            assignDates,
            startDate: moment(startDate, 'MMM DD YYYY').format('YYYY-MM-DD'),
            endDate: moment(endDate, 'MMM DD YYYY').format('YYYY-MM-DD'),
          }));
        }
        setState((prev) => ({
          ...prev,
          selectedColumn: [],
          eraseWarning: false,
        }));
        break;
      case 'cancel':
        setState((prev) => ({
          ...prev,
          eraseWarning: false,
          selectedColumn: [],
        }));
        break;

      default: break;
    }
  };

  const onLeaveApply = ({ type }) => {
    switch (type) {
      case 'apply':
        dispatch(applyLeave({
          orgId,
          siteId,
          empId: selectedEmp.uuid,
          startDate: moment(startDate, 'MMM DD YYYY').format('YYYY-MM-DD'),
          endDate: moment(endDate, 'MMM DD YYYY').format('YYYY-MM-DD'),
          leaveList: leavePostData.current,
          loading: 'leave',
        }));
        break;
      default: break;
    }
    setState((prev) => ({
      ...prev,
      leaveWarning: false,
    }));
  };

  const onOffApply = ({ type }) => {
    switch (type) {
      case 'apply':
        dispatch(updateRoaster({
          type: 'draft',
          weeklyOffList: offPostData.current.weeklyOffList,
          restDayList: offPostData.current.restDayList,
          orgId,
          siteId,
          empId: selectedEmp.uuid,
          startDate: moment(startDate, 'MMM DD YYYY').format('YYYY-MM-DD'),
          endDate: moment(endDate, 'MMM DD YYYY').format('YYYY-MM-DD'),
          leaveList: leavePostData.current,
        }));
        break;
      default: break;
    }
    setState((prev) => ({
      ...prev,
      offWarning: false,
    }));
  };

  const onShiftApply = ({ type }) => {
    switch (type) {
      case 'apply':
        dispatch(updateRoaster({
          type: 'draft',
          orgId,
          siteId,
          shiftList: shiftPostData.current.draftList,
          startDate: moment(startDate, 'MMM DD YYYY').format('YYYY-MM-DD'),
          endDate: moment(endDate, 'MMM DD YYYY').format('YYYY-MM-DD'),
        }));
        break;
      default: break;
    }
    setState((prev) => ({
      ...prev,
      shiftWarning: false,
    }));
  };

  const { display, ...propupConfig } = useMemo(() => {
    if (publishWarning) {
      return {
        display: true,
        text: 'are you sure you want to publish?',
        para: (
          <span style={{ fontSize: '14px' }}>
            you are publishing changes for
            {!isEmpty(selectedColumn) && selectedColumn.length > 1
              ? <strong>{`${moment(selectedColumn[0], 'MM-DD-YYYY').format('DD MMM YYYY').toLowerCase()} - ${moment(last(selectedColumn), 'MM-DD-YYYY').format('DD MMM YYYY').toLowerCase()} `}</strong>
              : <strong>{moment(selectedColumn[0], 'MM-DD-YYYY').format('DD MMM YYYY').toLowerCase()}</strong>}
            <br />
            once published it will be reflected in the reports
            <br />
          </span>
        ),
        confirmText: 'yes, publish',
        cancelText: 'go back',
        icon: blueTick,
        warningPopUp: () => onPublish({ type: 'publish' }),
        closePopup: () => onPublish({ type: 'cancel' }),
        isAlert: true,
        highlightText: 'you can edit the roster for future date and time',
      };
    }
    if (eraseWarning) {
      return {
        display: true,
        text: 'are you sure?',
        para: (
          <span style={{ fontSize: '14px' }}>
            are you sure want to clear the selected columns?
          </span>
        ),
        confirmText: 'yes, clear',
        cancelText: 'cancel',
        icon: deleteIcon,
        warningPopUp: () => onEraseConfirm({ type: 'erase' }),
        closePopup: () => onEraseConfirm({ type: 'cancel' }),
        highlightText: 'All the shifts and expected count will be cleared on cofirming',
      };
    }

    if (leaveWarning) {
      return {
        display: true,
        text: 'are you sure you want to apply leave?',
        para: (
          <div style={{ fontSize: '12px', margin: '0 0 10px 0' }}>
            <div style={{ height: '50px' }}>
              <span style={{ fontSize: '14px' }}>
                you are appying sick leave for
                {' '}
                <strong>1 employee</strong>
                {' '}
                on
                {' '}
                <strong>{moment(leavePostData.current.startDate, 'YYYY-MM-DD').format('DD MMM YY')}</strong>
                {' '}
                once applied it will
              </span>
            </div>
            <div className="">
              <span className="p-2 mt-2" style={{ backgroundColor: '#EDF7ED' }}>
                <img src={doubleTick} alt="tick" className="pr-2" height="18px" />
                directly publish leave and will be deducted from quota
              </span>
            </div>
          </div>
        ),
        confirmText: 'yes, apply leave',
        cancelText: 'cancel',
        icon: blueTick,
        warningPopUp: () => onLeaveApply({ type: 'apply' }),
        closePopup: () => onLeaveApply({ type: 'cancel' }),
        isAlert: true,
      };
    }
    if (offWarning) {
      if (showShiftAssign === 'edit') {
        return {
          display: true,
          text: 'are you sure you want to apply off?',
          para: (
            <div style={{ fontSize: '12px', margin: '0 0 10px 0' }}>
              <div style={{ height: '50px' }}>
                <span style={{ fontSize: '14px' }}>
                  you are appying off for
                  {' '}
                  <strong>1 employee</strong>
                  {' '}
                  on
                  {' '}
                  <strong>{moment(offPostData.current.startDate, 'YYYY-MM-DD').format('DD MMM YY')}</strong>
                  {offPostData.current.endDate !== offPostData.current.startDate
                 && (
                 <strong>
                   &nbsp;-
                   {moment(offPostData.current.endDate, 'YYYY-MM-DD').format('DD MMM YY')}
                 </strong>
                 )}
                  {' '}
                  once applied it will
                </span>
              </div>
              <div style={{ height: '37px' }}>
                <span className="p-2 mb-2 mt-2" style={{ backgroundColor: '#F7EDF0' }}>
                  <img src={togglePink} alt="tick" className="pr-2" height="18px" />
                  override the already assigned date for the day
                </span>
              </div>
            </div>
          ),
          confirmText: 'yes, override',
          cancelText: 'cancel',
          icon: blueTick,
          warningPopUp: () => onOffApply({ type: 'apply' }),
          closePopup: () => onOffApply({ type: 'cancel' }),
          isAlert: true,
        };
      }
      onOffApply({ type: 'apply' });
      return {
        display: false,
      };
    }
    if (shiftWarning) {
      if (showShiftAssign === 'edit') {
        return {
          display: true,
          text: 'are you sure you want to assign shift(s)?',
          para: (
            <div style={{ fontSize: '12px', margin: '0 0 10px 0' }}>
              <div style={{ height: '50px' }}>
                <span style={{ fontSize: '14px' }}>
                  you are appying shifts for
                  {' '}
                  <strong>1 employee</strong>
                  {' '}
                  on
                  {' '}
                  <strong>{moment(shiftPostData.current.startDate, 'YYYY-MM-DD').format('DD MMM YY')}</strong>
                  {offPostData.current.endDate !== shiftPostData.current.startDate
                 && (
                 <strong>
                   &nbsp;-
                   {moment(shiftPostData.current.endDate, 'YYYY-MM-DD').format('DD MMM YY')}
                 </strong>
                 ) }
                  {' '}
                  once applied it will
                </span>
              </div>
              <div style={{ height: '37px' }}>
                <span className="p-2 mb-2 mt-2" style={{ backgroundColor: '#F7EDF0' }}>
                  <img src={togglePink} alt="tick" className="pr-2" height="18px" />
                  override the already assigned date for the day
                </span>
              </div>
            </div>
          ),
          confirmText: 'yes, assign shift',
          cancelText: 'cancel',
          icon: blueTick,
          warningPopUp: () => onShiftApply({ type: 'apply' }),
          closePopup: () => onShiftApply({ type: 'cancel' }),
          isAlert: true,
        };
      }
      onShiftApply({ type: 'apply' });
      return {
        display: false,
      };
    }
    if (error.leave) {
      return {
        display: true,
        text: 'cant apply leave',
        para: (
          <span style={{ fontSize: '14px' }}>
            {error.leave}
          </span>
        ),
        confirmText: 'okay',
        icon: yellowWarning,
        warningPopUp: () => dispatch(clearError({ key: 'leave' })),
        isAlert: true,
        centerAlignButton: true,
      };
    }
    return {
      display: false,
    };
    // eslint-disable-next-line
  }, [publishWarning, eraseWarning, leaveWarning, offWarning, shiftWarning, error.leave]);

  const pasteMessagePostion = useMemo(() => pasteMessageXPostion.reduce((acc, val) => acc + val, 0)
  / pasteMessageXPostion.length,
  // eslint-disable-next-line
  [pasteMessageXPostion.length]);

  const getEmptyState = () => {
    const targetUrl = location.search;
    const urlSearchParams = new URLSearchParams(targetUrl);
    const urlTags = urlSearchParams.get('tags');
    const urlVendors = urlSearchParams.get('vendor');
    if ((urlTags != null && urlTags.length !== 0) || (urlVendors != null && urlVendors.length !== 0)) {
      return {
        img: noFilter,
        text: 'no employees found based on applied filters',
      };
    } if (!isEmpty(searchValue)) {
      return {
        img: noSearch,
        text: `no employee with name/id ‘${searchValue}’.`,
      };
    } return {
      img: noEmp,
      text: 'no employees assigned to site',
    };
  };

  return (
    <div className={cx(styles.alignCenter, scrollStyle.scrollbar)}>
      {display
        && (
          <WarningPopUp
            {...propupConfig}
            className={styles.popUpWidth}
          />
        ) }

      <div className="pt-2">
        <div style={{ width: 'fit-content' }}>
          <ArrowLink
            label={siteName}
            url={`/customer-mgmt/org/${orgId}/site/${siteId}/shift`}
          />
        </div>
        <div className="d-flex row m-2">
          <div>
            <div className="p-0 row m-0">
              <div>
                <span className={cx(styles.siteHeading)}>{siteName}</span>
              </div>
              <div className={cx(styles.siteNumber, 'ml-3')}>
                <span>
                  {empList.length}
                  {' '}
                  emp
                </span>
              </div>
              <div className={cx('ml-3', styles.dateSelectorArea)}>
                <div className={cx(styles.dateSelector)}>
                  <span onClick={() => weekChange(false)} className={cx('pt-2 pb-2 pr-2', styles.pointer)} role="button" tabIndex={0} aria-hidden>
                    <img src={arrow} alt="arrow" style={{ transform: 'rotate(90deg)' }} height="7px" />
                  </span>
                  <span className={cx(styles.week)}>
                    <img src={calendar} alt="calendar" className="pr-2" />
                    {moment(startDate).format('MMM DD').toLowerCase()}
                    <img
                      src={arrowLeft}
                      alt="arrowLeft"
                      style={{
                        transform: 'rotate(180deg)', marginLeft: '14px', marginRight: '14px', height: '10px',
                      }}
                    />
                    {endDate}
                  </span>
                  <span onClick={() => weekChange(true)} className={cx('pt-2 pb-2 pl-2', styles.pointer)} role="button" tabIndex={0} aria-hidden>
                    <img src={arrow} alt="arrow" style={{ transform: 'rotate(-90deg)' }} height="7px" />
                  </span>

                </div>
              </div>
            </div>
          </div>
          <div className="d-flex row m-0 flex-grow-1">
            <div className="ml-3 pt-1 d-flex">
              <span data-tip="copy" data-for="copy">
                <div
                  className={cx(styles.copyDiv, {
                    [`${styles.disabled}`]: !selectedColumn.length,
                  })}
                  role="button"
                  aria-hidden
                  onClick={selectedColumn.length ? () => onCopy(selectedColumn) : null}
                >
                  <img height="25px" src={selectedColumn.length ? copy : copyDisable} alt="copy" />
                </div>

                <Tooltip id="copy" type="info" place="top" delayShow={300} tooltipClass={styles.tooltipClass}>
                  {!copyText ? (
                    <span className={styles.tooltip}>
                      {selectedColumn.length ? 'copy selected columns' : 'select column to copy'}
                    </span>
                  )
                    : (
                      <span className={styles.tooltip}>
                        {copyText}
                      </span>
                    ) }
                </Tooltip>
              </span>
              <div className="position-relative">
                <div
                  className={cx(styles.copyOption)}
                  role="button"
                  aria-hidden
                  onClick={() => onOption('displayCopyOptions')}
                >
                  <img src={dropdownArrow} alt="arrow" style={{ transform: !displayCopyOptions && 'rotate(180deg)' }} height="5px" />

                </div>

                {displayCopyOptions && (
                <ConfigDropDown
                  checkboxes={copyOptions}
                  config={copyConfiguration}
                  onChange={onChangeConfig}
                  onBlur={() => onOption('displayCopyOptions')}
                />
                )}
              </div>
            </div>
            <div className="ml-3 pt-1" style={{ cursor: 'pointer' }}>
              <span data-tip="paste" data-for="paste">
                <div
                  className={cx({
                    [`${styles.disabled}`]: !selectedColumn.length || !(copiedData.shift.length || copiedData.count.length || copiedData.weekOff.length) || selectedColumn.some((date) => isPastDate(moment(date, 'MM-DD-YYYY'))),
                  })}
                  role="button"
                  aria-hidden
                  onClick={!selectedColumn.length || !(copiedData.shift.length || copiedData.count.length || copiedData.weekOff.length) || selectedColumn.some((date) => isPastDate(moment(date, 'MM-DD-YYYY'))) ? null : onPaste}
                >
                  <img src={selectedColumn.length ? paste : pasteDisable} alt="paste" height="32" />
                </div>
                <Tooltip id="paste" type="info" place="top" delayShow={300} tooltipClass={styles.tooltipClass}>
                  <span className={styles.tooltip}>
                    {selectedColumn.some((date) => isPastDate(moment(date, 'MM-DD-YYYY'))) ? 'past date cannot be pasted' : pasteText}
                  </span>
                </Tooltip>
              </span>
            </div>
            <div className="ml-3 pt-1 d-flex">
              <span data-tip="erase" data-for="erase">
                <div
                  className={cx(styles.copyDiv, {
                    [`${styles.disabled}`]: !selectedColumn.length,
                  })}
                  role="button"
                  aria-hidden
                  onClick={selectedColumn.length ? () => displayWarning('eraseWarning') : null}
                >
                  <img src={selectedColumn.length ? eraser : eraseDisable} alt="erase" height="25" />
                </div>

                <Tooltip id="erase" type="info" place="top" delayShow={300} tooltipClass={styles.tooltipClass}>
                  <span className={styles.tooltip}>
                    {selectedColumn.length ? 'erase selected columns' : 'select column to erase'}
                  </span>
                </Tooltip>
              </span>
              <div className="position-relative">
                <div
                  className={cx(styles.copyOption)}
                  role="button"
                  aria-hidden
                  onClick={() => onOption('displayEraseOptions')}
                >
                  <img src={dropdownArrow} alt="arrow" style={{ transform: !displayEraseOptions && 'rotate(180deg)' }} height="5px" />
                </div>

                {displayEraseOptions && (
                <ConfigDropDown
                  checkboxes={eraseOptions}
                  config={eraseConfiguration}
                  onChange={onChangeEraseConfig}
                  onBlur={() => onOption('displayEraseOptions')}
                />
                )}
              </div>
            </div>
            <div className="ml-3 pt-1">
              <span data-tip="reset" data-for="reset">
                <div
                  className={cx(styles.resetDiv, {
                    [`${styles.disabled}`]: !selectedColumn.length,
                  })}
                  role="button"
                  aria-hidden
                  onClick={() => selectedColumn.length && onPublish({
                    type: 'reset',
                    date: moment(selectedColumn[0], 'MM-DD-YYYY').format('YYYY-MM-DD'),
                  })}
                >
                  <img src={selectedColumn.length ? resetIcon : resetDisabled} alt="reset" height="26px" />
                </div>
                <Tooltip id="reset" type="info" place="top" delayShow={300} tooltipClass={styles.tooltipClass}>
                  <span className={styles.tooltip}>
                    {selectedColumn.length ? 'reset selected changes' : 'select column to reset'}
                  </span>
                </Tooltip>
              </span>
            </div>

            <div className="ml-2 d-flex flex-grow-1 justify-content-end">
              <PublishCell
                isLoading={loading === 'publish'}
                isPublished={isPublished}
                isSelected={selectedColumn.length && loading !== 'publish' && !selectedColumn.some((date) => isPastDate(moment(date, 'MM-DD-YYYY')))}
                onPublishClick={() => displayWarning('publishWarning')}
              />
            </div>
          </div>
        </div>
        { isPastedSuccesfully
          && (
          <div className={styles.pasteMessage} style={{ left: pasteMessagePostion }}>
            succesfully pasted
          </div>
          ) }
        {
          showFilter
          && (
          <div style={{ position: 'relative' }}>
            <RosterFilter isEdit handleCloseFilter={() => handleRemoveFilter()} empLength={empList.length} />
          </div>
          )
        }
        <table className={cx(styles.commonTable)}>
          <tbody>
            <tr className={cx(styles.tRow)}>
              <td className={cx(styles.tdCell, styles.firstCell)}>
                <div className={cx('d-flex', styles.searchCell)}>
                  <Input
                    placeholder="search for employee"
                    isSearch
                    className={styles.searchInputWrapper}
                    inputClass={styles.searchInput}
                    onChange={search}
                    value={searchValue}
                  />
                  <div className={styles.filterIcon}>
                    {filterCount > 0 && <div className={styles.filterCount}>{filterCount}</div>}
                    <img src={filter} alt="expand" height="28px" aria-hidden onClick={() => handleToggleFilter()} />
                  </div>
                </div>
              </td>
              {
                calendarRange.map((date, index) => {
                  const isHoliday = get(holidays, `${date.format('YYYY')}`, []).some((holiday) => moment(holiday.startDate, 'YYYY-MM-DD').isSame(date)
                  || moment(holiday.endDate, 'YYYY-MM-DD').isSame(date)
                  || (date.isAfter(moment(holiday.startDate, 'YYYY-MM-DD')) && date.isBefore(moment(holiday.endDate, 'YYYY-MM-DD'))));
                  const isColumnSelectedForPublish = [
                    // today
                    selectedColumn.includes(date.format('MM-DD-YYYY')),
                    // tomorrow
                    !!calendarRange[index + 1] && selectedColumn.includes(calendarRange[index + 1].format('MM-DD-YYYY')),
                    // yesterday
                    !!calendarRange[index - 1] && selectedColumn.includes(calendarRange[index - 1].format('MM-DD-YYYY')),
                  ];
                  const isEdited = empList.some((emp) => get(emp, 'rosterData', [])
                    .some((data) => data.assignDate === date.format('YYYY-MM-DD') && data.status === 'DRAFT'));
                  const isAllPublished = empList.some((emp) => get(emp, 'rosterData', [])
                    .some((data) => data.assignDate === date.format('YYYY-MM-DD') && data.status === 'PUBLISHED')) && !isEdited;
                  return (
                    <td
                      key={moment(date)}
                      className={cx(styles.tdCell, styles.tdDate, {
                        [`${styles.tdCellTopToday}`]: !isColumnSelectedForPublish[0] && isToday(date),
                        [`${styles.tdCellTopPublish}`]: isColumnSelectedForPublish[0],
                        ...cellCommonStyles({ isHoliday, isColumnSelectedForPublish, date }),
                      })}
                    >
                      <DayCell date={date} isToday={isToday(date)} isHoliday={isHoliday} isEdited={isEdited} isPublished={isAllPublished} onDateClick={onDateClick} />
                    </td>
                  );
                })
              }
            </tr>
          </tbody>
        </table>
        {
        loaderEmpCount.includes(loading) || loaderShift.includes(getSiteShiftListState) ? <Loader type="rosterEmpCount" />
          : (
            <div className={cx(styles.countTable,
              {
                [`${styles.countTableScroll} ${scrollStyle.scrollbarBlue}`]: isCountExpanded,
              })}
            >
              <table className={cx(styles.commonTable, styles.countTable,
                {
                  [`${styles.countTableScroll}`]: isCountExpanded,
                }, 'mt-0')}
              >
                <tbody>
                  <tr className={cx(styles.tRow)} style={{ height: '60px' }}>
                    <td colSpan={isCountExpanded ? '9' : '1'} className={cx(styles.tdCell, 'text-left', styles.countTitleCell, styles.firstCell)}>
                      <span className={styles.countTitle}>
                        <img src={expectedCount} alt="expected counts" className="pr-2" height="32px" />
                        {`employee counts (${shiftList.length} shifts)`}
                      </span>
                      <div className={styles.smallDropdownContainer} role="button" aria-hidden onClick={expandCountTable}>
                        <img src={isCountExpanded ? formChecked : form} alt="expand" className={styles.smallDropdownIcon} />
                      </div>
                    </td>
                    {!isCountExpanded && calendarRange.map((date, index) => {
                      const isColumnSelectedForPublish = [
                        // today
                        selectedColumn.includes(date.format('MM-DD-YYYY')),
                        // tomorrow
                        !!calendarRange[index + 1] && selectedColumn.includes(calendarRange[index + 1].format('MM-DD-YYYY')),
                        // yesterday
                        !!calendarRange[index - 1] && selectedColumn.includes(calendarRange[index - 1].format('MM-DD-YYYY')),
                      ];
                      const isHoliday = get(holidays, `${date.format('YYYY')}`, []).some((holiday) => moment(holiday.startDate, 'YYYY-MM-DD').isSame(date)
                  || moment(holiday.endDate, 'YYYY-MM-DD').isSame(date)
                  || (date.isAfter(moment(holiday.startDate, 'YYYY-MM-DD')) && date.isBefore(moment(holiday.endDate, 'YYYY-MM-DD'))));
                      return (
                        <td
                          key={moment(date)}
                          className={cx(styles.tdCell, {
                            ...cellCommonStyles({ isHoliday, isColumnSelectedForPublish, date }),
                          })}
                        >
                          <CollapsedCountCell shifts={shiftList} date={date} totalEmpCountData={totalEmpCountData} />
                        </td>
                      );
                    })}
                  </tr>
                  {isCountExpanded && !isEmpty(shiftList)
                && shiftList.map(({
                  startTime = {}, endTime = {}, shiftName = '', _id,
                }) => {
                  const shiftStart = getShiftTime(startTime);
                  const shiftEnd = getShiftTime(endTime);
                  return (
                    <tr key={_id} className={cx(styles.tRow)}>
                      <td className={cx(styles.tdCell, 'text-left', styles.countNameCell, styles.firstCell)} style={{ width: '246px' }}>
                        <div className="d-flex">
                          <div>
                            <img src={getSourceImage({ startTime })} alt="expected counts" className="pr-2" />
                          </div>
                          <div>
                            <span className={styles.shiftName}>
                              {shiftName}
                            </span>
                            <br />
                            <span className={styles.shiftTime}>
                              {`${shiftStart}-${shiftEnd}`}
                            </span>
                          </div>
                        </div>
                      </td>
                      {
                        calendarRange.map((date, index) => {
                          const isColumnSelectedForPublish = [
                            // today
                            selectedColumn.includes(date.format('MM-DD-YYYY')),
                            // tomorrow
                            !!calendarRange[index + 1] && selectedColumn.includes(calendarRange[index + 1].format('MM-DD-YYYY')),
                            // yesterday
                            !!calendarRange[index - 1] && selectedColumn.includes(calendarRange[index - 1].format('MM-DD-YYYY')),
                          ];
                          const isHoliday = get(holidays, `${date.format('YYYY')}`, []).some((holiday) => moment(holiday.startDate, 'YYYY-MM-DD').isSame(date)
                                              || moment(holiday.endDate, 'YYYY-MM-DD').isSame(date)
                                              || (date.isAfter(moment(holiday.startDate, 'YYYY-MM-DD')) && date.isBefore(moment(holiday.endDate, 'YYYY-MM-DD'))));
                          return (
                            <td
                              key={moment(date)}
                              className={cx(styles.tdCell, {
                                ...cellCommonStyles({ isHoliday, isColumnSelectedForPublish, date }),
                              })}
                            >
                              <CountCell
                                isDisabled={isShiftTimeElapsed(startTime, date)}
                                shiftId={_id}
                                data={fetchCountData({ shiftId: _id, date, totalEmpCountData })}
                                isCollpased={!isCountExpanded}
                                shiftList={shiftList}
                                calendarRange={calendarRange}
                                clickedDate={date}
                                vendorData={vendorDataList}
                                date={date}
                                toggleFunction={toggleEmpCountPopup}
                              />
                            </td>
                          );
                        })
                      }
                    </tr>
                  );
                })}
                  {isCountExpanded && isEmpty(shiftList)
                  && (
                  <div className={cx('d-flex flex-column', styles.emptyShiftContainer)}>
                    <img src={emptyShift} alt="empty shift" />
                    <span className={styles.countTitle} style={{ fontSize: '18px', lineHeight: '22px' }}>there is no shift added yet</span>
                    <span style={{ fontSize: '14px', lineHeight: '24px' }}>please add at least one shift to plan employee count</span>
                  </div>
                  )}
                </tbody>
              </table>
            </div>
          )
}
      </div>

      { !isEmpty(empList)
        ? (
          <div id="emp-cell">
            <table className={cx(styles.commonTable)}>
              <tbody>
                {empList.map((emp) => (
                  <tr
                    key={emp.uuid}
                    className={cx(styles.tRow, {
                      [`${styles.opacity}`]: focus.length > 0,
                    })}
                  >
                    <td className={cx(styles.tdCell, 'text-left', styles.countNameCell, styles.firstCell)}>
                      <EmpCell emp={emp} pic={!isEmpty(empPics[emp.uuid]) ? empPics[emp.uuid] : defaultEmpPic} />
                    </td>
                    {calendarRange.map((date, index) => {
                      const edited = [];
                      const shift = [];
                      const ids = [];
                      let isLeave = false;
                      get(emp, 'rosterData', []).forEach((roster) => {
                        const leavesEmp = empLeaveData.current[emp.uuid] || [];
                        if (roster.status === 'DRAFT') edited.push({ date: roster.assignDate, empId: roster.empId });
                        if (moment(date).format('YYYY-MM-DD') === roster.assignDate) {
                          ids.push(roster._id);
                          if (!isLeave && roster.type === 'LEAVE') {
                            isLeave = true;
                            if (!leavesEmp.includes(date.format('MM-DD-YYYY'))) {
                              leavesEmp.push(date.format('MM-DD-YYYY'));
                              empLeaveData.current[emp.uuid] = leavesEmp;
                            }
                          }
                        }
                        shiftList.forEach((list, ind) => {
                          if (list._id === roster.shiftId && moment(date).format('YYYY-MM-DD') === roster.assignDate) {
                            shift.push({ ...shiftList[ind], status: roster.status });
                          }
                        });
                      });

                      let color;
                      const offs = ['WEEKLY_OFF', 'REST_DAY'];
                      let offType = '';
                      get(emp, 'rosterData', []).forEach((roster) => {
                        if (moment(date).format('YYYY-MM-DD') === roster.assignDate && offs.includes(roster.type)) offType = roster.type;
                      });
                      const isColumnSelectedForPublish = [
                        // today
                        selectedColumn.includes(date.format('MM-DD-YYYY')),
                        // tomorrow
                        !!calendarRange[index + 1] && selectedColumn.includes(calendarRange[index + 1].format('MM-DD-YYYY')),
                        // yesterday
                        !!calendarRange[index - 1] && selectedColumn.includes(calendarRange[index - 1].format('MM-DD-YYYY')),
                      ];
                      const isEdited = edited.length > 0 && edited.findIndex((d) => moment(date).format('YYYY-MM-DD') === d.date && emp.uuid === d.empId) !== -1;
                      const isFocused = focus.length > 0 && focus.findIndex((d) => moment(date).format('MM-DD-YYYY') === d.date && emp.uuid === get(d, 'emp.uuid', '')) === -1;
                      if ((isLeave || offType) && !isPastDate(date)) {
                        color = '#E6EAEE';
                      } else if (isPastDate(date) && !(isLeave || offType) && shift.length === 1 && shift[0] && shift[0]._id) color = `repeating-linear-gradient(-45deg,${get(getShiftColor(shift[0] && shift[0]._id), 'backgroundColor', '')} 33px 41px ,  #d9d9d9 43px 26px)`;
                      else if (isPastDate(date) && (isLeave || offType)) color = 'repeating-linear-gradient(-45deg,#E6EAEE 33px 41px ,  #d9d9d9 43px 26px)';
                      else if (isPastDate(date)) color = 'repeating-linear-gradient(-45deg,#FFFFFF 33px 41px ,  #d9d9d9 43px 26px)';
                      else if (!shift[0] && isFocused) {
                        color = '#e8e8e8';
                      } else if (shift.length && isFocused) {
                        color = '#e8e8e8';
                      } else {
                        color = get(getShiftColor(shift.length === 1 && shift[0] && shift[0]._id), 'backgroundColor', '');
                      }
                      const isHoliday = get(holidays, `${date.format('YYYY')}`, []).some((holiday) => moment(holiday.startDate, 'YYYY-MM-DD').isSame(date)
                  || moment(holiday.endDate, 'YYYY-MM-DD').isSame(date)
                  || (date.isAfter(moment(holiday.startDate, 'YYYY-MM-DD')) && date.isBefore(moment(holiday.endDate, 'YYYY-MM-DD'))));
                      return (
                        <td
                          key={moment(date)}
                          className={cx(styles.tabAlignCenter,
                            styles.tdCell,
                            styles.tRow, {
                              [`${styles.edited}`]: isEdited,
                              [`${styles.opacity}`]: isFocused,
                              [`${styles.hoverClass}`]: (shift.length === 1 && shift[0] && shift[0]._id) || offType || isLeave,
                              ...cellCommonStyles({ isHoliday, isColumnSelectedForPublish, date }),
                            })}
                          style={{
                            background: color,
                          }}
                        >
                          <EmpShiftCell
                            shift={shift}
                            emp={emp}
                            isLeave={isLeave}
                            isSelected={selectedColumn.includes(date.format('MM-DD-YYYY'))}
                            ids={ids}
                            offType={offType}
                            isDisabled={isPastDate(date)}
                            onClick={onClickEmpShiftCell}
                            date={date.format('MM-DD-YYYY')}
                            isFocused={isFocused}
                            disableShiftPopup={focus.length}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        : (
          loading === null
          && (
          <div className={styles.emptyStateBg}>
            <img src={getEmptyState().img} alt="not found" />
            <div className={styles.emptyStateText}>{getEmptyState().text}</div>
          </div>
          )
        )}
      {
        (loading === 'employee' || loading === 'empCount' || loading === 'publish') && <Loader type="rosterEmpTable" />
      }
      {showShiftAssign && (
      <AssignShift
        calendarRange={calendarRange}
        shiftList={shiftList}
        startDate={selectedDate}
        emp={selectedEmp}
        onClick={onClickAssignShift}
        empLeaveData={empLeaveData.current[selectedEmp.uuid] || []}
      />
      )}
      {showEmpCountPopup && (
      <RosterEmpCount
        toggleFunction={toggleEmpCountPopup}
        countDetails={empCountDetails}
        startDate={moment(startDate, 'MMM DD YYYY').format('YYYY-MM-DD')}
        endDate={moment(endDate, 'MMM DD, YYYY').format('YYYY-MM-DD')}
      />
      )}

    </div>
  );
};

export default Roaster;

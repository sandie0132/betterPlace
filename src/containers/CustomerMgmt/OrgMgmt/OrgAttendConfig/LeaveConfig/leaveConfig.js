/* eslint-disable no-underscore-dangle */
import React, {
  useState, useMemo, useEffect,
} from 'react';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import { useRouteMatch, useHistory, useLocation } from 'react-router';
import moment from 'moment';
import cx from 'classnames';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { Tooltip, Button } from 'react-crux';
import leaveIcon from '../../../../../assets/icons/leaveConfigIcon.svg';
import ArrowLink from '../../../../../components/Atom/ArrowLink/ArrowLink';
import CardHeader from '../../../../../components/Atom/PageTitle/PageTitle';
import styles from './leaveConfig.module.scss';
import TagSearchField from '../../../../TagSearch/TagSearchField/TagSearchField';
import DropDownSmall from '../../../../../components/Atom/SmallDropDown/SmallDropDown';
import {
  tableConfiguration, monthOptions, yearOptions, Add, getLabel, checkOverlap,
} from './leaveConfigHelper';
import Spinnerload from '../../../../../components/Atom/Spinner/Spinner';
import Notification from '../../../../../components/Molecule/Notification/Notification';
import CancelButton from '../../../../../components/Molecule/CancelButton/CancelButton';
import DeleteButton from '../../../../../components/Molecule/DeleteButton/DeleteButton';
import EmptyLeaveConfig from '../../../../../assets/icons/emptyLeaveConfig.svg';
import blueEdit from '../../../../../assets/icons/blueEdit.svg';
import config from '../../../../../assets/icons/config.svg';
import Prompt from '../../../../../components/Organism/Prompt/Prompt';
import {
  clearNotification,
  deleteLeaveCycle,
  getAllLeaves,
  getSuggestedLeaves,
  getUrl, notificationUpdate,
  resetLocalState,
  submitLeaves,
  updateLocalState,
} from './Store/action';
import WarningPopUp from '../../../../../components/Molecule/WarningPopUp/WarningPopUp';
import deleteBin from '../../../../../assets/icons/deleteBinIcon.svg';
import HasAccess from '../../../../../services/HasAccess/HasAccess';
import VendorDropdown from '../../../../VendorSearch/VendorDropdown/VendorDropdown';
import viewIcon from '../../../../../assets/icons/eyeIconViewMode.svg';
import blueTick from '../../../../../assets/icons/blueLightTick.svg';

let notificationTimer;
const {
  fixedHeader,
  alignCenter,
  cardLayout,
  configFilterCard,
  labelText,
  tagInputField,
  tagDropdown,
  dropDownStyle,
  dropdownMenu,
  optionDropdown,
  sectionHeading,
  pointer,
  heading,
  rowBorder,
  listBoldText,
  listText,
  locationNameContainer,
  tooltiptext,
  textElipsis,
  listSmallText,
  fixedTopHeader,
  container,
  formHeader,
  timeHeading,
  cancelButton,
  emptyData,
  cycleSelector,
  cylceDelete,
  editContainer,
  ErrorMessage,
  configContainer,
  w32,
  leaveCycleDropDown,
  disbaledTag,
} = styles;

const initialState = {
  filterTags: [],
  leaveCycle: 'select leave period',
  leaveCycleStartMonth: 'january',
  leaveCycleStartYear: moment().format('YYYY'),
  leaveCycleEndMonth: 'december',
  leaveCycleEndYear: moment().format('YYYY'),
  isLeaving: true,
  showCancelPopUp: false,
  isEdited: false,
  isDelete: false,
  saveType: null,
  isConfirm: false,
};

const LeaveConfig = () => {
  const [state, setState] = useState(initialState);
  const {
    filterTags,
    leaveCycle,
    leaveCycleStartMonth,
    leaveCycleEndMonth,
    leaveCycleEndYear,
    leaveCycleStartYear,
    isLeaving,
    showCancelPopUp,
    isEdited,
    isDelete,
    saveType,
    isConfirm,
  } = state;

  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const orgId = match.params.uuid;
  const orgMgmtRState = useSelector((rstate) => get(rstate, 'orgMgmt', {}), shallowEqual);
  const {
    loading, getErrorMsg, notification, allLeaves, orgId: rOrgId, ...restLeaveConfig
  } = get(orgMgmtRState, 'orgAttendConfig.leaveConfig', {});
  const { tagList } = get(orgMgmtRState, 'orgAttendConfig.holidayConfig', {});
  const arrowLabel = get(orgMgmtRState, 'staticData.orgData.name', '');
  const enabledServices = get(orgMgmtRState, 'staticData.servicesEnabled', '');
  const urlParams = new URLSearchParams(location.search);
  const reload = urlParams.get('state');
  const clientId = urlParams.get('clientId') || false;
  const vendorId = urlParams.get('vendorId') || false;
  useEffect(() => {
    if ((restLeaveConfig.localConfiguredLeaves.length === 0
      && restLeaveConfig.localSuggestedLeaves.length === 0) || orgId !== rOrgId) {
      dispatch(getSuggestedLeaves({ orgId, clientId, vendorId }));
      dispatch(getAllLeaves({ orgId, clientId, vendorId }));
    }
    return () => {
      setTimeout(() => {
        if (!window.location.pathname.includes('leave-config-detail')) {
          dispatch(resetLocalState());
        }
      }, 100);
    };
    // eslint-disable-next-line
  }, [orgId]);

  useEffect(() => {
    const reloadState = JSON.parse(sessionStorage.getItem('leaveConfigState'));

    if (reload === 'hardload') {
      setTimeout(() => {
        setState({
          ...state,
          ...reloadState,
          isLeaving: true,
        });
        if (get(reloadState, 'leaveCycle', null)) {
          const tagIds = get(reloadState, 'filterTags', []).map((tag) => tag.uuid).join(',');
          dispatch(updateLocalState({
            value: reloadState.leaveCycle, orgId, tagIds, clientId, vendorId,
          }));
        }
        sessionStorage.clear('leaveConfigState');
      }, 2000);
    } else {
      setState({
        ...state,
        ...reloadState,
        isLeaving: true,
      });
      sessionStorage.clear('leaveConfigState');
    }
    // eslint-disable-next-line
  }, [reload]);

  const updateValue = (feild, value) => {
    setState({
      ...state,
      [`${feild}`]: value,
    });
  };

  const handleTagInput = (event, inputIdentifier, action) => {
    let updatedFilterTags = [...filterTags];
    if (inputIdentifier === 'tags') {
      if (action === 'add') {
        updatedFilterTags = [
          ...updatedFilterTags.slice(0),
          event.value,
        ];
      } else if (action === 'delete') {
        updatedFilterTags = updatedFilterTags.filter((tag) => tag.uuid !== event.value.uuid);
      }
    }
    const tagIds = updatedFilterTags.map((tag) => tag.uuid).join(',');
    dispatch(updateLocalState({
      value: leaveCycle, orgId, tagIds, clientId, vendorId,
    }));
    updateValue('filterTags', updatedFilterTags);
  };

  const handleLocationTags = ({ allTags, tags }, tagType) => {
    let element = null;
    if (allTags && tagType === 'includeTags') {
      element = (
        <span className={cx(listSmallText)} style={{ paddingTop: '8px' }}>all locations</span>
      );
    } else if (isEmpty(tags)) {
      element = (
        <span className={cx(listSmallText)} style={{ paddingTop: '8px' }}> - - </span>
      );
    } else if (!isEmpty(tagList)) {
      const tagNames = [];
      tags.forEach((tag) => {
        const selectedTag = tagList.filter((item) => item.uuid === tag);
        if (!isEmpty(selectedTag)) {
          tagNames.push(selectedTag[0].name.toLowerCase());
        }
      });
      if (!isEmpty(tagNames)) {
        const first = tagNames[0];
        tagNames.shift();
        const remainingList = tagNames.join(', ');
        element = (
          <div className={cx('d-flex flex-row')}>
            <div className={locationNameContainer}>
              <span data-tip={`tooltip${first}`} data-for={`tooltip${first}`} className={textElipsis}>{first}</span>
              <Tooltip id={`tooltip${first}`} place="bottom" tooltipClass={tooltiptext} arrowColor="transparent">
                <span>{first}</span>
              </Tooltip>
            </div>
            {tagNames.length >= 1
              && (
              <div className={locationNameContainer}>
                <span data-tip={`tooltip${remainingList}`} data-for={`tooltip${remainingList}`}>
                  {`+ ${tagNames.length} more`}
                </span>
                <Tooltip id={`tooltip${remainingList}`} place="bottom" tooltipClass={tooltiptext} arrowColor="transparent">
                  <span>{remainingList}</span>
                </Tooltip>
              </div>
              )}
          </div>
        );
      }
    }
    return element;
  };

  const routeToEditPage = (search, routeState) => {
    sessionStorage.setItem('leaveConfigState', JSON.stringify({ ...state, isLeaving: false, isEdited: true }));
    setState({
      ...state,
      isLeaving: false,
      isEdited: true,
    });
    setTimeout(() => history.push({
      pathname: `/customer-mgmt/org/${orgId}/attendconfig/leave-config/leave-config-detail/add`,
      search: getUrl('', clientId, vendorId, search),
      state: routeState,
    }), 1);
  };

  const popupConfirm = () => {
    if (leaveCycle === 'new leave cycle') {
      dispatch(resetLocalState());
      if (isDelete) {
        setState({
          ...state,
          showCancelPopUp: false,
          leaveCycle: 'select leave period',
          isDelete: false,
          isEdited: false,
          leaveCycleStartMonth: 'january',
          leaveCycleStartYear: moment().format('YYYY'),
          leaveCycleEndMonth: 'december',
          leaveCycleEndYear: moment().format('YYYY'),
        });
        dispatch(clearNotification());
      } else {
        setState({
          ...state,
          showCancelPopUp: false,
          isEdited: false,
          leaveCycleStartMonth: 'january',
          leaveCycleStartYear: moment().format('YYYY'),
          leaveCycleEndMonth: 'december',
          leaveCycleEndYear: moment().format('YYYY'),
        });
        const startCycle = `january ${moment().format('YYYY')}`;
        const endCycle = `december ${moment().format('YYYY')}`;
        const isOverlapped = checkOverlap(startCycle, endCycle, allLeaves);
        if (isOverlapped) {
          dispatch(notificationUpdate({
            msg: 'selected leave cycle is overlapping with already configured leaves',
          }));
        } else dispatch(clearNotification());
      }
    } else if (isDelete) {
      const { startDate, endDate } = allLeaves.filter((leave) => leave._id === leaveCycle)[0] || {};
      setState({
        ...state,
        showCancelPopUp: false,
        leaveCycle: 'select leave period',
        isDelete: false,
        filterTags: [],
        isEdited: false,
        leaveCycleEndMonth: moment(endDate, 'YYYY-MM-DD').format('MMMM').toLowerCase(),
        leaveCycleEndYear: moment(endDate, 'YYYY-MM-DD').format('YYYY').toLowerCase(),
        leaveCycleStartMonth: moment(startDate, 'YYYY-MM-DD').format('MMMM').toLowerCase(),
        leaveCycleStartYear: moment(startDate, 'YYYY-MM-DD').format('YYYY').toLowerCase(),
      });
      dispatch(deleteLeaveCycle({
        orgId, leaveCycleId: leaveCycle, clientId, vendorId,
      }));
    } else {
      const { startDate, endDate } = allLeaves.filter((leave) => leave._id === leaveCycle)[0] || {};
      setState({
        ...state,
        showCancelPopUp: false,
        isEdited: false,
        leaveCycleEndMonth: moment(endDate, 'YYYY-MM-DD').format('MMMM').toLowerCase(),
        leaveCycleEndYear: moment(endDate, 'YYYY-MM-DD').format('YYYY').toLowerCase(),
        leaveCycleStartMonth: moment(startDate, 'YYYY-MM-DD').format('MMMM').toLowerCase(),
        leaveCycleStartYear: moment(startDate, 'YYYY-MM-DD').format('YYYY').toLowerCase(),
      });
      dispatch(updateLocalState({ value: leaveCycle }));
    }
  };

  const submitData = (saveAs) => {
    dispatch(submitLeaves({
      saveAs,
      orgId,
      startDate: moment(`${leaveCycleStartYear}-${leaveCycleStartMonth}-01`, 'yyyy-MMM-dd').format('YYYY-MM-DD'),
      endDate: moment(`${leaveCycleEndYear}-${leaveCycleEndMonth}-01`, 'yyyy-MMM-dd')
        .add(moment(`${leaveCycleEndYear}-${leaveCycleEndMonth}-01`, 'yyyy-MMM-dd').daysInMonth() - 1, 'd').format('YYYY-MM-DD'),
      leaves: [...restLeaveConfig.localCompoffLeaves, ...restLeaveConfig.localConfiguredLeaves],
      leaveCycleId: leaveCycle,
      clientId,
      vendorId,
    }));
    setState({
      ...state,
      isEdited: false,
      isConfirm: false,
      leaveCycle: 'select leave period',
    });
  };

  useEffect(() => {
    const { saveAs } = allLeaves.filter((leave) => leave._id === leaveCycle)[0] || {};
    setState(((prev) => ({
      ...prev,
      saveType: saveAs,
    })));
    // eslint-disable-next-line
  }, [allLeaves]);

  const onLeavePeriodChange = (value) => {
    if (value !== 'select leave period' && value !== 'new leave cycle') {
      const { startDate, endDate, saveAs } = allLeaves.filter((leave) => leave._id === value)[0]
      || {};
      const tagIds = filterTags.map((tag) => tag.uuid).join(',');
      setState({
        ...state,
        leaveCycle: value,
        leaveCycleEndMonth: moment(endDate, 'YYYY-MM-DD').format('MMMM').toLowerCase(),
        leaveCycleEndYear: moment(endDate, 'YYYY-MM-DD').format('YYYY').toLowerCase(),
        leaveCycleStartMonth: moment(startDate, 'YYYY-MM-DD').format('MMMM').toLowerCase(),
        leaveCycleStartYear: moment(startDate, 'YYYY-MM-DD').format('YYYY').toLowerCase(),
        saveType: saveAs,
      });
      dispatch(updateLocalState({
        value, orgId, tagIds, clientId, vendorId,
      }));
      dispatch(clearNotification());
    } else {
      setState({
        ...state,
        leaveCycle: value,
        leaveCycleStartMonth: 'january',
        leaveCycleStartYear: moment().format('YYYY'),
        leaveCycleEndMonth: 'december',
        leaveCycleEndYear: moment().format('YYYY'),
        saveType: null,
      });
      if (value === 'new leave cycle') {
        const startCycle = `january ${moment().format('YYYY')}`;
        const endCycle = `december ${moment().format('YYYY')}`;
        const isOverlapped = checkOverlap(startCycle, endCycle, allLeaves);
        if (isOverlapped) {
          dispatch(notificationUpdate({
            msg: 'selected leave cycle is overlapping with already configured leaves',
          }));
        } else dispatch(clearNotification());
      }
      if (value === 'select leave period') {
        dispatch(clearNotification());
      }
      dispatch(resetLocalState());
    }
  };

  const onDelete = () => {
    setState({
      ...state,
      isDelete: true,
    });
  };

  const closePopup = () => {
    setState({
      ...state,
      showCancelPopUp: false,
      isDelete: false,
      isConfirm: false,
    });
  };

  const updateCycleValue = (key, value) => {
    const updatedState = {
      ...state,
      [key]: value,
      isEdited: true,
    };
    setState({
      ...updatedState,
    });

    const startCycle = `${updatedState.leaveCycleStartMonth} ${updatedState.leaveCycleStartYear}`;
    const endCycle = `${updatedState.leaveCycleEndMonth} ${updatedState.leaveCycleEndYear}`;
    const isOverlapped = checkOverlap(startCycle, endCycle, allLeaves);
    if (isOverlapped) {
      dispatch(notificationUpdate({
        msg: 'selected leave cycle is overlapping with already configured leaves',
      }));
    } else dispatch(clearNotification());
  };

  const updateNotification = (timeout) => {
    if (notificationTimer) clearTimeout(notificationTimer);
    notificationTimer = setTimeout(() => {
      dispatch(clearNotification());
      notificationTimer = null;
    }, timeout);
  };

  const handleShowVendorDropDown = () => {
    let showVendorDropDown = false;
    if (!isEmpty(enabledServices) && !isEmpty(enabledServices.platformServices)) {
      forEach(enabledServices.platformServices, (service) => {
        if (service.platformService === 'VENDOR') showVendorDropDown = true;
      });
    }
    return showVendorDropDown;
  };

  const isNew = useMemo(() => leaveCycle !== 'select leave period', [leaveCycle]);
  const isCycleError = useMemo(() => moment(`${leaveCycleStartMonth} ${leaveCycleStartYear}`, 'MMM YYYY')
    .isAfter(moment(`${leaveCycleEndMonth} ${leaveCycleEndYear}`, 'MMM YYYY')),
  [leaveCycleEndYear, leaveCycleEndMonth, leaveCycleStartMonth, leaveCycleStartYear]);

  const leavePeriodOptions = useMemo(() => {
    let options = [];
    options = allLeaves.map((val) => {
      const opt = `${moment(val.startDate, 'YYYY-MM-DD').format('MMM yyyy')}-${moment(val.endDate, 'YYYY-MM-DD').format('MMM yyyy')}`;
      return {
        option: val._id,
        optionLabel: opt.toLowerCase(),
        customLabel: getLabel(val),
        isDraft: val.saveAs === 'DRAFT',
        isActive: val.isActive || val.isActive === false,
      };
    });
    if (vendorId) {
      return options;
    }
    options.unshift({
      option: 'new leave cycle',
      optionLabel: 'new leave cycle',
    });
    return options;
  }, [allLeaves, vendorId]);

  const onVendorChange = (type, org) => {
    let vendor;
    let client;
    if (type === 'client') client = org._id;
    else if (type === 'vendor') vendor = org._id;
    setState((prev) => ({ ...prev, leaveCycle: 'select leave period' }));
    dispatch(getSuggestedLeaves({ orgId, clientId: client, vendorId: vendor }));
    dispatch(getAllLeaves({ orgId, clientId: client, vendorId: vendor }));
  };

  const isEditable = useMemo(() => (get(
    leavePeriodOptions.filter((opt) => opt.option === leaveCycle)[0], 'isDraft',
  ) || leaveCycle === 'new leave cycle') && !vendorId,
  // eslint-disable-next-line
  [leaveCycle, leavePeriodOptions, vendorId, clientId]);

  const isDeletable = useMemo(() => !get(
    leavePeriodOptions.filter((opt) => opt.option === leaveCycle)[0], 'isActive',
  ) && !vendorId,
  [leaveCycle, leavePeriodOptions, vendorId]);

  const notificationData = useMemo(() => {
    let defaultMessage;
    if (isNew && isEditable) defaultMessage = 'on confirming, the currenct cycle is applicable instantly';
    else if (!isEditable && leaveCycle !== 'select leave period') defaultMessage = 'confirmed leave cylce cannot be edited';
    else defaultMessage = 'please select a leave cycle to configure';
    return {
      type: notification.message ? notification.type : 'info',
      message: notification.message ? notification.message : defaultMessage,
      timeout: notification.timeout ? notification.timeout : 0,
    };
  }, [notification, isNew, isEditable, leaveCycle]);

  const buttonEnable = useMemo(() => isCycleError || notificationData.type === 'warning',
  // eslint-disable-next-line
  [isCycleError, JSON.stringify(notificationData)]);

  const { isWarningDisplay, ...warningProps } = useMemo(() => {
    if (showCancelPopUp) {
      return {
        isWarningDisplay: true,
        text: 'are you sure ?',
        para: (
          <span>
            {isDelete ? 'are you sure you want to delete leave cycle'
              : 'are you sure you want to cancel all unsaved configurations on current leave cycle'}
            <br />
            {`${leaveCycleStartMonth} ${leaveCycleStartYear} - ${leaveCycleEndMonth} ${leaveCycleEndYear} ?`}
          </span>
        ),
        confirmText: isDelete ? 'yes, delete' : 'yes, cancel',
        cancelText: 'no keep',
        icon: deleteBin,
        warningPopUp: popupConfirm,
        closePopup,
        highlightText: isDelete ? 'all the configurations made for this current cycle will be lost on deleting it'
          : 'all the unsaved configurations made for this current cycle will be lost on canceling it',
      };
    }
    if (isDelete) {
      return {
        isWarningDisplay: true,
        text: 'are you sure ?',
        para: (
          <span>
            are you sure you want to delete leave cycle
            <br />
            {`${leaveCycleStartMonth} ${leaveCycleStartYear} - ${leaveCycleEndMonth} ${leaveCycleEndYear} ?`}
          </span>
        ),
        confirmText: 'yes, delete',
        cancelText: 'no keep',
        icon: deleteBin,
        warningPopUp: popupConfirm,
        closePopup,
        highlightText: 'all the configurations made for this current cycle will be lost on deleting it',
      };
    }
    if (isConfirm) {
      return {
        isWarningDisplay: true,
        text: 'are you sure ?',
        para: (
          <span>
            are you sure you want to save and confirm
            <br />
            {`${leaveCycleStartMonth} ${leaveCycleStartYear} - ${leaveCycleEndMonth} ${leaveCycleEndYear} ?`}
          </span>
        ),
        confirmText: 'yes, confirm',
        cancelText: 'go back',
        icon: blueTick,
        isAlert: true,
        warningPopUp: () => submitData('POLICY'),
        closePopup,
        highlightText: `saving and confriming the leave cycle will be effective from 
        ${moment(`${leaveCycleStartMonth} ${leaveCycleStartYear}`, 'MMMM YYYY').format('DD MMM YYYY')} and new employees will be granted leaves`,
      };
    }
    return {
      isWarningDisplay: false,
    };
  },
  // eslint-disable-next-line
  [isDelete, showCancelPopUp, isConfirm]);

  return (
    <>
      <Prompt
        when={isNew && isLeaving && isEdited}
      />
      {isWarningDisplay
        && (
          <WarningPopUp
            {...warningProps}
          />
        ) }
      <div className={alignCenter}>
        <div className={fixedTopHeader}>
          <div className="d-flex">
            <ArrowLink
              label={arrowLabel}
              url={`/customer-mgmt/org/${orgId}/profile`}
            />
            {handleShowVendorDropDown()
            && (
            <div className="ml-auto mt-2">
              <VendorDropdown showIcon onChange={onVendorChange} />
            </div>
            )}
          </div>
          <div className="d-flex">
            <CardHeader label="leave configuration" iconSrc={leaveIcon} />
          </div>
          <div className={cardLayout}>
            <div className={fixedHeader}>
              <div className={cx('row', formHeader)} style={{ height: '3.5rem' }}>
                <div className={cx(timeHeading, 'col-6 mx-0 px-0')}>
                  <Notification
                    type={notificationData.type}
                    message={notificationData.message}
                  />
                  {notificationData.timeout > 0 && notificationData.message
                  && updateNotification(notificationData.timeout)}
                </div>

                <div className="ml-auto d-flex my-auto">
                  <div className={cx('row no-gutters justify-content-end')}>
                    <CancelButton
                      isDisabled={buttonEnable || !isEditable}
                      clickHandler={() => updateValue('showCancelPopUp', true)}
                      className={cancelButton}
                    >
                      cancel
                    </CancelButton>
                    {loading && <Spinnerload type="loading" />}
                    {isNew && !loading
                      && (
                        <Button
                          label="save as draft"
                          isDisabled={buttonEnable || !isEditable}
                          className="mr-2"
                          labelStyle="mb-0"
                          clickHandler={() => submitData('DRAFT')}
                          type="secondaryButton"
                        />
                      )}
                    {!loading
                    && (
                    <Button
                      label={isNew ? 'save & confirm' : 'save'}
                      isDisabled={((buttonEnable
                        || restLeaveConfig.localConfiguredLeaves.length === 0 || !isEditable) && (saveType !== 'DRAFT' || leaveCycle === 'select leave period' || buttonEnable)) || vendorId}
                      clickHandler={() => updateValue('isConfirm', true)}
                      type="save"
                      className="ml-2"
                    />
                    )}
                  </div>
                </div>
              </div>
              <div className={cx('d-flex flex-row position-relative', configFilterCard)}>
                <div
                  className={cx({
                    [`${disbaledTag}`]: !buttonEnable
                    || (leaveCycle === 'select leave period' || leaveCycle === 'new leave cycle'),
                  })}
                  style={{ width: '600px' }}
                >
                  <TagSearchField
                    name="location"
                    labelText={labelText}
                    className={cx(tagInputField, 'col-10', {
                      [`${disbaledTag}`]: !buttonEnable
                    || (leaveCycle === 'select leave period' || leaveCycle === 'new leave cycle'),
                    })}
                    label=""
                    placeholder="search for any locations to filter"
                    orgId={orgId}
                    category="geographical"
                    tags={filterTags}
                    updateTag={(value, action) => handleTagInput(value, 'tags', action)}
                    dropdownMenu={tagDropdown}
                    // this needs to be updated according to design given by @rupesh
                    disabled={!buttonEnable
                      || (leaveCycle === 'select leave period' || leaveCycle === 'new leave cycle')}
                    vendorId={vendorId}
                    clientId={clientId}
                  />
                </div>
                <div>
                  <DropDownSmall
                    Options={[
                      {
                        option: 'select leave period',
                        optionLabel: 'select leave period',
                      },

                      ...leavePeriodOptions,
                    ]}
                    dropdownMenu={cx(dropdownMenu, leaveCycleDropDown)}
                    className={cx(dropDownStyle, 'ml-4', leaveCycleDropDown)}
                    value={leavePeriodOptions.findIndex((ele) => ele.option === leaveCycle) > -1
                      ? leaveCycle
                      : 'select leave period'}
                    changed={(value) => onLeavePeriodChange(value)}
                    defaultColor={cx(optionDropdown)}

                  />
                </div>
              </div>
              {isNew && (
              <div className={cx('d-flex row mt-2 p-10', cycleSelector)}>
                <div className={w32}>
                  <div className={cx('d-flex row mr-3')}>
                    <DropDownSmall
                      Options={monthOptions()}
                      dropdownMenu={dropdownMenu}
                      className={cx(dropDownStyle, 'ml-4')}
                      value={leaveCycleStartMonth}
                      changed={(value) => updateCycleValue('leaveCycleStartMonth', value)}
                      defaultColor={cx(optionDropdown)}
                      label="cycle starting from"
                      disabled={!isEditable}
                    />
                    <DropDownSmall
                      Options={yearOptions(leaveCycleStartYear)}
                      dropdownMenu={dropdownMenu}
                      className={cx(dropDownStyle, 'ml-1')}
                      value={leaveCycleStartYear}
                      changed={(value) => updateCycleValue('leaveCycleStartYear', value)}
                      defaultColor={cx(optionDropdown)}
                      label={<span>&nbsp;</span>}
                      disabled={!isEditable}
                    />
                  </div>
                  {isCycleError && <span className={cx(ErrorMessage, 'pl-2')}>Start date should come before end date</span> }
                </div>
                <div className={cx('d-flex row ml-4', w32)}>
                  <DropDownSmall
                    Options={monthOptions()}
                    dropdownMenu={dropdownMenu}
                    className={cx(dropDownStyle, 'ml-4')}
                    value={leaveCycleEndMonth}
                    changed={(value) => updateCycleValue('leaveCycleEndMonth', value)}
                    defaultColor={cx(optionDropdown)}
                    label="cycle ends on"
                    disabled={!isEditable}
                  />
                  <DropDownSmall
                    Options={yearOptions(leaveCycleEndYear)}
                    dropdownMenu={dropdownMenu}
                    className={cx(dropDownStyle, 'ml-1')}
                    value={leaveCycleEndYear}
                    changed={(value) => updateCycleValue('leaveCycleEndYear', value)}
                    defaultColor={cx(optionDropdown)}
                    label={<span>&nbsp;</span>}
                    disabled={!isEditable}
                  />
                </div>
                <div className={cx(cylceDelete)} style={{ width: '34%' }}>
                  {isDeletable && (
                  <DeleteButton
                    label="remove this cycle"
                    isDeleteIconRequired
                    clickHandler={() => onDelete()}
                  />
                  )}
                </div>
              </div>
              )}
            </div>
          </div>
        </div>

        <div className={container}>
          {!isNew && (
          <div className={cx(emptyData)}>
            <img src={EmptyLeaveConfig} alt="empty leave config" />
            <p>
              there is no leave period selected to view configured suggestedLeaves
              <br />
              please select a leave period above
            </p>
          </div>
          )}
          {tableConfiguration.map(({
            data,
            tableHeading,
            isConfig,
            columns,
            addButtonText,
            search,
            displayCondition,
            isLocal,
            footer,
          }) => {
            if (get(restLeaveConfig, `${data}`, []).length >= displayCondition.minLength && (displayCondition.default
              || get(state, `${displayCondition.key}`, '') !== displayCondition.notValue)) {
              return (
                <div className="mt-1 pb-4" key={data}>
                  <table className="w-100">
                    <tbody>
                      <tr>
                        <td>
                          <span className={sectionHeading}>
                            {tableHeading}
                          </span>
                        </td>
                        <td colSpan="3" />
                        <td className="float-right pr-3">
                          <HasAccess
                            permission={['LEAVE_CONFIG:CREATE']}
                            orgId={orgId}
                            yes={() => (isEditable ? (
                              <Add
                                text={addButtonText}
                                onClick={() => routeToEditPage(search, true)}
                              />
                            ) : <></>)}
                          />
                        </td>
                      </tr>
                      <>
                        { get(restLeaveConfig, `${data}`, []).length > 0 && (
                        <tr className={rowBorder}>
                          {columns.map(({ name }) => (
                            <td key={name} className="pt-2 pb-2">
                              <span className={cx(heading)}>
                                {name}
                              </span>
                            </td>
                          ))}
                        </tr>
                        )}
                        {get(restLeaveConfig, `${data}`, []).map(({
                          leaveName,
                          leaveType,
                          allTags,
                          numberOfDaysAssigned,
                          excludeTags,
                          includeTags,
                          _id,
                          calculationCriteria,
                        }, index) => (
                          <tr className={rowBorder} key={_id || leaveName}>
                            <td className={cx('pt-3 pb-3', listBoldText)}>
                              <span>
                                {(leaveName && leaveName.toLowerCase())
                               || `comp off ${index + 1}` }
                              </span>
                            </td>
                            <td className={cx('pt-3 pb-3', listText)}>
                              <span>
                                { leaveType ? `${numberOfDaysAssigned} - ${leaveType.toLowerCase()}`
                                  : calculationCriteria.toString().toLowerCase()}
                              </span>
                            </td>
                            <td className="pt-3 pb-3">
                              <span>
                                {handleLocationTags({ allTags, tags: includeTags }, 'includeTags')}
                              </span>
                            </td>
                            <td className="pt-3 pb-3">
                              <span>
                                {handleLocationTags({ allTags, tags: excludeTags }, 'excludeTags')}
                              </span>
                            </td>
                            <td className="pt-3 pb-3 pr-3 float-right">
                              <HasAccess
                                permission={['LEAVE_CONFIG:CREATE']}
                                orgId={orgId}
                                // denySuperAdminAccess
                                yes={() => (
                                  <div
                                    className={cx(pointer)}
                                    role="button"
                                    tabIndex="0"
                                    onClick={() => routeToEditPage(`${search}&leaveType=${leaveName || index}&isLocal=${isLocal}&leaveCycleId=${leaveCycle}`, isEditable)}
                                    aria-hidden
                                  >
                                    {isConfig ? (
                                      <>
                                        {isEditable
                                      && (
                                      <span className={configContainer}>
                                        <img src={config} alt="edit" />
                                &nbsp;&nbsp;config
                                      </span>
                                      )}
                                      </>
                                    ) : (
                                      <span className={editContainer}>
                                        <span>
                                          <img src={isEditable ? blueEdit : viewIcon} alt="edit" className="pr-1" />
                                          {isEditable ? 'edit' : 'view'}
                                        </span>
                                      </span>
                                    )}
                                  </div>
                                )}
                                no={() => (
                                  <HasAccess
                                    permission={['LEAVE_CONFIG:VIEW']}
                                    orgId={orgId}
                                    yes={() => (
                                      <div
                                        className={cx(pointer)}
                                        role="button"
                                        tabIndex="0"
                                        onClick={() => routeToEditPage(`${search}&leaveType=${leaveName || index}&isLocal=${isLocal}&leaveCycleId=${leaveCycle}`, false)}
                                        aria-hidden
                                      >
                                        {isConfig ? (
                                          null
                                        ) : (
                                          <span className={editContainer}>
                                            <span>
                                              <img src={viewIcon} alt="edit" className="pr-1" />
                                    &nbsp;view
                                            </span>
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  />
                                )}
                              />

                            </td>
                          </tr>
                        ))}
                      </>
                    </tbody>
                  </table>
                  {get(restLeaveConfig, `${data}`, []).length >= footer.minDataLength
                    && get(restLeaveConfig, `${data}`, []).length <= footer.maxDataLength && (
                    <p className={cx(footer.className, 'mt-3')}>
                      {footer.img && <img src={footer.img} className="pr-2" alt="warn" /> }
                      {footer.text}
                    </p>
                  )}
                </div>
              );
            }
            return null;
          })}
        </div>

      </div>
    </>

  );
};

export default LeaveConfig;

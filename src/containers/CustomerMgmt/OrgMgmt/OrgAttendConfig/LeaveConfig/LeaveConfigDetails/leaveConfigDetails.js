/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import cx from 'classnames';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import { useRouteMatch, useLocation, useHistory } from 'react-router';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Button } from 'react-crux';
import styles from './leaveConfig.module.scss';
import ArrowLink from '../../../../../../components/Atom/ArrowLink/ArrowLink';
import CheckBox from '../../../../../../components/Atom/CheckBox/CheckBox';
import TagSearchModal from '../../../../../TagSearch/TagSearchModal/TagSearchModal';
import close from '../../../../../../assets/icons/closeNotification.svg';
import info from '../../../../../../assets/icons/infoMid.svg';
import {
  INIT, generateForm, convertFeildsToNumbers, numberFeilds, convertFeildsToString, sortAllArray,
} from './leaveConfigDetailsInitData';
import Spinnerload from '../../../../../../components/Atom/Spinner/Spinner';
import Notification from '../../../../../../components/Molecule/Notification/Notification';
import {
  clearError, getUrl, postCompoff, postLeaveConfig,
} from '../Store/action';

const {
  alignCenter,
  container,
  sectionHeading,
  horizontalLine,
  checkBoxText,
  checkMarkStyle,
  addLocationContainer,
  blueText,
  addIcon,
  locationNameContainer,
  closeTag,
  fixedHeader,
  formHeader,
  timeHeading,
  fixedTopHeader,
  locationInfoText,
} = styles;

const initialState = {
  formData: { ...INIT },
  showTagModal: false,
  selectTagType: 'include',
  tagInfo: [],
  errors: {},
  enableSubmit: false,
  triggeredFeild: null,
};

const LeaveConfigDetails = () => {
  const [state, setState] = useState(initialState);
  const {
    formData,
    showTagModal,
    selectTagType,
    tagInfo,
    errors,
    enableSubmit,
    triggeredFeild,
  } = state;

  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const type = urlParams.get('type');
  const leaveType = urlParams.get('leaveType');
  const isLocal = urlParams.get('isLocal') === 'true';
  const clientId = urlParams.get('clientId') || false;
  const vendorId = urlParams.get('vendorId') || false;
  const orgId = match.params.uuid;
  const dispatch = useDispatch();
  const orgMgmtRState = useSelector((rstate) => get(rstate, 'orgMgmt', {}), shallowEqual);
  const {
    loading, error, localConfiguredLeaves, localCompoffLeaves, localSuggestedLeavesCopy,
  } = get(orgMgmtRState, 'orgAttendConfig.leaveConfig', {});
  const { tagList } = get(orgMgmtRState, 'orgAttendConfig.holidayConfig', {});

  useEffect(() => () => {
    dispatch(clearError());
    // eslint-disable-next-line
    }, []);

  useEffect(() => {
    if (!localSuggestedLeavesCopy.length) {
      history.push(getUrl(`/customer-mgmt/org/${orgId}/attendconfig/leave-config`, clientId, vendorId, 'state=hardload'));
    }
    // eslint-disable-next-line
  }, [localSuggestedLeavesCopy]);

  const form = useMemo(generateForm, [leaveType]);

  // triggers whenever formdata type or error change, to validate enable condition
  useEffect(() => {
    let enable = location.state;
    form[type].feilds.forEach((rle) => {
      rle.forEach(({ name, required, condition }) => {
        if (required && (condition.isValid || get(formData, `${type}.${condition.key}`, '') === condition.value)) {
          enable = enable && !isEmpty(formData[type][name]) && isEmpty(errors[name]);
        }
      });
    });
    enable = enable && (formData[type].allTags || formData[type].includeTags.length > 0);
    setState((prev) => ({
      ...prev,
      enableSubmit: enable,
    }));
    // eslint-disable-next-line
  }, [formData, type, errors, form]);

  const updateFormData = (inputField, value) => {
    const updatedFormData = cloneDeep(formData);
    updatedFormData[type][inputField] = value;
    if (inputField === 'allTags' && value) {
      updatedFormData[type].includeTags = [];
    }
    setState({
      ...state,
      formData: updatedFormData,
      triggeredFeild: inputField,
    });
  };

  // updates leaveName from url to state
  useEffect(() => {
    if (type === 'leave') updateFormData('leaveName', leaveType);
    // eslint-disable-next-line
  }, [leaveType]);

  const handleTagInfo = useCallback(() => {
    const tagInfoList = [];
    if (!isEmpty(tagList)) {
      tagList.forEach((tag) => {
        tagInfoList.push({ uuid: tag.uuid, name: tag.name });
      });
    }
    setState((prev) => ({
      ...prev,
      tagInfo: tagInfoList,
    }));
  }, [tagList]);

  useEffect(() => {
    if (isLocal) {
      let editData = {};
      if (type === 'leave') editData = localConfiguredLeaves.filter((leaves) => leaveType === leaves.leaveName);
      else editData = [localCompoffLeaves[leaveType]];
      editData = editData.length > 0 ? editData[0] : {};
      const updatedFormData = cloneDeep(formData);
      updatedFormData[type] = convertFeildsToString(editData, numberFeilds[type]);
      setState((prev) => ({
        ...prev,
        formData: updatedFormData,
      }));
      handleTagInfo();
    }
    // eslint-disable-next-line
  }, [isLocal]);

  const updateErrorData = (inputField, err) => {
    const updatedErrorData = { ...errors };
    updatedErrorData[inputField] = err;
    if (!isEqual(errors, updatedErrorData)) {
      setState((prev) => ({
        ...prev,
        errors: updatedErrorData,
      }));
    }
  };

  const toggleTagModal = (tagType = 'include') => {
    setState({
      ...state,
      showTagModal: !showTagModal,
      selectTagType: tagType,
    });
  };

  const removeTag = (e, tagType, uuid) => {
    e.preventDefault();
    const newtagList = formData[type][tagType].filter((item) => item !== uuid);
    updateFormData(tagType, newtagList);
  };

  const showTags = (tagType) => {
    const tag = tagType === 'include' ? 'includeTags' : 'excludeTags';
    const displayTag = [];
    if (formData && formData[type] && formData[type][tag]) {
      formData[type][tag].forEach((tags) => {
        tagInfo.forEach((id) => {
          if (id.uuid === tags) {
            displayTag.push(id);
          }
        });
      });
    }
    return displayTag;
  };

  const handleGetUuidFromTagList = (tagLists) => {
    const updatedTagList = [];
    tagLists.forEach((item) => {
      updatedTagList.push(item.uuid);
    });
    return updatedTagList;
  };

  const handleGetTagFromTagList = (tagLists) => {
    const updatedTagList = [];
    tagLists.forEach((item) => {
      updatedTagList.push({ uuid: item.uuid, name: item.name });
    });
    return updatedTagList;
  };

  const handleTagChange = (event) => {
    const updatedFormData = cloneDeep(formData);
    const selectedTag = selectTagType === 'include' ? 'includeTags' : 'excludeTags';
    const tagData = handleGetTagFromTagList(event.value);
    const tagIdList = handleGetUuidFromTagList(event.value);
    updatedFormData[type][selectedTag] = [...tagIdList];
    const updatedTagInfo = cloneDeep(tagInfo);
    tagData.forEach((tagVal) => {
      if (isEmpty(updatedTagInfo) || !updatedTagInfo.some((t) => t.uuid === tagVal.uuid)) {
        updatedTagInfo.push(tagVal);
      }
    });
    setState({
      ...state,
      formData: updatedFormData,
      tagInfo: updatedTagInfo,
      showTagModal: false,
    });
  };

  const hideTags = (tagType) => {
    const tag = tagType === 'include' ? 'excludeTags' : 'includeTags';
    let hideTagsList = [];
    hideTagsList = formData[type][tag];
    return hideTagsList;
  };

  const getTagName = (uuid) => {
    let tagName = '';
    tagInfo.forEach((tag) => {
      if (tag.uuid === uuid) { tagName = tag.name; }
    });
    return tagName;
  };

  const submitData = () => {
    let postData = { ...formData[type] };
    postData = convertFeildsToNumbers(postData, numberFeilds[type]);
    if (type === 'leave') {
      if (postData.leaveName === 'ADD NEW LEAVE') {
        postData.leaveName = postData.newLeaveName;
        delete postData.newLeaveName;
      }
      if (postData.leavePolicy === 'ENCASH') {
        delete postData.numberOfdaysToForward;
      }
      if (postData.leavePolicy === 'CARRY_FORWARD') {
        delete postData.encashmentPercentage;
      }
      // hardcoded below data due to business logic issues
      postData.leaveCycleType = 'ANNUALLY';
      dispatch(postLeaveConfig({
        orgId,
        formdata: postData,
        history,
        url: getUrl(`/customer-mgmt/org/${orgId}/attendconfig/leave-config`, clientId, vendorId, 'state=reload'),
        isLocal,
        clientId,
        vendorId,
      }));
    } else {
      postData = sortAllArray(postData);
      dispatch(postCompoff(
        {
          orgId,
          formdata: postData,
          history,
          url: getUrl(`/customer-mgmt/org/${orgId}/attendconfig/leave-config`, clientId, vendorId, 'state=reload'),
          isLocal,
          index: leaveType,
          clientId,
          vendorId,
        },
      ));
    }
  };

  // console.log(formData[type])

  return (
    <div className={alignCenter}>
      <div className={fixedTopHeader}>
        <ArrowLink
          label="back"
          url={getUrl(`/customer-mgmt/org/${orgId}/attendconfig/leave-config`, clientId, vendorId, '?state=reload')}
        />
        <div style={{ pointerEvents: location.state ? 'all' : 'none' }}>
          <div className={fixedHeader}>
            <div className={cx(formHeader, 'row mx-0')} style={{ height: '3.5rem' }}>
              <div className={cx(timeHeading, 'col-8 mx-0 px-0')}>
                { error
                  ? (
                    <Notification
                      type="warning"
                      message={error}
                    />
                  )
                  : !enableSubmit && !loading
                    && (
                    <Notification
                      type="basic"
                      message="please fill all the mandatory fields to enable save"
                    />
                    )}
              </div>

              <div className="ml-auto d-flex my-auto">
                <div className={cx('row no-gutters justify-content-end')}>
                  {loading ? <Spinnerload type="loading" />
                    : (
                      <Button
                        label="done"
                        isDisabled={!enableSubmit}
                        clickHandler={submitData}
                        type="save"
                      />
                    )}
                </div>

              </div>

            </div>
          </div>
          <div className={container}>
            <div className="d-flex flex-column">
              <span className={cx(sectionHeading, 'pl-3')} style={{ paddingBottom: '2rem' }}>{form[type].heading}</span>
              {form[type].feilds.map((rEle, index) => (
                <div className="row no-gutters" key={index}>
                  {rEle.map(({
                    Component, condition, value, divClass, customValidators = [], trigger = 'null', ...rest
                  }) => (
                    (condition.isValid || get(formData, `${type}.${condition.key}`, '') === condition.value)
                  && (
                  <div className={cx('pl-3 my-1 py-2 pl-3 col-4', divClass)} key={value}>
                    <Component
                      value={get(formData, `${type}.${rest.name}`, null)}
                      onChange={(val) => updateFormData(rest.name, val)}
                      onSelectOption={(val) => updateFormData(rest.name, val)}
                      errors={errors[rest.name]}
                      onError={(err) => updateErrorData(rest.name, err)}
                      triggerValidation={triggeredFeild === trigger}
                      customValidators={customValidators.map((valid) => get(formData, `${type}.${valid}`, {}))}
                      {...rest}
                    />
                  </div>
                  )
                  ))}
                </div>
              ))}
              <hr className={horizontalLine} />
              <div className="d-flex flex-column pl-3">
                <div>
                  <span className={cx(sectionHeading)} style={{ paddingBottom: '1.5rem' }}>include location</span>
                  <span className={cx('float-right', locationInfoText)}>
                    atleast one location need to be added for configuring leaves
                    <img className="pl-2 pr-2" src={info} alt="info" />
                  </span>
                </div>
                <div className="d-flex flex-row ml-0 position-relative mt-1">
                  <div className="mr-3">
                    <span className={checkBoxText}>all location </span>
                  </div>
                  <CheckBox
                    type="medium"
                    name="allTags"
                    value={get(formData[type], 'allTags', false)}
                    onChange={() => updateFormData('allTags', !get(formData[type], 'allTags', false))}
                    checkMarkStyle={checkMarkStyle}
                  />
                </div>
                <div className="row no-gutters" style={{ marginTop: '1rem' }}>
                  <div disabled={get(formData[type], 'allTags', false)} className={cx(addLocationContainer, blueText)} onClick={() => toggleTagModal('include')} role="button" tabIndex="0" aria-hidden>
                    {'add location '}
                    <span className={addIcon}>+</span>
                  </div>
                  {get(formData, `${type}.includeTags`, []).map((tag) => (
                    <div key={tag} className={cx(locationNameContainer)}>
                      {`${getTagName(tag).toLowerCase()}`}
                      <div onClick={(e) => removeTag(e, 'includeTags', tag)} role="button" tabIndex="0" aria-hidden>
                        <img className={cx(closeTag)} src={close} alt="close tag" />
                      </div>
                    </div>
                  ))}
                </div>

                <span className={cx(sectionHeading)} style={{ paddingBottom: '1.5rem', marginTop: '1.5rem' }}>exclude location</span>
                <div className="row no-gutters">
                  <div className={cx(addLocationContainer, blueText)} onClick={() => toggleTagModal('exclude')} role="button" tabIndex="0" aria-hidden>
                    {'add location '}
                    <span className={addIcon}>+</span>
                  </div>
                  {get(formData, `${type}.excludeTags`, []).map((tag) => (
                    <div key={tag} className={cx(locationNameContainer)}>
                      {`${getTagName(tag).toLowerCase()}`}
                      <div onClick={(e) => removeTag(e, 'excludeTags', tag)} role="button" tabIndex="0" aria-hidden>
                        <img className={cx(closeTag)} src={close} alt="close tag" />
                      </div>
                    </div>
                  ))}
                </div>

                {showTagModal
                && (
                  <TagSearchModal
                    showModal={showTagModal}
                    tagType={`${selectTagType} location`}
                    placeholder="search location here"
                    tags={showTags(selectTagType)}
                    orgId={orgId}
                    selectTags={(value) => handleTagChange(value)}
                    disableTags={hideTags(selectTagType)}
                    closeModal={toggleTagModal}
                    category="geographical"
                    vendorId={vendorId}
                    clientId={clientId}
                  />
                )}
              </div>
              <hr className={horizontalLine} style={{ marginTop: '1.5rem' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveConfigDetails;

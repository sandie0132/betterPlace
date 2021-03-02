/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import cx from 'classnames';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { Button, Input, Datepicker } from 'react-crux';
import styles from './HolidayConfigDetails.module.scss';
import HasAccess from '../../../../../../services/HasAccess/HasAccess';
import ArrowLink from '../../../../../../components/Atom/ArrowLink/ArrowLink';
import Notification from '../../../../../../components/Molecule/Notification/Notification';
import CustomSelect from '../../../../../../components/Atom/CustomSelect/CustomSelect';
import CheckBox from '../../../../../../components/Atom/CheckBox/CheckBox';
import Prompt from '../../../../../../components/Organism/Prompt/Prompt';
import TagSearchModal from '../../../../../TagSearch/TagSearchModal/TagSearchModal';
import close from '../../../../../../assets/icons/closeNotification.svg';
import { InitData, requiredFields } from './HolidayConfigDetailsInitData';
import scrollStyle from '../../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import { validation, message } from './HolidayConfigValidations';
import Spinnerload from '../../../../../../components/Atom/Spinner/Spinner';
import info from '../../../../../../assets/icons/infoMid.svg';
import * as actions from '../Store/action';

class HolidayConfigDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: { ...InitData },
      showTagModal: false,
      selectTagType: 'include',
      removeHoliday: false,
      showRemoveHolidayPopup: false,
      tagInfo: [],
      errors: {},
      isEdited: false,
      enableSubmit: false,
      selectedYear: null,
    };
  }

  componentDidMount = () => {
    const {
      match,
      location,
      onGetHolidayConfig,
    } = this.props;
    const orgId = match.params.uuid;
    const query = new URLSearchParams(location.search);
    const year = query.get('year');
    const vendorQuery = { ...this.handleGetQueryParams() };
    this.setState({ selectedYear: year });
    if (!location.pathname.includes('/add')) {
      const { holidayId } = match.params;
      onGetHolidayConfig(orgId, holidayId, vendorQuery);
    }
  }

  componentDidUpdate = (prevProps) => {
    const { getHolidayConfigState, getTagListState } = this.props;

    if (getHolidayConfigState !== prevProps.getHolidayConfigState && getHolidayConfigState === 'SUCCESS') {
      this.handlePropsToState();
    }
    if (getTagListState !== prevProps.getTagListState && getTagListState === 'SUCCESS') {
      this.handleTagInfo();
    }
  }

  handlePropsToState = () => {
    const { holidayConfig } = this.props;
    let updatedFormData = { ...InitData };
    if (!isEmpty(holidayConfig)) {
      updatedFormData = { ...holidayConfig };
    }

    this.setState({ formData: updatedFormData, isEdited: false });
  }

  handleTagInfo = () => {
    const { tagList } = this.props;
    const tagInfoList = [];
    if (!isEmpty(tagList)) {
      tagList.forEach((tag) => {
        tagInfoList.push({ uuid: tag.uuid, name: tag.name });
      });
    }
    this.setState({ tagInfo: tagInfoList });
  }

  handleInputChange = (value, inputField) => {
    const { formData } = this.state;
    const updatedFormData = { ...formData };
    updatedFormData[inputField] = value;
    if (inputField === 'startDate' || inputField === 'endDate') {
      const week = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      if (!isEmpty(updatedFormData.startDate) && updatedFormData.startDate.length === 10) {
        if ((isEmpty(updatedFormData.endDate)) || (!isEmpty(updatedFormData.endDate) && updatedFormData.startDate === updatedFormData.endDate)) {
          const startDay = new Date(updatedFormData.startDate).getDay();
          updatedFormData.dayOfHoliday = week[startDay];
        } else if (!isEmpty(updatedFormData.endDate) && updatedFormData.endDate.length === 10 && updatedFormData.startDate < updatedFormData.endDate) {
          const startDay = new Date(updatedFormData.startDate).getDay();
          const endDay = new Date(updatedFormData.endDate).getDay();
          updatedFormData.dayOfHoliday = `${week[startDay]} - ${week[endDay]}`;
        }
      }
    }
    const enableSubmit = this.handleEnableSubmit(updatedFormData);
    this.setState({ formData: updatedFormData, isEdited: true, enableSubmit });
  }

  handleEnableSubmit = (formData) => {
    let enableSubmit = true;
    const updatedFormData = { ...formData };
    requiredFields.forEach((field) => {
      if (isEmpty(updatedFormData[field])) {
        enableSubmit = false;
      }
      if (updatedFormData.allTags || updatedFormData.includeTags.length > 0) enableSubmit = enableSubmit && true;
      else enableSubmit = false;
    });
    return enableSubmit;
  }

  handleCheckBox = (inputField) => {
    const { formData, removeHoliday } = this.state;
    const updatedFormData = { ...formData };
    if (inputField === 'removeHoliday') {
      this.setState({ removeHoliday: !removeHoliday });
    } else {
      updatedFormData[inputField] = !updatedFormData[inputField];
      if (updatedFormData[inputField]) {
        updatedFormData.includeTags = [];
      }
    }

    const enableSubmit = this.handleEnableSubmit(updatedFormData);
    this.setState({ formData: updatedFormData, enableSubmit });
  }

  toggleRemovePopup = (e) => {
    if (e) e.preventDefault();
    const { showRemoveHolidayPopup } = this.state;
    this.setState({ showRemoveHolidayPopup: !showRemoveHolidayPopup });
  }

  handleError = (error, inputField) => {
    const { errors } = this.state;
    const currentErrors = { ...errors };
    const updatedErrors = { ...currentErrors };
    if (!isEmpty(error)) {
      updatedErrors[inputField] = error;
    } else {
      delete updatedErrors[inputField];
    }
    if (!isEqual(updatedErrors, currentErrors)) {
      this.setState({
        errors: updatedErrors,
      });
    }
  };

  toggleTagModal = (type) => {
    const TagType = type || 'include';
    const { showTagModal } = this.state;
    this.setState({
      showTagModal: !showTagModal,
      selectTagType: TagType,
    });
  }

  showTags = (tagType) => {
    const type = tagType === 'include' ? 'includeTags' : 'excludeTags';
    const { formData, tagInfo } = this.state;
    const displayTag = [];
    if (formData) {
      if (formData[type]) {
        formData[type].forEach((tags) => {
          tagInfo.forEach((id) => {
            if (id.uuid === tags) {
              displayTag.push(id);
            }
          });
        });
      }
    }
    return displayTag;
  }

  hideTags = (tagType) => {
    const type = tagType === 'include' ? 'excludeTags' : 'includeTags';
    const { formData } = this.state;
    let hideTagsList = [];
    hideTagsList = formData[type];
    return hideTagsList;
  }

  handleCloseModal = () => {
    this.setState({
      showTagModal: false,
    });
  }

  handleGetUuidFromTagList = (tagList) => {
    const updatedTagList = [];
    tagList.forEach((item) => {
      updatedTagList.push(item.uuid);
    });
    return updatedTagList;
  }

  handleGetTagFromTagList = (tagList) => {
    const updatedTagList = [];
    tagList.forEach((item) => {
      updatedTagList.push({ uuid: item.uuid, name: item.name });
    });
    return updatedTagList;
  }

  getTagName = (uuid) => {
    const { tagInfo } = this.state;
    let tagName = '';
    tagInfo.forEach((tag) => {
      if (tag.uuid === uuid) { tagName = tag.name; }
    });
    return tagName;
  }

  handleTagChange = (event) => {
    const { formData, selectTagType, tagInfo } = this.state;
    const updatedFormData = { ...formData };
    const type = selectTagType === 'include' ? 'includeTags' : 'excludeTags';
    const tagData = this.handleGetTagFromTagList(event.value);
    const tagIdList = this.handleGetUuidFromTagList(event.value);
    updatedFormData[type] = tagIdList;

    const updatedTagInfo = [...tagInfo];
    tagData.forEach((tag) => {
      if (isEmpty(updatedTagInfo) || !updatedTagInfo.some((t) => t.uuid === tag.uuid)) {
        updatedTagInfo.push(tag);
      }
    });
    const enableSubmit = this.handleEnableSubmit(updatedFormData);
    this.setState({
      formData: updatedFormData,
      tagInfo: updatedTagInfo,
      showTagModal: false,
      enableSubmit,
    });
  };

  removeTag = (e, tagType, uuid) => {
    e.preventDefault();
    const { formData } = this.state;
    const updatedFormData = { ...formData };
    const type = tagType === 'include' ? 'includeTags' : 'excludeTags';
    const newtagList = formData[type].filter((item) => item !== uuid);
    updatedFormData[type] = newtagList;
    const enableSubmit = this.handleEnableSubmit(updatedFormData);
    this.setState({ formData: updatedFormData, enableSubmit });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      match,
      location,
      onPostHolidayConfig,
      onPutHolidayConfig,
      history,
    } = this.props;
    const { formData } = this.state;
    const orgId = match.params.uuid;
    const query = new URLSearchParams(location.search);
    const dest = `/customer-mgmt/org/${orgId}/attendconfig/holiday-config`;
    const vendorQuery = { ...this.handleGetQueryParams() };
    this.setState({ enableSubmit: false, isEdited: false, errors: {} });
    if (isEmpty(formData.endDate)) { formData.endDate = formData.startDate; }
    if (location.pathname.includes('/add')) {
      onPostHolidayConfig(
        orgId, formData, { history, dest, search: `?${query.toString()}` }, vendorQuery,
      );
    } else {
      const { holidayId } = match.params;
      onPutHolidayConfig(
        orgId, holidayId, formData, { history, dest, search: `?${query.toString()}` }, vendorQuery,
      );
    }
  }

  handleRemove = (e) => {
    e.preventDefault();
    const {
      match,
      history,
      location,
      onDeleteHolidayConfig,
    } = this.props;
    const orgId = match.params.uuid;
    const { holidayId } = match.params;
    const query = new URLSearchParams(location.search);
    const dest = `/customer-mgmt/org/${orgId}/attendconfig/holiday-config`;
    const vendorQuery = { ...this.handleGetQueryParams() };
    onDeleteHolidayConfig(
      orgId, holidayId, { history, dest, search: `?${query.toString()}` }, vendorQuery,
    );
    this.toggleRemovePopup();
  }

  handleGetQueryParams = () => {
    const { location } = this.props;
    const urlSearchParams = new URLSearchParams(location.search);
    if (urlSearchParams.get('vendorId')) {
      return { vendorId: urlSearchParams.get('vendorId') };
    }
    if (urlSearchParams.get('clientId')) {
      return { clientId: urlSearchParams.get('clientId') };
    }
    return {};
  }

  render() {
    const {
      match,
      location,
      error,
      postHolidayConfigState,
      putHolidayConfigState,
      gettHolidayConfigState,
      deleteHolidayConfigState,
    } = this.props;
    const orgId = match.params.uuid;
    const {
      formData,
      showTagModal,
      selectTagType,
      enableSubmit,
      errors,
      isEdited,
      showRemoveHolidayPopup,
    } = this.state;
    const { includeTags, excludeTags } = formData;

    let mandatoryFieldsFilled = enableSubmit;
    mandatoryFieldsFilled = this.handleEnableSubmit(formData);

    const urlSearchParams = new URLSearchParams(location.search);
    const viewOnly = !!urlSearchParams.get('vendorId');

    return (
      <>
        <Prompt
          when={postHolidayConfigState === 'ERROR' || putHolidayConfigState === 'ERROR' || deleteHolidayConfigState === 'ERROR' || isEdited}
        />
        <div className={cx(styles.alignCenter, scrollStyle.scrollbar)}>
          <div className={styles.fixedTopHeader}>
            <ArrowLink
              label="back"
              url={`/customer-mgmt/org/${orgId}/attendconfig/holiday-config?${urlSearchParams.toString()}`}
            />
            <div className={styles.fixedHeader}>
              <div className={cx(styles.formHeader, 'row mx-0')} style={{ height: '3.5rem' }}>
                {
                  !viewOnly
                  && (
                    <HasAccess
                      permission={['HOLIDAY_CONFIG:CREATE']}
                      orgId={orgId}
                      yes={() => (
                        <>
                          <div className={cx(styles.timeHeading, 'col-8 mx-0 px-0')}>
                            {(postHolidayConfigState === 'ERROR' || putHolidayConfigState === 'ERROR')
                              ? (
                                <Notification
                                  type="warning"
                                  message={error}
                                />
                              )
                              : !mandatoryFieldsFilled && gettHolidayConfigState !== 'LOADING'
                            && (
                              <Notification
                                type="basic"
                                message="please fill all the mandatory fields to enable save"
                              />
                            )}
                          </div>

                          <div className="ml-auto d-flex my-auto">
                            <div className={cx('row no-gutters justify-content-end')}>
                              {postHolidayConfigState === 'LOADING' || putHolidayConfigState === 'LOADING' ? <Spinnerload type="loading" />
                                : (
                                  <Button
                                    label="done"
                                    isDisabled={!(enableSubmit && isEmpty(errors))}
                                    clickHandler={(e) => this.handleSubmit(e)}
                                    type="save"
                                  />
                                )}
                            </div>

                          </div>
                        </>
                      )}
                    />
                  )
                }

              </div>
            </div>
          </div>
          <div className={styles.container}>
            <form>
              <div className="d-flex flex-column">
                {(location.pathname.includes('/add'))
                  ? (
                    <span className={cx(styles.sectionHeading, 'pl-3')} style={{ paddingBottom: '2rem' }}>configure new holiday</span>
                  )
                  : (
                    <span className={cx(styles.sectionHeading, 'pl-3')} style={{ paddingBottom: '2rem' }}>
                      {viewOnly
                        ? 'view configured holiday'
                        : 'edit configured holiday'}

                    </span>
                  )}
                <div className="row no-gutters">
                  <Input
                    name="holidayName"
                    placeholder=""
                    className="col-4 pl-3"
                    value={get(this.state, 'formData.holidayName', '')}
                    onChange={(val) => this.handleInputChange(val, 'holidayName')}
                    label="holiday name"
                    required={requiredFields.includes('holidayName')}
                    disabled={viewOnly}
                  />

                  <CustomSelect
                    name="holidayType"
                    className="my-1 col-4 py-2 pl-3"
                    label="holiday type"
                    required={requiredFields.includes('holidayType')}
                    options={[
                      { label: 'regional', value: 'REGIONAL' },
                      { label: 'public', value: 'PUBLIC' },
                    ]}
                    value={get(this.state, 'formData.holidayType', '')}
                    onChange={(value) => this.handleInputChange(value, 'holidayType')}
                    disabled={viewOnly}
                  />

                </div>

                <div className="row no-gutters">
                  <Datepicker
                    name="startDate"
                    placeholder=""
                    openCalendar
                    className={cx(styles.datePicker, 'col-4 pl-3')}
                    value={get(this.state, 'formData.startDate', '')}
                    onChange={(val) => this.handleInputChange(val, 'startDate')}
                    label="start date"
                    required
                    validation={validation.startDate}
                    message={message.startDate}
                    errors={errors.startDate}
                    onError={(err) => this.handleError(err, 'startDate')}
                    customValidators={[get(this.state, 'selectedYear', null)]}
                    disabled={viewOnly}
                  />

                  <Datepicker
                    name="endDate"
                    placeholder=""
                    openCalendar
                    className={cx(styles.datePicker, 'col-4 pl-3')}
                    value={get(this.state, 'formData.endDate', '')}
                    onChange={(val) => this.handleInputChange(val, 'endDate')}
                    label="end date"
                    validation={validation.endDate}
                    message={message.endDate}
                    errors={errors.endDate}
                    onError={(err) => this.handleError(err, 'endDate')}
                    customValidators={[get(this.state, 'formData.startDate', null), get(this.state, 'formData.endDate', null), get(this.state, 'selectedYear', null)]}
                    disabled={viewOnly}
                  />
                  <Input
                    placeholder="date of holiday"
                    className="col-4 pl-3"
                    value={get(this.state, 'formData.dayOfHoliday', '')}
                    onChange={(val) => this.handleInputChange(val, 'dayOfHoliday')}
                    label="date of holiday"
                    disabled
                  />

                </div>

                <div className="row no-gutters">
                  <Input
                    name="comments"
                    placeholder="add comment here"
                    className="col-4 pl-3"
                    value={get(this.state, 'formData.comments', '')}
                    onChange={(val) => this.handleInputChange(val, 'comments')}
                    label="comments"
                    disabled={viewOnly}
                  />

                </div>

                <hr className={styles.horizontalLine} />
                <div className="d-flex flex-column pl-3">
                  <div>
                    <span className={cx(styles.sectionHeading)} style={{ paddingBottom: '1.5rem' }}>include location</span>
                    <span className={cx('float-right', styles.locationInfoText)}>
                      atleast one location need to be added for configuring holiday
                      <img className="pl-2 pr-2" src={info} alt="info" />
                    </span>
                  </div>
                  <div className="d-flex flex-row ml-0 position-relative">
                    <div className="mr-3">
                      <span className={styles.checkBoxText}>all location </span>
                    </div>
                    <CheckBox
                      type="medium"
                      name="allTags"
                      value={get(this.state, 'formData.allTags', false)}
                      onChange={() => this.handleCheckBox('allTags')}
                      checkMarkStyle={styles.checkMarkStyle}
                      disabled={viewOnly}
                    />
                  </div>
                  <div className="row no-gutters" style={{ marginTop: '1rem' }}>
                    <div disabled={get(formData, 'allTags', false) || viewOnly} className={cx(styles.addLocationContainer, styles.blueText)} onClick={() => this.toggleTagModal('include')} role="button" tabIndex="0" aria-hidden>
                      {'add location '}
                      <span className={styles.addIcon}>+</span>
                    </div>
                    {includeTags && includeTags.map((tag) => (
                      <div key={tag} className={cx(styles.locationNameContainer)}>
                        {`${this.getTagName(tag).toLowerCase()}`}
                        <div disabled={viewOnly} onClick={(e) => this.removeTag(e, 'include', tag)} role="button" tabIndex="0" aria-hidden>
                          <img className={cx(styles.closeTag)} src={close} alt="close tag" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <span className={cx(styles.sectionHeading)} style={{ paddingBottom: '1.5rem', marginTop: '1.5rem' }}>exclude location</span>
                  <div className="row no-gutters">
                    <div disabled={viewOnly} className={cx(styles.addLocationContainer, styles.blueText)} onClick={() => this.toggleTagModal('exclude')} role="button" tabIndex="0" aria-hidden>
                      {'add location '}
                      <span className={styles.addIcon}>+</span>
                    </div>
                    {excludeTags && excludeTags.map((tag) => (
                      <div key={tag} className={cx(styles.locationNameContainer)}>
                        {`${this.getTagName(tag).toLowerCase()}`}
                        <div disabled={viewOnly} onClick={(e) => this.removeTag(e, 'exclude', tag)} role="button" tabIndex="0" aria-hidden>
                          <img className={cx(styles.closeTag)} src={close} alt="close tag" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {showTagModal
                    ? (
                      <TagSearchModal
                        showModal={showTagModal}
                        tagType={`${selectTagType} location`}
                        tags={this.showTags(selectTagType)}
                        orgId={orgId}
                        placeholder="search location here"
                        category="geographical"
                        selectTags={(value) => this.handleTagChange(value)}
                        disableTags={this.hideTags(selectTagType)}
                        closeModal={this.toggleTagModal}
                        vendorId={urlSearchParams.get('vendorId')}
                        clientId={urlSearchParams.get('clientId')}
                        disabled={viewOnly}
                      />
                    ) : null}
                </div>
                <hr className={styles.horizontalLine} style={{ marginTop: '1.5rem' }} />
                {showRemoveHolidayPopup

                  && (
                    <div className={styles.removeContainer}>
                      <div className="d-flex flex-row justify-content-between">
                        <span className={styles.removeContainerText} style={{ paddingTop: '8px' }}>{`are you sure you want to remove configure leave "${formData.holidayName}?"`}</span>
                        <div className="row mr-0">
                          <Button
                            type="noButton"
                            label="no"
                            clickHandler={(e) => this.toggleRemovePopup(e)}
                          />
                          <Button
                            type="yesButton"
                            className={styles.yesButton}
                            label="yes"
                            clickHandler={(e) => this.handleRemove(e)}
                          />
                        </div>
                      </div>

                    </div>
                  )}

                <div className="d-flex flex-row justify-content-between">
                  <div className="d-flex flex-row pl-3 position-relative">
                    {(!location.pathname.includes('/add') && !viewOnly)
                      && (
                        <>
                          <CheckBox
                            type="medium"
                            name="removeHoliday"
                            value={get(this.state, 'removeHoliday', false)}
                            onChange={(e) => this.toggleRemovePopup(e)}
                            checkMarkStyle={styles.checkMarkStyle}
                          />
                          <div className="ml-4">
                            <span className={styles.checkBoxText}>remove this configured holiday </span>
                          </div>
                        </>
                      )}
                  </div>

                </div>

              </div>

            </form>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  postHolidayConfigState: state.orgMgmt.orgAttendConfig.holidayConfig.postHolidayConfigState,
  putHolidayConfigState: state.orgMgmt.orgAttendConfig.holidayConfig.putHolidayConfigState,
  deleteHolidayConfigState: state.orgMgmt.orgAttendConfig.holidayConfig.deleteHolidayConfigState,
  getHolidayConfigState: state.orgMgmt.orgAttendConfig.holidayConfig.getHolidayConfigByIdState,
  holidayConfig: state.orgMgmt.orgAttendConfig.holidayConfig.holidayConfigData,
  getTagListState: state.orgMgmt.orgAttendConfig.holidayConfig.getTagInfoState,
  tagList: state.orgMgmt.orgAttendConfig.holidayConfig.tagList,
  error: state.orgMgmt.orgAttendConfig.holidayConfig.error,

});

const mapDispatchToProps = (dispatch) => ({
  onPostHolidayConfig: (orgId, config, params, query) => dispatch(actions.postHolidayConfig(orgId, config, params, query)),
  onPutHolidayConfig: (orgId, holidayId, config, params, query) => dispatch(actions.putHolidayConfig(orgId, holidayId, config, params, query)),
  onDeleteHolidayConfig: (orgId, holidayId, params, query) => dispatch(actions.deleteHolidayConfig(orgId, holidayId, params, query)),
  onGetHolidayConfig: (orgId, holidayId, query) => dispatch(actions.getHolidayConfigById(orgId, holidayId, query)),

});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HolidayConfigDetails));

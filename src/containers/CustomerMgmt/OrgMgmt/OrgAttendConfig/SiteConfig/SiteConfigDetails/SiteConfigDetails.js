/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
import React, { Component } from 'react';
import cx from 'classnames';
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';
import isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Map, Button, Input } from 'react-crux';
import styles from './SiteConfigDetails.module.scss';
import * as actions from '../Store/action';
import { requiredFields, message, validation } from './SiteConfigDetailsValidation';
import HasAccess from '../../../../../../services/HasAccess/HasAccess';
import Prompt from '../../../../../../components/Organism/Prompt/Prompt';
import ArrowLink from '../../../../../../components/Atom/ArrowLink/ArrowLink';
import TagSearchField from '../../../../../TagSearch/TagSearchField/TagSearchField';
import Notification from '../../../../../../components/Molecule/Notification/Notification';
import Loader from '../../../../../../components/Organism/Loader/Loader';
import TextArea from '../../../../../../components/Atom/TextArea/TextArea';
import building from '../../../../../../assets/icons/greyBuilding.svg';
import locationIcon from '../../../../../../assets/icons/currentAddressIcon.svg';
import map from '../../../../../../assets/icons/locationMapIcon.svg';
import close from '../../../../../../assets/icons/crossIcon.svg';
import Spinnerload from '../../../../../../components/Atom/Spinner/Spinner';
import CheckBox from '../../../../../../components/Atom/CheckBox/CheckBox';
import TagSearchModal from '../../../../../TagSearch/TagSearchModal/TagSearchModal';
import warning from '../../../../../../assets/icons/warning.svg';
import WarningPopUp from '../../../../../../components/Molecule/WarningPopUp/WarningPopUp';
import scrollStyle from '../../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';

class SiteConfigDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        siteId: '',
        siteCode: '',
        address: '',
        radius: null,
        lattitude: null,
        longitude: null,
      },
      siteName: [],
      isEdited: false,
      showModal: false,
      showWarning: false,
      enableSubmit: false,
      showCancelPopUp: false,
      errors: {},
      showNotification: false,
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    const { onGetAttendDataById, match } = this.props;
    const { uuid, siteId } = match.params;

    if (!isEmpty(siteId)) {
      const query = { ...this.handleGetQueryParams() };
      onGetAttendDataById(uuid, siteId, query);
    }
  }

  componentDidUpdate = (prevProps) => {
    const {
      getSiteConfigByIdState, getTagInfoState, postAttendSiteConfigState, putAttendSiteConfigState,
    } = this.props;
    if (prevProps.getSiteConfigByIdState !== getSiteConfigByIdState && getSiteConfigByIdState === 'SUCCESS') {
      this.handleGetTagInfo();
    }
    if (prevProps.getTagInfoState !== getTagInfoState && getTagInfoState === 'SUCCESS') {
      this.handlePropstoState();
    }

    if (postAttendSiteConfigState !== prevProps.postAttendSiteConfigState
      && (postAttendSiteConfigState === 'ERROR')) {
      this.handleNotificationTimeOut();
    }

    if (putAttendSiteConfigState !== prevProps.putAttendSiteConfigState
      && (putAttendSiteConfigState === 'ERROR')) {
      this.handleNotificationTimeOut();
    }

    if (putAttendSiteConfigState !== prevProps.putAttendSiteConfigState
      && (putAttendSiteConfigState === 'SUCCESS')) {
      this.handleNotificationTimeOut();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
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

  handleNotificationTimeOut = () => {
    this.setState({ showNotification: true, isEdited: false });

    setTimeout(() => {
      if (this._isMounted) {
        this.setState({ showNotification: false });
      }
    }, 5000);
  }

  handleLocationChange = (({ lat, lng, address }) => {
    // make use of lat and lng based on requirement
    this.handleInputChange({ target: { locationAddress: address, lattitude: lat, longitude: lng } }, 'location');
  })

  handleInputChange = (value, inputField, action) => {
    const { formData } = this.state;
    const updatedFormData = { ...formData };
    let site = [];
    switch (inputField) {
      case 'siteName': if (action === 'add') {
        site = [value.value];
        updatedFormData.siteId = value.value.uuid;
      } else {
        site = [];
        updatedFormData.siteId = '';
      }
        this.setState({
          siteName: site,
        });
        break;

      case 'location':
        updatedFormData.address = value.target.locationAddress;
        updatedFormData.lattitude = value.target.lattitude;
        updatedFormData.longitude = value.target.longitude;
        break;

      default: updatedFormData[inputField] = value;
    }
    const enable = this.handleEnableSubmit(updatedFormData);
    this.setState({
      formData: updatedFormData,
      isEdited: true,
      enableSubmit: enable,
    });
  };

  handleModalTags = (value) => {
    const { formData } = this.state;
    const updatedFormData = { ...formData };
    const site = [];

    site.push(value.value[0]);
    updatedFormData.siteId = value.value[0].uuid;
    this.setState({
      siteName: site,
      formData: updatedFormData,
      isEdited: true,
      showModal: false,
    });
  }

  handleGetTagInfo = () => {
    const { siteDataById, onGetTagInfo } = this.props;
    const propsData = { ...siteDataById };
    const tags = [propsData.siteId];
    const query = { ...this.handleGetQueryParams() };
    const sharedTag = !isEmpty(query);
    onGetTagInfo(tags, sharedTag);
  }

  handlePropstoState = () => {
    const { siteDataById, tags } = this.props;
    const { formData } = this.state;
    const propsData = { ...siteDataById };
    const stateData = { ...formData };
    const sites = [...tags];

    if (!isEmpty(propsData)) {
      stateData.siteId = propsData.siteId;
      stateData.siteCode = propsData.siteCode;
      stateData.address = propsData.address;
      stateData.radius = propsData.radius.toString();
      stateData.lattitude = propsData.lattitude;
      stateData.longitude = propsData.longitude;
    }
    this.setState({
      formData: stateData,
      siteName: sites,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const {
      match, onPostAttendSiteConfig, onPutAttendSiteConfig, history,
      location,
    } = this.props;
    const urlSearchParams = new URLSearchParams(location.search);
    const { formData, siteName } = this.state;
    const orgId = match.params.uuid;
    const payload = { ...formData };
    payload.radius = parseInt(payload.radius, 10);
    const { siteId } = match.params;
    const currSiteName = siteName[0].name;

    const query = { ...this.handleGetQueryParams() };
    if (!isEmpty(siteId)) {
      onPutAttendSiteConfig(orgId, payload, siteId, query);
    } else {
      const redirectUrl = `/customer-mgmt/org/${orgId}/attendconfig/site-config?${urlSearchParams.toString()}`;
      onPostAttendSiteConfig(orgId, payload, { redirectUrl, history }, currSiteName, query);
    }

    this.setState({
      isEdited: false,
      enableSubmit: false,
    });
  }

  handleShowModal = (event) => {
    event.preventDefault();
    this.setState({
      showModal: true,
      // selectTagType: selectTagType
    });
  }

  handleCloseModal = () => {
    this.setState({
      showModal: false,
    });
  }

  handleCheckBox = (event) => {
    let check = false;
    if (event.target.checked) {
      check = true;
    }
    this.setState({
      showWarning: check,
    });
  }

  deleteToggle = (event, value) => {
    event.preventDefault();
    if (value === 'yes') {
      const {
        match, onDeleteAttendSiteConfig, history, location,
      } = this.props;
      const { siteName } = this.state;
      const { siteId } = match.params;
      const orgId = match.params.uuid;
      const urlSearchParams = new URLSearchParams(location.search);
      const redirectUrl = `/customer-mgmt/org/${orgId}/attendconfig/site-config?${urlSearchParams.toString()}`;
      const currSiteName = siteName[0].name;
      const query = { ...this.handleGetQueryParams() };
      onDeleteAttendSiteConfig(orgId, siteId, { redirectUrl, history }, currSiteName, query);
      this.setState({
        isEdited: false,
        showWarning: false,
      });
    } else {
      this.setState({
        showWarning: false,
      });
    }
  }

  handleEnableSubmit = (formData) => {
    let enableSubmit = false;
    if (formData.siteId !== '' && formData.address !== '' && !isEmpty(formData.radius)) {
      enableSubmit = true;
    }
    return enableSubmit;
  }

  handleCancelPopUp = () => {
    const { isEdited, showCancelPopUp } = this.state;
    if (isEdited) {
      this.setState({
        showCancelPopUp: !showCancelPopUp,
      });
    }
  }

  handleCancel = () => {
    this.setState({
      enableSubmit: false,
      isEdited: false,
      showCancelPopUp: false,
    });
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

  handleShowNotification = () => {
    const {
      error, postAttendSiteConfigState, putAttendSiteConfigState, getSiteConfigByIdState,
    } = this.props;
    const { showNotification, formData, enableSubmit } = this.state;
    let mandatoryFieldsFilled = enableSubmit;
    mandatoryFieldsFilled = this.handleEnableSubmit(formData);

    if ((postAttendSiteConfigState === 'ERROR' || putAttendSiteConfigState === 'ERROR') && showNotification) {
      return {
        message: error,
        type: 'warning',
      };
    } if (putAttendSiteConfigState === 'SUCCESS' && showNotification) {
      return {
        message: 'site configuration successfuly updated',
        type: 'success',
      };
    } if (!mandatoryFieldsFilled && getSiteConfigByIdState !== 'LOADING') {
      return {
        message: 'please fill all the mandatory fields to enable save',
        type: 'basic',
      };
    } return false;
  }

  render() {
    const {
      match, history, getSiteConfigByIdState, putAttendSiteConfigState,
      location,
    } = this.props;
    const {
      formData, siteName, enableSubmit, showModal, showWarning, errors,
      showCancelPopUp, isEdited,
    } = this.state;
    const { siteId } = match.params;
    const orgId = match.params.uuid;
    const urlSearchParams = new URLSearchParams(location.search);
    const viewOnly = !!urlSearchParams.get('vendorId');

    return (
      <>
        <Prompt
          when={isEdited}
          navigate={(path) => history.push(path)}
        />

        <div className={styles.alignCenter}>

          {getSiteConfigByIdState === 'LOADING' ? (
            <div className={cx(scrollStyle.scrollbar, 'pt-4')}>
              <Loader type="onboardForm" />
            </div>
          )
            : (
              <>
                <form>
                  <div className={styles.fixedHeader}>
                    <ArrowLink
                      label="back to view/edit configued sites"
                      url={`/customer-mgmt/org/${orgId}/attendconfig/site-config?${urlSearchParams.toString()}`}
                    />

                    <div className={styles.formHeader} style={{ height: '3.5rem' }}>
                      {
                        !viewOnly
                        && (
                        <HasAccess
                          permission={['SITE_CONFIG:CREATE']}
                          orgId={orgId}
                          yes={() => (
                            <div className={cx(styles.formHeaderContent, 'row mx-0')}>
                              <div className={styles.timeHeading}>
                                { this.handleShowNotification()
                            && (
                              <Notification
                                type={this.handleShowNotification().type}
                                message={this.handleShowNotification().message}
                              />
                            )}
                              </div>
                              <div className="ml-auto d-flex">
                                <div className={cx('row no-gutters justify-content-end')}>
                                  {showCancelPopUp
                                    ? (
                                      <WarningPopUp
                                        text="cancel?"
                                        para="Warning: this cannot be undone"
                                        confirmText="yes, cancel"
                                        cancelText="keep"
                                        icon={warning}
                                        warningPopUp={this.handleCancel}
                                        closePopup={this.handleCancelPopUp}
                                      />
                                    )
                                    : null}
                                  {putAttendSiteConfigState === 'LOADING'
                                    ? <Spinnerload type="loading" />
                                    : (
                                      <Button
                                        type="save"
                                        label="done"
                                        clickHandler={(event) => this.handleSubmit(event)}
                                        isDisabled={!enableSubmit || !isEmpty(errors)}
                                      />
                                    )}
                                </div>
                              </div>
                            </div>
                          )}
                        />
                        )
                      }
                    </div>
                  </div>

                  <div className={styles.container}>
                    <div className="d-flex">
                      <div>
                        <img src={building} alt="site" height="18" />
                      </div>
                      <div className="pl-4 w-100">
                        <div className={styles.labelText}>
                          site name
                          <span className={styles.required}>*</span>
                        </div>
                        <div className="d-flex mt-2">
                          <div className={styles.borderBottom}>
                            {
                              isEmpty(siteName)
                                ? (
                                  <TagSearchField
                                    name="location"
                                    className={cx(styles.tagInputField, 'col-12')}
                                    placeholder="search for any tags and filter configured sites"
                                    orgId={orgId}
                                    category="geographical"
                                    tags={siteName}
                                    updateTag={(value, action) => this.handleInputChange(value, 'siteName', action)}
                                    dropdownMenu={styles.tagDropdown}
                                    noBorder
                                    imgSize={styles.searchIconSize}
                                    disabled={!isEmpty(siteId) || viewOnly}
                                    type="site"
                                    vendorId={urlSearchParams.get('vendorId')}
                                    clientId={urlSearchParams.get('clientId')}
                                  />
                                )
                                : (
                                  <div className={styles.selectedTagTab}>
                                    {siteName[0].name}
                                    {isEmpty(siteId)
                                      ? (
                                        <button type="button" onClick={() => this.handleInputChange([], 'siteName', 'delete')} className={styles.btn}>
                                          <img src={close} alt="close" className="ml-4" />
                                        </button>
                                      )
                                      : null}
                                  </div>
                                )
                            }

                          </div>
                          <div className="ml-auto" style={{ width: '12rem' }}>
                            <Button
                              type="save"
                              label="select from hierarchy"
                              isDisabled={!isEmpty(siteName) || !isEmpty(siteId) || viewOnly}
                              clickHandler={(event) => this.handleShowModal(event)}
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                    <div className="d-flex mt-4">
                      <div>
                        <img src={building} alt="site" height="18" />
                      </div>
                      <div className="w-100 pl-4">
                        <div className={styles.labelText}>enter site code</div>
                        <Input
                          name="siteCode"
                          onChange={(value) => this.handleInputChange(value, 'siteCode')}
                          placeholder="enter site code"
                          className="ml-0 pl-0 col-7"
                          value={formData.siteCode}
                          disabled={viewOnly}
                        />
                      </div>
                    </div>
                    <div className="d-flex mt-4">
                      <div>
                        <img src={locationIcon} alt="site" height="18" />
                      </div>
                      <div className="w-100 pl-4">
                        <div className={styles.labelText}>
                          set location address on map
                          <span className={styles.required}>*</span>
                        </div>
                        <Map
                          onLocationChange={this.handleLocationChange}
                          pos={{ lat: formData.lattitude, lng: formData.longitude }}
                          disabled={viewOnly}
                        />

                        <TextArea
                          name="address"
                          placeholder="location address"
                          className="col-7 pl-0"
                          value={formData.address}
                          rows="2"
                          maxLength="200"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex mt-4 pl-1">
                      <div>
                        <img src={map} alt="site" height="18" />
                      </div>
                      <div className="w-100 pl-4">
                        <div className={styles.labelText}>
                          enter attendance area for your site
                          <span className={styles.required}>*</span>
                        </div>
                        <div className="d-flex">
                          <Input
                            name="radius"
                            placeholder=""
                            className="ml-0 pl-0 col-1"
                            onChange={(value) => this.handleInputChange((value), 'radius')}
                            value={formData.radius}
                            required={includes(requiredFields, 'radius')}
                            validation={validation.radius}
                            message={message.radius}
                            errors={errors.radius}
                            onError={(err) => this.handleError(err, 'radius')}
                            disabled={viewOnly}
                          />
                          <span className={cx(styles.subHeading)} style={{ marginBottom: '0rem' }}>m</span>
                        </div>
                      </div>
                    </div>

                  </div>
                  {
                    showWarning ? (
                      <div className={styles.warningBg}>
                        <span className="pb-4">
                          are you sure to remove site &quot;
                          {siteName[0].name}
                          &quot; from attendance ?
                        </span>

                        <div className="d-flex mt-3">
                          <div className="ml-auto mr-auto">
                            <Button
                              type="noButton"
                              label="no"
                              clickHandler={(event) => this.deleteToggle(event, 'no')}
                            />
                            <Button
                              type="yesButton"
                              className={styles.yesButton}
                              label="yes"
                              clickHandler={(event) => this.deleteToggle(event, 'yes')}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.lineBg}>
                        <hr className={styles.horizontalLine} />
                        <div className={cx('row mx-0', styles.saveBg)}>
                          {!isEmpty(siteId) && !viewOnly
                            ? (
                              <CheckBox
                                type="small"
                                value={showWarning}
                                onChange={(event) => this.handleCheckBox(event)}
                                label="remove this site from attendance"
                                className="col-5 mr-4"
                                name="removeSite"
                                checkBoxStyle={styles.checkBoxStyle}
                              />
                            ) : null}
                          <div className={styles.alignLeft} />
                        </div>
                      </div>
                    )
                  }

                  {
                    showModal
                      ? (
                        <TagSearchModal
                          showModal={showModal}
                          tags={siteName}
                          orgId={orgId}
                          selectTags={(value) => this.handleModalTags(value, 'siteName')}
                          closeModal={this.handleCloseModal}
                          category="geographical"
                          type="site"
                          singleTagSelection
                          vendorId={urlSearchParams.get('vendorId')}
                          clientId={urlSearchParams.get('clientId')}
                        />
                      ) : null
                  }
                </form>
              </>
            )}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  getSiteConfigByIdState: state.orgMgmt.orgAttendConfig.siteConfig.getAttendSiteConfigState,
  postAttendSiteConfigState: state.orgMgmt.orgAttendConfig.siteConfig.postAttendSiteConfigState,
  putAttendSiteConfigState: state.orgMgmt.orgAttendConfig.siteConfig.putAttendSiteConfigState,
  deleteAttendSiteConfigState: state.orgMgmt.orgAttendConfig.siteConfig.deleteAttendSiteConfigState,
  siteDataById: state.orgMgmt.orgAttendConfig.siteConfig.siteConfigData,
  getTagInfoState: state.orgMgmt.orgAttendConfig.siteConfig.postTagInfoState,
  tags: state.orgMgmt.orgAttendConfig.siteConfig.tagList,
  error: state.orgMgmt.orgAttendConfig.siteConfig.error,
});

const mapDispatchToProps = (dispatch) => ({
  initState: () => dispatch(actions.initState()),
  onPostAttendSiteConfig:
    (orgId, config, routinParams, siteName, query) => dispatch(actions.postAttendSiteConfig(orgId, config, routinParams, siteName, query)),
  onPutAttendSiteConfig:
    (orgId, config, siteId, query) => dispatch(actions.putAttendSiteConfig(orgId, config, siteId, query)),
  onDeleteAttendSiteConfig:
  (orgId, config, siteId, routinParams, siteName, query) => dispatch(actions.deleteAttendSiteConfig(orgId, config, siteId, routinParams, siteName, query)),
  onGetAttendDataById: (orgId, siteId, query) => dispatch(actions.getAttendSiteConfig(orgId, siteId, query)),
  onGetTagInfo: (tagIdList, sharedTag) => dispatch(actions.getTagInfo(tagIdList, sharedTag)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SiteConfigDetails));

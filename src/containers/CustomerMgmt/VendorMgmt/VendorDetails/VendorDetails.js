/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { Button } from 'react-crux';
import _ from 'lodash';
import cx from 'classnames';
import styles from './VendorDetails.module.scss';
import themes from '../../../../theme.scss';

import CardHeader from '../../../../components/Atom/PageTitle/PageTitle';
import Upload from '../../../../components/Molecule/UploadDoc/UploadDoc';
import FileView from '../../../../components/Molecule/FileView/FileView';
import WarningPopUp from '../../../../components/Molecule/WarningPopUp/WarningPopUp';
import SuccessNotification from '../../../../components/Organism/Notifications/SuccessNotification/SuccessNotification';
import ErrorNotification from '../../../../components/Organism/Notifications/ErrorNotification/ErrorNotification';
import Spinnerload from '../../../../components/Atom/Spinner/Spinner';
import ArrowLink from '../../../../components/Atom/ArrowLink/ArrowLink';
import Loader from '../../../../components/Organism/Loader/Loader';
import RedDotTooltip from '../../../../components/Atom/RedDotTooltip/RedDotTooltip';
import OrgLogo from '../../../../components/Atom/OrgLogo/OrgLogo';

import container from '../../../../assets/icons/orgDetailsIcon.svg';
import upload from '../../../../assets/icons/upload.svg';
import vendorPhone from '../../../../assets/icons/vendorPhone.svg';
import vendorMail from '../../../../assets/icons/vendorMail.svg';
import warn from '../../../../assets/icons/warning.svg';
import editEmp from '../../../../assets/icons/editEmp.svg';
import spocProfile from '../../../../assets/icons/spocBackground.svg';
import inProgressApproval from '../../../../assets/icons/inprogressWithBg.svg';
import yellowTimer from '../../../../assets/icons/yellowTimer.svg';

import * as actions from './Store/action';
import * as actionTypes from './Store/actionTypes';
import * as actionsOnBoarding from '../VendorOnboarding/Store/action';

import HasAccess from '../../../../services/HasAccess/HasAccess';

class VendorDetails extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      submitSuccess: false,
      agreementUrl: [],
      deleteFileUrl: null,
      isEdit: true,
      confirmDelete: false,
    };
  }

  componentDidMount = () => {
    this._isMounted = true;
    const {
      match, vendorData, vendorOrgDetails, orgData,
    } = this.props;
    const orgId = match.params.uuid;
    let { vendorId } = match.params;

    if (vendorId) {
      let updatedAgreementUrl = [];
      if (!_.isEmpty(vendorData)) {
        updatedAgreementUrl = vendorData.attachments;
      } else {
        this.props.getVendorById(orgId, vendorId);
      }
      this.handleVendorContactPermission(vendorId);
      this.setState({ isEdit: false, agreementUrl: updatedAgreementUrl });
    } else {
      vendorId = vendorOrgDetails.uuid;
      if (vendorId) {
        this.props.onGetOrgName(vendorId);
        this.handleVendorContactPermission(vendorId);
      }
    }

    if (_.isEmpty(orgData)) {
      if (_.isEmpty(vendorId)) {
        const redirectUrl = `/customer-mgmt/org/${orgId}/vendor-mgmt?filter=vendors`;
        this.props.history.push(redirectUrl);
      }
    }
    this.props.clearOrg();
  }

  handleVendorContactPermission = (orgId) => {
    const thisRef = this;
    _.forEach(this.props.policies, (policy) => {
      if (_.includes(policy.businessFunctions, 'ORG_CONTACT:VIEW') || _.includes(policy.businessFunctions, '*')) {
        thisRef.props.onGetVendorContacts(orgId);
      }
    });
  }

  componentDidUpdate = (prevProps) => {
    const {
      match, vendorOrgDetails, agreementUrl, vendorData, deleteAgreementState, postDataState,
    } = this.props;
    let { vendorId } = match.params;
    if (!vendorId) vendorId = vendorOrgDetails.uuid;

    const orgId = match.params.uuid;

    if (prevProps.agreementUrl !== agreementUrl && !_.isEmpty(agreementUrl)) {
      // eslint-disable-next-line react/no-access-state-in-setstate
      const agreementList = !_.isEmpty(this.state.agreementUrl) ? this.state.agreementUrl : [];
      _.forEach(agreementUrl, (value) => {
        agreementList.push(value);
      });
      this.setState({ agreementUrl: agreementList, isEdit: true });
    }

    if (prevProps.vendorData !== vendorData && !_.isEmpty(vendorData)) {
      this.setState({ agreementUrl: vendorData.attachments, isEdit: false });
    }

    if (prevProps.deleteAgreementState !== deleteAgreementState && deleteAgreementState === 'SUCCESS') {
      this.handleAgreementFile();
    }

    if (prevProps.postDataState !== postDataState && postDataState === 'SUCCESS') {
      this.props.handleShowModal(false);
      this.setState({ submitSuccess: true, isEdit: false });
      this.props.history.push(`/customer-mgmt/org/${orgId}/vendor-mgmt/vendor/${vendorId}/config/vendordetails`);
      setTimeout(() => {
        if (this._isMounted) {
          this.setState({ submitSuccess: false });
        }
      }, 3000);
    }
  }

  componentWillUnmount = () => {
    this._isMounted = false;
    this.props.getInitState();
  }

  handleAgreementFile = () => {
    const { deleteFileUrl } = this.state;
    const agreementUrl = [];
    _.forEach(this.state.agreementUrl, (file) => {
      if (file !== deleteFileUrl) {
        agreementUrl.push(file);
      }
    });
    this.setState({ agreementUrl });
  }

  handleBack = () => {
    if (this.props.showModal) {
      this.props.initOnboardingDetails();
    }
  }

  fileUpload = (file) => {
    const formData = new FormData();
    const type = 'vendor_documents';
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < file.length; i++) {
      formData.append('file', file[i]);
    }
    this.props.onFileUpload(type, formData);
  }

  showDeleteFileWarning = (e, url) => {
    e.stopPropagation();
    const deleteObject = {
      url,
    };
    this.setState({
      confirmDelete: true,
      deleteObject,
    });
  }

  deleteFile = () => {
    const { url } = this.state.deleteObject;
    let fileName = _.isEmpty(url) ? '' : url.split('/');
    fileName = fileName[fileName.length - 1];
    this.setState({ deleteFileUrl: url, confirmDelete: false });
    this.props.onDeleteFile('vendor_documents', fileName, url);
  }

  handleFileDownload = (url) => {
    this.props.onDownloadFile('vendor_documents', url);
  }

  handleSubmit = () => {
    const {
      match, vendorOrgDetails, vendorData, getOrgName,
    } = this.props;
    const orgId = match.params.uuid;

    let { vendorId } = match.params;
    if (!vendorId) vendorId = vendorOrgDetails.uuid;

    const agreementDocList = [];

    _.forEach(this.state.agreementUrl, (value) => {
      agreementDocList.push(value);
    });

    let data = {
      orgId,
      vendorId,
      functions: [],
      locations: [],
      attachments: agreementDocList,
      status: vendorData.status ? vendorData.status : '',
    };
    this.setState({ showSaveButton: true, isEdit: false });
    setTimeout(() => {
      this.setState({ showSaveButton: false });
    }, 2000);

    if (match.params.vendorId) {
      const updateData = { ...vendorData };
      updateData.attachments = agreementDocList;
      this.props.onPutVendorData(orgId, vendorId, data, updateData);
    } else {
      const updateData = {
        ...data,
        address: getOrgName.address,
        contactPerson: getOrgName.contactPerson,
        brandColor: getOrgName.brandColor,
        vendorLegalName: getOrgName.legalName,
      };
      data = { ...data, status: 'pendingapproval' };
      this.props.onPostVendorData(orgId, data, updateData);
    }
  }

  handleCloseSuccessNotification = () => {
    this.setState({ submitSuccess: false });
  };

  errorClickedHandler = () => {
    this.props.onResetError();
  }

  handleEnableEdit = () => {
    this.setState({ isEdit: true });
  }

  render() {
    const {
      t, match, vendorData, vendorDataState, getOrgName, getOrgNameState,
      orgData, getDocType, getDocNumber, error,
      agreementState, deleteAgreementState, downloadFileState, postDataState, putVendorDataState,
      vendorContactsList,
    } = this.props;

    const {
      submitSuccess, isEdit, agreementUrl, showSaveButton, confirmDelete,
    } = this.state;

    const orgId = match.params.uuid;
    const vendor = match.params.vendorId ? vendorData : getOrgName;
    const vendorName = match.params.vendorId ? vendorData.vendorLegalName ? vendorData.vendorLegalName : 'company' : getOrgName.legalName;

    const NotificationPan = (submitSuccess)
      ? (
        <div className={
          submitSuccess
            ? cx(styles.ShowSuccessNotificationCard, 'flex align-items-center')
            : cx(styles.HideSuccessNotificationCard)
      }
        >
          <SuccessNotification
            message={`vendor request has been sent successfully to ${vendorName} and waiting for approval`}
            className="d-flex mb-4"
            clicked={this.handleCloseSuccessNotification}
            type="agencyNotification"
          />
        </div>
      )
      : (error)
        ? (
          <div className={(error) ? cx(styles.ShowErrorNotificationCard, 'flex align-items-center') : cx(styles.HideErrorNotificationCard)}>
            <ErrorNotification type="agencyErrorNotification" error={error} clicked={this.errorClickedHandler} className="d-flex mb-4" />
          </div>
        ) : '';

    return (
      <>
        {vendorDataState === 'LOADING' || getOrgNameState === 'LOADING'
          ? (
            <div className={styles.alignCenter}>
              <Loader />
            </div>
          )
          : (
            <div className={styles.alignCenter}>
              <div onClick={this.handleBack} style={{ width: 'max-content' }}>
                <ArrowLink
                  label={!_.isEmpty(orgData) ? orgData.nameInLowerCase + t('translation_vendorDetails:label') : 'company'}
                  url={`/customer-mgmt/org/${orgId}/vendor-mgmt?filter=vendors`}
                />
              </div>
              <CardHeader label={t('translation_vendorDetails:cardHeader')} iconSrc={container} />
              {NotificationPan}
              <div className={cx(styles.CardLayout, 'card')}>

                <div className={cx(styles.CardPadding, 'card-body')}>
                  {this._isMounted && !match.params.vendorId
                    ? (
                      <div>
                        {!_.isEmpty(getDocType)
                          ? (
                            <div>
                              <div className="row no-gutters">
                                <div className={cx(styles.Input, 'col-4 pr-3 d-flex flex-column-reverse my-1')}>
                                  <input
                                    className={styles.InputElement}
                                    type="text"
                                    disabled
                                    value={getDocNumber}
                                    style={{ backgroundColor: themes.primaryBackground }}
                                  />
                                  <label className={cx(styles.LabelWithValue)}>
                                    {getDocType === 'VENDOR' ? `${getDocType.toLowerCase()} name` : `${getDocType} number`}
                                    <span className={styles.requiredStar}>{' *'}</span>
                                  </label>
                                </div>
                                <Link to={`/customer-mgmt/org/${orgId}/vendor-mgmt?filter=vendors`}>
                                  <img
                                    className={styles.image}
                                    src={editEmp}
                                    alt=""
                                    onClick={() => this.props.handleShowModal(true)}
                                  />
                                </Link>
                              </div>
                              <div className="row ml-auto">
                                <label className={styles.Italic}>
                                  {t('translation_vendorDetails:heading.fetch')}
                                  {' '}
                                  {getDocType === 'VENDOR' ? `${getDocType.toLowerCase()} name` : `${getDocType} number`}
                                </label>
                              </div>
                            </div>
                          )
                          : ''}
                      </div>
                    )
                    : ''}

                  {!_.isEmpty(vendor)
                    ? (
                      <div className={cx(styles.Border, 'mb-2 col-12')}>
                        <label className={styles.OrgHeading}>{vendorName}</label>

                        <div className={cx('row no-gutters col-4 px-0')}>
                          <label className={styles.smallCardHeading}>{t('translation_vendorDetails:heading.companyAddress')}</label>
                        </div>

                        <div className="row no-gutters">
                          {!_.isEmpty(vendor.address)
                            ? (
                              <div className="col-4 px-0">
                                <div className="d-flex flex-column">
                                  <label className={styles.smallLabel}>
                                    {`${vendor.address.addressLine1},`}
                                  </label>

                                  {vendor.address.addressLine2
                                    ? (
                                      <label className={styles.smallLabel}>
                                        {`${vendor.address.addressLine2},`}
                                      </label>
                                    ) : null}

                                  <div className="row no-gutters">
                                    <label className={styles.smallLabel}>
                                      {`${vendor.address.city}, ${vendor.address.state}, ${vendor.address.pincode}`}
                                    </label>
                                  </div>
                                </div>

                              </div>
                            )
                            : ''}
                          <div className="ml-auto">
                            <div className="row no-gutters justify-content-betweeen">
                              <OrgLogo
                                name={vendorName}
                                brandColor={vendor.brandColor}
                              />
                            </div>
                          </div>
                        </div>

                        <hr className={styles.HorizontalLine} />
                        <div className="row no-gutters col-4 px-0">
                          <label className={styles.smallCardHeading}>{t('translation_vendorDetails:heading.contact')}</label>
                        </div>

                        {!_.isEmpty(vendorContactsList)
                          ? (
                            <div className="d-flex flex-row flex-wrap">
                              {vendorContactsList.map((item) => (
                                <div className="col-6 pl-0 mb-3 pr-3" key={item.uuid}>
                                  <div className={cx(styles.contactBackground)}>
                                    <div className="row no-gutters">
                                      <div className="col-3 mt-2">
                                        <img height="90%" src={spocProfile} alt={t('translation_vendorDetails:image_alt_vendorDetails.vendorProfile')} />
                                      </div>

                                      <div className="col-9 px-0">
                                        <div className={styles.flexDirection}>
                                          <label className={styles.contactFullName}>
                                            {item.fullName}
                                          </label>
                                        </div>

                                        <div className={styles.flexDirection}>
                                          <span className="">
                                            <label className={styles.contactInfo}>
                                              {item.label ? item.label : ''}
                                            </label>
                                            <label className={styles.contactInfo}>
                                              {item.label && item.designation ? ' | ' : null}
                                              {item.designation ? item.designation : '--'}
                                            </label>
                                          </span>
                                        </div>

                                        <div className={styles.flexDirection}>
                                          <div className="pr-2">
                                            <img src={vendorPhone} alt={t('translation_vendorDetails:image_alt_vendorDetails.vendorPhone')} />
                                          </div>
                                          <div>
                                            <label className={cx('pl-1', styles.contactInfo)}>{item.phoneNumber}</label>
                                          </div>
                                        </div>

                                        <div className={styles.flexDirection}>
                                          <div className="pr-2">
                                            <img src={vendorMail} alt={t('translation_vendorDetails:image_alt_vendorDetails.vendorMail')} />
                                          </div>
                                          <div>
                                            <label className={styles.contactInfo}>
                                              {item.emailAddress}
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                          : !_.isEmpty(vendor.contactPerson)
                            ? (
                              <>
                                <div className="col-6 pl-0 mb-3 pr-3">
                                  <div className={cx(styles.contactBackground)}>
                                    <div className="row no-gutters">
                                      <div className="col-3 mt-2">
                                        <img height="90%" src={spocProfile} alt={t('translation_vendorDetails:image_alt_vendorDetails.vendorProfile')} />
                                      </div>

                                      <div className="col-9 px-0">
                                        <div className={styles.flexDirection}>
                                          <label className={styles.contactFullName}>
                                            {vendor.contactPerson.fullName}
                                          </label>
                                        </div>

                                        <div className={styles.flexDirection}>
                                          <span className="">
                                            <label className={styles.contactInfo}>
                                              {vendor.contactPerson.label ? vendor.contactPerson.label : ''}
                                            </label>
                                            <label className={styles.contactInfo}>
                                              {vendor.contactPerson.label && vendor.contactPerson.designation ? ' | ' : null}
                                              {vendor.contactPerson.designation ? vendor.contactPerson.designation : '--'}
                                            </label>
                                          </span>
                                        </div>

                                        <div className={styles.flexDirection}>
                                          <div className="pr-2">
                                            <img src={vendorPhone} alt={t('translation_vendorDetails:image_alt_vendorDetails.vendorPhone')} />
                                          </div>
                                          <div>
                                            <label className={cx('pl-1', styles.contactInfo)}>{vendor.contactPerson.phoneNumber}</label>
                                          </div>
                                        </div>

                                        <div className={styles.flexDirection}>
                                          <div className="pr-2">
                                            <img src={vendorMail} alt={t('translation_vendorDetails:image_alt_vendorDetails.vendorMail')} />
                                          </div>
                                          <div>
                                            <label className={styles.contactInfo}>
                                              {vendor.contactPerson.emailAddress}
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )
                            : ''}
                      </div>
                    )
                    : ''}
                  <div className="row ml-0 mt-4">
                    <span className={styles.LabelWithValue}>{t('translation_vendorDetails:heading.upload')}</span>
                  </div>

                  <div className="d-flex">
                    <div>
                      <Upload
                        vendorDetails
                        upload={upload}
                        disabled={!isEdit}
                        fileUpload={(file) => this.fileUpload(file)}
                        addState={agreementState}
                        className={isEdit ? styles.Cursor : ''}
                      />
                    </div>
                    <div>
                      <div className="d-flex flex-wrap">
                        {!_.isEmpty(agreementUrl)
                          ? agreementUrl.map((url, index) => (
                            <FileView
                              // eslint-disable-next-line react/no-array-index-key
                              key={index}
                              className={cx(styles.Preview, 'ml-2 mb-2')}
                              url={url}
                              fileClicked={downloadFileState === 'LOADING' ? null : () => this.handleFileDownload(url)}
                              downloadFileState={downloadFileState}
                              clicked={(e) => this.showDeleteFileWarning(e, url)}
                              disabled={!isEdit}
                            />
                          )) : ''}
                      </div>
                    </div>
                  </div>
                  <div className="row no-gutters justify-content-end">
                    {match.params.vendorId && vendorData.status !== 'active'
                      ? (
                        <RedDotTooltip
                          icon={yellowTimer}
                          info={`waiting for the approval from ${vendorName}`}
                          yellow
                        />
                      )
                      : vendorData.status !== 'active'
                        ? (
                          <RedDotTooltip
                            icon={inProgressApproval}
                            info="adding vendor need approval from vendor admin"
                          />
                        ) : null}
                    <span className="mr-2" />

                    {
                      postDataState === 'LOADING' || putVendorDataState === 'LOADING'
                        ? <Spinnerload type="loading" />
                        : showSaveButton
                          ? error ? <Spinnerload /> : <Spinnerload type="success" />
                          : isEdit || error
                            ? (
                              <HasAccess
                                permission={['VENDOR:EDIT', 'VENDOR:ADD']}
                                orgId={orgId}
                                yes={() => (
                                  <Button
                                    label={match.params.vendorId ? t('translation_vendorDetails:save') : t('translation_vendorDetails:add')}
                                    isDisabled={agreementState === 'LOADING' || deleteAgreementState === 'LOADING'}
                                    clickHandler={this.handleSubmit}
                                  />
                                )}
                              />
                            )
                            : (
                              <HasAccess
                                permission={['VENDOR:EDIT']}
                                orgId={orgId}
                                yes={() => <Button label={t('translation_vendorDetails:edit')} clickHandler={this.handleEnableEdit} type="edit" />}
                              />
                            )
                    }

                  </div>
                  {confirmDelete
                    ? (
                      <WarningPopUp
                        text={t('translation_vendorDetails:warning_delete.text')}
                        para={t('translation_vendorDetails:warning_delete.para')}
                        confirmText={t('translation_vendorDetails:warning_delete.confirmText')}
                        cancelText={t('translation_vendorDetails:warning_delete.cancelText')}
                        icon={warn}
                        warningPopUp={() => this.deleteFile()}
                        closePopup={() => this.setState({
                          confirmDelete: false, deleteObject: {},
                        })}
                      />
                    )
                    : null}
                </div>
              </div>
            </div>
          )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  getDocType: state.vendorMgmt.vendorOnboarding.docType,
  getDocNumber: state.vendorMgmt.vendorOnboarding.docNumber,
  vendorOrgDetails: state.vendorMgmt.vendorOnboarding.orgData,
  showModal: state.vendorMgmt.vendorOnboarding.showModal,

  agreementUrl: state.vendorMgmt.vendorDetails.agreementUrl,
  vendorData: state.vendorMgmt.vendorDetails.getVendorData,
  vendorDataState: state.vendorMgmt.vendorDetails.getVendorDataState,
  postDataState: state.vendorMgmt.vendorDetails.postDataState,
  putVendorDataState: state.vendorMgmt.vendorDetails.putVendorDataState,
  deleteAgreementState: state.vendorMgmt.vendorDetails.deleteAgreementState,
  getOrgName: state.vendorMgmt.vendorDetails.getOrgName,
  agreementState: state.vendorMgmt.vendorDetails.agreementState,
  getOrgNameState: state.vendorMgmt.vendorDetails.getOrgNameState,
  downloadFileState: state.vendorMgmt.vendorDetails.downloadFileState,
  vendorContactsList: state.vendorMgmt.vendorDetails.vendorContactsList,
  vendorContactsListState: state.vendorMgmt.vendorDetails.vendorContactsListState,
  error: state.vendorMgmt.vendorDetails.error,

  orgData: state.orgMgmt.staticData.orgData,

  policies: state.auth.policies,
});

const mapDispatchToProps = (dispatch) => ({
  getInitState: () => dispatch(actions.initState()),
  onPostVendorData: (orgId, data, updateData) => dispatch(
    actions.postVendorData(orgId, data, updateData),
  ),
  onFileUpload: (type, file) => dispatch(actions.fileUpload(type, file)),
  onDeleteFile: (type, file, url) => dispatch(actions.deleteFile(type, file, url)),
  onGetOrgName: (orgId) => dispatch(actions.getOrgName(orgId)),
  onGetVendorContacts: (orgId) => dispatch(actions.getVendorContacts(orgId)),
  onDownloadFile: (type, url) => dispatch(actions.downloadFile(type, url)),
  getVendorById: (orgId, vendorId) => dispatch(actions.getVendorData(orgId, vendorId)),
  onPutVendorData: (orgId, vendorId, data, updateData) => dispatch(
    actions.putVendorData(orgId, vendorId, data, updateData),
  ),

  onResetError: () => dispatch({ type: actionTypes.RESET_ERROR }),

  initOnboardingDetails: () => dispatch(actionsOnBoarding.initState()),
  handleShowModal: (value) => dispatch(actionsOnBoarding.handleShowModal(value)),
  clearOrg: () => dispatch(actionsOnBoarding.clearOrg()),
});

export default withTranslation()(withRouter(
  connect(mapStateToProps, mapDispatchToProps)(VendorDetails),
));

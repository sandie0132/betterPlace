/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import _ from 'lodash';

import cx from 'classnames';
import { withTranslation } from 'react-i18next';
import { VendorIcon } from 'react-crux';
import styles from './ProfileBasicInfo.module.scss';

import ProfilePicStatus from '../../../../../components/Organism/ProfilePicStatus/ProfilePicStatus';
import * as imageStoreActions from '../../../../Home/Store/action';
// import * as reportActions from '../../EmpBgvReport/Store/action';
// import DownloadButton from '../../../../../components/Atom/DownloadButton/DownloadButton';

import phone from '../../../../../assets/icons/phone.svg';
import location from '../../../../../assets/icons/locationIcon.svg';
import fb from '../../../../../assets/icons/fb.svg';
import twitter from '../../../../../assets/icons/twitter.svg';
import linkedin from '../../../../../assets/icons/linkedin.svg';
import insta from '../../../../../assets/icons/instagram.svg';
import HasAccess from '../../../../../services/HasAccess/HasAccess';
import greenCase from '../../../../../assets/icons/greenCase.svg';
import redCase from '../../../../../assets/icons/verifyRed.svg';
import amberCase from '../../../../../assets/icons/verifyYellow.svg';
import greyCase from '../../../../../assets/icons/inprogress.svg';
import terminateIcon from '../../../../../assets/icons/terminate.svg';
import hiredIcon from '../../../../../assets/icons/greenTick.svg';
import prehiredIcon from '../../../../../assets/icons/loading.svg';
// import downArrow from '../../../../../assets/icons/downArrow.svg';
// import arrowDown from '../../../../../assets/icons/greyDropdown.svg';
// import greyDownload from '../../../../../assets/icons/greyDownload.svg';
// import Loader from '../../../../../components/Organism/Loader/Loader';

const months = {
  '01': 'january',
  '02': 'february',
  '03': 'march',
  '04': 'april',
  '05': 'may',
  '06': 'june',
  '07': 'july',
  '08': 'august',
  '09': 'september',
  10: 'october',
  11: 'november',
  12: 'december',
};

class ProfileBasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDownloadMenu: false,
    };
  }

  componentDidMount() {
    const { empData, onGetProfilePic } = this.props;
    if (empData.profilePicUrl) {
      onGetProfilePic(empData.uuid, empData.profilePicUrl);
    }
  }

  // calculate age
  getAge = (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }
    return age;
  }

  // statusOfEmployee
  handleStatusIcon = (status) => {
    if (status === 'HIRED') return hiredIcon;
    if (status === 'PRE_HIRED') return prehiredIcon;
    return terminateIcon;
  }

  // latestWorKExperience = (workList) => {
  //   let latestWork = workList[0];
  //   let lastWorkDate = new Date(workList[0].workedUntil);
  //   _.forEach(workList, function (value, key) {
  //     let currentDate = new Date(value.workedUntil);
  //     if (lastWorkDate < currentDate) {
  //       lastWorkDate = currentDate;
  //       latestWork = value
  //     }
  //   })
  //   return latestWork;
  // }
  handleOutsideClick = (e) => {
    if (!_.isEmpty(this.node)) {
      if (this.node.contains(e.target)) {
        return;
      }
      this.handleClick();
    }
  }

  handleClick = (event) => {
    const { showDownloadMenu } = this.state;
    if (event) {
      event.preventDefault();
    }
    if (!showDownloadMenu) {
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }
    this.setState((prevState) => ({
      showDownloadMenu: !prevState.showDownloadMenu,
    }));
  }

  downloadZipHandler = (type) => {
    const {
      match, empData, onDownloadZip, onDownloadSummaryPdf,
    } = this.props;
    const orgId = match.params.uuid;
    const { empId } = match.params;
    const fileName = `${empData.firstName ? empData.firstName : ''}${empData.lastName ? `_${empData.lastName}` : ''}${empData.employeeId ? `_${empData.employeeId}` : ''}`;

    if (type === 'zip') {
      onDownloadZip(orgId, empId, `${fileName}_summary`);
    } else if (type === 'summarypdf') {
      onDownloadSummaryPdf(orgId, empId, `${fileName}_report`);
    }
  }

  render() {
    const {
      t, match, empData, serviceStatus, AccountsProfile, images, reDraw, orgData,
      defaultRole, defaultLocation, verificationStatus,
    } = this.props;

    const { empId } = match.params;
    const orgId = match.params.uuid;
    const IconObject = {
      facebook: fb,
      twitter,
      linkedin,
      instagram: insta,
    };
    let phno = null;
    _.forEach(empData.contacts, (contact) => {
      if (contact.type === 'MOBILE' && contact.isPrimary === true) phno = contact.contact;
    });

    // let workExperience = '';
    // if (!_.isEmpty(empData.workDetails)) {
    //   workExperience = this.latestWorKExperience(empData.workDetails);
    // }

    //  updateAfterVerificationInitiation
    const empVerificationStatus = (verificationStatus === 'done') ? (!_.isEmpty(serviceStatus) && !_.isEmpty(serviceStatus.profile)) ? serviceStatus.profile.clientStatus === 'GREEN' ? <img src={greenCase} alt="green" className={cx('pl-2', styles.Size)} />
      : serviceStatus.profile.clientStatus === 'RED' ? <img src={redCase} alt="red" className={cx('pl-2', styles.Size)} />
        : serviceStatus.profile.clientStatus === 'YELLOW' ? <img src={amberCase} alt="amber" className={cx('pl-2', styles.Size)} />
          : <img src={greyCase} alt="grey" style={{ height: '1.2rem' }} className={cx('pl-2 pb-1', styles.Size)} /> : ''
      : (verificationStatus === 'inProgress') ? <img src={greyCase} alt="grey" style={{ height: '1.2rem' }} className={cx('pl-2 pb-1', styles.Size)} />
        : '';

    let createdOnDate = '';
    let modifiedOnDate = '';

    if (!_.isEmpty(empData) && !_.isEmpty(empData.createdOn)) {
      createdOnDate = empData.createdOn.split(' ');
      createdOnDate = createdOnDate[0].split('-');
      createdOnDate = `${createdOnDate[2]} ${months[createdOnDate[1]]} ${createdOnDate[0]}`;

      if (!_.isEmpty(empData.modifiedOn)) {
        modifiedOnDate = empData.modifiedOn.split(' ');
        modifiedOnDate = modifiedOnDate[0].split('-');
        modifiedOnDate = `${modifiedOnDate[2]} ${months[modifiedOnDate[1]]} ${modifiedOnDate[0]}`;
      }
    }

    const deployedTo = [];
    if (!_.isEmpty(empData.deployedTo)) {
      _.forEach(empData.deployedTo, (dep) => {
        deployedTo.push(dep);
      });
    }

    // let subVendorData = {}; let vendorData = {};
    // let clientData = {}; let superClientData = {};
    // if (vendorClientInfoState === 'SUCCESS' && !_.isEmpty(vendorClientInfo)
    //   && !_.isEmpty(vendorClientInfo.profileData)) {
    //   vendorClientInfo.profileData.map((eachInfo) => {
    //     if (eachInfo.type === 'superClient') {
    //       superClientData = eachInfo;
    //     }
    //     if (eachInfo.type === 'client') {
    //       clientData = eachInfo;
    //     }
    //     if (eachInfo.type === 'vendor') {
    //       vendorData = eachInfo;
    //     }
    //     if (eachInfo.type === 'subVendor') {
    //       subVendorData = eachInfo;
    //     }
    //     return null;
    //   });
    // }

    return (
      <div className={cx(styles.Card, 'col-12')}>
        {AccountsProfile
          ? <ProfilePicStatus />
          : (
            <div className={cx('card-body d-flex flex-row', styles.HeadCard)}>

              <div className={cx(' mx-4 pb-4', styles.Pic)}>
                <ProfilePicStatus
                  src={empData.profilePicUrl ? (images[empId]
                    ? images[empId].image : null)
                    : null}
                  serviceStatus={serviceStatus}
                  reDraw={reDraw}
                />
                {empData.status !== 'TERMINATED'
                  ? (
                    <HasAccess
                      permission={['EMP_PROFILE:EDIT']}
                      orgId={orgId}
                      yes={() => (
                        <NavLink to={`/customer-mgmt/org/${orgId}/employee/onboard/${empId}/basic-details`}>
                          <div className={cx(styles.smallButton)}>
                            {t('translation_empProfile:texts_empProfile.profileBasicInfo.editProfile')}
                          </div>
                        </NavLink>
                      )}
                      no={() => (
                        <HasAccess
                          permission={['EMP_MGMT:DOCUMENT_GENERATION']}
                          orgId={orgId}
                          yes={() => (
                            <NavLink to={`/customer-mgmt/org/${orgId}/employee/onboard/${empId}/document-generation/digital-signature`}>
                              <div className={cx(styles.smallButton)}>
                                {t('translation_empProfile:texts_empProfile.profileBasicInfo.editProfile')}
                              </div>
                            </NavLink>
                          )}
                        />
                      )}
                    />
                  ) : null}
              </div>

              <div className="ml-1 pt-1 pb-4 flex-column" style={{ width: '100%' }}>
                <label htmlFor="firstName" className={styles.orgHeading}>
                  {empData.firstName}
                  {!_.isEmpty(empData.lastName) ? ` ${empData.lastName}` : ''}
                  {empData.dob || empData.gender
                    ? <hr className={cx(styles.verticalLine, 'ml-2')} /> : ''}
&nbsp;
                  {!_.isEmpty(empData.dob)
                    ? <label htmlFor="dob" className="mr-2 mb-0">{this.getAge(empData.dob)}</label>
                    : null}
                  {empData.gender ? (empData.gender).toLowerCase() : null}

                  {empVerificationStatus}
                </label>
                <div className={cx(styles.tagText, 'pl-0 d-flex flex-row')}>
                  {defaultRole}
                  {' '}
                  @&nbsp;
                  {!_.isEmpty(orgData) ? orgData.name : ''}
                  {/* <hr className={styles.verticalLine} />&nbsp; */}
                  {empData.employeeId ? (` | ${empData.employeeId}`) : null}
                  <VendorIcon
                    id={empData.uuid}
                    deployedTo={!_.isEmpty(deployedTo) ? deployedTo : []}
                    sourceOrg={!_.isEmpty(empData.source_org_name) ? `${empData.source_org_name}` : ''}
                    originOrg={!_.isEmpty(empData.origin_org_name) ? `${empData.origin_org_name}` : ''}
                    deplength={!_.isEmpty(empData.deployedTo) ? empData.deployedTo.length : ''}
                  />
                </div>

                {!_.isEmpty(empData.status)
                  ? (
                    <div className={cx('d-flex flex-row mt-1', styles.hireContainer)}>
                      <img
                        className={cx('my-auto', styles.statusIcon)}
                        src={this.handleStatusIcon(empData.status)}
                        alt=""
                        style={empData.status === 'HIRED' ? { height: '9px' } : { height: '12px' }}
                      />
                      <label htmlFor="status" className={styles.statusText}>{empData.status.toLowerCase().replace(/_/g, '-')}</label>
                      {/* <hr className={cx(styles.statusVerticleLine)} /> */}
                    </div>
                  ) : null}

                {!_.isEmpty(empData.createdOn)
                  ? (
                    <div className={cx('d-flex flex-row mt-1', styles.CreatedOnText)}>
                      <i>
                        created on
                        {' '}
                        {createdOnDate}
                      </i>
&nbsp;
                      {!_.isEmpty(modifiedOnDate) ? (
                        <i>
                          | last modified on
                          {' '}
                          {modifiedOnDate}
                        </i>
                      ) : ''}
                    </div>
                  ) : null}

                <div className="row no-gutters">
                  {!_.isEmpty(defaultLocation)
                    ? (
                      <div className={cx(styles.locationText, 'pl-0 py-2')}>
                        <img src={location} alt={t('translation_empProfile:image_alt_empProfile.profileBasicInfo.location')} className="pr-2" />
                        {defaultLocation}
                      </div>
                    ) : null}
                </div>

                <div className={cx(styles.locationText, 'pl-0 mt-1 pr-2')}>
                  {phno !== null ? (
                    <span>
                      <img src={phone} alt={t('translation_empProfile:image_alt_empProfile.profileBasicInfo.phone')} className="pr-1" />
                      {' '}
                      {phno}
                      {' '}
                    </span>
                  ) : ''}
                  &nbsp;&nbsp;
                  {!_.isEmpty(empData.socialNetworks)
                    ? empData.socialNetworks.map((social) => (
                      <span key={social.uuid}>
                        <a href={social.profileUrl} rel="noopener noreferrer" target="_blank" style={{ textDecoration: 'none' }}>
&nbsp;
                          <img src={IconObject[social.platform.toLowerCase()]} alt={t('translation_empProfile:image_alt_empProfile.profileBasicInfo.img')} className=" ml-2" />
                        </a>
                      </span>
                    )) : null}
                </div>
              </div>
            </div>
          )}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  empData: state.empMgmt.empProfile.empData,
  orgData: state.empMgmt.staticData.orgData,
  serviceStatus: state.empMgmt.empProfile.serviceStatus,
  verificationStatus: state.empMgmt.empProfile.verificationStatus,
  error: state.empMgmt.empProfile.error,
  images: state.imageStore.images,
  vendorClientInfoState: state.empMgmt.empProfile.vendorClientInfoState,
  vendorClientInfo: state.empMgmt.empProfile.vendorClientInfo,
});

const mapDispatchToProps = (dispatch) => ({
  onGetProfilePic: (empId, filePath) => dispatch(imageStoreActions.getProfilePic(empId, filePath)),
  // onDownloadZip: (orgId, empId, fileName) => dispatch(
  // reportActions.downloadZip(orgId, empId, fileName)),
  // onDownloadSummaryPdf: (orgId, empId, fileName) => dispatch(reportActions
  //   .downloadPdf(orgId, empId, fileName)),
});
export default withTranslation()(withRouter(connect(mapStateToProps,
  mapDispatchToProps)(ProfileBasicInfo)));

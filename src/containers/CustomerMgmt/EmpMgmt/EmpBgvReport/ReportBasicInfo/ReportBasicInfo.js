/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import cx from 'classnames';
import _ from 'lodash';
import { withRouter } from 'react-router';
import styles from './ReportBasicInfo.module.scss';
import locationIcon from '../../../../../assets/icons/locationIcon.svg';
import phone from '../../../../../assets/icons/phone.svg';
import ProfilePicStatus from '../../../../../components/Organism/ProfilePicStatus/ProfilePicStatus';
import DownloadButton from '../../../../../components/Atom/DownloadButton/DownloadButton';
import info from '../../../../../assets/icons/info.svg';
import tick from '../../../../../assets/icons/verifyTick.svg';
import HasAccess from '../../../../../services/HasAccess/HasAccess';
import * as actions from '../Store/action';
import redTag from '../../../../../assets/icons/redTag.svg';
import yellowTag from '../../../../../assets/icons/yellowTag.svg';
import greenTag from '../../../../../assets/icons/greenTag.svg';
import inprogressTag from '../../../../../assets/icons/inprogressTag.svg';
import * as imageStoreActions from '../../../../Home/Store/action';

class ReportBasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // zipFile: '',
      showDownloadMenu: false,
    };
  }

  componentDidMount() {
    const {
      match, empData, onGetRoleTagData, onGetLocationTagData, onGetProfilePic,
    } = this.props;
    const { empId } = match.params;

    if (!_.isEmpty(empData.defaultRole)) {
      const tag = [];
      tag.push(empData.defaultRole);
      onGetRoleTagData(tag);
    }
    if (!_.isEmpty(empData.defaultLocation)) {
      const tag = [];
      tag.push(empData.defaultLocation);
      onGetLocationTagData(tag);
    }

    if (!_.isEmpty(empData)) {
      if (!_.isEmpty(empData.profilePicUrl)) { // profile picture
        onGetProfilePic(empId, empData.profilePicUrl);
      }
    }
  }

  // componentDidUpdate(prevProps) {
  //   const { downloadPdfState, zip } = this.props;
  //   const { zipFile } = this.this.state;

  //   let lzip = _.cloneDeep(zipFile);
  //   if (prevProps.downloadPdfState !== downloadPdfState && downloadPdfState === 'SUCCESS') {
  //     lzip = zip;
  //     // eslint-disable-next-line react/no-did-update-set-state
  //     this.setState({
  //       zipFile: lzip,
  //     });
  //   }
  // }

  componentWillUnmount() {
    const {
      onClearRoleTagInfo,
    } = this.props;
    onClearRoleTagInfo();
  }

  // latestWorKExperience = (workList) => {
  //     let latestWork = workList[0];
  //     let lastWorkDate = new Date(workList[0].workedUntil);
  //     _.forEach(workList, function (value, key) {
  //         let currentDate = new Date(value.workedUntil);
  //         if (lastWorkDate < currentDate) {
  //             lastWorkDate = currentDate;
  //             latestWork = value
  //         }
  //     })
  //     return latestWork;
  // }

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

    handleColor = (status) => {
      if (status === 'red') {
        return { fontFamily: 'Gilroy-bold', color: '#EE3942' };
      }
      if (status === 'green') {
        return { fontFamily: 'Gilroy-bold', color: '#4BB752' };
      } if (status === 'yellow') {
        return { fontFamily: 'Gilroy-bold', color: '#FEBC02' };
      }
      return null;
    }

    downloadZipHandler = (type) => {
      const {
        empData, onDownloadZip, onDownloadSummaryPdf,
      } = this.props;
      const fileName = `${empData.firstName ? empData.firstName : ''}${empData.lastName ? `_${empData.lastName}` : ''}${empData.employeeId ? `_${empData.employeeId}` : ''}`;
      if (type === 'zip') {
        onDownloadZip(empData.orgId, empData.uuid, `${fileName}_summary`);
      } else if (type === 'summarypdf') {
        onDownloadSummaryPdf(empData.orgId, empData.uuid, `${fileName}_report`);
      }
    }

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

    render() {
      const {
        match, empData, bgvData, orgData, finalResult, defaultLocation, defaultRole,
        images, downloadSummaryPdfState, location, // downloadPdfState,
      } = this.props;
      const orgId = match.params.uuid;
      const { empId } = match.params;
      // const { showDownloadMenu } = this.state;

      // let workExperience = '';
      // if (!_.isEmpty(empData.workDetails)) {
      //     workExperience = this.latestWorKExperience(empData.workDetails);
      // }

      let contact = '';
      if (!_.isEmpty(empData.contacts)) {
        _.forEach(empData.contacts, (value) => {
          if (value.type === 'MOBILE') {
            contact = value.contact;
          }
        });
      }

      const clientStatus = !_.isEmpty(bgvData.profile) && !_.isEmpty(bgvData.profile.clientStatus) ? bgvData.profile.clientStatus : '';
      const platformStatus = !_.isEmpty(bgvData.profile) && !_.isEmpty(bgvData.profile.platformStatus) ? bgvData.profile.platformStatus : '';

      let empVerificationStatus = <img src={inprogressTag} alt="grey" />;
      if (finalResult === 'GREEN') empVerificationStatus = <img src={greenTag} alt="green" />;
      else if (finalResult === 'YELLOW') empVerificationStatus = <img src={yellowTag} alt="amber" />;
      else if (finalResult === 'RED') empVerificationStatus = <img src={redTag} alt="red" />;

      return (
          <div className={cx('d-flex flex-column col-12 px-0', styles.ProfileCard)}>
            <div className={cx('d-flex  p-2')}>
              <div className={cx('d-flex flex-column align-items-center px-4 pb-4 pt-0')}>
                {!_.isEmpty(bgvData)
                  ? (
                    <div>
                      <ProfilePicStatus
                        src={empData.profilePicUrl ? (images[empId]
                          ? images[empId].image : null) : null}
                        serviceStatus={bgvData}
                        index={empId}
                        reDraw={!images[empId]}
                      />
                    </div>
                  )
                  : null}
                <HasAccess
                  permission={['EMP_PROFILE:EDIT']}
                  orgId={orgId}
                  yes={() => (
                    <NavLink to={{ pathname: `/customer-mgmt/org/${orgId}/employee/${empId}/profile`, state: { prevPath: location.pathname, label: 'report' } }}>
                      <div
                        className={cx('mt-2 mx-auto ', styles.ShareProfile)}
                      >
                        <label className={cx(styles.ShareFontProfile)}>view profile</label>
                      </div>
                    </NavLink>
                  )}
                />
              </div>
              {!_.isEmpty(empData)
                ? (
                  <div className={cx('d-flex flex-column align-items-start flex-grow-1 pt-0 pb-4')}>

                    <div className={cx('d-inline-flex py-2', styles.BasicInfo)}>
                      <span className={styles.Name}>
                        {empData.firstName}
                        {' '}
                        {empData.lastName}
&nbsp;
                      </span>
                      {empData.dob || empData.gender
                        ? <div className={styles.VerticalLine} />
                        : ''}
&nbsp;
                      {empData.dob ? `${this.getAge(empData.dob)}` : ''}
&nbsp;
                      {!_.isEmpty(empData.gender) ? empData.gender.toLowerCase() : ''}
&nbsp;
                      {empVerificationStatus}
&nbsp;&nbsp;

                      {/* {verificationResult} */}
                    </div>
                    <div className={cx(styles.TagText, 'd-inline-flex pb-2')}>
                      <span style={{ paddingTop: '0.5rem' }}>
                        {!_.isEmpty(defaultRole) ? `${defaultRole[0].name} @` : ''}
                        {!_.isEmpty(orgData.name) ? <span>{orgData.name}</span> : null}
&nbsp;
                      </span>
                      {!_.isEmpty(empData.employeeId)
                        ? (
                          <>
                            <div className={styles.VerticalLine} style={{ height: '1rem' }} />
                            {' '}
                            <span style={{ paddingTop: '0.5rem' }}>
&nbsp;
                              {empData.employeeId}
                            </span>
                            {' '}

                          </>
                        )
                        : null}
                    </div>
                    {!_.isEmpty(empData.status)
                      ? (
                        <div className={cx('d-inline-flex flex-row mt-1', styles.Hired)}>
                          <img src={tick} alt="tick" />
&nbsp;
                          {empData.status.toLowerCase()}
                        </div>
                      ) : ''}
                    <div className="row no-gutters w-100">
                      {!_.isEmpty(defaultLocation)
                        ? (
                          <div className={cx(styles.TagText, 'pt-2')}>
                            <span>
                              <img src={locationIcon} alt="locationIcon" className="pr-2" />
                              {defaultLocation[0].name}
                            </span>
                          </div>
                        ) : ''}

                      <HasAccess
                        permission={['BGV:DOWNLOAD_REPORT']}
                        orgId={orgId}
                        yes={() => (
                          <div className="ml-auto no-gutters mr-3">
                            <DownloadButton
                                        // type="excelDownload"
                              label="download pdf report"
                              downloadState={
                                                      downloadSummaryPdfState === 'LOADING' ? 'LOADING' : 'INIT'
                                                }
                              clickHandler={downloadSummaryPdfState === 'LOADING' ? null : () => this.downloadZipHandler('summarypdf')}
                            />
                          </div>
                        )}
                      />
                    </div>

                    <div className="row no-gutters w-100 pr-4">
                      {!_.isEmpty(contact)
                        ? (
                          <div className={cx(styles.TagText, 'pl-0 pt-2 ')}>
                            <img src={phone} alt="phone" className="pr-2" />
                            {contact}
                          </div>
                        ) : null}

                    </div>

                  </div>
                ) : null}
            </div>
            <div className={cx('d-flex')}>
              {clientStatus !== platformStatus ? (
                <div className={styles.Notify}>
                  <img className="ml-4 pl-2" src={info} alt="info" />
                  <label className={cx(styles.Label, 'ml-2')}>
                    profile final status has been changed to
                    <span style={this.handleColor(clientStatus.toLowerCase())}>
                      {clientStatus.toLowerCase()}
                      {' '}
                      case
                      {' '}
                    </span>
                    {' '}
                    from betterplace default status
                    <span style={this.handleColor(platformStatus.toLowerCase())}>
                      {platformStatus.toLowerCase()}
                      {' '}
                      case
                    </span>
                  </label>
                </div>
              ) : ''}
            </div>
          </div>
      );
    }
}

const mapStateToProps = (state) => ({
  zip: state.empMgmt.empReport.zipFile,
  downloadPdfState: state.empMgmt.empReport.downloadPdfState,
  defaultRole: state.empMgmt.empReport.roleTag,
  defaultLocation: state.empMgmt.empReport.locationTag,
  globalDbPdf: state.empMgmt.empReport.globaldbPdf,
  //downloadGlobaldbPdfState: state.empMgmt.empReport.downloadGlobaldbPdfState,
  //downloadCrcPdfState: state.empMgmt.empReport.downloadCrcPdfState,
  //downloadPerCrcPdfState: state.empMgmt.empReport.downloadPerCrcPdfState,
  crcCurPdf: state.empMgmt.empReport.crcCurPdf,
  crcPerPdf: state.empMgmt.empReport.crcPerPdf,
  images: state.imageStore.images,

  summaryPdf: state.empMgmt.empReport.summaryPdf,
  downloadSummaryPdfState: state.empMgmt.empReport.downloadSummaryPdfState,
});

const mapDispatchToProps = (dispatch) => ({
  onDownloadZip: (orgId, empId, fileName) => dispatch(actions.downloadZip(orgId, empId, fileName)),
  onDownloadSummaryPdf: (orgId, empId, fileName) => dispatch(actions
    .downloadPdf(orgId, empId, fileName)),
  onGetRoleTagData: (tag) => dispatch(actions.getRoleTagData(tag)),
  onGetLocationTagData: (tag) => dispatch(actions.getLocationTagData(tag)),
  //onDownloadGlobalDbPdf: (filename) => dispatch(actions.downloadGlobalDbPdf(filename)),
  //onDownloadCurCrcPdf: (url) => dispatch(actions.downloadCrcPdf(url)),
  //onDownloadPerCrcPdf: (url) => dispatch(actions.downloadPerCrcPdf(url)),
  onGetProfilePic: (empId, filePath) => dispatch(imageStoreActions.getProfilePic(empId, filePath)),
  onClearRoleTagInfo: () => dispatch(actions.clearRoleTagInfo()),

});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReportBasicInfo));

/* eslint-disable prefer-destructuring */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';
import queryString from 'query-string';
import cx from 'classnames';
import styles from './EmpProfile.module.scss';

import ProfileBasicInfo from './ProfileBasicInfo/ProfileBasicInfo';
import Profile from './Profile/Profile';
import ProfileVerify from './ProfileVerify/ProfileVerify';
import ProfileAttendance from './ProfileAttendance/ProfileAttendance';

import * as actions from './Store/action';
import { getOrgDetails } from '../EmpMgmtStore/action';

import MissingNotification from '../../../../components/Organism/Notifications/SuccessNotification/SuccessNotification';
import ArrowLink from '../../../../components/Atom/ArrowLink/ArrowLink';
import Loader from '../../../../components/Organism/Loader/Loader';
import scrollStyle from '../../../../components/Atom/ScrollBar/ScrollBar.module.scss';

import profileIcon from '../../../../assets/icons/idDocuments.svg';
import attendIcon from '../../../../assets/icons/attendance.svg';
import verifyIcon from '../../../../assets/icons/verify.svg';
import onboardIcon from '../../../../assets/icons/onboard.svg';

class EmpProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      empId: '',
      empMissingData: [],
      empMissingDataMessage: '',
      empInsufficientInfo: [],
      empInsufficientInfoMessage: '',
      profileSection: 'profile',
    };
  }

  componentDidMount() {
    const {
      match, orgData, servicesEnabled,
      onGetProfileData, onGetOrgDetails,
    } = this.props;
    const orgId = match.params.uuid;
    const { empId } = match.params;

    if (empId) {
      this.setState({ empId });
      onGetProfileData(empId, orgId);
    }
    if (!_.isEmpty(orgData)) {
      if (!_.isEmpty(servicesEnabled)) {
        this.handleBgvDetailsApi();
      }
    } else {
      onGetOrgDetails(orgId);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { empId, empMissingData, empInsufficientInfo } = this.state;
    const {
      location,
      getEmpDataState,
      empData,
      onGetTagName,
      servicesEnabled,
      getEmpMissingDataState,
      employeeMissingData,
      employeeInsufficientInfo,
    } = this.props;
    let tagArray = [];
    if (prevProps.getEmpDataState !== getEmpDataState && getEmpDataState === 'SUCCESS') {
      if (!_.isEmpty(empData) && !_.isEmpty(empId)) {
        if (!_.isEmpty(empData.tags)) {
          tagArray = empData.tags.filter((tag) => {
            if (tagArray.includes(tag)) return null;
            return tagArray.push(tag);
          });
        }
        if (!_.isEmpty(empData.defaultRole) && !tagArray.includes(empData.defaultRole)) {
          tagArray = [...tagArray, empData.defaultRole];
        }
        if (!_.isEmpty(empData.defaultLocation) && !tagArray.includes(empData.defaultLocation)) {
          tagArray = [...tagArray, empData.defaultLocation];
        }
        if (tagArray.length > 0) {
          onGetTagName(tagArray);
        }
      }
    }

    if (!_.isEqual(servicesEnabled, prevProps.servicesEnabled)
    || !_.isEqual(location.search, prevProps.location.search)) {
      this.handleBgvDetailsApi();
    }

    if (prevProps.getEmpMissingDataState !== getEmpMissingDataState && getEmpMissingDataState === 'SUCCESS') {
      this.dataFormat(employeeMissingData, 'missingData');
      this.dataFormat(employeeInsufficientInfo, 'insufficientInfo');
    }

    if (prevState.empMissingData.length !== empMissingData.length
      && empMissingData.length > 0) {
      this.msgFormation(empMissingData, 'missingData');
    }

    if (prevState.empInsufficientInfo.length !== empInsufficientInfo.length
      && empInsufficientInfo.length > 0) {
      this.msgFormation(empInsufficientInfo, 'insufficientInfo');
    }
  }

    handleBgvDetailsApi = () => {
      const {
        match, location, servicesEnabled, onGetEmployeeBgvData, getEmpMissingData,
      } = this.props;
      const params = queryString.parse(location.search);

      if (!_.isEmpty(servicesEnabled)) {
        const orgId = match.params.uuid;
        const { empId } = match.params;
        let isVendorEnabled = false;

        if (!_.isEmpty(servicesEnabled.platformServices)) {
          _.forEach(servicesEnabled.platformServices, (elem) => {
            if (elem.platformService === 'VENDOR') isVendorEnabled = true;
          });
        }

        if (!_.isEmpty(servicesEnabled.products)) {
          let isBgvEnabled = false;
          _.forEach(servicesEnabled.products, (product) => {
            if (product.product === 'BGV') isBgvEnabled = true;
          });
          if (isBgvEnabled) {
            let orgFrom = null; let orgTo = null; let orgVia = null;
            if (isVendorEnabled) {
              if (!_.isEmpty(params.vendorId)) {
                if (!_.isEmpty(params.subVendorId)) {
                  orgFrom = params.subVendorId;
                  orgTo = match.params.uuid;
                  orgVia = params.vendorId;
                } else {
                  orgFrom = params.vendorId;
                  orgTo = match.params.uuid;
                  orgVia = null;
                }
              } else if (!_.isEmpty(params.clientId)) {
                if (!_.isEmpty(params.superClientId)) {
                  orgFrom = match.params.uuid;
                  orgTo = params.superClientId;
                  orgVia = params.clientId;
                } else {
                  orgFrom = match.params.uuid;
                  orgTo = params.clientId;
                  orgVia = null;
                }
              }
            }
            onGetEmployeeBgvData(orgId, empId, orgFrom, orgTo, orgVia);
            getEmpMissingData(orgId, empId);
          }
        }
      }
    }

    componentWillUnmount = () => {
      const { initState } = this.props;
      initState();
    }

    dataFormat = (missingOrInsuffData, type) => {
      const inputData = new Set(missingOrInsuffData);
      const updatedData = [];

      if (inputData.has('PAN')) {
        updatedData.push('pan card');
      }
      if (inputData.has('AADHAAR')) {
        updatedData.push('aadhaar card');
      }
      if (inputData.has('VOTER')) {
        updatedData.push('voter card');
      }
      if (inputData.has('DL')) {
        updatedData.push('driving license');
      }
      // && (this.props.empData.isCurrAndPerAddrSame
      // && (inputData.has("CRC_CURRENT_ADDRESS") || inputData.has("CURRENT_ADDRESS")))
      if (inputData.has('PERMANENT_ADDRESS') || inputData.has('CRC_PERMANENT_ADDRESS')) {
        updatedData.push('permanent address');
      }
      if (inputData.has('CURRENT_ADDRESS') || inputData.has('CRC_CURRENT_ADDRESS')) {
        updatedData.push('current address');
      }
      if (inputData.has('CURRENT_ADDRESS_REVIEW')) {
        updatedData.push('current address review');
      }
      if (inputData.has('PERMANENT_ADDRESS_REVIEW')) {
        updatedData.push('permanent address review');
      }
      if (inputData.has('RC')) {
        updatedData.push('rc');
      }
      if (inputData.has('EDUCATION')) {
        updatedData.push('education');
      }
      if (inputData.has('EMPLOYMENT')) {
        updatedData.push('employment');
      }
      if (inputData.has('HEALTH')) {
        updatedData.push('health');
      }
      if (inputData.has('REFERENCE')) {
        updatedData.push('reference');
      }
      if (inputData.has('GLOBALDB')) {
        updatedData.push('globaldb');
      }

      if (type === 'missingData') {
        this.setState({ empMissingData: [...updatedData] });
      } else if (type === 'insufficientInfo') {
        this.setState({ empInsufficientInfo: [...updatedData] });
      }
    }

    msgFormation = (missingOrInsuffData, type) => {
      const n = missingOrInsuffData.slice(0, -1).length;
      let print = '';
      if (!_.isEmpty(missingOrInsuffData.slice(0, -1))
      && missingOrInsuffData.slice(0, -1).length > 0) {
        missingOrInsuffData.slice(0, -1).forEach((item, index) => {
          if (index === n - 1) {
            print += item;
          } else {
            print += `${item}, `;
          }
        });
      }
      if (missingOrInsuffData.length === 1) {
        print = missingOrInsuffData[0];
      }

      if (type === 'missingData') {
        this.setState({ empMissingDataMessage: print });
      } else if (type === 'insufficientInfo') {
        this.setState({ empInsufficientInfoMessage: print });
      }
    }

    handleSectionClick = (section) => {
      this.setState({ profileSection: section });
    }

    render() {
      const {
        match, location, getEmpDataState, serviceStatusState, getEmpMissingDataState,
        tagData, orgData, empLeaveQuota,
        getProfilePictureState, empData, serviceStatus, servicesEnabled,
      } = this.props;

      const {
        empMissingData, empMissingDataMessage, empInsufficientInfo,
        empInsufficientInfoMessage, profileSection,
      } = this.state;

      const orgId = match.params.uuid;

      const NotificationPan = !_.isEmpty(empMissingData)
      && empMissingData.length > 0 && !_.isEmpty(empInsufficientInfo)
      && empInsufficientInfo.length > 0
        ? (
          <MissingNotification
            type="missingDocument"
            missingDataMessage={empMissingDataMessage}
            missingDataName={empMissingData}
            clicked={this.handleClose}
            NotificationCardBGV_className={styles.NotificationCardBGV}
            insuffInfoMessage={empInsufficientInfoMessage}
            insuffInfoName={empInsufficientInfo}
          />
        )
        : !_.isEmpty(empMissingData) && empMissingData.length > 0
        && empInsufficientInfo.length === 0
          ? (
            <MissingNotification
              type="missingDocument"
              missingDataMessage={empMissingDataMessage}
              missingDataName={empMissingData}
              clicked={this.handleClose}
              NotificationCardBGV_className={styles.NotificationCardBGV}
              insuffInfoMessage={null}
              insuffInfoName={null}
            />
          )
          : !_.isEmpty(empInsufficientInfo) && empInsufficientInfo.length > 0
          && empMissingData.length === 0
            ? (
              <MissingNotification
                type="missingDocument"
                missingDataMessage={null}
                missingDataName={null}
                clicked={this.handleClose}
                NotificationCardBGV_className={styles.NotificationCardBGV}
                insuffInfoMessage={empInsufficientInfoMessage}
                insuffInfoName={empInsufficientInfo}
              />
            )
            : null;

      let defaultRole = null;
      let defaultLocation = null;

      if (!_.isEmpty(tagData)) {
        tagData.map((tag) => {
          if (tag.category === 'geographical' && tag.uuid === empData.defaultLocation) defaultLocation = tag.name;
          else if (tag.category === 'functional' && tag.uuid === empData.defaultRole) defaultRole = tag.name;
          return null;
        });
      }

      const redirectUrl = location.state && location.state.prevPath
        ? (location.state.prevPath === `/customer-mgmt/org/${orgId}/employee` ? `${location.state.prevPath}?isActive=true` : location.state.prevPath)
        : `/customer-mgmt/org/${orgId}/employee?isActive=true`;

      const productSections = [
        { name: 'profile', icon: profileIcon },
        { name: 'onboard', icon: onboardIcon },
      ];
      if (!_.isEmpty(servicesEnabled) && !_.isEmpty(servicesEnabled.products)) {
        servicesEnabled.products.forEach((key) => {
          if (key.product === 'BGV') { // !_.isEmpty(serviceStatus)
            const data = { name: 'verify', icon: verifyIcon };
            productSections.push(data);
          }
          if (key.product === 'ATTEND') {
            const data = { name: 'attend', icon: attendIcon };
            productSections.push(data);
          }
        });
      }

      return (
        <>
          <div className={cx(styles.scrollPage, scrollStyle.scrollbar)}>
            {getEmpDataState === 'LOADING' || serviceStatusState === 'LOADING'
            || getEmpMissingDataState === 'LOADING' || getProfilePictureState === 'LOADING'
              ? <div className={styles.Loader}><Loader type="empProfile" /></div>
              : getEmpDataState === 'SUCCESS' && !_.isEmpty(empData)
                ? (
                  <>
                    <div style={{ width: 'max-content' }}>
                      <ArrowLink
                        label={location.state && location.state.label ? location.state.label : orgData ? `${orgData.nameInLowerCase} / all employees` : 'all employees'}
                        url={redirectUrl}
                        className={styles.PaddingLeftArrow}
                      />
                    </div>
                    {/* <div className={styles.animate}>button</div> */}
                    <div className="row">
                      {NotificationPan}
                    </div>

                    <div className="row">
                      <ProfileBasicInfo
                        reDraw={empMissingData.length > 0}
                        defaultRole={defaultRole}
                        defaultLocation={defaultLocation}
                      />
                    </div>

                    <div className={styles.optionContainer}>
                      <div className={cx('row mt-2 mx-0', styles.optionBorder)}>
                        {productSections.map((key) => (
                          <div key={key.name} className={profileSection === key.name ? cx(styles.borderActive, 'mr-4') : 'mr-4'} role="button" aria-hidden onClick={() => this.handleSectionClick(key.name)}>
                            <div className={profileSection === key.name
                              ? styles.ActiveButtonBg : styles.InactiveButtonBg}
                            >
                              <div className={profileSection === key.name
                                ? styles.ActiveButton : styles.InactiveButton}
                              >
                                <img src={key.icon} alt={key.name} className="pr-2" />
                                {key.name}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {profileSection === 'profile'
                    && (
                    <Profile
                      data={empData}
                      servicesEnabled={servicesEnabled}
                      defaultRole={defaultRole}
                      defaultLocation={defaultLocation}
                      orgName={!_.isEmpty(orgData) ? orgData.name : ''}
                      orgBrandColor={!_.isEmpty(orgData) ? orgData.brandColor : ''}
                      orgData={!_.isEmpty(orgData) ? orgData : ''}
                    />
                    )}
                    {profileSection === 'verify'
                    && (
                      <ProfileVerify
                        empData={empData}
                        bgvData={serviceStatus}
                      />
                    )}
                    { profileSection === 'attend'

                      && (
                      <ProfileAttendance
                        data={empLeaveQuota}
                      />
                      )}
                  </>
                )
                : null}
          </div>
        </>
      );
    }
}
const mapStateToProps = (state) => ({
  empData: state.empMgmt.empProfile.empData,
  getEmpDataState: state.empMgmt.empProfile.getEmpDataState,
  serviceStatus: state.empMgmt.empProfile.serviceStatus,
  serviceStatusState: state.empMgmt.empProfile.serviceStatusState,
  employeeMissingData: state.empMgmt.empProfile.empMissingData,
  getEmpMissingDataState: state.empMgmt.empProfile.getEmpMissingDataState,
  tagData: state.empMgmt.empProfile.tagData,
  employeeInsufficientInfo: state.empMgmt.empProfile.empInsufficientInfo,
  getProfilePictureState: state.imageStore.getProfilePictureState,

  orgData: state.empMgmt.staticData.orgData,
  servicesEnabled: state.empMgmt.staticData.servicesEnabled,

  policies: state.auth.policies,

});

const mapDispatchToProps = (dispatch) => ({
  initState: () => dispatch(actions.initState()),
  onGetProfileData: (empId, orgId) => dispatch(actions.getEmpData(empId, orgId)),
  onGetEmployeeBgvData: (orgId, empId, orgFrom, orgTo, orgVia) => dispatch(
    actions.getEmpBGVResult(orgId, empId, orgFrom, orgTo, orgVia),
  ),
  getEmpMissingData: (orgId, empId) => dispatch(actions.getEmpMissingData(orgId, empId)),
  onGetTagName: (tagArray) => dispatch(actions.getTagName(tagArray)),
  onGetOrgDetails: (orgId) => dispatch(getOrgDetails(orgId)),

});

export default withTranslation()(withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EmpProfile),
));

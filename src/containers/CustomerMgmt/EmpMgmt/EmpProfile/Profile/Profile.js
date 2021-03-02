/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router';
import cx from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import forEach from 'lodash/forEach';
import styles from './Profile.module.scss';

import ProfileAbout from './ProfileAbout/ProfileAbout';
import ProfileJobDetails from './ProfileJobDetails/ProfileJobDetails';
import ProfileDocuments from './ProfileDocuments/ProfileDocuments';
import ProfileExperience from './ProfileExperience/ProfileExperience';
import ProfileFamily from './ProfileFamily/ProfileFamily';

import { getVendorClientInfo } from '../Store/action';
import { getReportsToData, getReportsToTagInfo, getSharedTagsInfo } from '../../EmpOnboarding/EmpDetails/Store/action';
/**
@data {object} gives empData
@defaultRole {string} gives default employee role
@defaultLocation {string} gives default employee location
@orgData {object} gives org info
@servicesEnabled {object} gives the org's services enabled data
* */
const Profile = ({
  data, defaultRole, defaultLocation, orgData, servicesEnabled,
}) => {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const orgId = match.params.uuid;
  const { empId } = match.params;

  // job api call to get subvendor/client data
  const empProfileRState = useSelector((rstate) => get(rstate, 'empMgmt.empProfile', {}), shallowEqual);
  const { vendorClientInfo, vendorClientInfoState, orgNameMapping } = empProfileRState;
  // reportsTo data if reporting manager present
  const empOnboardRState = useSelector((rstate) => get(rstate, 'empMgmt.empOnboard', {}), shallowEqual);
  const reportsToData = get(empOnboardRState, 'empDetails.reportsToData', {});
  const reportsToDataState = get(empOnboardRState, 'empDetails.reportsToDataState', 'INIT');
  const reportsToTagInfo = get(empOnboardRState, 'empDetails.reportsToTagInfo', {});
  const reportsToTagInfoState = get(empOnboardRState, 'empDetails.reportsToTagInfoState', 'INIT');
  const sharedTagsInfo = get(empOnboardRState, 'empDetails.sharedTagsInfo', {});
  // const sharedTagsInfoState = get(empOnboardRState, 'empDetails.sharedTagInfoState', 'INIT');

  const emptyState = (
    <div className="d-flex justify-content-center">
      <div className={cx(styles.emptyInfo, 'px-2 py-1')}>
        not added yet
      </div>
    </div>
  );

  // didMount - api call only when VENDOR is enabled for an org
  useEffect(() => {
    if (vendorClientInfoState !== 'SUCCESS' && !isEmpty(servicesEnabled) && !isEmpty(servicesEnabled.platformServices)) {
      servicesEnabled.platformServices.forEach((service) => {
        if (service.platformService === 'VENDOR') {
          const requiredEmpData = {
            orgId: orgData.uuid,
            defaultLocation: data.defaultLocation,
            defaultRole: data.defaultRole,
            employeeId: data.employeeId,
            status: data.status,
            joiningDate: data.joiningDate,
            deployedTo: data.deployedTo,
            terminationDate: !isEmpty(data.terminationDate) ? data.terminationDate : null,
            type: 'org',
            orgData: {
              name: orgData.name,
              brandColor: orgData.brandColor,
              uuid: orgData.uuid,
            },
          };
          dispatch(getVendorClientInfo(orgId, empId, requiredEmpData, 'client', 'ACTIVE'));
        }
      });
    }
    if (reportsToDataState !== 'SUCCESS' && data.reportsTo) {
      dispatch(getReportsToData(data.reportsTo, data.orgId));
    }
    // eslint-disable-next-line
  }, []);

  // didUpdate - call tagData api to get reporting_manager role and loc
  useEffect(() => {
    if (reportsToDataState === 'SUCCESS' && !isEmpty(reportsToData) && reportsToTagInfoState !== 'SUCCESS') {
      const tagIdList = [];
      if (reportsToData.defaultLocation) {
        tagIdList.push(reportsToData.defaultLocation);
      }
      if (reportsToData.defaultRole) {
        tagIdList.push(reportsToData.defaultRole);
      }
      dispatch(getReportsToTagInfo(tagIdList));
    }
  },
  // eslint-disable-next-line
  [reportsToDataState, reportsToData, reportsToTagInfoState]);

  useEffect(() => {
    if (vendorClientInfoState === 'SUCCESS') {
      const tagIdList = [];
      forEach(vendorClientInfo, (each) => {
        if (!tagIdList.includes(each.defaultLocation)) {
          tagIdList.push(each.defaultLocation);
        }
        if (!tagIdList.includes(each.defaultRole)) {
          tagIdList.push(each.defaultRole);
        }
      });
      if (!isEmpty(tagIdList)) {
        dispatch(getSharedTagsInfo(tagIdList));
      }
    }
  },
  // eslint-disable-next-line
  [vendorClientInfoState]);

  // assigning respective tag names for reporting_manager data
  let reportsToRole = ''; let reportsToLocation = '';
  if (reportsToTagInfoState === 'SUCCESS') {
    forEach(reportsToTagInfo, (eachTag) => {
      if (reportsToData.defaultRole && eachTag.category === 'functional'
      && reportsToData.defaultRole === eachTag.uuid && eachTag.type === 'role') {
        reportsToRole = eachTag.name;
      }
      if (reportsToData.defaultLocation && eachTag.category === 'geographical'
      && reportsToData.defaultLocation === eachTag.uuid) {
        reportsToLocation = eachTag.name;
      }
    });
  }

  return (
    <div className={cx('d-flex flex-column mb-4', styles.container)}>
      {defaultRole || data.fatherName || data.motherName
      || data.maritalStatus || data.nationality || data.religion
      || !isEmpty(data.skills) || !isEmpty(data.preferences) || !isEmpty(data.languages)
        ? (
          <>
            <span className={cx('mb-2', styles.sectionHeading)}>
              about
              {' '}
              {data.firstName}
            </span>
            <ProfileAbout
              firstName={data.firstName}
              defaultRole={defaultRole}
              gender={data.gender}
              skills={data.skills}
              preferences={data.preferences}
              languages={data.languages}
              fatherName={data.fatherName}
              motherName={data.motherName}
              maritalStatus={data.maritalStatus}
              nationality={data.nationality}
              religion={data.religion}
            />
            <hr className={cx('my-4', styles.horizontalLine)} />
          </>
        ) : null}

      <ProfileJobDetails
        defaultRole={defaultRole}
        defaultLocation={defaultLocation}
        orgName={!isEmpty(orgData) ? orgData.name : ''}
        orgBrandColor={!isEmpty(orgData) ? orgData.brandColor : ''}
        orgData={!isEmpty(orgData) ? orgData : ''}
        reportingManager={!isEmpty(reportsToData) ? reportsToData : null}
        reportsToRole={reportsToRole}
        reportsToLocation={reportsToLocation}
        vendorClientInfoState={vendorClientInfoState}
        orgNameMapping={orgNameMapping}
        vendorClientInfo={vendorClientInfo}
        sharedTagsInfo={sharedTagsInfo}
      />

      <hr className={cx('my-4', styles.horizontalLine)} />

      <span className={cx('mb-3', styles.sectionHeading)}>
        experience
      </span>
      {!isEmpty(data.workDetails) ? (
        <ProfileExperience
          experienceSection
          workDetails={data.workDetails}
        />
      ) : emptyState}

      <hr className={cx('my-4', styles.horizontalLine)} />
      <span className={cx('mb-3', styles.sectionHeading)}>
        education
      </span>
      {!isEmpty(data.educationDetails) ? (
        <ProfileExperience
          educationSection
          educationDetails={data.educationDetails}
        />
      ) : emptyState}

      <hr className={cx('my-4', styles.horizontalLine)} />

      <span className={cx('mb-3', styles.sectionHeading)}>
        family &amp; references
      </span>
      {!isEmpty(data.familyRefs) ? (
        <ProfileFamily
          familySection
          familyRefs={data.familyRefs}
        />
      ) : emptyState}

      <hr className={cx('my-4', styles.horizontalLine)} />

      <span className={cx('mb-3', styles.sectionHeading)}>
        health details
      </span>
      {!isEmpty(data.healthDetails) ? (
        <ProfileFamily
          healthSection
          healthObject={data.healthDetails}
        />
      ) : emptyState}

      <hr className={cx('my-4', styles.horizontalLine)} />

      <span className={cx('mb-2', styles.sectionHeading)}>
        address
      </span>
      {!isEmpty(data.addresses) ? (
        <ProfileFamily
          addressSection
          addresses={data.addresses}
          isCurrAndPerAddrSame={data.isCurrAndPerAddrSame}
        />
      ) : emptyState}

      <hr className={cx('my-4', styles.horizontalLine)} />

      <span className={cx('mb-2', styles.sectionHeading)}>
        contact
      </span>
      {!isEmpty(data.contacts) ? (
        <ProfileFamily
          contactSection
          contacts={data.contacts}
        />
      ) : emptyState}

      <hr className={cx('my-4', styles.horizontalLine)} />

      <span className={cx('mb-2', styles.sectionHeading)}>
        document
      </span>
      <ProfileDocuments />

    </div>
  );
};

export default Profile;

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';
import cx from 'classnames';
import styles from './ProfileJobDetails.module.scss';

import OrgLogo from '../../../../../../components/Atom/OrgLogo/OrgLogo';
import SpocCard from '../../../../OrgMgmt/OrgBgvConfig/ClientSpoc/SpocCard/SpocCard';

import entityType from '../../../../../../assets/icons/entityType.svg';
import empRole from '../../../../../../assets/icons/empRole.svg';
import empLocation from '../../../../../../assets/icons/empLocation.svg';
import building from '../../../../../../assets/icons/buildingWithBg.svg';
import empIdIcon from '../../../../../../assets/icons/empId.svg';
import statusIcon from '../../../../../../assets/icons/blueStatus.svg';
import calendar from '../../../../../../assets/icons/calendar.svg';
import empType from '../../../../../../assets/icons/empType.svg';
import locTag from '../../../../../../assets/icons/locationTags.svg';
import funcTag from '../../../../../../assets/icons/folder.svg';
import custTag from '../../../../../../assets/icons/customTags.svg';
import locTagKey from '../../../../../../assets/icons/locationTagsKey.svg';
import funcTagKey from '../../../../../../assets/icons/functionTagsKey.svg';
import custTagKey from '../../../../../../assets/icons/customTagsKey.svg';

import Carousel from '../../../Carousel/Carousel';
import DeployedInfoTile from '../../../DeployedInfoTile/DeployedInfoTile';
import CustomSelect from '../../../../../../components/Atom/CustomSelect/CustomSelect';

import * as actions from '../../Store/action';

class ProfileJobDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orgType: 'ORG',
      selectedTile: 0,
      deploymentStatus: 'ACTIVE',
    };
  }

  displayEachField = (name, value, icon) => (
    <span className="row no-gutters col-4 px-0">
      <img className="pr-2" src={icon} alt="" />
      <span className="d-flex flex-column pl-1">
        <label htmlFor="blackText" className={styles.BlackText}>{value}</label>
        <label htmlFor="greyText" className={styles.TagSecondaryText}>{name}</label>
      </span>
    </span>
  )

  handleClick = (index) => {
    const { selectedTile } = this.state;
    if (index !== selectedTile) {
      this.setState({ selectedTile: index });
    }
  };

  onChange = (value) => {
    const { match } = this.props;
    const orgId = match.params.uuid;
    const { empId } = match.params;
    const { onGetVendorClientInfo, vendorClientInfo } = this.props;
    this.setState({ deploymentStatus: value });
    onGetVendorClientInfo(orgId, empId, vendorClientInfo[0], 'client', value);
  }

  render() {
    const {
      t, empData, tagDataState, tagData, vendorClientInfo, vendorClientInfoState, orgNameMapping,
      orgName, orgBrandColor, reportingManager, reportsToRole, reportsToLocation, sharedTagsInfo,
      EMP_DEPLOYMENT_STATUS_TYPE,
    } = this.props;

    const {
      orgType, selectedTile, deploymentStatus,
    } = this.state;

    const selectedTabData = !_.isEmpty(vendorClientInfo) ? vendorClientInfo[selectedTile] : {};
    const defaultLocation = !_.isEmpty(selectedTabData) && !_.isEmpty(sharedTagsInfo[selectedTabData.orgId]) && !_.isEmpty(sharedTagsInfo[selectedTabData.orgId].geographical) ? sharedTagsInfo[selectedTabData.orgId].geographical : '';
    const defaultRole = !_.isEmpty(selectedTabData) && !_.isEmpty(sharedTagsInfo[selectedTabData.orgId]) && !_.isEmpty(sharedTagsInfo[selectedTabData.orgId].functional) ? sharedTagsInfo[selectedTabData.orgId].functional : '';

    const emptyTags = (
      <div className={cx('px-3', styles.EmptyInformation)}>
        {t('translation_empProfile:span_label_empProfile.profileAbout.emptyInfo')}
      </div>
    );

    let roleTags = []; let locationTags = []; let customTags = [];
    let empDataTags = [];
    if (empData.tags != null) {
      empDataTags = empData.tags.filter((tag) => {
        if (empDataTags.includes(tag)) return null;
        return empDataTags.push(tag);
      });
    }
    if (tagDataState === 'SUCCESS' && !_.isEmpty(tagData) && !_.isEmpty(empDataTags)) {
      empDataTags.forEach((empTags) => {
        tagData.forEach((tag) => {
          if (tag.category === 'functional' && tag.type === 'role' && tag.uuid === empTags) {
            roleTags = roleTags.concat(
              <div key={tag.uuid} className={cx('mb-2 mr-2 pr-2 py-1', styles.TagNames)}>
                <img className="px-2" style={{ height: '12px' }} src={tag.hasAccess ? funcTagKey : funcTag} alt="" />
                {tag.name}
              </div>,
            );
          }
          if (tag.category === 'geographical' && tag.uuid === empTags) {
            locationTags = locationTags.concat(
              <div key={tag.uuid} className={cx('mb-2 mr-2 pr-2 py-1', styles.TagLocation)}>
                <img className="px-2" style={{ height: '12px' }} src={tag.hasAccess ? locTagKey : locTag} alt="" />
                {tag.name}
              </div>,
            );
          }
          if (tag.category === 'custom' && tag.uuid === empTags) {
            customTags = customTags.concat(
              <div key={tag.uuid} className={cx('mb-2 mr-2 pr-2 py-1', styles.TagNames)}>
                <img className="px-2" style={{ height: '12px' }} src={tag.hasAccess ? custTagKey : custTag} alt="" />
                {tag.name}
              </div>,
            );
          }
          return null;
        });
      });
    }

    return (
      <div className="d-flex flex-column col-12 px-0">
        <div className="d-flex justify-content-between">

          <span className={cx(styles.jobSectionMargin, styles.sectionHeading)}>
            employee job & contractor details
          </span>

          <CustomSelect
            name="status"
            className="my-1 col-4 pr-3 py-2"
            options={EMP_DEPLOYMENT_STATUS_TYPE}
            value={deploymentStatus}
            onChange={(value) => this.onChange(value)}
          />

        </div>
        {vendorClientInfoState === 'SUCCESS' && !_.isEmpty(vendorClientInfo)
          ? (
            !_.isEmpty(vendorClientInfo)
            && (
            <>
              <Carousel
                showItems={2}
                itemWidth={292}
                clickHandler={(index) => this.handleClick(index)}
                selectedTile={selectedTile}
                widthStyles={styles.carouselSlider}
                iconStylesLeft={styles.carouselScrollIconLeft}
                iconStylesRight={styles.carouselScrollIconRight}
              >
                {vendorClientInfo.map((each, index) => (
                  <div key={each.uuid}>
                    <DeployedInfoTile
                      orgType={each.type}
                      isTerminated={each.status === 'TERMINATED'}
                      orgName={each.orgData.name}
                      sourceOrgName={!_.isEmpty(each.source_org) ? orgNameMapping[each.source_org] : ''}
                      originOrgName={!_.isEmpty(each.origin_org) ? orgNameMapping[each.origin_org] : ''}
                      deployedTo={!_.isEmpty(each.deployedTo) ? each.deployedTo : ''}
                      brandColor={each.orgData.brandColor}
                      joiningDate={each.joiningDate}
                      terminationDate={each.terminationDate}
                      isSelected={index === selectedTile}
                      clickHandler={() => this.handleClick(index)}
                    />
                    {index === selectedTile
                            && (
                            <div className="d-flex justify-content-center">
                              <div className={styles.activePointer} />
                              <hr className={styles.activeHorizontalLine} />
                            </div>
                            )}
                  </div>
                ))}
              </Carousel>
              <hr className={styles.horizontalLine} />
              <div>
                <div className={cx('row no-gutters')}>
                  <span className="row no-gutters col-9 px-0 my-auto">
                    <img className="pr-2" src={building} alt="" />
                    <span className="d-flex flex-column pl-1">
                      <label htmlFor="blackText" className={styles.BlackText}>
                        {!_.isEmpty(selectedTabData) && !_.isEmpty(selectedTabData.orgData)
                        && selectedTabData.orgData.name
                          ? selectedTabData.orgData.name : orgName}
                      </label>
                      <label htmlFor="greyText" className={styles.TagSecondaryText}>{t('translation_empProfile:texts_empProfile.profileJobDetails.organisation')}</label>
                    </span>
                  </span>
                  <span>
                    <OrgLogo
                      name={
                      !_.isEmpty(selectedTabData) && !_.isEmpty(selectedTabData.orgData)
                        && selectedTabData.orgData.name
                        ? selectedTabData.orgData.name : orgName
                    }
                      brandColor={
                      !_.isEmpty(selectedTabData) && !_.isEmpty(selectedTabData.orgData)
                        && selectedTabData.orgData.brandColor
                        ? selectedTabData.orgData.brandColor : orgBrandColor
                    }
                    />
                  </span>
                </div>

                {orgType === 'ORG' && (empData.entityType || empData.employeeType)
                  ? (
                    <div className={cx(styles.MarginTop, 'row no-gutters')}>
                      {empData.entityType
                        ? (
                          this.displayEachField(t('translation_empProfile:texts_empProfile.profileJobDetails.entityType'), empData.entityType.toLowerCase().replace(/_/g, ' '), entityType)
                        ) : null}

                      {empData.employeeType
                        ? (
                          this.displayEachField(t('translation_empProfile:texts_empProfile.profileJobDetails.empType'), empData.employeeType.toLowerCase().replace(/_/g, ' '), empType)
                        ) : null}
                    </div>
                  ) : null}

                {!_.isEmpty(selectedTabData) && (selectedTabData.employeeId
                || selectedTabData.status || selectedTabData.joiningDate)
                  ? (
                    <div className={cx(styles.MarginTop, 'row no-gutters')}>
                      {selectedTabData.employeeId
                        ? (
                          this.displayEachField(t('translation_empProfile:texts_empProfile.profileJobDetails.empId'), selectedTabData.employeeId, empIdIcon)
                        )
                        : null}

                      {selectedTabData.status
                        ? (
                          this.displayEachField(t('translation_empProfile:texts_empProfile.profileJobDetails.status'), selectedTabData.status.toLowerCase(), statusIcon)
                        )
                        : null}

                      {selectedTabData.joiningDate
                        ? (
                          this.displayEachField(t('translation_empProfile:texts_empProfile.profileJobDetails.joinedOn'), selectedTabData.joiningDate.split('-').reverse().join(' • '), calendar)
                        )
                        : null}
                    </div>
                  ) : null}

                {defaultLocation || defaultRole
                  ? (
                    <div className={cx(styles.MarginTop, 'row no-gutters')}>
                      <div className="row no-gutters">
                        {defaultLocation
                          ? (
                            <span className="row no-gutters px-0" style={{ width: '14.125rem' }}>
                              <span><img className="pr-2" src={empLocation} alt="" /></span>
                              <span className="d-flex flex-column pl-1" style={{ width: '10.875rem' }}>
                                <label htmlFor="blackText" className={cx(styles.BlackText, styles.WordBreak)}>
                                  {defaultLocation}
                                </label>
                                <label htmlFor="greyText" className={styles.TagSecondaryText}>{t('translation_empProfile:texts_empProfile.profileJobDetails.defaultLoc')}</label>
                              </span>
                            </span>
                          ) : null}

                        {defaultRole
                          ? (
                            <span className="row no-gutters px-0" style={{ width: '14.125rem', marginLeft: '2.875rem' }}>
                              <span><img className="pr-2" src={empRole} alt="" /></span>
                              <span className="d-flex flex-column pl-1" style={{ width: '10.875rem' }}>
                                <label htmlFor="blackText" className={cx(styles.BlackText, styles.WordBreak)}>
                                  {defaultRole}
                                </label>
                                <label htmlFor="greyText" className={styles.TagSecondaryText}>{t('translation_empProfile:texts_empProfile.profileJobDetails.defaultRole')}</label>
                              </span>
                            </span>
                          ) : null}
                      </div>
                    </div>
                  ) : null}

                {selectedTabData.type === 'org'
                  ? (
                    <>
                      <div className={cx(styles.MarginTop)}>
                        <div className="row no-gutters">
                          <label htmlFor="greySubHeading" className={cx('mb-2', styles.GreySubHeading)}>{t('translation_empProfile:texts_empProfile.profileJobDetails.assignedRoles')}</label>
                        </div>
                        <div className="row no-gutters mt-3">
                          {roleTags.length !== 0 ? roleTags
                            : emptyTags}
                        </div>
                      </div>

                      <div className={cx(styles.MarginTop)}>
                        <div className="row no-gutters">
                          <label htmlFor="greySubHeading" className={cx('mb-2', styles.GreySubHeading)}>{t('translation_empProfile:texts_empProfile.profileJobDetails.assignedLocs')}</label>
                        </div>
                        <div className="row no-gutters mt-3">
                          {locationTags.length !== 0 ? locationTags
                            : emptyTags}
                        </div>
                      </div>

                      {reportingManager
                        ? (
                          <div className="mt-4">
                            <div className="row no-gutters">
                              <label htmlFor="greySubHeading" className={cx('mb-2', styles.GreySubHeading)}>
                                {t('translation_empProfile:texts_empProfile.profileJobDetails.reportingMg')}
                              </label>
                            </div>

                            <div className="row no-gutters mt-3">
                              <SpocCard
                                reportingManager
                                name={reportingManager.firstName + (reportingManager.lastName ? ` ${reportingManager.lastName}` : '')}
                                profilePicUrl={reportingManager.profilePicUrl}
                                empId={reportingManager.uuid}
                                orgName={orgName}
                                employeeId={reportingManager.employeeId}
                                designation={reportsToRole}
                                locationTag={reportsToLocation}
                                id={null}
                                isChecked
                                isDisabled
                              />
                            </div>
                          </div>
                        ) : null}
                    </>
                  )
                  : null}
              </div>
            </>
            )
          )
          : <div className="d-flex justify-content-center">{emptyTags}</div>}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  empData: state.empMgmt.empProfile.empData,
  tagData: state.empMgmt.empProfile.tagData,
  tagDataState: state.empMgmt.empProfile.tagDataState,
  EMP_DEPLOYMENT_STATUS_TYPE: state.empMgmt.staticData.empMgmtStaticData.EMP_DEPLOYMENT_STATUS_TYPE,
  clientsExists: state.empMgmt.empProfile.clientsExists,
  // vendorClientInfoState: state.empMgmt.empProfile.vendorClientInfoState,
  // vendorClientInfo: state.empMgmt.empProfile.vendorClientInfo,
});

const mapDispatchToProps = (dispatch) => ({
  onGetVendorClientInfo: (orgId, empId, empData, type, status) => dispatch(
    actions.getVendorClientInfo(orgId, empId, empData, type, status),
  ),
});

export default withTranslation()(withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProfileJobDetails),
));

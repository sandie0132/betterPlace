import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { withRouter } from 'react-router';
import { Button } from 'react-crux';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import forEach from 'lodash/forEach';
import cx from 'classnames';
import * as actionsOrgMgmt from '../../OrgMgmtStore/action';
import { getAttendanceConfig } from '../Store/action';
import RightNavUrls from './RightNavUrls/RightNavUrls';
import styles from './OrgAttendConfigRightNav.module.scss';
import RightNavBar from '../../../../../components/Organism/Navigation/RightNavBar/RightNavBar';
import VendorLabel from '../../../../VendorSearch/VendorLabel/VendorLabel';

const rightNavBarLinks = [
  {
    id: 'org-level-config',
    label: 'org level configuartion',
    value: 'orgLevelConfig',
    permission: ['ORG_LEVEL_CONFIG:VIEW', 'SITE_CONFIG:VIEW', 'LEAVE_CONFIG:VIEW', 'HOLIDAY_CONFIG:VIEW', 'BP_SPOC_CONFIG:VIEW', 'CLIENT_SPOC_CONFIG:VIEW'],
  },
  {
    id: 'site-config',
    label: 'site configuration',
    value: 'siteConfig',
    permission: ['SITE_CONFIG:VIEW'],
  },
  {
    id: 'leave-config',
    label: 'leave configuartion',
    value: 'leaveConfig',
    permission: ['LEAVE_CONFIG:VIEW'],
  },
  {
    id: 'holiday-config',
    label: 'holiday configuartion',
    value: 'holidayConfig',
    search: `year=${moment().format('YYYY')}`,
    permission: ['HOLIDAY_CONFIG:VIEW'],
  },
  {
    id: 'betterplace-spoc',
    label: 'betterplace spoc',
    value: 'betterplaceSpocConfig.deploymentManagers',
    permission: ['BP_SPOC_CONFIG:VIEW'],
  },
  {
    id: 'client-spoc',
    label: 'client spoc',
    value: 'clientSpocConfig.clientSpocs',
    permission: ['CLIENT_SPOC_CONFIG:VIEW'],
  },
];
class OrgAttendConfigRightNav extends Component {
  componentDidMount() {
    const {
      match, getOrgData, attendanceConfig, location,
    } = this.props;
    const orgId = match.params.uuid;
    const urlSearchParams = new URLSearchParams(location.search);
    const query = {};
    if (urlSearchParams.get('vendorId')) {
      query.vendorId = urlSearchParams.get('vendorId');
    } else if (urlSearchParams.get('clientId')) {
      query.clientId = urlSearchParams.get('clientId');
    }
    getOrgData(orgId);
    attendanceConfig(orgId, query);
  }

  componentDidUpdate = (prevProps) => {
    const {
      location, match, attendanceConfig, attendConfigState, attendConfig, history,
    } = this.props;
    if (prevProps.location.search !== location.search) {
      const orgId = match.params.uuid;
      const urlSearchParams = new URLSearchParams(location.search);
      const prevSearchParams = new URLSearchParams(prevProps.location.search);
      const query = {};
      if (urlSearchParams.get('vendorId') && prevSearchParams.get('vendorId') !== urlSearchParams.get('vendorId')) {
        query.vendorId = urlSearchParams.get('vendorId');
        attendanceConfig(orgId, query);
      } else if (urlSearchParams.get('clientId') && prevSearchParams.get('clientId') !== urlSearchParams.get('clientId')) {
        query.clientId = urlSearchParams.get('clientId');
        attendanceConfig(orgId, query);
      } else if ((!urlSearchParams.get('vendorId') && prevSearchParams.get('vendorId'))
        || (!urlSearchParams.get('clientId') && prevSearchParams.get('clientId'))) {
        attendanceConfig(orgId, query);
      }
    }

    if (prevProps.attendConfigState !== attendConfigState) {
      if (attendConfigState === 'SUCCESS' && isEmpty(get(attendConfig, 'orgLevelConfig', null))) {
        const orgId = match.params.uuid;
        const url = `/customer-mgmt/org/${orgId}/attendconfig/org-level-config`;
        if (location.pathname !== url) {
          const urlSearchParams = new URLSearchParams(location.search);
          let searchParam = null;
          if (urlSearchParams.get('vendorId')) {
            searchParam = `?vendorId=${urlSearchParams.get('vendorId').toString()}`;
          } else if (urlSearchParams.get('clientId')) {
            searchParam = `?clientId=${urlSearchParams.get('clientId').toString()}`;
          }
          history.push({
            pathname: url,
            search: searchParam,
          });
        }
      }
    }
  }

    handleHeadingState = (value) => {
      const { location } = this.props;
      if (location.pathname.includes(value)) {
        return 'active';
      } return 'done';
    }

    urlHandler = (value, search) => {
      const { match, history } = this.props;
      const orgId = match.params.uuid;
      const urlSearchParams = new URLSearchParams(history.location.search);
      let searchOrgParam = null;
      if (urlSearchParams.get('vendorId')) {
        searchOrgParam = `vendorId=${urlSearchParams.get('vendorId').toString()}`;
      } else if (urlSearchParams.get('clientId')) {
        searchOrgParam = `clientId=${urlSearchParams.get('clientId').toString()}`;
      }
      let searchParam = '?';
      if (!isEmpty(searchOrgParam)) {
        searchParam += `${searchOrgParam}`;
      }
      if (!isEmpty(search)) {
        searchParam += !isEmpty(searchOrgParam) ? `&${search}` : `${search}`;
      }
      const url = `/customer-mgmt/org/${orgId}/attendconfig/${value}`;
      history.push({
        pathname: url,
        search: searchParam,
      });
    }

    handleUrlIcon = (value, url) => {
      const { location, attendConfig } = this.props;
      if (location.pathname.includes(url)) return 'current';
      if (isEmpty(get(attendConfig, 'orgLevelConfig', null))) return 'disabled';
      if (!isEmpty(get(attendConfig, `${value}`, []))) return 'done';
      return 'inactive';
    }

    redirectUrl = () => {
      const { match, history } = this.props;
      const orgId = match.params.uuid;
      history.push(`/customer-mgmt/org/${orgId}/profile`);
    }

    getBrandColor = () => {
      const { orgData } = this.props;
      let color = '#8697A8';
      if (!isEmpty(orgData)) {
        color = orgData.brandColor;
      }
      return color;
    }

    handleShowVendorLabel = () => {
      let showVendorLabel = false;
      const { enabledServices } = this.props;
      if (!isEmpty(enabledServices) && !isEmpty(enabledServices.platformServices)) {
        forEach(enabledServices.platformServices, (service) => {
          if (service.platformService === 'VENDOR') showVendorLabel = true;
        });
      }
      return showVendorLabel;
    }

    render() {
      const { orgData, match } = this.props;
      const orgId = match.params.uuid;
      const showVendorLabel = this.handleShowVendorLabel();
      const RightNavContent = (
        <div className={styles.rightNavPosition}>
          <>
            <div style={{ backgroundColor: this.getBrandColor() }} className={cx('d-flex flex-row no-gutters', styles.orgCard)}>
              <div className={cx('align-self-end pl-5 pb-3', styles.labelScroll)}>
                <span className={cx(styles.OrgRightNavLabel, 'pt-4 pb-3')}>
                  {get(orgData, 'name', null)}
                </span>
              </div>
            </div>
          </>
          <div style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>
            <span className={styles.navHeading}>attend configuration</span>
          </div>
          <div className="pl-4 mb-4" style={{ width: '20rem' }}>
            {showVendorLabel && <VendorLabel />}
          </div>
          <div className={cx(' pl-5 ', styles.Hover)}>
            {rightNavBarLinks.map(({
              id, label, value, search, permission,
            }) => (
              <RightNavUrls
                key={id}
                headingState={this.handleHeadingState(id)}
                label={label}
                linkTo={() => this.urlHandler(id, search)}
                iconState={this.handleUrlIcon(value, id)}
                orgId={orgId}
                permission={permission}
              />
            ))}
          </div>
          <div className={styles.LargeButtonAlign}>
            <Button
              label="proceed"
              type="largeWithArrow"
              className={cx('ml-3', styles.LargeButtonWidth)}
              clickHandler={() => this.redirectUrl()}
            />
          </div>
        </div>
      );
      return (
        <RightNavBar content={RightNavContent} className={styles.show} />
      );
    }
}

const mapStateToProps = (state) => ({
  orgData: state.orgMgmt.staticData.orgData,
  enabledServices: state.orgMgmt.staticData.servicesEnabled,
  attendConfig: get(state, 'orgMgmt.orgAttendConfig.attendConfig.attendConfig', {}),
  attendConfigState: state.orgMgmt.orgAttendConfig.attendConfig.attendConfigState,
});

const mapDispatchToProps = (dispatch) => ({
  getOrgData: (orgId) => dispatch(actionsOrgMgmt.getDataById(orgId)),
  attendanceConfig: (orgId, query) => dispatch(getAttendanceConfig(orgId, query)),
});

export default (withRouter(connect(mapStateToProps, mapDispatchToProps)(OrgAttendConfigRightNav)));

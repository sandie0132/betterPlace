/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import cx from 'classnames';
import _ from 'lodash';
import * as actions from './OrgMgmtStore/action';
import OrgList from './OrgList/OrgList';
import OrgDetails from './OrgDetails/OrgDetails';
import OrgContact from './OrgContact/OrgContact';
import OrgAddress from './OrgAddress/OrgAddress';
import OrgAccessManagement from './OrgAccessManagement/OrgAccessManagement';
import TagMgmt from '../TagMgmt/TagMgmt';
import OrgProfile from './OrgProfile/OrgProfile';
import OrgDocuments from './OrgDocuments/OrgDocuments';
import OrgBgvConfig from './OrgBgvConfig/OrgBgvConfig';
import OrgOpsConfig from './OrgOpsConfig/OrgOpsConfig';
import OrgOnboardConfig from './OrgOnboardConfig/OrgOnboardConfig';
import OrgAttendConfig from './OrgAttendConfig/OrgAttendConfig';
// import HasAccess from '../../../services/HasAccess/HasAccess';
import OrgInfo from './OrgOnboarding/OrgInfo/OrgInfo';
import OrgClientList from './OrgClient/OrgClientList/OrgClientList';
import OrgClientDetails from './OrgClient/OrgClientDetails/OrgClientDetails';
import OrgClientTags from './OrgClient/OrgClientTags/OrgClientTags';
import OrgBgvDashboard from './OrgBgvDashboard/OrgBgvDashboard';
import OrgOnboardDashboard from './OrgOnboardDashboard/OrgOnboardDashboard';
import OrgProfileRigthNav from './OrgProfile/OrgProfileRightNav';
import OrgMgmtRightNav from './OrgMgmtRightNav/OrgMgmtRightNav';
import OrgOnboardConfigRightNav from './OrgOnboardConfig/OrgOnboardRightNav/OrgOnboardRightNav';
import styles from './OrgMgmt.module.scss';
import view from '../../../assets/icons/options.svg';
import close from '../../../assets/icons/closeBig.svg';
import OrgBgvConfigRightNav from './OrgBgvConfig/OrgBgvConfigRightNav/OrgBgvConfigRightNav';
import OrgOpsConfigRightNav from './OrgOpsConfig/OrgOpsConfigRightNav/OrgOpsConfigRightNav';
import scrollStyle from '../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import OrgAttendConfigRightNav from './OrgAttendConfig/OrgAttendConfigRightNav/OrgAttendConfigRightNav';
import OrgAttendDashboard from './OrgAttendDashboard/OrgAttendDashboard';
import CreateShiftForm from './OrgAttendDashboard/SiteShiftMgmt/CreateShift/CreateShiftForm/CreateShiftForm';
import SiteDetails from './OrgAttendDashboard/SiteShiftMgmt/SiteDetails/SiteDetails';
import Roaster from './OrgAttendDashboard/RoasterMgmt/RoasterMgmt';

class OrgMgmt extends Component {
  constructor(props) {
    super(props);
    this.state = {
    //   windowSize: window.innerWidth,
      showPanel: false,
      viewPanelContent: false,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    const { onGetStaticDataList } = this.props;
    if (window.innerWidth > 1024) {
      this.setState({
        showPanel: true,
      });
    }
    onGetStaticDataList();
  }

  componentWillUnmount() {
    const { initState } = this.props;
    window.removeEventListener('resize', this.handleResize);
    initState();
  }

    handleHideLeftNav = () => {
      const { match, location } = this.props;
      const { pathname } = location;
      if ((((_.includes(pathname, '/orgInfo')) || (_.includes(pathname, '/profile') || (_.includes(pathname, '/dashboard')))) && (!_.includes(pathname, '/profile-level'))) || ((match.path === '/customer-mgmt/org') && (match.isExact === true))) {
        return 1;
      }

      return (styles.alignContent);
    }

    handleShowRighttNav = () => {
      const { match, location } = this.props;
      const { pathname } = location;
      const hideRightNavRoute = ['/site-config/site-config-detail', '/orgInfo', '/dashboard/onboard', '/holiday-config-detail', '/verify', '/leave-config-detail'];
      if (((match.path === '/customer-mgmt/org') && (match.isExact === true)) || hideRightNavRoute.some((route) => pathname.includes(route))) return false;

      return true;
    }

    handleResize = () => {
      const { viewPanelContent } = this.state;
      const windowSize = window.innerWidth;
      let show = false;
      let panel = viewPanelContent;
      if (windowSize > 1024) {
        show = true;
        panel = false;
      }
      this.setState({
        // windowSize,
        showPanel: show,
        viewPanelContent: panel,
      });
    };

    toggleSideNav = (yes) => {
      if (yes) {
        this.setState({
          viewPanelContent: false,
        });
      } else {
        this.setState({
          viewPanelContent: true,
        });
      }
    }

    putStyles = () => {
      const { showPanel, viewPanelContent } = this.state;
      if (!showPanel) {
        if (viewPanelContent) {
          return styles.openView;
        } return styles.removeDisplay;
      }
      return null;
    }

    render() {
      const { match } = this.props;
      const { showPanel, viewPanelContent } = this.state;
      return (
        <>
          <div className={cx('d-flex', this.handleHideLeftNav())}>
            <div className={cx(styles.centerContent, scrollStyle.scrollbar)}>

              <Switch>
                <Route path={`${match.path}`} exact component={OrgList} />
              </Switch>

              <Switch>
                <Route path={`${match.path}/add`} exact component={OrgDetails} />
                <Route path={`${match.path}/:uuid`} exact component={OrgDetails} />
                <Route path={`${match.path}/:uuid/site/:siteId/shift`} exact component={SiteDetails} />
                <Route path={`${match.path}/:uuid/site/:siteId/shift/add`} exact component={CreateShiftForm} />
                <Route path={`${match.path}/:uuid/site/:siteId/shift/:shiftId`} exact component={CreateShiftForm} />
                <Route path={`${match.path}/:uuid/orgInfo`} exact component={OrgInfo} />
                <Route path={`${match.path}/:uuid/config`} component={OrgBgvConfig} />
                <Route path={`${match.path}/:uuid/onboardconfig`} component={OrgOnboardConfig} />
                <Route path={`${match.path}/:uuid/attendconfig`} component={OrgAttendConfig} />
                <Route path={`${match.path}/:uuid/opsconfig`} component={OrgOpsConfig} />
                <Route path={`${match.path}/:uuid/contact`} exact component={OrgContact} />
                <Route path={`${match.path}/:uuid/address`} exact component={OrgAddress} />
                <Route path={`${match.path}/:uuid/profile`} exact component={OrgProfile} />
                <Route path={`${match.path}/:uuid/access-management`} exact component={OrgAccessManagement} />
                <Route path={`${match.path}/:uuid/documents`} exact component={OrgDocuments} />
                <Route path={`${match.path}/:uuid/clients/:clientId`} exact component={OrgClientDetails} />
                <Route path={`${match.path}/:uuid/clients/:clientId/:category`} exact component={OrgClientTags} />
                <Route path={`${match.path}/:uuid/clients`} exact component={OrgClientList} />
                <Route path={`${match.path}/:uuid/dashboard/verify`} component={OrgBgvDashboard} />
                <Route path={`${match.path}/:uuid/dashboard/onboard`} component={OrgOnboardDashboard} />
                <Route path={`${match.path}/:uuid/dashboard/attend`} component={OrgAttendDashboard} />
                <Route path={`${match.path}/:uuid/:category`} exact component={TagMgmt} />
                <Route path={`${match.path}/:uuid/:category/tag/:tagId`} exact component={TagMgmt} />
                <Route path={`${match.path}/:uuid/site/:siteId/roaster-mgmt`} component={Roaster} />
              </Switch>

            </div>
            {
                        showPanel || viewPanelContent
                          ? (
                            <>
                              {viewPanelContent ? (
                                <span aria-hidden="true" role="button" tabIndex={0} onClick={() => this.toggleSideNav('yes')} className={styles.closeNav}>
                                  <img src={close} alt="close" />
                                </span>
                              ) : null}

                              <div className={cx(this.putStyles(), 'd-flex')}>
                                <Switch>
                                  <Route path={`${match.path}/:uuid/site/:siteId`} />
                                  <Route path={`${match.path}/:uuid/site/:siteId/shift/`} />
                                  <Route path={`${match.path}/:uuid/dashboard/`} />
                                  {/* <Route path={`${match.path}/:uuid/orgInfo`} /> */}
                                  <Route path={`${match.path}/:uuid/attendconfig/holiday-config/holiday-config-detail/`} />
                                  <Route path={`${match.path}/:uuid/attendconfig/leave-config/leave-config-detail/`} />
                                  <Route path={`${match.path}/:uuid/attendconfig/site-config/site-config-detail`} />
                                  <Route path={`${match.path}/:uuid/attendconfig`} component={OrgAttendConfigRightNav} />
                                  <Route path={`${match.path}/:uuid/config`} component={OrgBgvConfigRightNav} />
                                  <Route path={`${match.path}/:uuid/opsconfig`} component={OrgOpsConfigRightNav} />
                                  <Route path={`${match.path}/:uuid/onboardconfig`} component={OrgOnboardConfigRightNav} />
                                  <Route path={`${match.path}/:uuid/profile`} exact component={OrgProfileRigthNav} />
                                  <Route path={`${match.path}/:uuid`} component={OrgMgmtRightNav} />
                                </Switch>
                              </div>
                            </>
                          )
                          : (
                            <>
                              {this.handleShowRighttNav()
                                ? (
                                  <div aria-hidden="true" role="button" tabIndex={0} onClick={() => this.toggleSideNav()}>

                                    <img src={view} alt="view" style={{ cursor: 'pointer' }} className="mt-4" />
                                  </div>
                                )
                                : null}
                            </>
                          )

                    }

          </div>

        </>

      );
    }
}

const mapDispatchToProps = (dispatch) => ({
  initState: () => dispatch(actions.initState()),
  onGetStaticDataList: () => dispatch(actions.getStaticDataList()),
});

export default withRouter(connect(null, mapDispatchToProps)(OrgMgmt));

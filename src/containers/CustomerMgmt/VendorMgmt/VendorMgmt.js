import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import _ from 'lodash';
import cx from 'classnames';
import styles from './VendorMgmt.module.scss';
import scrollStyle from '../../../components/Atom/ScrollBar/ScrollBar.module.scss';

import VendorList from './VendorList/VendorList';
import VendorDetails from './VendorDetails/VendorDetails';
import VendorTags from './VendorTags/VendorTags';
import VendorTagsAssignment from './VendorTagsAssignment/VendorTagsAssignment';
import VendorMgmtRightNav from './VendorMgmtRightNav/VendorMgmtRightNav';
import VendorProfile from './VendorProfile/VendorProfile';
import VendorOnboarding from './VendorOnboarding/VendorOnboarding';
import ClientProfile from './clientProfile/clientProfile';
import ClientTags from './ClientTags/ClientTags';
import ClientRightNav from './ClientRightNav/ClientRightNav';

import view from '../../../assets/icons/options.svg';
import close from '../../../assets/icons/closeBig.svg';

import * as actionsOrgMgmt from '../OrgMgmt/OrgMgmtStore/action';

class VendorMgmt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // windowSize: window.innerWidth,
      showPanel: false,
      viewPanelContent: false,
    };
  }

  componentDidMount() {
    const { orgData, match, onGetOrgData } = this.props;
    window.addEventListener('resize', this.handleResize);
    if (window.innerWidth > 1024) {
      this.setState({ showPanel: true });
    }
    if (_.isEmpty(orgData)) {
      const orgId = match.params.uuid;
      onGetOrgData(orgId);
    }
  }

  componentWillUnmount() {
    const { onGetInitState } = this.props;
    window.removeEventListener('resize', this.handleResize);
    onGetInitState();
  }

  // eslint-disable-next-line consistent-return
  handleHideLeftNav = () => {
    const { match, location } = this.props;
    if (((match.path === '/customer-mgmt/org') && (match.isExact === true)) || _.includes(location.pathname, '/vendorprofile')) {
      return 1;
    }

    if (((match.path === '/customer-mgmt/org') && (match.isExact === true)) || _.includes(location.pathname, 'vendor/add')
      || (_.includes(location.pathname, 'vendor-mgmt') && (_.includes(location.pathname, 'vendordetails')))
      || (_.includes(location.pathname, 'vendor-mgmt') && (_.includes(location.pathname, 'function-role') || _.includes(location.pathname, 'location-sites')))
      || (_.includes(location.pathname, 'vendor-mgmt') && _.includes(location.pathname, '/assign'))) {
      return (styles.alignContent);
    }
  }

  handleShowRighttNav = () => {
    const { match, location } = this.props;
    // const pathname = this.props.location.pathname;
    if (((match.path === '/customer-mgmt/org') && (match.isExact === true))
      || _.includes(location.pathname, '/vendorprofile')
      || _.includes(location.pathname, '/clientprofile')
      || _.includes(location.pathname, '/assign')) {
      return false;
    }
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
      this.setState({ viewPanelContent: false });
    } else {
      this.setState({ viewPanelContent: true });
    }
  }

  // eslint-disable-next-line consistent-return
  putStyles = () => {
    const { showPanel, viewPanelContent } = this.state;
    if (!showPanel) {
      if (viewPanelContent) {
        return styles.openView;
      }
      return styles.removeDisplay;
    }
  }

  render() {
    const { match } = this.props;

    // eslint-disable-next-line prefer-const
    let { showPanel, viewPanelContent } = this.state;

    return (
      <>
        <div className={cx('d-flex', this.handleHideLeftNav())}>
          <div className={cx(styles.centerContent, scrollStyle.scrollbar)}>
            <Switch>
              <Route path={`${match.path}`} exact component={VendorList} />
              <Route path={`${match.path}/vendor/add`} exact component={VendorDetails} />
              <Route path={`${match.path}/vendor/:vendorId/vendorprofile`} exact component={VendorProfile} />
              <Route path={`${match.path}/client/:clientId/clientprofile`} exact component={ClientProfile} />
              <Route path={`${match.path}/client/:clientId/details/:category`} exact component={ClientTags} />
              <Route path={`${match.path}/vendor/:vendorId/config/vendordetails`} exact component={VendorDetails} />
              <Route path={`${match.path}/vendor/:vendorId/config/:category`} exact component={VendorTags} />
              <Route path={`${match.path}/vendor/:vendorId/config/client/:clientId/:category/assign`} exact component={VendorTagsAssignment} />
            </Switch>
          </div>
          {
            showPanel || viewPanelContent
              ? (
                <>
                  {viewPanelContent ? (
                    <span onClick={() => this.toggleSideNav('yes')} role="button" aria-hidden="true" className={styles.closeNav}>
                      <img src={close} alt="close" />
                    </span>
                  ) : null}

                  <div className={cx(this.putStyles(), 'd-flex')}>
                    <Switch>
                      <Route path={`${match.path}/vendor/:vendorId/vendorprofile`} exact />
                      <Route path={`${match.path}/client/:clientId/clientprofile`} exact />
                      <Route path={`${match.path}`} exact component={VendorOnboarding} />
                      <Route path={`${match.path}/vendor/add`} exact component={VendorMgmtRightNav} />
                      <Route path={`${match.path}/vendor/:vendorId/config/vendordetails`} exact component={VendorMgmtRightNav} />
                      <Route path={`${match.path}/vendor/:vendorId/config/:category`} exact component={VendorMgmtRightNav} />
                      <Route path={`${match.path}/vendor/:vendorId/config/client/:clientId/:category`} exact component={VendorMgmtRightNav} />
                      <Route path={`${match.path}/client/:clientId/details/:category`} exact component={ClientRightNav} />
                    </Switch>

                  </div>

                </>
              )
              : (
                <>
                  {this.handleShowRighttNav()
                    ? (
                      <div onClick={this.toggleSideNav} role="button" aria-hidden="true">
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

const mapStateToProps = (state) => ({
  orgData: state.orgMgmt.staticData.orgData,
});

const mapDispatchToProps = (dispatch) => ({
  onGetInitState: () => dispatch(actionsOrgMgmt.initState()),
  onGetOrgData: (orgId) => dispatch(actionsOrgMgmt.getDataById(orgId)),
});

export default (withRouter(connect(mapStateToProps, mapDispatchToProps)(VendorMgmt)));

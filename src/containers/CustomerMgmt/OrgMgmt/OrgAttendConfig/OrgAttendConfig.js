/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import OrgLevelConfig from './OrgLevelConfig/OrgLevelConfig';
import SiteConfig from './SiteConfig/SiteConfig';
import SiteConfigDetails from './SiteConfig/SiteConfigDetails/SiteConfigDetails';
import HolidayConfig from './HolidayConfig/HolidayConfig';
import HolidayConfigDetails from './HolidayConfig/HolidayConfigDetails/HolidayConfigDetails';
import LeaveConfig from './LeaveConfig/leaveConfig';
import LeaveConfigDetails from './LeaveConfig/LeaveConfigDetails/leaveConfigDetails';
import * as actions from './Store/action';
import BetterplaceSpocConfig from './BetterplaceSpocConfig/BetterplaceSpocConfig';
import ClientSpocConfig from './ClientSpocConfig/ClientSpocConfig';

class OrgAttendConfig extends Component {
    componentWillUnmount = () => {
      const { initState } = this.props;
      initState();
    }

    render() {
      const { match } = this.props;

      return (
        <Switch>
          <Route path={`${match.path}/org-level-config`} exact component={OrgLevelConfig} />
          <Route path={`${match.path}/site-config`} exact component={SiteConfig} />
          <Route path={`${match.path}/site-config/site-config-detail/add`} exact component={SiteConfigDetails} />
          <Route path={`${match.path}/holiday-config`} exact component={HolidayConfig} />
          <Route path={`${match.path}/holiday-config/holiday-config-detail/add`} exact component={HolidayConfigDetails} />
          <Route path={`${match.path}/holiday-config/holiday-config-detail/:holidayId`} exact component={HolidayConfigDetails} />
          <Route path={`${match.path}/leave-config/leave-config-detail/add`} exact component={LeaveConfigDetails} />
          <Route path={`${match.path}/site-config/site-config-detail/:siteId`} exact component={SiteConfigDetails} />
          <Route path={`${match.path}/leave-config`} exact component={LeaveConfig} />
          <Route path={`${match.path}/betterplace-spoc`} exact component={BetterplaceSpocConfig} />
          <Route path={`${match.path}/client-spoc`} exact component={ClientSpocConfig} />
        </Switch>
      );
    }
}

const mapDispatchToProps = (dispatch) => ({
  initState: () => dispatch(actions.initState()),
});

export default (withRouter(connect(null, mapDispatchToProps)(OrgAttendConfig)));

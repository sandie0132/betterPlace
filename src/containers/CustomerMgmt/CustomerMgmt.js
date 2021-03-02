/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import OrgMgmt from './OrgMgmt/OrgMgmt';
import EmpMgmt from './EmpMgmt/EmpMgmt';
import VendorMgmt from './VendorMgmt/VendorMgmt';

class CustomerMgmt extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route path={`${match.path}/org/:uuid/vendor-mgmt`} component={VendorMgmt} />
        <Route path={`${match.path}/org/:uuid/employee`} component={EmpMgmt} />
        <Route path={`${match.path}/org`} component={OrgMgmt} />
      </Switch>
    );
  }
}

export default withRouter(CustomerMgmt);

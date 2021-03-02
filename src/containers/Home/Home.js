import React, { Component } from "react";
import _ from 'lodash';
import { connect } from "react-redux";

import { Route, Redirect, Switch } from "react-router-dom";
import { withRouter } from "react-router";

import HasAccess from '../../services/HasAccess/HasAccess';

import DownloadFiles from '../DownloadFiles/DownloadFiles';
import OpsHome from './OpsHome/OpsHome';
import CustomerMgmt from "../CustomerMgmt/CustomerMgmt";
import User from "../User/User";
import resetPassword from '../User/ResetPassword/ResetPassword'
import LeftNavBar from "../../components/Organism/Navigation/LeftNavBar/LeftNavBar";
import OrgMgmtLeftNav from "../CustomerMgmt/OrgMgmt/OrgMgmtLeftNav/OrgMgmtLeftNav";
import EmpMgmtLeftNav from "../CustomerMgmt/EmpMgmt/EmpMgmtLeftNav/EmpMgmtLeftNav";
import * as actions from '../User/Store/action';
import cx from "classnames";
import styles from "./Home.module.scss";
import WorkloadMgmt from "../WorkloadMgmt/WorkloadMgmt";
import CourtVerification from '../WorkloadMgmt/ServiceVerification/TaskSearchCloseReview/TaskSearchCloseReview';

class Home extends Component {

  componentDidMount() {
    this.props.onUserDetails();
  }

  handleRedirectUser = () => {
    const policies = this.props.policies;
    
    let redirectToOrgList = false;
    let redirectToOrgProfile = false;
    let redirectToOrgWorkload = false;
    let redirectOrg = null;
    let orgProfileCount = 0;
    
    _.forEach(policies, function(policy){
      if(_.includes(policy.businessFunctions, "ORG_PROFILE:VIEW")){
        redirectOrg = policy.orgId;
        orgProfileCount = orgProfileCount + 1;
      }
      else if( _.includes(policy.businessFunctions, '*')){
        redirectToOrgList = true;
      }
    })

    if(orgProfileCount > 1){
      redirectToOrgList = true;
    }else if(orgProfileCount === 1){
      redirectToOrgProfile = true
    }

    _.forEach(policies, function(policy){
      if(_.includes(policy.businessFunctions, "OPS:TASK")){
        redirectToOrgWorkload = true;
      }
    })
    
    if(redirectToOrgList) return "/customer-mgmt/org?filter=starred";
    else if(redirectToOrgWorkload) return "/workload-mgmt";
    else if(redirectToOrgProfile) return "/customer-mgmt/org/" + redirectOrg + "/profile";
  }

  handleLeftNavBar = () => {
    const policies = this.props.policies;
    let showClientLeftNav = false;

    _.forEach(policies, function(policy){
      if(_.includes(policy.businessFunctions, "CLIENT:HOME")){
        showClientLeftNav = true;
      }
    })
    _.forEach(policies, function(policy){
      if(_.includes(policy.businessFunctions, "OPS:TASK")){
        showClientLeftNav = false;
      }
      else if( _.includes(policy.businessFunctions, '*')){
        showClientLeftNav = false;
      }
    })
    return(showClientLeftNav);
  }

  render() {
    const { location } = this.props;
    let redirect = false;
    if (this.props.history.location.pathname === '/') {
      redirect = true;
    }
    const downloadFilesBasePath = '/download/files';
    const addressPhyVerification = '/workload-mgmt/address/physical/';
    const addressPostVerification = '/workload-mgmt/address/postal/';
    return (
      <React.Fragment>
      <Route path={downloadFilesBasePath} component={DownloadFiles} />
      <div className={cx(styles.Home, "row no-gutters")}>
        {(location.pathname==='/customer-mgmt/employee/:empId/report/docverify' || 
          location.pathname === '/customer-mgmt/employee/:empId/report/legalverify' ||
          location.pathname.substring(0, downloadFilesBasePath.length) === downloadFilesBasePath) ||
          location.pathname.substring(0, addressPhyVerification.length) === addressPhyVerification ||
          location.pathname.substring(0, addressPostVerification.length) === addressPostVerification
          ? null :
          <div className={cx(styles.LeftNavBar, "col-1 px-0")}>
            <LeftNavBar />
            {this.handleLeftNavBar() ?
              <Route path="/" component={EmpMgmtLeftNav} />
              :
              <Route path="/" component={OrgMgmtLeftNav} />
            } 
          </div>
        }
        <div className="col-11" style={{marginLeft:"8.3333%"}}>
          <div className={cx("col-12 px-0")}>

            <Route path="/customer-mgmt" component={CustomerMgmt} />
              <Switch>
                <Route path="/user/:userId" exact component={User} />
                <Route path="/user/:userId/reset-password" exact component={resetPassword} />
              </Switch>

              <HasAccess
                permission={['OPS:TASK', 'AGENCY_DASHBOARD:VIEW_ALL', 'AGENCY_DASHBOARD:VIEW_ASSIGNED']}
                yes={() =>
                  <React.Fragment>
                    {/* added condition to remove white spacing in workload */}
                    {this.props.location.pathname === `/workload-mgmt` && this.props.location.pathname.length === 14
                      && _.isEmpty(this.props.location.search) ?
                      <Route path="/workload-mgmt" exact component={OpsHome} />
                      :
                      <Route path="/workload-mgmt" component={WorkloadMgmt} />
                    }
                      <Route path='/crc' component={CourtVerification} />
                  </React.Fragment>
                }
              />
            { redirect ? <Redirect to={this.handleRedirectUser()} /> : null}
          </div>
        </div>
      </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    policies: state.auth.policies
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUserDetails: () => dispatch(actions.getUserDetails())
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import SelectDocuments from "./SelectDocuments/SelectDocuments";
import DocumentManagement from "./DocumentManagement/DocumentManagement";
import GovernmentDocument from "./GovernmentDocument/GorvernmentDocument";
import { withRouter } from "react-router";
import * as actionsOrgMgmt from '../OrgMgmtStore/action';
import * as actionsOrgOnboard from './Store/action';

class OrgOnboardConfig extends Component {

    componentDidMount = () => {
        const { match } = this.props;
        let orgId = match.params.uuid;
        this.props.getOrgData(orgId)
        this.props.getOrgOnboardConfigData(orgId);
    }

    componentWillUnmount = () => {
        this.props.initStateOnboard();
        this.props.initStateOrgMgmt();
    }

    render() {
        const { match } = this.props;

        return (
            <Switch>
                <Route path={`${match.path}/select-documents`} exact component={SelectDocuments} />
                <Route path={`${match.path}/company-documents/:documentType`} exact component={DocumentManagement} />
                <Route path={`${match.path}/government-documents/:documentType`} exact component={GovernmentDocument} />
            </Switch>
        );
    }
}

const mapStateToProps = state => {
    return {
        orgData: state.orgMgmt.staticData.orgData,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        initStateOnboard: () => dispatch(actionsOrgOnboard.initState()),
        initStateOrgMgmt: () => dispatch(actionsOrgMgmt.initState()),
        getOrgData: (orgId) => dispatch(actionsOrgMgmt.getDataById(orgId)),
        getOrgOnboardConfigData: (orgId) => dispatch(actionsOrgOnboard.getOnboardConfig(orgId))
    }
}

export default (withRouter(connect(mapStateToProps, mapDispatchToProps)(OrgOnboardConfig)));
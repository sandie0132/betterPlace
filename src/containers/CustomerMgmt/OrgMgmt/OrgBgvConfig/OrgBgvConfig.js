import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from "react-router";
import SelectService from '../OrgBgvConfig/SelectService/SelectService';
import TatMapping from './TatMapping/TatMapping';
import ClientSpoc from './ClientSpoc/ClientSpoc';
import TagMapping from './ServiceMapping/ServiceMapping';
import StatusMgmt from './StatusMgmt/StatusMgmt';
import BpSpoc from './BetterplaceSpoc/BetterplaceSpoc';
import * as actions from './Store/action.js';

class OrgBgvConfig extends Component {
    componentDidMount() {
        this.props.getServices();
    }

    componentWillUnmount() {
        this.props.initState();
    }
    render() {
        const { match } = this.props;

        return (
            <div className="container-fluid row px-0 mx-0">
                <Switch>
                    <Route path={`${match.path}/bgv-select`} exact component={SelectService} />
                    <Route path={`${match.path}/bgv-tat`} exact component={TatMapping} />
                    <Route path={`${match.path}/bgv-clientspoc`} exact component={ClientSpoc} />
                    <Route path={`${match.path}/bgv-map`} exact component={TagMapping} />
                    <Route path={`${match.path}/bgv-status`} component={StatusMgmt} />
                    <Route path={`${match.path}/bgv-bpspoc`} exact component={BpSpoc} />                    
                </Switch>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        servicesData: state.orgMgmt.orgBgvConfig.selectService.servicesData,
        getSelectedDataState: state.orgMgmt.orgBgvConfig.selectService.getSelectedDataState,
        error: state.orgMgmt.orgBgvConfig.selectService.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        initState: () => dispatch(actions.initState()),
        getServices: () => dispatch(actions.getServices())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OrgBgvConfig));
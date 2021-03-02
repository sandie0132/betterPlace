import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import EmpDetails from './EmpDetails/EmpDetails';
import { getOrgDetails, getOnboardConfig } from '../EmpMgmtStore/action';
import _ from "lodash";
import cx from "classnames";

import styles from "./EmpOnboarding.module.scss";
import * as actions from './Store/action';
import * as EmpAddNewModalActions from '../EmpAddNewModal/Store/action';

import EmpBasicRegistration from "./EmpBasicRegistration/EmpBasicRegistration";
import EmpAdditionalDetails from './EmpAdditionalDetails/EmpAdditionalDetails';
import EmpCompanyDocuments from './EmpCompanyDocuments/EmpCompanyDocuments';
import EmpGovernmentDocuments from './EmpGovernmentDocuments/EmpGovernmentDocuments';

class EmpOnboarding extends Component {

    state = {
        windowSize: window.innerWidth,
        showPanel: false,
        viewPanelContent: false
    }


    componentDidMount() {
        const orgId = this.props.match.params.uuid;

        if (!_.isEmpty(this.props.orgData)) {
            if (!_.isEmpty(this.props.servicesEnabled)) {
                this.handleBgvDetailsApi()
            }
        } else {
            this.props.onGetOrgDetails(orgId);
        }
        this.props.onGetOrgOnboardConfig(orgId);

        window.addEventListener("resize", this.handleResize);
        if (window.innerWidth > 1024) {
            this.setState({
                showPanel: true
            })
        }
    }

    componentDidUpdate(prevProps) {
        if (!_.isEqual(this.props.servicesEnabled, prevProps.servicesEnabled)) {
            this.handleBgvDetailsApi()
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
        this.props.initState();
    }

    handleBgvDetailsApi = () => {
        if (!_.isEmpty(this.props.servicesEnabled)) {
            const orgId = this.props.match.params.uuid;
            const empId = this.props.match.params.empId;

            if (!_.isEmpty(this.props.servicesEnabled.products)) {
                let isBgvEnabled = false;
                _.forEach(this.props.servicesEnabled.products, function (product) {
                    if (product.product === "BGV") isBgvEnabled = true;
                })
                if (isBgvEnabled && empId) {
                    this.props.onGetBgvDetails(orgId, empId);
                }
            }
        }
    }

    handleHideLeftNav = () => {
        const { match } = this.props;
        const pathname = this.props.location.pathname;
        if ((_.includes(pathname, "/profile")) || (match.isExact === true) ||
            (_.includes(pathname, "/excel-onboard")) || (_.includes(pathname, "/onboard")) || (_.includes(pathname, "/additional-details"))) {
            // return 1;
        }
        else {
            return (styles.alignContent);
        }
    }

    handleShowRighttNav = () => {
        const pathname = this.props.location.pathname;
        if ((_.includes(pathname, "/profile")) || (_.includes(pathname, "/excel-onboard"))) {
            return false;
        }
        else {
            return true;
        }
    }

    handleResize = e => {
        const windowSize = window.innerWidth;
        let show = false;
        let panel = this.state.viewPanelContent;
        if (windowSize > 1024) {
            show = true;
            panel = false
        }
        this.setState({
            windowSize: windowSize,
            showPanel: show,
            viewPanelContent: panel
        })
    };

    toggleSideNav = (yes) => {
        if (yes) {
            this.setState({
                viewPanelContent: false
            })
        } else {
            this.setState({
                viewPanelContent: true
            })
        }

    }

    putStyles = () => {
        if (!this.state.showPanel) {
            if (this.state.viewPanelContent) {
                return styles.openView
            } else return styles.removeDisplay
        }
    }



    render() {
        const { match } = this.props;
        
        return (
            <React.Fragment>
                <div className={cx(this.handleHideLeftNav())}>

                    <Switch>
                        <Route path={`${match.path}`} exact component={EmpBasicRegistration} />
                        <Route path={`${match.path}/basic-details`} exact component={EmpBasicRegistration} />
                        <Route path={`${match.path}/additional-details`} component={EmpAdditionalDetails} />
                        <Route path={`${match.path}/employee-details`} exact component={EmpDetails} />
                        <Route path={`${match.path}/company-documents`} component={EmpCompanyDocuments} />
                        <Route path={`${match.path}/government-documents`} component={EmpGovernmentDocuments} />
                    </Switch>
                </div>
            </React.Fragment>
        )
    }

}

const mapStateToProps = state => {
    return {
        showModal: state.empMgmt.empAddNew.showModal,
        data: state.empMgmt.empOnboard.onboard.empData,
        orgData: state.empMgmt.staticData.orgData,
        servicesEnabled: state.empMgmt.staticData.servicesEnabled,
        orgOnboardConfigData: state.empMgmt.staticData.orgOnboardConfig
    }
};

const mapDispatchToProps = dispatch => {
    return {
        initState: () => dispatch(actions.initState()),
        empAddNewModalReset: () => dispatch(EmpAddNewModalActions.initState()),
        onGetBgvDetails: (orgId, empId) => dispatch(actions.getEmpBgvDetails(orgId, empId)),
        onGetOrgDetails: (orgId) => dispatch(getOrgDetails(orgId)),
        onGetOrgOnboardConfig: (orgId) => dispatch(getOnboardConfig(orgId))
    };
}

export default (connect(mapStateToProps, mapDispatchToProps)(withRouter(EmpOnboarding)));
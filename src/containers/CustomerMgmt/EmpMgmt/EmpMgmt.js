import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import _ from "lodash";
import cx from "classnames";

import * as actions from './EmpMgmtStore/action';

import view from "../../../assets/icons/options.svg";
import close from "../../../assets/icons/closeBig.svg";
import styles from "./EmpMgmt.module.scss";
import scrollStyle from '../../../components/Atom/ScrollBar/ScrollBar.module.scss';

import ExcelOnboardingRightNav from "./ExcelOnboarding/ExcelOnboardingRightNav/ExcelOnboardingRightNav";
import EmpRightNav from './EmpOnboarding/EmpRightNav/EmpRightNav';
import EmpOnboarding from './EmpOnboarding/EmpOnboarding';
import EmployeeOnboarding from '../EmpMgmt/EmpAddNewModal/EmpAddNewModal';
import EmpList from './EmpList/EmpList';
import EmpProfile from './EmpProfile/EmpProfile';
import EmpListRightNav from "./EmpList/EmpListRightNav/EmpListRightNav";
import Report from './EmpBgvReport/Report';
// import VerifyAddress from './EmpBgvReport/ReportAddress/VerifyAddress/VerifyAddress';
// import VerifyDoc from './EmpBgvReport/ReportDocuments/VerifyDoc/VerifyDoc';
// import VerifyLegal from './EmpBgvReport/ReportLegal/VerifyLegal/VerifyLegal';
// import VerifyCareer from './EmpBgvReport/ReportCareer/VerifyCareer/VerifyCareer';
// import VerifyHealth from './EmpBgvReport/ReportHealth/VerifyHealth/VerifyHealth';
// import VerifyReference from './EmpBgvReport/ReportReference/VerifyReference/VerifyReference';
import EmpTermination from './EmpTermination/EmpTermination';
import ExcelOnboarding from './ExcelOnboarding/ExcelOnboarding';


class EmployeeMgmt extends Component {

    state = {
        windowSize: window.innerWidth,
        showPanel: false,
        viewPanelContent: false
    }

    componentDidMount() {
        const orgId = this.props.match.params.uuid;
        window.addEventListener("resize", this.handleResize);
        if (window.innerWidth > 1024) {
            this.setState({
                showPanel: true
            })
        }
        this.props.onGetOrgDetails(orgId);
        this.props.onGetStaticDataList();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
        this.props.initState();
    }

    handleHideLeftNav = () => {
        const { match } = this.props;
        const pathname = this.props.location.pathname;
        if ((_.includes(pathname, "/profile")) || (match.isExact === true) || 
        (_.includes(pathname, "/excel-onboard")) ||  (_.includes(pathname, "/onboard")) ) {
            // return 1;
        }
        else {
            return (styles.alignContent);
        }
    }

    handleShowRighttNav = () => {
        // const { match } = this.props;
        const pathname = this.props.location.pathname;
        if ((_.includes(pathname, "/profile")) || (_.includes(pathname, "/excel-onboard")) ) {
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
                <div className={cx("d-flex", this.handleHideLeftNav())}>
                    <div className={styles.centerContent} >
                        <Switch>
                            <Route path={`${match.path}/:empId/report`} exact component={Report} />
                            {/* <Route path={`${match.path}/:empId/report/addressverify`} component={VerifyAddress} />
                            <Route path={`${match.path}/:empId/report/docverify`} component={VerifyDoc} />
                            <Route path={`${match.path}/:empId/report/legalverify`} component={VerifyLegal} />
                            <Route path={`${match.path}/:empId/report/healthverify`} component={VerifyHealth} />
                            <Route path={`${match.path}/:empId/report/careerverify`} component={VerifyCareer} />
                            <Route path={`${match.path}/:empId/report/referenceverify`} component={VerifyReference} /> */}
                        </Switch>
                        
                        <Switch>
                            <Route path={`${match.path}/duplicate`} exact component={EmpTermination} />
                            <Route path={`${match.path}/on-boarding`} exact component={EmployeeOnboarding} />
                            <Route path={`${match.path}/excelonboard`} exact component={ExcelOnboarding} />
                            <Route path={`${match.path}`} exact component={EmpList} />
                            <Route path={`${match.path}/onboard/addnew`} exact component={EmpOnboarding} />
                            <Route path={`${match.path}/onboard/:empId`} component={EmpOnboarding} />
                            <Route path={`${match.path}/:empId/profile`} exact component={EmpProfile} /> 
                        </Switch>
                           
                    </div>
                    {
                        this.state.showPanel || this.state.viewPanelContent ?
                            <span>
                                {this.state.viewPanelContent ? <span onClick={() => this.toggleSideNav("yes")} className={styles.closeNav}>
                                    <img src={close} alt="close" />
                                </span> : null}

                                <div className={cx(this.putStyles(), styles.rightNavWidth, scrollStyle.scrollbar)}>
                                    <Switch>
                                        <Route path={`${match.path}/:empId/report`} />
                                        {/* <Route path={`${match.path}/:empId/report/addressverify`} component={VerifyAddress} />
                                        <Route path={`${match.path}/:empId/report/docverify`} component={VerifyDoc} />
                                        <Route path={`${match.path}/:empId/report/legalverify`} component={VerifyLegal} />
                                        <Route path={`${match.path}/:empId/report/healthverify`} component={VerifyHealth} />
                                        <Route path={`${match.path}/:empId/report/careerverify`} component={VerifyCareer} />
                                        <Route path={`${match.path}/:empId/report/referenceverify`} component={VerifyReference} /> */}
                                        <Route path={`${match.path}/:empId/profile`} exact />
                                        <Route path={`${match.path}/excelonboard/:excelRoute`} exact />
                                        <Route path={`${match.path}/onboard/addnew`} exact  component={EmpRightNav}/>
                                        <Route path={`${match.path}/onboard/:empId`}  component={EmpRightNav}/>
                                        <Route path={`${match.path}/excelonboard`} component={ExcelOnboardingRightNav} />
                                        <Route path={`${match.path}`} exact component={EmpListRightNav} />
                                    </Switch>
                                </div>
                            </span> :
                            <React.Fragment>
                                {this.handleShowRighttNav() ?
                                    <div onClick={() => this.toggleSideNav()}>

                                        <img src={view} alt="view" style={{ cursor: "pointer" }} className={cx("mt-4",styles.positionIcon)} />
                                    </div>
                                    : null}
                            </React.Fragment>

                    }
                </div>
            </React.Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        initState: () => dispatch(actions.initState()),
        onGetStaticDataList: () => dispatch(actions.getStaticDataList()),
        onGetOrgDetails: (orgId) => dispatch(actions.getOrgDetails(orgId))        
    };
}

export default withRouter(connect(null, mapDispatchToProps)(EmployeeMgmt));
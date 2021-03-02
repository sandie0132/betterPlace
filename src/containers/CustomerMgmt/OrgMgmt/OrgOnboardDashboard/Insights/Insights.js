import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router";
import cx from "classnames";
import _ from "lodash";

import HasAccess from '../../../../../services/HasAccess/HasAccess';

import styles from "./Insights.module.scss";
import ProgressBar from './ProgressBar/ProgressBar';

import onBoard from "../../../../../assets/icons/onBoardBg.svg";
import active from "../../../../../assets/icons/activeGreen.svg";
import terminated from "../../../../../assets/icons/terminated.svg";
import preHired from "../../../../../assets/icons/preHired.svg";
import hired from "../../../../../assets/icons/hired.svg";
import terminateEmp from "../../../../../assets/icons/terminatedBriefcase.svg";
import verify from "../../../../../assets/icons/verifyIcon.svg";
import warning from "../../../../../assets/icons/onholdYellow.svg";
import initiated from "../../../../../assets/icons/initiatedIcon.svg";
import note from "../../../../../assets/icons/yellowExclamation.svg"
import { Button } from 'react-crux';
import OnboardInsight from './OnboardInsight/OnboardInsight';
import Loader from "../../../../../components/Organism/Loader/Loader";
import tooltip from "../../../../../assets/icons/question.svg";

class Insights extends Component {

    redirectUrl = () => {
        const orgId = this.props.match.params.uuid;
        let url = `/customer-mgmt/org/${orgId}/dashboard/verify?filter=insights&duration=all_time`
        this.props.history.push(url)
    }

    checkBGVService = () => {
        const bgvService = _.cloneDeep(this.props.enabledProducts);
        let isBgvEnabled = false
        if (!_.isEmpty(bgvService)) {
            _.forEach(bgvService, function (product) {
                if (product.product === "BGV") isBgvEnabled = true;
            })
        }
        return isBgvEnabled;
    }

    getConversionRate = (ter, on) => {

        if (on !== 0) {
            let att = (ter / on) * 100
            if (isNaN(att)) {
                return "00"
            } else return att.toFixed(2)
        } else {
            return "00"
        }


    }

    render() {
        const onboardData = _.cloneDeep(this.props.onboardStats)
        const bgvData = _.cloneDeep(this.props.bgvStatus)
        const { match } = this.props;
        const orgId = match.params.uuid;
        const baseUrl = "/customer-mgmt/org/" + orgId + "/employee?"

        return (
            <React.Fragment>
            {
            this.props.getOrgOnboardStatsState === 'LOADING' ?
                <Loader type='onboardDashboard' /> :
                <div>
                    <div className={styles.heading}>onboarding status</div>
                    {
                        !_.isEmpty(onboardData) ?
                            <div className={cx(styles.cardBg, "mb-3")}>
                                <div className="pl-3">
                                    <ProgressBar
                                        label="basic registration completed"
                                        total={onboardData.totalEmployees}
                                        completed={onboardData.basicDetails}
                                        category="basic"
                                        url={baseUrl+'isBasicDetailsFilled=true'}
                                    />
                                    <ProgressBar
                                        label="additional data collected"
                                        total={onboardData.totalEmployees}
                                        completed={onboardData.additionalDetails}
                                        category="additional"
                                        url={baseUrl+'isAdditionalDetailsFilled=true'}
                                    />
                                    <ProgressBar
                                        label="employee details collected"
                                        total={onboardData.totalEmployees}
                                        completed={onboardData.empDetails}
                                        category="employee"
                                        url={baseUrl+'isEmpDetailsFilled=true'}
                                    />
                                    <ProgressBar
                                        label="company documents generated"
                                        total={onboardData.totalEmployees}
                                        completed={onboardData.companyDocuments}
                                        category="company"
                                        url={baseUrl+'isCompanyDocGenerated=true'}
                                    />
                                    <ProgressBar
                                        label="government documents generated"
                                        total={onboardData.totalEmployees}
                                        completed={onboardData.govDocuments}
                                        category="government"
                                        url={baseUrl+'isGovDocGenerated=true'}
                                    />
                                </div>
                                <div className={cx("row mx-0", styles.blueCardBG)} >
                                    <div className="col-8 px-0 py-2 px-2">
                                        <div className={styles.mediumTextBold}>
                                            overall completed profiles (hired)
                                        </div>
                                        <div className={styles.smallBoldGrey}>
                                            {onboardData.completedProfiles} profiles
                                        </div>
                                    </div>
                                    <div className={cx("col-4 row pr-0", styles.borderLeft)} >
                                        <div className={styles.largeNumber}>{this.getConversionRate(onboardData.completedProfiles, onboardData.totalEmployees)}%</div>
                                        <div className={cx(styles.mediumTextBold, "pt-2 ml-2")}>
                                            conversion rate
                                        </div>
                                        <div className={cx(styles.tooltip,"mt-2")}>
                                            <img src={tooltip} alt="tooltip" className="pl-2"/>
                                            <span className={cx(styles.tooltiptext)}>This includes profiles for which employee details are collected and documents are generated out of all registered profiles</span>
                                            </div>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <img src={note} alt="note" className="mr-2"/>
                                    <span className={styles.greyItalic}>Terminated employees are included in the count</span>
                                </div>
                            </div>

                            : null

                    }



                    <div className={cx(styles.heading, "mt-5")}>overall status</div>
                    {
                        !_.isEmpty(onboardData) ?
                            <div className={cx(styles.cardBg, "mb-3")}>
                                <div className={styles.alignCenter}>
                                    <div className="row px-0 mx-0 mt-2">
                                        <div className="mr-3">
                                            <img src={onBoard} alt="img" />
                                        </div>
                                        <div>
                                            <div className={styles.smallBold}>
                                                overall onboarded
                                        </div>
                                            <div className={styles.largeMedium}>
                                                {onboardData.totalEmployees} profiles
                                        </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={cx("row mx-0 px-0", styles.smallCard)}>
                                    <div className="col-8 pl-4">
                                        <div className={styles.smallBoldGrey}>
                                            <img src={active} alt="active" className="mr-2" />active
                                        </div>
                                        <div className={"row mx-0 px-0 mt-2"}>
                                            <div className="col-6 row px-0 mx-0">
                                                <div className="mr-3 my-auto">
                                                    <img src={preHired} alt="img" />
                                                </div>
                                                <div>
                                                    <div className={styles.mediumBold}>
                                                        {onboardData.preHiredEmployees}
                                                    </div>
                                                    <div className={styles.smallBoldGrey}>
                                                        pre-hired employees
                                                </div>
                                                </div>
                                            </div>
                                            <div className={cx("col-6 row pr-0 pl-5 mx-0", styles.borderLeftGrey)}>
                                                <div className="mr-3 my-auto">
                                                    <img src={hired} alt="img" />
                                                </div>
                                                <div>
                                                    <div className={styles.mediumBold}>
                                                        {onboardData.hiredEmployees}
                                                    </div>
                                                    <div className={styles.smallBoldGrey}>
                                                        hired employees
                                                </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className={cx("col-4", styles.borderLeftGrey, styles.paddingLeft)}>
                                        <div className={styles.smallBoldGrey}>
                                            <img src={terminated} alt="terminated" className="mr-2" height="32px" /> terminated
                                    </div>
                                        <div className="row px-0 mx-0 mt-2">
                                            <div className="mr-3 my-auto">
                                                <img src={terminateEmp} alt="img" />
                                            </div>
                                            <div>
                                                <div className={styles.mediumBold}>
                                                    {onboardData.terminatedEmployees}
                                                </div>
                                                <div className={styles.smallBoldGrey}>
                                                    terminated employees
                                            </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                            : null}

                    {
                        this.checkBGVService() && !_.isEmpty(bgvData) ?

                            <React.Fragment>

                                <div className={cx(styles.heading, "mt-5")}>additional services</div>

                                <div className={cx(styles.cardBg, "mb-3")}>
                                    <div className={cx(styles.smallGreyBold)}>
                                    <img src={verify} alt="img" height="32px" className="mr-2"/>
                                    verify
                                </div>
                                    <div className="row mx-0 px-0">
                                        <div className="row col-3 px-0 mx-0 mt-2">
                                            <div className="mr-3 my-auto">
                                                <img src={initiated} alt="img" />
                                            </div>
                                            <div>
                                                <div className={styles.largeMedium}>
                                                    {bgvData.INITIATED == null ? 0 : bgvData.INITIATED}
                                                </div>
                                                <div className={styles.smallText}>
                                                    initiated profiles
                                    </div>
                                            </div>
                                        </div>
                                        {
                                            <div className={cx("row col-4 pr-0 pl-5 mx-0 mt-2", styles.borderLeftGrey)}>
                                                <div className={cx("mr-3 my-auto", styles.imgBg)}>
                                                    <img src={warning} alt="img" />
                                                </div>
                                                <div>
                                                    <div className={"d-flex"}>
                                                        <div className={cx(styles.largeMediumGrey)}>{bgvData.MISSING_INFO == null ? 0 : bgvData.MISSING_INFO}</div>
                                                        <div className={cx(styles.smallGreyBold, "pt-1 ml-2")}>profiles</div>
                                                    </div>
                                                    <div className={styles.smallGrey}>
                                                        missing data
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {
                                            <HasAccess
                                                permission={["BGV:DASHBOARD"]}
                                                orgId={this.props.orgId}
                                                yes={() => (
                                                    !_.isEmpty(this.props.bgvConfig) && this.props.bgvConfig['status'] === 'done' ?
                                                        <div className="ml-auto my-auto">
                                                            <Button
                                                                type="mediumWithArrow"
                                                                label="dashboard"
                                                                labelStyle={styles.button}
                                                                clickHandler={() => this.redirectUrl()}
                                                            />
                                                        </div>
                                                        :
                                                        null
                                                )}
                                            />
                                        }

                                    </div>

                                </div>
                            </React.Fragment> : null
                    }

                    <div className={cx(styles.heading, "mt-5 mb-3")}>onboarding insights</div>
                </div>
            }
            <OnboardInsight />
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        getOrgProfileState: state.orgMgmt.orgOnboardDashboard.getOrgProfileState,
        getOrgConfigState: state.orgMgmt.orgOnboardDashboard.getOrgConfigState,
        getOrgBgvStatusState: state.orgMgmt.orgOnboardDashboard.postOrgBgvStatusState,
        getOrgOnboardStatsState: state.orgMgmt.orgOnboardDashboard.getOrgOnboardStatsState,
        getOrgOnboardInsightsState: state.orgMgmt.orgOnboardDashboard.getOrgOnboardInsightsState,

        onboardStats: state.orgMgmt.orgOnboardDashboard.onboardStats,
        bgvConfig: state.orgMgmt.orgOnboardDashboard.bgvConfig,
        bgvStatus: state.orgMgmt.orgOnboardDashboard.bgvStatus,
        orgData: state.orgMgmt.orgOnboardDashboard.orgData,
        enabledProducts: state.orgMgmt.orgOnboardDashboard.enabledProducts
    };
};

export default withRouter(connect(mapStateToProps, null)(Insights));
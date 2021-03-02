import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router";
import * as actions from './Store/action';
import styles from './Insights.module.scss';
import InsightChart from '../../../../../components/Organism/InsightChart/InsightChart';
import _ from "lodash";
import { withTranslation } from 'react-i18next';
import Loader from '../../../../../components/Organism/Loader/Loader';
import success from "../../../../../assets/icons/warning.svg";
import terminated from "../../../../../assets/icons/terminated.svg";
import reInitiate from "../../../../../assets/icons/reInitiate.svg";
import cx from "classnames";

class InsightsAllTime extends Component {

    componentDidMount() {
        const { match } = this.props;
        const orgId = match.params.uuid;
        this.props.getServicesConfigured(orgId);
        this.handleApiCalls();

    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.location.search !== this.props.location.search) {
            this.handleApiCalls();
        }

    }

    componentWillUnmount() {
        this.props.initState();
    }

    handleApiCalls = () => {
        const { match } = this.props;
        const orgId = match.params.uuid;
        let urlSearchParams = new URLSearchParams(window.location.search.toString());
        let tagId = urlSearchParams.get("tagId");
        if (tagId) {
            this.props.onGetBgvStatus(orgId, tagId)
        }
        else {
            this.props.onGetBgvStatus(orgId)
        }
    }

    handleOverAllData = () => {
        if (!_.isEmpty(this.props.bgvStatus)) {
            let dt = this.props.bgvStatus;
            let data = {
                "RED": dt["RED"],
                "YELLOW": dt["YELLOW"],
                "GREEN": dt["GREEN"],
                "INPROGRESS": dt["INPROGRESS"],
                "INITIATED": dt["INITIATED"]
            }
            return data;
        }
    }

    handleCheckData = () => {

        if (!_.isEmpty(this.props.services) && !_.isEmpty(this.props.bgvStatus)) {
            let services = this.props.services.servicesEnabled;
            let serviceArr = [];
            let finalData = [];
            let bgvData = this.props.bgvStatus;
            _.forEach(services, function (object) {
                serviceArr.push(object.service)
            });

            _.forEach(serviceArr, function (service, i) {
                let serviceName = '';
                let obj;
                const serviceData = bgvData["checks"].filter((serviceObj, index) => {
                    serviceName = service;
                    if (serviceObj.hasOwnProperty(service)) {
                        return serviceObj[service];
                    }
                    else
                        return null;
                })

                if (serviceData[0] !== undefined) {
                    let data = serviceData[0];
                    obj =
                    {
                        CATEGORY: serviceName,
                        INITIATED: data[serviceName]["INITIATED"],
                        RED: data[serviceName]["RED"],
                        YELLOW: data[serviceName]["YELLOW"],
                        GREEN: data[serviceName]["GREEN"],
                        INPROGRESS: data[serviceName]["INPROGRESS"],
                        index: i
                    }
                }
                else {
                    obj =
                    {
                        CATEGORY: serviceName,
                        INITIATED: 0,
                        RED: 0,
                        YELLOW: 0,
                        GREEN: 0,
                        INPROGRESS: 0,
                        index: i
                    }
                }
                finalData.push(obj)    
            });
            if (serviceArr.length < 9) {
                for (let i = 0; i < 9 - serviceArr.length; i++) {
                    let obj = {
                        CATEGORY: "",
                        INITIATED: 0,
                        RED: 0,
                        YELLOW: 0,
                        GREEN: 0,
                        INPROGRESS: 0,
                        index: i + serviceArr.length
                    }
                    finalData.push(obj)
                }
            }
            return finalData;
        }
    }

    handleTatData = () => {
        let tatData = this.props.bgvStatus["tatDetails"];
        let tatObj = {};

        _.forEach(tatData, function (tat) {
            if (tat["daysForCompletion"] === 0) {
                tatObj["1"] = tat["count"]
            } else {
                if (tatObj.hasOwnProperty(tat["daysForCompletion"])) {
                    tatObj[tat["daysForCompletion"]] = tatObj[tat["daysForCompletion"]] + tat["count"]
                } else {
                    tatObj[tat["daysForCompletion"]] = tat["count"]
                }
            }
        })
        tatObj["AGREE"] = this.props.bgvStatus["tat"]
        return tatObj
    }

    render() {
        const { t } = this.props;
        let bgvData = this.props.bgvStatus;

        return (
            <React.Fragment>
                {this.props.getServicesState === 'LOADING' && this.props.getBgvStatusState === 'LOADING' ?
                    <div className="col-12 px-0"><Loader type='orgDashboard' /></div>
                    : this.props.getServicesState === 'SUCCESS' && this.props.getBgvStatusState === 'SUCCESS' ?
                        <React.Fragment>
                            <div className="col-12 px-0">
                                <div className="my-2">
                                    <span className={styles.heading}>
                                        {t('translation_orgBgvStatus:dashboard.l5')}
                                    </span>
                                    <br /><br />
                                    {this.props.getServicesState === 'SUCCESS' && this.props.getBgvStatusState === 'SUCCESS' ?
                                        <React.Fragment>
                                            <InsightChart
                                                data={this.handleOverAllData()}
                                                type="overAll"
                                            />
                                            <br />
                                            <br />
                                            <span className={styles.heading}>
                                                {t('translation_orgBgvStatus:dashboard.l6')}
                                            </span>
                                            <br />
                                            <br />
                                            <InsightChart
                                                data={this.handleCheckData()}
                                                type="checks"
                                            />
                                            <br />
                                            <br />
                                            <span className={styles.heading}>
                                                Tat comparison
                                                </span>
                                            <br />
                                            <br />
                                            <InsightChart
                                                data={this.handleTatData()}
                                                type="tat"
                                            />
                                            <br />
                                            <br />
                                            {bgvData["missingDetails"]["totalMissingInfoCount"] !== 0 ?
                                                <React.Fragment>
                                                    <div className={styles.heading}>
                                                        missing & insufficient information </div>
                                                    <div className={cx("row ml-0 mt-3", styles.cardBg)}>
                                                        <div className="ml-3">
                                                            <img src={success} alt="tick" style={{ height: "54px" }} />
                                                        </div>
                                                        <div className="mx-5" style={{ color: "#212529" }}>
                                                            <div className="d-flex" >
                                                                <div className={styles.smallCardHeading}>{bgvData["missingDetails"]["BgvMissingInfoNotification"]} </div><div className={styles.smallCardTextBold}>&nbsp;&nbsp;profiles</div></div>
                                                            <div className={cx(styles.smallCardText, "mt-2")}>BGV missing information</div>
                                                        </div>
                                                        <div className="mx-4" style={{ color: "#8697A8" }}>
                                                            <div className="d-flex" >
                                                                <div className={styles.smallCardHeading}>{bgvData["missingDetails"]["BgvInsufficientInfoNotification"]} </div> <div className={styles.smallCardText}>&nbsp;&nbsp;profiles</div></div>
                                                            <div className={cx(styles.smallCardText, "mt-2")}>BGV insufficient information</div>
                                                        </div>
                                                        {/* <div className="ml-auto">
                                                    <span className={styles.downloadButton} onClick={() => this.downloadxlxsPOC()}>
                                                        donwload approvals
                                                            <img src={download} alt="download" className="ml-2" />
                                                    </span>
                                                </div> */}
                                                    </div>
                                                </React.Fragment>
                                                : null}
                                            <br />
                                            {/* <br /> */}
                                            {bgvData["approvalDetails"]["totalApprovalInfoCount"] !== 0 ?
                                                <React.Fragment>
                                                    <div className={styles.heading}>
                                                        re-initiate<span className={styles.headingBold}>&nbsp;&nbsp;{bgvData["approvalDetails"]["totalApprovalInfoCount"]}&nbsp;&nbsp;</span>checks</div>
                                                    <div className={cx("row ml-0 mt-3", styles.cardBg)}>
                                                        <div className="ml-3">
                                                            <img src={reInitiate} alt="tick" style={{ height: "54px" }} />
                                                        </div>
                                                        <div className="mx-5" style={{ color: "#212529" }}>
                                                            <div className="d-flex" >
                                                                <div className={styles.smallCardHeading}>{bgvData["approvalDetails"]["EmpDetailsUpdateApprovalNotification"]}</div> <div className={styles.smallCardTextBold}>&nbsp;&nbsp;checks</div></div>
                                                            <div className={cx(styles.smallCardText, "mt-2")}>employee details update approval</div>
                                                        </div>
                                                        <div className="mx-4" style={{ color: "#8697A8" }}>
                                                            <div className="d-flex" >
                                                                <div className={styles.smallCardHeading}>{bgvData["approvalDetails"]["BgvVerificationApprovalNotification"]}</div> <div className={styles.smallCardText}>&nbsp;&nbsp;checks</div></div>
                                                            <div className={cx(styles.smallCardText, "mt-2")}>BGV verification approval</div>
                                                        </div>
                                                        {/* <div className="ml-auto">
                                                    <span className={styles.downloadButton} onClick={() => this.downloadxlxsPOC()}>
                                                        donwload approvals
                                                            <img src={download} alt="download" className="ml-2" />
                                                    </span>
                                                </div> */}
                                                    </div>
                                                </React.Fragment>
                                                : null}
                                            <br />

                                            {bgvData.totalOnboardedCount !== 0 ?
                                                <React.Fragment>
                                                    <div className={styles.heading}>terminated profiles summary</div>
                                                    <div className={cx("row ml-0 mt-3", styles.cardBgSmall)}>
                                                        <div className="ml-3">
                                                            <img src={terminated} alt="tick" className="pt-4" />
                                                        </div>
                                                        <div className="mx-5 pt-4" style={{ color: "#212529" }}>
                                                            <div className="d-flex" >
                                                                <div className={styles.smallCardHeading}>{bgvData.totalTerminatedCount ? bgvData.totalTerminatedCount : 0}</div> <div className={styles.smallCardTextBold}>&nbsp;&nbsp;employees</div></div>
                                                            <div className={cx(styles.smallCardText, "mt-2")}>terminated over all</div>
                                                        </div>
                                                        <div className={cx("ml-5 pt-4")}>
                                                            {/* <div className={cx("px-4", styles.borderRight)} style={{ color: "#8697A8" }}>
                                                        <div className="d-flex" >
                                                            <div className={styles.smallCardHeading}>400</div> <div className={styles.smallCardText}>&nbsp;&nbsp;employees</div></div>
                                                        <div className={cx(styles.smallCardText, "mt-2")}>over all terminated ( till now )</div>
                                                    </div> */}
                                                            <div className="mx-4" style={{ color: "#8697A8" }}>
                                                                <div className="d-flex" >
                                                                    <div className={styles.smallCardHeading}>{bgvData.totalOnboardedCount}</div> <div className={styles.smallCardText}>&nbsp;&nbsp;employees</div></div>
                                                                <div className={cx(styles.smallCardText, "mt-2")}>over all onboarded ( till date )</div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                                : null}
                                        </React.Fragment>
                                        : null}
                                    <br />
                                </div>
                            </div>
                        </React.Fragment>
                        : null}
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        getServicesState: state.orgMgmt.orgBgvDashboard.bgvInsights.getServicesState,
        getBgvStatusState: state.orgMgmt.orgBgvDashboard.bgvInsights.postBgvStatusState,
        services: state.orgMgmt.orgBgvDashboard.bgvInsights.services,
        bgvStatus: state.orgMgmt.orgBgvDashboard.bgvInsights.bgvStatus,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        initState: () => dispatch(actions.initState()),
        onGetBgvStatus: (orgId, tagId) => dispatch(actions.postBgvStatus(orgId, tagId)),
        getServicesConfigured: (orgId) => dispatch(actions.getServicesConfigured(orgId)),
    };
};

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(InsightsAllTime)));
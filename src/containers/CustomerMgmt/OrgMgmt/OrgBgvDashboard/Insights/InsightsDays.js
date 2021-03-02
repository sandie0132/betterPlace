import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router";
import * as actions from './Store/action';
import Loader from '../../../../../components/Organism/Loader/Loader';
import EmptyPage from '../../../../../components/Organism/EmptyPage/EmptyPage';

import styles from './Insights.module.scss';
import cx from "classnames";
import _ from "lodash";
import verify from "../../../../../assets/icons/inprogressDashboard.svg";
import inProgress from "../../../../../assets/icons/inprogress_2.svg";
import done from "../../../../../assets/icons/closedVerification.svg";
import other from "../../../../../assets/icons/otherId.svg";
import panConfigIcon from '../../../../../assets/icons/panConfigIcon.svg';
import voterConfigIcon from '../../../../../assets/icons/voterConfigIcon.svg';
import aadhaarConfigIcon from '../../../../../assets/icons/aadhaarConfigIcon.svg';
import permanentAddress from '../../../../../assets/icons/permanentaddressConfigIcon.svg';
import currentAddress from '../../../../../assets/icons/currentAddressConfigIcon.svg';
import defaultIcon from '../../../../../assets/icons/defaultIcon.svg';
import drivingLicenseConfigIcon from '../../../../../assets/icons/drivingLicenseConfigIcon.svg';
import globalDb from '../../../../../assets/icons/databaseWithBackground.svg';
import educationConfigIcon from '../../../../../assets/icons/educationConfigIcon.svg';
import employmentConfigIcon from '../../../../../assets/icons/employmentConfigIcon.svg';
import healthConfigIcon from '../../../../../assets/icons/healthConfigIcon.svg';
import refConfigIcon from '../../../../../assets/icons/refConfigIcon.svg';
import courtConfigIcon from '../../../../../assets/icons/courtConfigIcon.svg';
import policeVerificationConfigIcon from '../../../../../assets/icons/policeConfigIcon.svg';
import vehicleregistrationConfigIcon from '../../../../../assets/icons/rcConfigIcon.svg';
import { withTranslation } from 'react-i18next';

class InsightDays extends Component {

    state = {
        verificationData: null
    }

    componentDidMount() {
        this.handleCheckVerifiedCard();
        this.handleApiCalls();
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.location.search !== this.props.location.search) {
            this.handleApiCalls();
        }

        if (prevProps.getCustomBgvStatusState !== this.props.getCustomBgvStatusState) {
            if (this.props.getCustomBgvStatusState === "SUCCESS") {
                this.handleCheckVerifiedCard()
            }
        }
    }


    componentWillUnmount() {
        this.props.initState()
    }

    handleApiCalls = () => {
        const { match } = this.props;
        const orgId = match.params.uuid;

        let urlSearchParams = new URLSearchParams(window.location.search.toString());
        let tagId = urlSearchParams.get("tagId");
        let duration = this.handleDateFilter();

        if (duration) {
            this.props.onGetCustomBgvStatus(orgId, tagId, duration)

        }
    }

    formatDate = (date) => {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    handleDateFilter = () => {
        let urlSearchParams = new URLSearchParams(window.location.search.toString());
        let dateType = urlSearchParams.get("duration");
        let newDate = new Date();
        let today = new Date();
        let lastWeek = null;
        let duration = {};

        switch (dateType) {
            case 'last_week':

                lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
                newDate = this.formatDate(newDate);
                lastWeek = this.formatDate(lastWeek);
                duration = {
                    dateFrom: lastWeek,
                    dateTo: newDate
                };
                return duration;


            case 'last_day':
                lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
                newDate = this.formatDate(newDate);
                lastWeek = this.formatDate(lastWeek);
                duration = {
                    dateFrom: lastWeek,
                    dateTo: newDate
                };
                return duration;


            case 'last_month':
                lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
                newDate = this.formatDate(newDate);
                lastWeek = this.formatDate(lastWeek);
                duration = {
                    dateFrom: lastWeek,
                    dateTo: newDate
                };
                return duration;

            case 'last_year':
                lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 365);
                newDate = this.formatDate(newDate);
                lastWeek = this.formatDate(lastWeek);
                duration = {
                    dateFrom: lastWeek,
                    dateTo: newDate
                };
                return duration;

            case 'custom_date_range':
                duration = {
                    dateFrom: urlSearchParams.get("from"),
                    dateTo: urlSearchParams.get("to")
                };
                return duration;

            default:
                return null;

        }

    }

    handleDisplayIcon = (icon) => {
        let displayIcon = null;
        switch (icon.toString()) {
            case 'PAN': displayIcon = panConfigIcon; break;
            case 'AADHAAR': displayIcon = aadhaarConfigIcon; break;
            case 'VOTER': displayIcon = voterConfigIcon; break;
            case 'RC': displayIcon = vehicleregistrationConfigIcon; break;
            case 'DL': displayIcon = drivingLicenseConfigIcon; break;
            case 'PERMANENT_ADDRESS': displayIcon = permanentAddress; break;
            case 'CURRENT_ADDRESS': displayIcon = currentAddress; break;
            case 'GLOBALDB': displayIcon = globalDb; break;
            case 'EMPLOYMENT': displayIcon = employmentConfigIcon; break;
            case 'EDUCATION': displayIcon = educationConfigIcon; break;
            case 'HEALTH': displayIcon = healthConfigIcon; break;
            case 'REFERENCE': displayIcon = refConfigIcon; break;
            case 'CRC_PERMANENT_ADDRESS': displayIcon = courtConfigIcon; break;
            case 'CRC_CURRENT_ADDRESS': displayIcon = courtConfigIcon; break;
            case 'POLICE_VERIFICATION': displayIcon = policeVerificationConfigIcon; break;
            case 'others': displayIcon = other; break;
            default: displayIcon = defaultIcon;
        }
        return displayIcon;
    }

    handleCheckVerifiedCard = () => {

        let checksArr = []
        let updatedChecksArray;
        let otherscount = 0;
        if (!_.isEmpty(this.props.customBgvStatus)) {
            _.forEach(this.props.customBgvStatus["checks"], function (checkData) {
                let checkKey = Object.keys(checkData);
                if (checkData[checkKey]["VERIFIED"]) {
                    let obj = {
                        "checks": checkData[checkKey]["VERIFIED"],
                        "label": checkKey.toString()
                    }
                    checksArr.push(obj)
                }
            })
            checksArr = checksArr.sort(function (a, b) {
                return a.checks > b.checks;
            });
            if (checksArr.length <= 4) {
                updatedChecksArray = _.cloneDeep(checksArr)
            }
            else {
                _.forEach(checksArr, function (data, index) {
                    if (index >= 3) {
                        otherscount = otherscount + data["checks"]
                    }
                })
                updatedChecksArray = [
                    _.cloneDeep(checksArr[0]),
                    _.cloneDeep(checksArr[1]),
                    _.cloneDeep(checksArr[2]),
                    {
                        "checks": otherscount,
                        "label": "others"
                    }
                ]
            }
            this.setState({
                verificationData: _.cloneDeep(updatedChecksArray)
            })
        }
    }

    render() {
        const { t } = this.props;
        const data = this.props.customBgvStatus;
        return (
            <React.Fragment>
                {this.props.getServicesState === 'LOADING' && this.props.getCustomBgvStatusState === 'LOADING' ?
                    <div className="col-12 px-0"><Loader type='orgDashboard' /></div>
                    :
                    this.props.getCustomBgvStatusState === 'SUCCESS' ?
                        <React.Fragment>

                            <div className="col-12 px-0">
                                <div className="my-2">
                                    {data["INITIATED"] !== 0 ?
                                        <React.Fragment>
                                            <div className={styles.heading}>{t('translation_orgBgvStatus:summary')} </div>
                                            <div className={cx("row mx-0 mt-3", styles.cardBgSmall)}>
                                                <div className="ml-3 mr-4 pt-3 " style={{ color: "#212529" }}>
                                                    <div className="d-flex" >
                                                        <div className={styles.smallCardHeading}>{data["INITIATED"]}</div> <div className={styles.smallCardTextBold}>&nbsp;&nbsp;{t('translation_orgBgvStatus:profiles')}</div></div>
                                                    <div className={cx(styles.smallCardText, "mt-2")}>
                                                        <img src={verify} alt="initiated" className="mr-2" />
                                                        {t('translation_orgBgvStatus:initiated')}</div>
                                                </div>
                                                <div className="ml-5 pt-3" style={{ color: "#212529" }}>
                                                    <div className="d-flex" >
                                                        <div className={styles.smallCardHeading}>{data["INPROGRESS"]}</div> <div className={styles.smallCardTextBold}>&nbsp;&nbsp;{t('translation_orgBgvStatus:profiles')}</div></div>
                                                    <div className={cx(styles.smallCardText, "mt-2")}>
                                                        <img src={inProgress} alt="progress" className="mr-2" />{t('translation_orgBgvStatus:totalInProgress')}</div>
                                                </div>
                                                <div className={cx(styles.cardBorderSmall, "ml-auto mr-4")}>
                                                    <div className={cx(styles.borderRightLarge)} style={{ color: "#212529", paddingRight: "6rem" }}>
                                                        <div className="d-flex" >
                                                            <div className={styles.smallCardHeading}>{data["INPROGRESS"] - data["INITIATED"] ? data["INITIATED"] - data["INPROGRESS"] : null}</div> <div className={styles.smallCardTextBold}>&nbsp;&nbsp;{t('translation_orgBgvStatus:profiles')}</div></div>
                                                        <div className={cx(styles.smallCardText, "mt-2")}>
                                                            <img src={done} alt="done" className="mr-2" />{t('translation_orgBgvStatus:done')}</div>
                                                    </div>
                                                    <div className=" ml-4 mr-3" style={{ color: "#8697A8" }}>
                                                        <div className={cx(styles.smallCardTextDot)}><div className={styles.red} />{data["RED"]} {t('translation_orgBgvStatus:red')}</div>
                                                        <div className={cx(styles.smallCardTextDot)}><div className={styles.yellow} />{data["YELLOW"]} {t('translation_orgBgvStatus:yellow')}</div>
                                                        <div className={cx(styles.smallCardTextDot)}><div className={styles.green} />{data["GREEN"]} {t('translation_orgBgvStatus:green')}</div>
                                                    </div>
                                                </div>
                                            </div>


                                            <br />
                                            <br />
                                            {!_.isEmpty(data["checks"]) ?
                                                <React.Fragment>
                                                    <div className={styles.heading}>{t('translation_orgBgvStatus:checkLevel')}</div>
                                                    <div className={cx("row mx-0 mt-3", styles.cardBgSmall)}>
                                                        <div className="ml-3 pt-3  " style={{ color: "#212529" }}>
                                                            <div className="d-flex" >
                                                                <div className={styles.smallCardHeading}>{data["checkVerified"] ? data["checkVerified"] : 0}</div> <div className={styles.smallCardTextBold}>&nbsp;&nbsp;{t('translation_orgBgvStatus:checks')}</div></div>
                                                            <div className={cx(styles.smallCardText, "mt-2")}>
                                                                <img src={done} alt="done" className="mr-2" />
                                                                {t('translation_orgBgvStatus:done')}</div>
                                                        </div>
                                                        <div className={cx(styles.cardBorderId, "ml-auto")}>
                                                            {this.state.verificationData ? this.state.verificationData.map((checkdata, index) => {
                                                                return (
                                                                    <React.Fragment key={index}>
                                                                        <div className={cx(styles.borderRight, "px-4")} style={{ color: "#8697A8" }}>
                                                                            <div className={styles.smallCardHeading}>{checkdata["checks"]}</div>
                                                                            <div className={cx(styles.smallCardText, "mt-2")}>
                                                                                <img src={this.handleDisplayIcon(checkdata["label"])} alt="id" className="mr-2" style={{ height: "22px" }} />
                                                                                {checkdata["label"].toLowerCase().replace(/_/g, " ")}</div>
                                                                        </div>
                                                                    </React.Fragment>
                                                                )
                                                            }) : null}

                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                                : null}
                                            <br />
                                            <div className="row">
                                                {!_.isEmpty(data["checks"]) ?
                                                    data["checks"].map((checkData, index) => {
                                                        let checkKey = Object.keys(checkData);
                                                        let checkName = checkKey.toString().toLowerCase().replace(/_/g, " ");
                                                        return (
                                                            <div className="col-6 mb-4" key={index}>
                                                                <div className={styles.idCardBg}>
                                                                    <div className={cx(styles.idCardHeading, "d-flex")}>
                                                                        <img src={this.handleDisplayIcon(checkKey)} alt="icons" className="mr-2" style={{ height: "24px" }} />{checkName}
                                                                        <div className={styles.achieveTat}>{t('translation_orgBgvStatus:agreedTat')} - {checkData[checkKey]["agreedTat"]}&nbsp;{checkData[checkKey]["agreedTatUnit"] ? checkData[checkKey]["agreedTatUnit"].toLowerCase() : null}</div>
                                                                    </div>

                                                                    <div className="d-flex mt-3">
                                                                        <div className={cx("pr-3")} style={{ color: "#212529" }}>
                                                                            <div className={styles.smallCardHeading}>{checkData[checkKey]["INPROGRESS"] ? checkData[checkKey]["INPROGRESS"] : 0}</div>
                                                                            <div className={cx(styles.smallCardText, "mt-2")}>{t('translation_orgBgvStatus:inProgress')}</div>


                                                                            {/* <div className={styles.achieveTat}>achived tat - {checkData[checkKey]["agreedTat"]} hrs</div> */}
                                                                        </div>
                                                                        <div className={cx("pr-3")} style={{ color: "#212529" }}>
                                                                            <div className={styles.smallCardHeading}>{checkData[checkKey]["VERIFIED"] ? checkData[checkKey]["VERIFIED"] : 0}</div>
                                                                            <div className={cx(styles.smallCardText, "mt-2")}>{t('translation_orgBgvStatus:verified')}</div>
                                                                        </div>
                                                                        <div style={{ color: "#8697A8", marginRight: "10%" }} className="ml-auto" >
                                                                            <div className={styles.borderLeft}>
                                                                                <div className={cx(styles.smallCardTextDot)}><div className={styles.red} />{checkData[checkKey]["RED"] ? checkData[checkKey]["RED"] : 0} {t('translation_orgBgvStatus:red')}</div>
                                                                                <div className={cx(styles.smallCardTextDot)}><div className={styles.yellow} />{checkData[checkKey]["YELLOW"] ? checkData[checkKey]["YELLOW"] : 0} {t('translation_orgBgvStatus:yellow')}</div>
                                                                                <div className={cx(styles.smallCardTextDot)}><div className={styles.green} />{checkData[checkKey]["GREEN"] ? checkData[checkKey]["GREEN"] : 0} {t('translation_orgBgvStatus:green')}</div>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    }) : null}
                                            </div>
                                        </React.Fragment>
                                        :
                                        <EmptyPage
                                            text={t('translation_orgBgvStatus:emptyText')}
                                        />}
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
        getCustomBgvStatusState: state.orgMgmt.orgBgvDashboard.bgvInsights.getCustomBgvStatusState,
        services: state.orgMgmt.orgBgvDashboard.bgvInsights.services,
        customBgvStatus: state.orgMgmt.orgBgvDashboard.bgvInsights.customBgvStatus,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        initState: () => dispatch(actions.initState()),
        onGetCustomBgvStatus: (orgId, tagId, duration) => dispatch(actions.getCustomBgvStatus(orgId, tagId, duration)),
        getServicesConfigured: (orgId) => dispatch(actions.getServicesConfigured(orgId)),
    };
};

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(InsightDays)));;

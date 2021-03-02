import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router";
import _ from 'lodash';
import cx from 'classnames';

import styles from './ToDos.module.scss';
import Loader from '../../../../../components/Organism/Loader/Loader';
import rightArrow from "../../../../../assets/icons/arrowRightLongIcon.svg";

class ToDos extends Component {

    handleClickRedirect = (type) => {
        const { match } = this.props;
        const orgId = match.params.uuid;
        
        let baseUrl = "/customer-mgmt/org/" + orgId + "/employee?isActive=true&"
        if (type === "additional") baseUrl += "isAdditionalDetailsFilled=false";
        else if (type === "employment") baseUrl += "isEmpDetailsFilled=false";
        else if (type === "company") baseUrl += "isCompanyDocGenerated=false";
        else baseUrl += "isGovDocGenerated=false";

        this.props.history.push(baseUrl);
    }

    handleTaskCount = (type) => {
        const onboardStats = _.cloneDeep(this.props.onboardStats);
        let taskCount = 0;

        if (type === "additional") taskCount = Math.max(0, onboardStats.additionalDetails)
        else if (type === "employment") taskCount = Math.max(0, onboardStats.empDetails)
        else if (type === "company") taskCount = Math.max(0, onboardStats.companyDocuments)
        else taskCount = Math.max(0, onboardStats.govDocuments)

        return taskCount;
    }

    render() {
        return (
            <React.Fragment>
                {this.props.getOrgOnboardStatsState === 'LOADING' || _.isEmpty(this.props.onboardStats) ?
                    <Loader type="onboardTodo" /> 
                    :
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">

                            <div className={cx(styles.taskContainer, styles.additionalContainer)} onClick={() => this.handleClickRedirect("additional")}>
                                <div className="d-flex flex-row position-relative">
                                    <div className={cx(styles.taskTypeContainer, styles.additionalInnerContainer)}>
                                        {"additional data"}
                                    </div>

                                    <div className="d-flex flex-column" style={{ paddingLeft: '2rem', paddingTop: "4px" }}>
                                        <label className={styles.taskHeading}>additional data pending</label>
                                        <label className={styles.taskCount}>{this.handleTaskCount("additional")}</label>
                                    </div>

                                    <img src={rightArrow} alt="arrow" className={styles.arrowIcon} />
                                </div>

                            </div>


                            <div className={cx(styles.taskContainer, styles.employmentContainer)} onClick={() => this.handleClickRedirect("employment")}>
                                <div className="d-flex flex-row position-relative">
                                    <div className={cx(styles.taskTypeContainer, styles.employmentInnerContainer)}>
                                        {"employment details"}
                                    </div>

                                    <div className="d-flex flex-column" style={{ paddingLeft: '2rem', paddingTop: "4px" }}>
                                        <label className={styles.taskHeading}>employment details pending</label>
                                        <label className={styles.taskCount}>{this.handleTaskCount("employment")}</label>
                                    </div>

                                    <img src={rightArrow} alt="arrow" className={styles.arrowIcon} />
                                </div>

                            </div>

                        </div>

                        <div className="d-flex flex-row justify-content-between" style={{ paddingTop: "1.5rem" }}>
                            <div className={cx(styles.taskContainer, styles.companyContainer)} onClick={() => this.handleClickRedirect("company")}>
                                <div className="d-flex flex-row position-relative">
                                    <div className={cx(styles.taskTypeContainer, styles.companyInnerContainer)}>
                                        {"company documents"}
                                    </div>

                                    <div className="d-flex flex-column" style={{ paddingLeft: '2rem', paddingTop: "4px" }}>
                                        <label className={styles.taskHeading}>company documents pending</label>
                                        <label className={styles.taskCount}>{this.handleTaskCount("company")}</label>
                                    </div>

                                    <img src={rightArrow} alt="arrow" className={styles.arrowIcon} />
                                </div>

                            </div>

                            <div className={cx(styles.taskContainer, styles.governmentContainer)} onClick={() => this.handleClickRedirect("government")}>
                                <div className="d-flex flex-row position-relative">
                                    <div className={cx(styles.taskTypeContainer, styles.governmentInnerContainer)}>
                                        {"government documents"}
                                    </div>

                                    <div className="d-flex flex-column" style={{ paddingLeft: '2rem', paddingTop: "4px" }}>
                                        <label className={styles.taskHeading}>government documents pending</label>
                                        <label className={styles.taskCount}>{this.handleTaskCount("government")}</label>
                                    </div>

                                    <img src={rightArrow} alt="arrow" className={styles.arrowIcon} />
                                </div>

                            </div>

                        </div>

                    </div>}

            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        getOrgOnboardStatsState: state.orgMgmt.orgOnboardDashboard.getOrgOnboardStatsState,
        onboardStats: state.orgMgmt.orgOnboardDashboard.onboardStats
    };
};

export default withRouter(connect(mapStateToProps, null)(ToDos))
import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router";
import * as actions from './Store/action';
import styles from './Insights.module.scss';
import InsightChart from '../../../../../components/Organism/InsightChart/InsightChart';
import _ from "lodash";
import { withTranslation } from 'react-i18next';
import Loader from '../../../../../components/Organism/Loader/Loader';

class Insights extends Component {

    componentDidMount() {
        const { match } = this.props;
        const orgId = match.params.uuid;
        this.props.getServicesConfigured(orgId);
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
            let bgvData = this.props.bgvStatus;
            _.forEach(services, function (object) {
                serviceArr.push(object.service)
            });
            let finalData = [];
            _.forEach(serviceArr, function (service) {
                if (bgvData.hasOwnProperty(service)) {
                    let obj =
                    {
                        CATEGORY: service,
                        INITIATED: bgvData[service]["INITIATED"],
                        RED: bgvData[service]["RED"],
                        YELLOW: bgvData[service]["YELLOW"],
                        GREEN: bgvData[service]["GREEN"],
                        INPROGRESS: bgvData[service]["INPROGRESS"],
                    }
                    finalData.push(obj)
                }
            });
            return finalData;
        }
    }

    render() {
        const { t } = this.props;

        return (<React.Fragment>
            {
            this.props.getServicesState === 'LOADING' && this.props.getBgvStatusState === 'LOADING' ?
            <div className="col-12 px-0"><Loader type='orgDashboard'/></div>
            :
            this.props.getServicesState === 'SUCCESS' && this.props.getBgvStatusState === 'SUCCESS' ?
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
                                    {t('translation_orgBgvStatus:dashboard.l7')}
                                    </span>
                                    <br/>
                                    <br/>
                                    <InsightChart
                                        data={this.handleCheckData()}
                                        type="tat"
                                    />
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
        getServicesConfigured: (orgId) => dispatch(actions.getServicesConfigured(orgId)),
    };
};

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(Insights)));
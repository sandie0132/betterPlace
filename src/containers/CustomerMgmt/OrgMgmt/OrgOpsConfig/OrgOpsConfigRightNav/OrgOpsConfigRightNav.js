import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import RightNavUrl from '../../../../../components/Molecule/RightNavUrl/RightNavUrl';
import styles from './OrgOpsConfigRightNav.module.scss';
import cx from 'classnames';
import RightNavBar from '../../../../../components/Organism/Navigation/RightNavBar/RightNavBar';
import { NavLink } from "react-router-dom";
import { Button } from 'react-crux';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';

class RightNavContent extends Component {

    state = {
        rightNav: {
            selectService: 'next',
            tatService: 'next',
            priceService: 'next'
        }
    }

    componentDidMount() {
        this.handleConfigState();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.configStatus !== this.props.configStatus) {
            this.handleConfigState();
        }
    }

    handleConfigState = () => {
        let updatedSelectService = this.state.selectService;
        let updatedTatService = this.state.tatService;
        let updatedPriceService = this.state.priceService;
        if (this.props.configStatus.servicesConfigured) updatedSelectService = 'prev';
        else updatedSelectService = 'next';

        if (this.props.configStatus.tatMappingConfigured) updatedTatService = 'prev';
        else updatedTatService = 'next';

        if (this.props.configStatus.priceMappingConfigured) updatedPriceService = 'prev';
        else updatedPriceService = 'next';

        const orgId = this.props.match.params.uuid;

        if (this.props.location.pathname === '/customer-mgmt/org/'+orgId+'/opsconfig/ops-select') {
            updatedSelectService = 'current';
        }
        else if (this.props.location.pathname === '/customer-mgmt/org/'+orgId+'/opsconfig/ops-tat') {
            updatedTatService = 'current';
        }
        else if (this.props.location.pathname === '/customer-mgmt/org/'+orgId+'/opsconfig/ops-price') {
            updatedPriceService = 'current';
        }

        this.setState({
            selectService: updatedSelectService,
            tatService: updatedTatService,
            priceService: updatedPriceService,
        })
    }

    shouldEnableProceed = () => {
        let enableProceed = false;
        if (this.props.postDataState === 'SUCCESS' || this.props.putDataState === 'SUCCESS') {
            enableProceed = true;
        } else if (this.props.configStatus.servicesConfigured && this.props.configStatus.tatMappingConfigured &&
            this.props.configStatus.priceMappingConfigured) {
            enableProceed = true;
        }
        return enableProceed;
    }

    urlHandler = (value) => {
        const { match } = this.props;
        let orgId = match.params.uuid;
        let redirectFlag = false;
        if (value === "ops-select") {
            redirectFlag = true;
        }
        else if (value === "ops-tat") {
            if (this.props.configStatus.servicesConfigured) {
                redirectFlag = true
            }
        }
        else if (value === "ops-price") {
            if (this.props.configStatus.servicesConfigured && this.props.configStatus.tatMappingConfigured) {
                redirectFlag = true
            }
        }
        let url = "/customer-mgmt/org/" + orgId + "/opsconfig/" + value;
        if (redirectFlag) {
            this.props.history.push(url)
        }
    }

    render() {
        const { t } = this.props;
        const { match } = this.props;
        const orgId = match.params.uuid;
        let orgName = '';
        if (!_.isEmpty(this.props.orgData)) {
            orgName = this.props.orgData.name.toLowerCase();
        }
        let RightNavContent =
            <div>
                <div style={{ backgroundColor: this.props.orgData ? this.props.orgData.brandColor : '#8697A8', height: '12rem' }} className='d-flex flex-row no-gutters'>
                    <div className={cx('col-12 align-self-end',styles.MarginLeft)} > <span className={cx(styles.OrgRightNavLabel, 'pt-4 pb-3')}>{orgName} </span></div>
                </div>
                <div>
                    <h4 className={cx(styles.RightNavLabel, 'mt-0 pb-1 position-absolute')}>{t('translation_orgOpsConfigRightNav:heading.h1')}</h4>
                </div>
                <div className={"ml-4"} style={{ paddingTop: "3.5rem" }}>
                    <div onClick={() => this.urlHandler('ops-select')} className={this.props.configStatus.servicesConfigured ? cx(" ml-5", styles.Hover) : " ml-5"}>
                        <RightNavUrl imageState={this.state.selectService} label={t('translation_orgOpsConfigRightNav:RightNavUrl.l1')} first />
                    </div>
                    <div onClick={() => this.urlHandler('ops-tat')} className={this.props.configStatus.tatMappingConfigured ? cx(" ml-5", styles.Hover) : " ml-5"}>
                        <RightNavUrl imageState={this.state.tatService} label={t('translation_orgOpsConfigRightNav:RightNavUrl.l2')} />
                    </div>
                    <div onClick={() => this.urlHandler('ops-price')} className={this.props.configStatus.priceMappingConfigured ? cx(" ml-5", styles.Hover) : " ml-5"}>
                        <RightNavUrl imageState={this.state.priceService} label={t('translation_orgOpsConfigRightNav:RightNavUrl.l3')} />
                    </div>
                    <br />
                    <NavLink to={'/customer-mgmt/org/' + orgId + '/profile'}><Button label={t('translation_orgOpsConfigRightNav:button_orgOpsConfigRightNav.proceed')} type='largeWithArrow' className={cx("ml-3 mt-5", styles.LargeButtonWidth)} isDisabled={!this.shouldEnableProceed()}></Button></NavLink>
                </div>
            </div >

        return (
            <RightNavBar content={RightNavContent} className={styles.show}/>
        )
    }
}

const mapStateToProps = state => {
    return {
        configStatus: state.orgMgmt.orgOpsConfigReducer.configStatus,
        postDataState: state.orgMgmt.orgOpsConfigReducer.opsPricing.postDataState,
        putDataState: state.orgMgmt.orgOpsConfigReducer.opsPricing.putDataState,
        orgData: state.orgMgmt.staticData.orgData
    }
};

export default withTranslation()(withRouter(connect(mapStateToProps)(RightNavContent)));
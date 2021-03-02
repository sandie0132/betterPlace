import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import RightNavUrl from '../../../../../components/Molecule/RightNavUrl/RightNavUrl';
import styles from './OrgBgvConfigRightNav.module.scss';
import cx from 'classnames';
import queryString from 'query-string';
import RightNavBar from '../../../../../components/Organism/Navigation/RightNavBar/RightNavBar';
// import { NavLink } from 'react-router-dom';
import { Button } from 'react-crux';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import VendorLabel from '../../../../VendorSearch/VendorLabel/VendorLabel';

class RightNavContent extends Component {

    state = {
        selectService: 'next',
        mapService: 'next',
        tatService: 'next',
        clientService: 'next',
        statusMgmt: 'next',
        bpSpoc: 'next',
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
        let updatedMapService = this.state.mapService;
        let updatedTatService = this.state.tatService;
        let updatedClientService = this.state.clientService;
        let updatedBpSpoc = this.state.bpSpoc;
        let updatedstatusMgmt = this.state.statusMgmt;
        if (this.props.configStatus.servicesConfigured) updatedSelectService = 'prev';
        else updatedSelectService = 'next';

        if (this.props.configStatus.tagMappingConfigured) updatedMapService = 'prev';
        else updatedMapService = 'next';

        if (this.props.configStatus.tatMappingConfigured) updatedTatService = 'prev';
        else updatedTatService = 'next';

        if (this.props.configStatus.clientSpocConfigured) updatedClientService = 'prev';
        else updatedClientService = 'next';

        if (this.props.configStatus.betterPlaceSpocConfigured) updatedBpSpoc = 'prev';
        else updatedBpSpoc = 'next';

        if (this.props.configStatus.statusMgmtConfigured) updatedstatusMgmt = 'prev';
        else updatedstatusMgmt = 'next';

        const orgId = this.props.match.params.uuid;

        if (this.props.location.pathname === '/customer-mgmt/org/' + orgId + '/config/bgv-select') {
            updatedSelectService = 'current';
        }
        else if (this.props.location.pathname === '/customer-mgmt/org/' + orgId + '/config/bgv-map') {
            updatedMapService = 'current';
        }
        else if (this.props.location.pathname === '/customer-mgmt/org/' + orgId + '/config/bgv-tat') {
            updatedTatService = 'current';
        }
        else if (this.props.location.pathname === '/customer-mgmt/org/' + orgId + '/config/bgv-clientspoc') {
            updatedClientService = 'current';
        }
        else if (this.props.location.pathname === '/customer-mgmt/org/' + orgId + '/config/bgv-bpspoc') {
            updatedBpSpoc = 'current';
        }
        else if (this.props.location.pathname.includes('/customer-mgmt/org/' + orgId + '/config/bgv-status')) {
            updatedstatusMgmt = 'current';
        }

        this.setState({
            selectService: updatedSelectService,
            mapService: updatedMapService,
            tatService: updatedTatService,
            clientService: updatedClientService,
            bpSpoc: updatedBpSpoc,
            statusMgmt: updatedstatusMgmt
        })
    }

    shouldEnableProceed = () => {
        let enableProceed = false;
        if (this.props.configStatus.servicesConfigured && this.props.configStatus.tagMappingConfigured &&
            this.props.configStatus.tatMappingConfigured && this.props.configStatus.clientSpocConfigured
            && this.props.configStatus.betterPlaceSpocConfigured && this.props.configStatus.statusMgmtConfigured) {
            enableProceed = true;
        } else enableProceed = false;
        return enableProceed;
    }

    redirectUrl = () => {
        const { match } = this.props;
        let orgId = match.params.uuid;
        if (this.props.configStatus.servicesConfigured && this.props.configStatus.tagMappingConfigured &&
            this.props.configStatus.tatMappingConfigured && this.props.configStatus.clientSpocConfigured
            && this.props.configStatus.betterPlaceSpocConfigured && this.props.configStatus.statusMgmtConfigured) {
            this.props.history.push('/customer-mgmt/org/' + orgId + '/profile');
        }
    }

    urlHandler = (value) => {
        const { match, location } = this.props;
        let params = queryString.parse(location.search);
        let orgId = match.params.uuid;
        let redirectFlag = false;
        if (value === "bgv-select")
            redirectFlag = true;
        else if (value === "bgv-map") {
            if (this.props.configStatus.servicesConfigured)
                redirectFlag = true;
        }
        else if (value === "bgv-tat") {
            if (this.props.configStatus.servicesConfigured && this.props.configStatus.tagMappingConfigured)
                redirectFlag = true
        }
        else if (value === "bgv-bpspoc") {
            if (this.props.configStatus.servicesConfigured && this.props.configStatus.tagMappingConfigured &&
                this.props.configStatus.tatMappingConfigured) {
                redirectFlag = true
            }
        }
        else if (value === "bgv-clientspoc") {
            if (this.props.configStatus.servicesConfigured && this.props.configStatus.tagMappingConfigured &&
                this.props.configStatus.tatMappingConfigured && this.props.configStatus.betterPlaceSpocConfigured) {
                redirectFlag = true
            }
        }
        else if (value === "bgv-status/check-level") {
            if (this.props.configStatus.servicesConfigured && this.props.configStatus.tagMappingConfigured &&
                this.props.configStatus.tatMappingConfigured && this.props.configStatus.clientSpocConfigured
                && this.props.configStatus.betterPlaceSpocConfigured) {
                redirectFlag = true;
            }
        }
        
        let url = "/customer-mgmt/org/" + orgId + "/config/" + value;
        if(!_.isEmpty(params)){
            url += location.search;
        }
        if (redirectFlag) {
            this.props.history.push(url)
        }
    }

    handleShowVendorLabel = () => {
        let showVendorLabel = false;
        if(!_.isEmpty(this.props.enabledServices) && !_.isEmpty(this.props.enabledServices.platformServices)){
            _.forEach(this.props.enabledServices.platformServices, function(service){
                if(service.platformService === 'VENDOR') showVendorLabel = true;
            })
        }
        return showVendorLabel;
    }

    render() {    
        const { t } = this.props;
        // const { match } = this.props;
        // const orgId = match.params.uuid;
        let orgName = '';
        if (!_.isEmpty(this.props.orgData)) {
            orgName = this.props.orgData.name ? this.props.orgData.name.toLowerCase() : "";
        }
        const showVendorLabel = this.handleShowVendorLabel();

        let RightNavContent =
            <div>
                <div style={{ backgroundColor: this.props.orgData ? this.props.orgData.brandColor : '#8697A8', height: '12rem' }} className='d-flex flex- no-gutters'>
                    <div className={cx('col-12 align-self-end text-center')}> <span className={cx(styles.OrgRightNavLabel, 'pt-4 pb-3')}>{orgName} </span></div>
                </div>
                <div>
                    <h4 className={cx(styles.RightNavLabel, 'mt-0 pb-1 ')}>{t('translation_orgBgvConfigRightNav:BGVConfig')}</h4>
                </div>
                <div className={cx(styles.MarginLeft, styles.MarginTop)}>
                    {showVendorLabel && <VendorLabel />}
                </div>
                <div className={cx("ml-4", scrollStyle.scrollbar)} style={{ height:"65vh",overflow:"auto" }}>
                    <div onClick={() => this.urlHandler('bgv-select')} className={this.props.configStatus.servicesConfigured ? cx(" ml-5", styles.Hover) : " ml-5"}>
                        <RightNavUrl imageState={this.state.selectService} label={t('translation_orgBgvConfigRightNav:link.selectServices')} first />
                    </div>
                    <div onClick={() => this.urlHandler('bgv-map')} className={this.props.configStatus.tagMappingConfigured ? cx(" ml-5", styles.Hover) : " ml-5"}>
                        <RightNavUrl imageState={this.state.mapService} label={t('translation_orgBgvConfigRightNav:link.mapping')} />
                    </div>
                    <div onClick={() => this.urlHandler('bgv-tat')} className={this.props.configStatus.tatMappingConfigured ? cx(" ml-5", styles.Hover) : " ml-5"}>
                        <RightNavUrl imageState={this.state.tatService} label={t('translation_orgBgvConfigRightNav:link.TatMapping')} />
                    </div>
                    <div onClick={() => this.urlHandler('bgv-bpspoc')} className={this.props.configStatus.betterPlaceSpocConfigured ? cx(" ml-5", styles.Hover) : " ml-5"}>
                        <RightNavUrl imageState={this.state.bpSpoc} label={t('translation_orgBgvConfigRightNav:link.bpSpoc')} />
                    </div>
                    <div onClick={() => this.urlHandler('bgv-clientspoc')} className={this.props.configStatus.clientSpocConfigured ? cx(" ml-5", styles.Hover) : " ml-5"}>
                        <RightNavUrl imageState={this.state.clientService} label={t('translation_orgBgvConfigRightNav:link.clientSpoc')} />
                    </div>
                    <div onClick={() => this.urlHandler('bgv-status/check-level')} className={this.props.configStatus.statusMgmtConfigured ? cx(" ml-5", styles.Hover) : " ml-5"}>
                        <RightNavUrl imageState={this.state.statusMgmt} label={t('translation_orgBgvConfigRightNav:link.statusManagement')} />
                    </div>
                    <br />
                    <Button
                        label={t('translation_orgBgvConfigRightNav:button_orgBgvConfigRightNav.proceed')}
                        type='largeWithArrow'
                        className={cx("ml-3 mt-5", styles.LargeButtonWidth)}
                        isDisabled={!this.shouldEnableProceed()}
                        clickHandler={this.redirectUrl}
                    />
                </div>
            </div>

        return (
            <RightNavBar content={RightNavContent} className={styles.show} />
        )
    }
}

const mapStateToProps = state => {
    return {
        configStatus: state.orgMgmt.orgBgvConfig.configStatus,
        postDataState: state.orgMgmt.orgBgvConfig.clientSpoc.postSelectedSpocs,
        putDataState: state.orgMgmt.orgBgvConfig.clientSpoc.putSelectedSpocs,
        orgData: state.orgMgmt.staticData.orgData,
        enabledServices: state.orgMgmt.staticData.servicesEnabled,
    }
};

export default withTranslation()(withRouter(connect(mapStateToProps)(RightNavContent)));
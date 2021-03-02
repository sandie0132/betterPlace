import React, { Component } from 'react';
import CheckLevel from './checkLevel/checkLevel';
import SectionLevel from './sectionLevel/sectionLevel';
import ProfileLevel from './profileLevel/profileLevel';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from "react-router";
import ArrowLink from '../../../../../components/Atom/ArrowLink/ArrowLink';
import bgv_service from '../../../../../assets/icons/bgvService.svg';
import CardHeader from '../../../../../components/Atom/PageTitle/PageTitle';
import StatusMgmtTopNav from './StatusMgmtTopNav/StatusMgmtTopNav';
import styles from './StatusMgmt.module.scss';
import _ from 'lodash';
import cx from 'classnames';
import * as actions from './Store/action';
import Loader from '../../../../../components/Organism/Loader/Loader';
import { withTranslation } from 'react-i18next';
import VendorDropdown from '../../../../VendorSearch/VendorDropdown/VendorDropdown';

class StatusMgmt extends Component {

    handleShowVendorDropDown = () => {
        let showVendorDropDown = false;
        if(!_.isEmpty(this.props.enabledServices) && !_.isEmpty(this.props.enabledServices.platformServices)){
            _.forEach(this.props.enabledServices.platformServices, function(service){
                if(service.platformService === 'VENDOR') showVendorDropDown = true;
            })
        }
        return showVendorDropDown;
    }

    render() {
        const { t } = this.props;
        const { match } = this.props;
        const orgId = match.params.uuid;
        const showVendorDropDown = this.handleShowVendorDropDown();
        return (
            <React.Fragment>
                <div className={styles.alignCenter}>
                    <ArrowLink
                        label={_.isEmpty(this.props.orgData) ? " " : this.props.orgData.name.toLowerCase()}
                        url={`/customer-mgmt/org/` + orgId + `/profile`}
                    />
                    <div className="d-flex">
                        {this.props.getSelectedDataState === 'LOADING' || this.props.getStatusDataState === 'LOADING' ?
                            <Loader type='cardHeader' />
                            :
                            <CardHeader label={t('translation_orgStatusMgmtSectionLevel:cardHeading')} iconSrc={bgv_service} />
                        }
                        <div className={cx("ml-auto mr-3",styles.paddingY)}>
                            {showVendorDropDown && <VendorDropdown type="primary"/>}
                        </div>
                        <div className={cx(styles.paddingY)}>
                            {showVendorDropDown && <VendorDropdown type="secondary"/>}
                        </div>
                    </div>
                    
                    <StatusMgmtTopNav />
                    <div className="container-fluid row px-0 mx-0">
                        <Switch>
                            <Route path={`${match.path}/check-level`} exact component={CheckLevel} />
                            <Route path={`${match.path}/section-level`} exact component={SectionLevel} />
                            <Route path={`${match.path}/profile-level`} exact component={ProfileLevel} />
                        </Switch>

                    </div>
                </div>

            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        getSelectedDataState: state.orgMgmt.orgBgvConfig.statusMgmt.getSelectedDataState,
        getStatusDataState: state.orgMgmt.orgBgvConfig.statusMgmt.getStatusDataState,
        orgData: state.orgMgmt.staticData.orgData,
        enabledServices: state.orgMgmt.staticData.servicesEnabled,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getPostedData: (orgId, from, to, viaUrl) => dispatch(actions.getStatusData(orgId, from, to, viaUrl))
    };
};
export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(StatusMgmt)));
import React, { Component } from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import TopNavUrl from '../../../../../../components/Molecule/TopNavUrl/TopNavUrl';
import styles from './StatusMgmtTopNav.module.scss';
import Loader from '../../../../../../components/Organism/Loader/Loader';
import { withTranslation } from 'react-i18next';
import queryString from 'query-string';
import _ from 'lodash';

class StatusMgmtTopNav extends Component {
    
    state = {
        checkLevel: 'next',
        sectionLevel: 'next',
        profileLevel: 'next',
    }
    componentDidMount() {
        this.handleConfigState();
    }

    componentDidUpdate(prevProps){
        if(prevProps.checkLevelConfigured !== this.props.checkLevelConfigured 
            || prevProps.sectionLevelConfigured !== this.props.sectionLevelConfigured
            || prevProps.profileLevelConfigured !== this.props.profileLevelConfigured){
                this.handleConfigState();
        }
    }

    handleConfigState = () => {
        
        let updatedCheckLevel = this.state.checkLevel;
        let updatedSectionLevel = this.state.sectionLevel;
        let updatedProfileLevel = this.state.profileLevel;
        
        if(this.props.checkLevelConfigured) updatedCheckLevel = 'prev';
        else updatedCheckLevel = 'next';

        if(this.props.sectionLevelConfigured) updatedSectionLevel = 'prev';
        else updatedSectionLevel = 'next';

        if(this.props.profileLevelConfigured) updatedProfileLevel = 'prev';
        else updatedProfileLevel = 'next';

        const { location,match } = this.props;
        
        if ((location.pathname) === '/customer-mgmt/org/'+match.params.uuid+'/config/bgv-status/check-level') {
            updatedCheckLevel = 'current';
        }
        else if ((location.pathname) === '/customer-mgmt/org/'+match.params.uuid+'/config/bgv-status/section-level') {
            updatedSectionLevel = 'current';
        }
        else if ((location.pathname) === '/customer-mgmt/org/'+match.params.uuid+'/config/bgv-status/profile-level') {
            updatedProfileLevel = 'current';
        }
        

        this.setState({
            checkLevel: updatedCheckLevel,
            sectionLevel: updatedSectionLevel,
            profileLevel: updatedProfileLevel
            
        })
    }
    clickHandler = (level) => {
        const { match, location } = this.props;
        const orgId = match.params.uuid;
        let redirectFlag = false;
        if(level === "check-level")
        {
            redirectFlag = true;
        }
        else if(level === "section-level")
        {
            if(this.props.checkLevelConfigured)
            {
                redirectFlag = true;
            }
        }
        else if(level === "profile-level")
        {
            if(this.props.checkLevelConfigured && this.props.sectionLevelConfigured)   
            {
                redirectFlag = true
            }
        }
        let url = `/customer-mgmt/org/` + orgId + `/config/bgv-status/` + level;
        let params = queryString.parse(location.search);
        if(!_.isEmpty(params)){
            url += location.search;
        }
        if(redirectFlag)
        {
            this.props.history.push(url)   
        }
    }

    render() {
        const { t } = this.props;
        let TopNavContent =
            <div className={styles.margin}>
                <div className={"d-flex"}>
                    <div onClick={() => this.clickHandler('check-level')} className={this.props.checkLevelConfigured ? styles.Hover : undefined}>
                        <TopNavUrl imageState={this.state.checkLevel}
                            label={t('translation_orgStatusMgmtSectionLevel:topNav.checkLevel')}
                            first configured={this.props.checkLevelConfigured} />
                    </div>
                    <div onClick={() => this.clickHandler('section-level')} className={this.props.sectionLevelConfigured ? styles.Hover : undefined}>
                        <TopNavUrl imageState={this.state.sectionLevel} 
                        label={t('translation_orgStatusMgmtSectionLevel:topNav.sectionLevel')}
                        configured={this.props.sectionLevelConfigured} />
                    </div>
                    <div onClick={() => this.clickHandler('profile-level')} className={this.props.profileLevelConfigured ? styles.Hover : undefined}>
                        <TopNavUrl imageState={this.state.profileLevel} 
                        label={t('translation_orgStatusMgmtSectionLevel:topNav.profileLevel')}
                        last configured={this.props.profileLevelConfigured} />
                    </div>
                    <br />
                </div>
            </div >

        
        return (
            <div className={"col-12 mb-4 px-0"}>
                {this.props.getStatusDataState === 'LOADING' || this.props.getSelectedDataState === 'LOADING' ?
                    <Loader type= 'statusMgmtTop'/>
                    :
                TopNavContent}
            </div>
        )
    }
    
}
const mapStateToProps = state => {
    return {
        getSelectedDataState: state.orgMgmt.orgBgvConfig.statusMgmt.getSelectedDataState,
        getStatusDataState: state.orgMgmt.orgBgvConfig.statusMgmt.getStatusDataState,
        checkLevelConfigured : state.orgMgmt.orgBgvConfig.statusMgmt.checkLevelConfigured,
        sectionLevelConfigured : state.orgMgmt.orgBgvConfig.statusMgmt.sectionLevelConfigured,
        profileLevelConfigured : state.orgMgmt.orgBgvConfig.statusMgmt.profileLevelConfigured,
    };
};


export default withTranslation()(withRouter(connect(mapStateToProps)(StatusMgmtTopNav)));
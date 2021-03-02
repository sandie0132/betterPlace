import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as actions from './TagMgmtStore/action';
import * as actionTypes from './TagMgmtStore/actionTypes';
import * as actionsOrgMgmt from '../OrgMgmt/OrgMgmtStore/action';
import TagSheet from './TagSheet/TagSheet';
import styles from './TagMgmt.module.scss';
import _ from 'lodash';
import cx from 'classnames';
import CardHeader from '../../../components/Atom/PageTitle/PageTitle';
import locationSitesIcon from '../../../assets/icons/locationSites.svg';
import { withTranslation } from 'react-i18next'
import ArrowLink from '../../../components/Atom/ArrowLink/ArrowLink';
import Loader from '../../../components/Organism/Loader/Loader';

class TagMgmt extends Component {
    state = {
        tagHeading: '',
        iconSrc: null
    }

    componentDidMount() {
        this.props.onGetStaticData();
        this.handleSelectCategory();
        const { match } = this.props;
        const orgId = match.params.uuid;
        if (_.isEmpty(this.props.orgData) && orgId) {
            this.props.getOrgData(orgId)
        }
        if (orgId !== this.props.rightnavOrgId) {
            this.props.getOrgData(orgId)
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.category !== this.props.match.params.category) {
            this.handleSelectCategory();
        }
    }

    handleSelectCategory() {
        const { match } = this.props;
        const orgId = match.params.uuid;
        const tagIdentifier = match.params.category;
        let tagHeading = '';
        let category = '';
        let businessFunction = '';
        let iconSrc = null;
        if (tagIdentifier === 'function-role') {
            tagHeading = 'function & role';
            category = 'functional';
            iconSrc = locationSitesIcon;
            businessFunction = 'ORG_FUNC_ROLE'
        }
        else if (tagIdentifier === 'location-sites') {
            tagHeading = 'location & sites';
            category = 'geographical';
            iconSrc = locationSitesIcon;
            businessFunction = 'ORG_LOC_SITE'
        }
        else if (tagIdentifier === 'division') {
            tagHeading = 'division';
            category = 'divisional';
        }
        else {
            tagHeading = 'custom category';
            category = 'custom';
            businessFunction = 'ORG_CUST_TAG'
        }
        this.setState({
            tagHeading: tagHeading,
            iconSrc: iconSrc
        })
        this.props.handleSetOrgAndCategory(orgId, category, tagIdentifier, businessFunction);
    }

    componentWillUnmount = () => {
        this.props.getTagsInitState();
    }

    render() {

        return (
            <React.Fragment >
                <div className={styles.alignCenter}>

                    {!_.isEmpty(this.props.orgData) ?
                        <ArrowLink
                            label={this.props.orgData.name.toLowerCase()}
                            url={`/customer-mgmt/org/${this.props.orgData.uuid}/profile`}

                        />
                        : null
                    }

                    {this.props.tagListState === 'LOADING' ?
                        <Loader type='tagLoader'/> :
                        <React.Fragment>
                            <CardHeader label={'configure ' + this.state.tagHeading} iconSrc={this.state.iconSrc} />
                            <span className={styles.tagHeading} >
                                <hr className={cx(styles.HorizontalLine)} />
                            </span>
                            <TagSheet />
                        </React.Fragment>}
                </div>
            </React.Fragment>
        );
    }

};

const mapStateToProps = state => {
    return {
        orgData: state.orgMgmt.staticData.orgData,
        rightnavOrgId: state.orgMgmt.staticData.rightnavOrgId,
        tagListState: state.tagMgmt.tagListState
    }
}


const mapDispatchToProps = dispatch => {
    return {
        onInitState: () => dispatch({ type: actionTypes.INIT_TAGMGMT_STATE }),
        handleSetOrgAndCategory: (orgId, category, categoryUrlName, businessFunction) => dispatch(actions.setOrgAndCategory(orgId, category, categoryUrlName, businessFunction)),
        onGetStaticData: () => dispatch(actions.getStaticDataList()),
        getOrgData: (orgId) => dispatch(actionsOrgMgmt.getDataById(orgId)),
        getTagsInitState: () => dispatch(actions.getInitState())
    };
};

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(TagMgmt)));
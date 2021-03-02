import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import cx from 'classnames';
import _ from 'lodash';
import * as actionsOrgMgmt from '../../../OrgMgmt/OrgMgmtStore/action';
import CardHeader from '../../../../../components/Atom/PageTitle/PageTitle';
import vendor from '../../../../../assets/icons/vendorIcon.svg';
import OrgMgmtRightNav from '../../../OrgMgmt/OrgMgmtRightNav/OrgMgmtRightNav';
// import VendorCard from '../../../VendorMgmt/VendorList/VendorCard/VendorCard';
// import orgRightArrow from '../../../../../assets/icons/orgRightArrow.svg';
import Loader from '../../../../../components/Organism/Loader/Loader';
import * as actions from './Store/action';
import { withTranslation } from 'react-i18next';
import styles from './OrgClientList.module.scss';
import ArrowLink from '../../../../../components/Atom/ArrowLink/ArrowLink';

class OrgClientList extends Component {

    shortenDisplayName = (displayName) => {
        if (displayName.length > 12) {
            const updatedDisplayName = displayName.substring(0, 12) + '...';
            return (updatedDisplayName);
        }
        return (displayName);
    }

    componentDidMount = () => {
        this.props.initState();
        const { match } = this.props;
        const orgId = match.params.uuid;

        if (_.isEmpty(this.props.orgData) && orgId) {
            this.props.getOrgData(orgId)
        }
        if (orgId !== this.props.rightnavOrgId) {
            this.props.getOrgData(orgId)
        }
        this.props.clientList(orgId);
    }

    render() {
        // const url = this.props.match.url;
        const { t } = this.props;

        return (
            <React.Fragment>
                <div className={cx('col-9 pl-0 d-flex flex-row-reverse', styles.formBackground)}>
                    <div className={cx("col-10 pl-0")}>
                        {!_.isEmpty(this.props.orgData) ?
                            <ArrowLink
                                label={this.props.orgData.name.toLowerCase()}
                                url={`/customer-mgmt/org/${this.props.orgData.uuid}/profile`}
                                className={styles.PaddingLeftArrow} />
                            : null
                        }
                        <div className='row mt-3 ml-3 mb-4'>
                            <CardHeader label={t('translation_orgClientList:cardheading')} iconSrc={vendor} />
                        </div>

                        {this.props.getClientListState === 'LOADING' ?
                            <Loader type='tile' />
                            :
                            <div>
                                <div className='row'>
                                    {/* {!_.isEmpty(this.props.clientListData) ?
                                        this.props.clientListData.map((item, index) => {
                                            return (
                                                <VendorCard
                                                    key={index}
                                                    index={item.uuid}
                                                    url={url + '/' + item.uuid}
                                                    icon={orgRightArrow}
                                                    shortenName={this.shortenDisplayName(item.name)}
                                                />
                                            )
                                        }) : ''} */}
                                </div>

                            </div>}
                    </div>
                </div>
                <OrgMgmtRightNav />
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        clientListData: state.orgMgmt.orgClientList.clientList,
        getClientListState: state.orgMgmt.orgClientList.getClientListState,
        orgData: state.orgMgmt.staticData.orgData,
        rightnavOrgId: state.orgMgmt.staticData.rightnavOrgId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        initState: () => dispatch(actions.initState()),
        clientList: orgId => dispatch(actions.clientList(orgId)),
        getOrgData: (orgId) => dispatch(actionsOrgMgmt.getDataById(orgId))
    }
}

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(OrgClientList)));
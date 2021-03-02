import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash';
import cx from 'classnames';
import styles from './OrgClientTags.module.scss';
import OrgClientRightNavBar from '../OrgClientRightNav/OrgClientRightNav';
import CardHeader from '../../../../../components/Atom/PageTitle/PageTitle';
import container from '../../../../../assets/icons/orgDetailsIcon.svg';
import * as actions from './Store/action';
import FolderIcon from '../../../../../components/Atom/FolderIcon/FolderIcon';
import { withTranslation } from 'react-i18next';
import ArrowLink from '../../../../../components/Atom/ArrowLink/ArrowLink';

class OrgClientTags extends Component {

    state = {
        tagHeading: '',
        category: '',
        showModal: false,
        label: '',
        selectedTags: [],
        dropdown: false,
        cardIndex: -1,
        handleMenuCard: false
    }
    _isMounted = false;

    componentDidMount = () => {
        this.handleVendorTag();
        const { match } = this.props;
        const orgId = match.params.uuid;
        let vendorId = match.params.clientId;

        this.props.onGetOrgName(orgId);
        this.props.onGetVendorData(orgId, vendorId);
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.match.params.category !== this.props.match.params.category) {
            this.handleVendorTag()
        }

        if (prevProps.postVendorTagState !== this.props.postVendorTagState) {
            if (this.props.postVendorTagState === 'SUCCESS') {
                this.handleVendorTag()
            }
        }

        if (prevProps.getVendorTagsState !== this.props.getVendorTagsState) {
            if (this.props.getVendorTagsState === 'SUCCESS') {
                this.handleSelectedVendorTag()
            }
        }
        if (prevProps.deleteVendorTagStatus !== this.props.deleteVendorTagStatus) {
            if (this.props.deleteVendorTagStatus === 'SUCCESS') {
                this.handleVendorTag()
            }
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    handleSelectedVendorTag = () => {
        let selectedTags = _.cloneDeep(this.props.vendorTags)
        this.setState({ selectedTags: selectedTags })
    }

    handleVendorTag = () => {
        const { match } = this.props;
        let tagType = match.params.category
        let tagHeading = '';
        let label = '';
        let category = '';
        if (tagType === "location-sites") {
            tagHeading = "location & site";
            category = "geographical";
            label = "add locations";
        }
        else if (tagType === "function-role") {
            tagHeading = "function & role"
            category = "functional"
            label = "add functions";
        }
        this.setState({ tagHeading: tagHeading, category: category, label: label })
        this.props.onGetVendorTags(match.params.clientId, match.params.uuid, category)
    }

    render() {
        const { t } = this.props;
        const { match } = this.props;
        const orgId = match.params.uuid;
        let orgName = !_.isEmpty(this.props.getOrgName) ? (this.props.getOrgName.name.toLowerCase()) : 'company';
        //let orgName = !_.isEmpty(this.props.getOrgName) ? this.props.getOrgName.name : '';
        // let vendorName = !_.isEmpty(this.props.getVendorData) ? this.props.getVendorData.name : '';

        return (
            <React.Fragment>
                <div className={cx(styles.formBackground, 'col-9 pl-0 mx-0')}>
                    <ArrowLink
                        label={orgName + t('translation_orgClientTags:label.l1')}
                        url={'/customer-mgmt/org/' + orgId + '/clients'}
                        className={styles.PaddingLeftArrow}
                    />
                    <div className="d-flex flex-row-reverse">
                        <div className="col-10 px-0">
                            <div className={cx(styles.ContainerPadding64, "pb-2 d-flex flex-row justify-content-between no-gutters")}>
                                <CardHeader label={this.state.tagHeading} iconSrc={container} />
                            </div>
                        </div>
                    </div>

                    {this.state.selectedTags.length ?
                        <div className='d-flex flex-row-reverse'>
                            <div className={cx('col-10')}>
                                <div className={cx(styles.CardLayout, 'row card')}>
                                    <div className={cx(styles.CardPadding, 'row card-body')}>
                                        {this.state.selectedTags.map((selectedTag, vendorTagIndex) => {
                                            return (
                                                <div className={cx(styles.FlagCard)} key={vendorTagIndex}>
                                                    <FolderIcon />
                                                    <span className={cx('ml-2', styles.TagText)}>{selectedTag.name}</span>
                                                </div>
                                            )
                                        })}

                                    </div>
                                </div> </div>
                        </div>
                        :
                        <div className='d-flex flex-row-reverse'>
                            <div className={cx('col-10 px-0')} >
                                <div className={cx(styles.CardLayout, 'row card')}>
                                    <div className={cx(styles.CardPadding, 'card-body d-flex flex-column')}>

                                        <div style={{ textAlign: 'center' }}> <span className={styles.AddCardText}>{t('translation_orgClientTags:div.d1')}</span></div>
                                    </div>
                                </div>
                            </div> </div>
                    }
                </div>
                <OrgClientRightNavBar />
            </React.Fragment>
        )
    }
}


const mapStateToProps = state => {
    return {
        getVendorTagsState: state.vendorMgmt.vendorTags.vendorTagsState,
        vendorTags: state.vendorMgmt.vendorTags.vendorTags,
        postVendorTagState: state.vendorMgmt.vendorTags.postVendorTagState,
        deleteVendorTagStatus: state.vendorMgmt.vendorTags.deleteVendorTagStatus,
        getVendorData: state.vendorMgmt.vendorTags.getVendorData,
        getOrgName: state.vendorMgmt.vendorTags.getOrgName
    };
}

const mapDispatchToProps = dispatch => {
    return {

        onGetVendorTags: (orgId, vendorId, category) => dispatch(actions.getVendorTags(orgId, vendorId, category)),
        onGetOrgName: (orgId) => dispatch(actions.getOrgNameById(orgId)),
        onGetVendorData: (orgId, vendorId) => dispatch(actions.getVendorData(orgId, vendorId))
    }
};

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(OrgClientTags)));

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash';
import cx from 'classnames';
import styles from './OrgClientDetails.module.scss';
import OrgClientRightNav from '../OrgClientRightNav/OrgClientRightNav';
import CardHeader from '../../../../../components/Atom/PageTitle/PageTitle';
import FileView from '../../../../../components/Molecule/FileView/FileView';
import container from '../../../../../assets/icons/orgDetailsIcon.svg';
import ArrowLink from '../../../../../components/Atom/ArrowLink/ArrowLink';
import vendorPhone from '../../../../../assets/icons/vendorPhone.svg';
import vendorMail from '../../../../../assets/icons/vendorMail.svg';
import vendorProfile from '../../../../../assets/icons/vendorProfile.svg';
import verifyTick from '../../../../../assets/icons/verifyTick.svg';
import * as actions from './Store/action';
import { withTranslation } from 'react-i18next';

class OrgClientDetails extends Component {

    componentDidMount = () => {

        const { match } = this.props;
        let orgId = match.params.uuid; //orgId = vendorId for backend
        let clientId = match.params.clientId;

        this.props.onGetOrgName(orgId);
        this.props.clientData(clientId, orgId);
    }

    componentWillUnmount = () => {
        this.props.initOrgDetails();
    }

    render() {
        const { t } = this.props;
        const { match } = this.props;
        let orgId = match.params.uuid;
        let orgName = !_.isEmpty(this.props.getOrgName) ? (this.props.getOrgName.name.toLowerCase()) : 'company'

        return (
            <React.Fragment>
                <div className={cx(styles.formBackground, 'col-9 pl-0')}>
                    <ArrowLink
                        label={orgName + t('translation_orgClientDetails:label.l1')}
                        url={'/customer-mgmt/org/' + orgId + '/clients'}
                        className={styles.PaddingLeftArrow}
                    />

                    <div className="d-flex flex-row-reverse">
                        <div className="col-10">
                            <div className={cx(styles.ContainerPadding64, "pb-2")}>
                                <CardHeader label={t('translation_orgClientDetails:cardheading')} iconSrc={container} />
                            </div>
                            <div className={cx(styles.CardLayout, 'row card')}>
                                <div className={cx(styles.CardPadding, 'card-body')}>

                                    {!_.isEmpty(this.props.getClientData) ?
                                        <div className={cx(styles.Border, 'mb-2')}>
                                            <label className={styles.OrgHeading}>{this.props.getClientData.legalName}</label>

                                            <div className={cx(styles.verify, 'mb-3 px-3')}>
                                                <img src={verifyTick} alt={t('translation_orgClientDetails:image_alt_orgClientDetails.tick')} />&ensp;
                                            <label className={styles.verifyLabel}>{t('translation_orgClientDetails:label.l2')}</label>&ensp;
                                            <label className={styles.verifyBpss}>| {this.props.getClientData.organisationType} </label>
                                            </div>

                                            <div className={cx('row col-4')}>
                                                <label className={styles.smallCardHeading}>{t('translation_orgClientDetails:label.l3')}</label>
                                            </div>
                                            <div className='col-4'>
                                                <div className='row'><label className={styles.smallLabel}>{this.props.getClientData.address.addressLine1}</label></div>
                                                <div className='row'><label className={styles.smallLabel}>{this.props.getClientData.address.addressLine2}</label></div>
                                                <div className='row'><label className={styles.smallLabel}>{this.props.getClientData.address.city}</label>&nbsp;
                                                <label className={styles.smallLabel}>{this.props.getClientData.address.state}</label>&nbsp;
                                                <label className={styles.smallLabel}>{this.props.getClientData.address.pincode}</label>
                                                </div>
                                            </div>

                                            <hr className={styles.HorizontalLine} />
                                            <div className='row col-4'>
                                                <label className={styles.smallCardHeading}>{t('translation_orgClientDetails:label.l4')}</label>
                                            </div>

                                            <div className={cx('row mb-2')}>
                                                {!_.isEmpty(this.props.getClientData.contactPersons) ? this.props.getClientData.contactPersons.map((item, index) => {
                                                    return (
                                                        <div key={index} className='col-4 px-0'>
                                                            <div className={cx('mb-3 py-1', styles.contactBackground)}>
                                                                <div className={styles.flexDirection}>
                                                                    <div className='pl-3 pr-3'>
                                                                        <img src={vendorProfile} alt={t('translation_orgClientDetails:image_alt_orgClientDetails.vendorProfile')} />
                                                                    </div>
                                                                    <div className=''>
                                                                        <label className={styles.contactInfo}>{item.fullName}</label>
                                                                    </div>
                                                                </div>

                                                                <div className={styles.flexDirection}>
                                                                    <span className='pl-5 ml-2'>
                                                                        <label className={styles.contactInfo}>{item.label}&nbsp;|&nbsp;</label>
                                                                        <label className={styles.contactInfo}>{item.designation}</label>
                                                                    </span>
                                                                </div>

                                                                <div className={styles.flexDirection}>
                                                                    <div className='pl-4 pr-3'>
                                                                        <img src={vendorPhone} alt={t('translation_orgClientDetails:image_alt_orgClientDetails.vendorPhone')} />
                                                                    </div>
                                                                    <div>
                                                                        <label className={cx('pl-1', styles.contactInfo)}>{item.phoneNumber}</label>
                                                                    </div>
                                                                </div>

                                                                <div className={styles.flexDirection}>
                                                                    <div className='pl-4 pr-3'>
                                                                        <img src={vendorMail} alt={t('translation_orgClientDetails:image_alt_orgClientDetails.vendorMail')} />
                                                                    </div>
                                                                    <div>
                                                                        <label className={styles.contactInfo}>{item.emailAddress}</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }) : ''}
                                            </div>

                                            {!_.isEmpty(this.props.getClientData.agreementUrl) ?
                                                <div className='d-flex flex-column'>
                                                    <label className={styles.LabelWithValue}>{t('translation_orgClientDetails:label.l5')}</label>
                                                    <div className='d-flex flex-row'>

                                                        {this.props.getClientData.agreementUrl.map((item, index) => {
                                                            return (
                                                                <FileView
                                                                    key={index}
                                                                    className='mx-2 col-2'
                                                                    url={item}
                                                                />
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                                : ''}
                                        </div>
                                        : ''}
                                </div>
                            </div>
                        </div> </div>
                </div>
                <OrgClientRightNav />
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        contactList: state.orgMgmt.orgClientDetails.contactList,
        getClientData: state.orgMgmt.orgClientDetails.clientData,
        getOrgName: state.orgMgmt.orgClientDetails.getOrgName
    };
}

const mapDispatchToProps = dispatch => {
    return {
        initOrgDetails: () => dispatch(actions.initState()),
        clientData: (clientId, orgId) => dispatch(actions.clientData(clientId, orgId)),
        onGetOrgName: (orgId) => dispatch(actions.getOrgName(orgId))
    };
};

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(OrgClientDetails)));
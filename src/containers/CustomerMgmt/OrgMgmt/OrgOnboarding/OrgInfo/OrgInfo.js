import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash';
import cx from 'classnames';
import styles from './OrgInfo.module.scss';
import * as actionsOnBoarding from '../Store/action';

import { Button } from 'react-crux';

import leftArrow from '../../../../../assets/icons/arrowLeft.svg';
import vendorPhone from '../../../../../assets/icons/vendorPhone.svg';
import vendorMail from '../../../../../assets/icons/vendorMail.svg';
import vendorProfile from '../../../../../assets/icons/vendorProfile.svg';
import BigNotification from '../../../../../components/Molecule/BigNotification/BigNotification';
import { withTranslation } from 'react-i18next'
class OrgInfo extends Component {

    state = {
        enableSubmit: false,
        showSaveButton: false,
        submitSuccess: false,
        editMode: true,
        viewMode: false,
        brandColor: '',
        downloadURL: '',
        heading:'',
        message:''
    }
    _isMounted = false;

    componentDidMount = () => {
        this._isMounted = true;
        this.setState({mounted : true});
        if(!_.isEmpty(this.props.getOrgData)){
            let heading = 'cannot onboard client';
            let message = this.props.getOrgData.name + ' organisation is already registered with this '+this.props.getDocType+' number. add different document or review it.'
            this.setState({heading: heading, message: message})
        }
    }

    componentDidUpdate = (prevProps,prevState) => {
       if(_.isEmpty(this.props.getOrgData)){
           let redirectUrl='/customer-mgmt/org';
           this.props.history.push(redirectUrl);
       }
   
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    handleEditBack = () => {
        if (this.props.showModal) {
            this.props.initOrgDetails();
        }
    }
    handleBack = () => {
        if (this.props.showModal) {
            this.props.initStateonBoard();
        }
    }

    handleSubmit = () => {
        let redirectUrl = '/customer-mgmt/org/'+this.props.getOrgData.uuid+'/profile';
        this.props.history.push(redirectUrl);
    }

    render() {
        const { t } = this.props;
        return (
            <React.Fragment>
                <div className={styles.alignCenter}>
                   
                        <div className={cx("mt-3")} >
                        <NavLink to={'/customer-mgmt/org'}>
                            <img className={styles.Arrow} alt={t('translation_orgInfo:image_alt_orgInfo.img')} src={leftArrow} onClick={this.handleBack}/>
                            <label className={styles.smallText} onClick={this.handleBack}>{t('translation_orgInfo:text.t1')}</label>
                            </NavLink>
                        </div>
                   

                    <div className="px-2">
                        <div className={cx(styles.ContainerPadding64, "row pb-2")}>
                        <BigNotification
                            type='warning'
                            heading={this.state.heading}
                            message={this.state.message} />
                        </div>
                        <div className={cx(styles.CardLayout, 'row card')}>
                            <div className={cx(styles.CardPadding, 'card-body')}>
                                {/* {this._isMounted ?
                                <Form>
                                    {!_.isEmpty(this.props.getDocType) ?
                                    <React.Fragment>
                                    <div className='row'>
                                        <Input
                                            name='OrgCard'
                                            className="col-4"
                                            label={this.props.getDocType + ' Number'}
                                            type='text'
                                            required
                                            disabled={true}
                                            value={this.props.getDocNumber}
                                            fixed
                                        />
                                        <Link to={'/customer-mgmt/org'}>
                                            <img className={styles.image} src={editEmp} alt="editId" />
                                        </Link>
                                    </div> 
                               


                                <div className='row ml-auto'>
                                    <label className={styles.Italic}><i>below organisation is already registered with this {this.props.getDocType + ' number'}</i></label>
                                </div>
                                </React.Fragment>
                                :''}
                                </Form> :''} */}

                                {!_.isEmpty(this.props.getOrgData) ?
                                    <div className={cx(styles.Border, 'mb-2')}>
                                        <label className={styles.OrgHeading}>{t('translation_orgInfo:label.l1',{legalName:this.props.getOrgData.legalName})}</label>

                                        <div className={cx('row col-4')}>
                                            <label className={styles.smallCardHeading}>{t('translation_orgInfo:text.t2')}</label>
                                        </div>
                                        <div className='col-4'>
                                            <div className='row'><label className={styles.smallLabel}>{t('translation_orgInfo:label.l2',{addressLine1:this.props.getOrgData.address.addressLine1})}</label></div>
                                            <div className='row'><label className={styles.smallLabel}>{t('translation_orgInfo:label.l3',{addressLine2:this.props.getOrgData.address.addressLine2})}</label></div>
                                            <div className='row'><label className={styles.smallLabel}>{t('translation_orgInfo:label.l4',{city:this.props.getOrgData.address.city})}</label>&nbsp;
                                                <label className={styles.smallLabel}>{t('translation_orgInfo:label.l5',{state:this.props.getOrgData.address.state})}</label>&nbsp;
                                                <label className={styles.smallLabel}>{t('translation_orgInfo:label.l6',{pincode:this.props.getOrgData.address.pincode})}</label>
                                            </div>
                                        </div>

                                        <hr className={styles.HorizontalLine} />

                                        <div className='row col-4'>
                                            <label className={styles.smallCardHeading}>{t('translation_orgInfo:text.t3')}</label>
                                        </div>

                                        <div className={cx('d-flex')}>
                                            {this.props.getOrgData.contactPersons.map((item, index) => {
                                                return (
                                                    <div key={index} className={cx('d-flex flex-row col-4 mr-3 py-2 pl-3 pr-0', styles.contactBackground)}>
                                                        <div className='d-flex flex-column col-1 px-0'>
                                                            <div className='mt-2 mr-2'>
                                                                <img src={vendorProfile} alt={t('translation_orgInfo:image_alt_orgInfo.vendorProfile')} />
                                                            </div>
                                                            <div className='mt-3 mx-1'>
                                                                <img src={vendorPhone} alt={t('translation_orgInfo:image_alt_orgInfo.vendorPhone')} />
                                                            </div>
                                                            <div className='mt-0 mx-1'>
                                                                <img src={vendorMail} alt={t('translation_orgInfo:image_alt_orgInfo.vendorMail')} />
                                                            </div>
                                                        </div>

                                                        <div className='f-flex flex-column col-11 pl-3 '>
                                                           <div> <label className={styles.contactInfo}>{t('translation_orgInfo:label.l7',{fullName:item.fullName})}</label> </div>
                                                           <div> <label className={styles.contactInfo}>{t('translation_orgInfo:label.l8',{label:item.label,designation:item.designation})}</label></div>
                                                           <div> <label className={styles.contactInfo}>{t('translation_orgInfo:label.l9',{phone:item.phoneNumber})}</label></div>
                                                           <div> <label className={cx('col-12 px-0',styles.contactInfo)}>{t('translation_orgInfo:label.l10',{email :item.emailAddress})}</label></div>

                                                        </div>
                                                    </div>
                                                );
                                            })}</div>


                                    </div>
                                    :
                                   ''}
                                
                                <div className={cx("row justify-content-end", styles.SubmitPadding)}>
                                    <Button label={t('translation_orgInfo:button_orgInfo.goTo')} clickHandler ={this.handleSubmit}/>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
               
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        getDocType: state.orgMgmt.orgOnboard.cardtype,
        getDocNumber: state.orgMgmt.orgOnboard.idNo,
        getOrgData: state.orgMgmt.orgOnboard.orgData,
        showModal: state.orgMgmt.orgOnboard.showModal

        // agreement: state.vendorMgmt.vendorDetails.agreement
    };
}

const mapDispatchToProps = dispatch => {
    return {
        initStateonBoard: () => dispatch(actionsOnBoarding.initState()),
    };
};

export default withTranslation() (withRouter(connect(mapStateToProps, mapDispatchToProps)(OrgInfo)));

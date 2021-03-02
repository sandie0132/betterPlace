import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import _ from 'lodash';
import styles from './ManualAddressVerification.module.scss';
import profile from '../../../../../../assets/icons/defaultPic.svg';
import checkId from '../../../../../../assets/icons/checkId.svg';
import inactiveCheck from '../../../../../../assets/icons/inactiveCheck.svg';
import loader from '../../../../../../assets/icons/profilepicLoader.svg';

import CopyCard from '../../../../../../components/Molecule/CopyText/CopyText';
import CommentsSection from '../CommentsSection/CommentsSection';
import EmptyState from '../../../../../../components/Atom/EmptyState/EmptyState';

import * as imageStoreActions from '../../../../../Home/Store/action';
import { withTranslation } from 'react-i18next';


class ManualAddressVerification extends Component {

    componentDidMount(){
        if(this.props.taskData.profilePicUrl){
            this.props.onGetProfilePic(this.props.taskData.empId, this.props.taskData.profilePicUrl);
        }
    }

    openGoogleLinkHandler = () => {
        let address = document.getElementById("address").innerText;
        window.open("https://www.google.com/maps/search/"+address)
    }

    render() {
        const { t } = this.props;
        const empId = this.props.taskData.empId;
        return (
            !_.isEmpty(this.props.taskData) ?
                <div className={this.props.disabled ? cx(styles.CardPadding, styles.LowerCardInactive) : cx(styles.CardPadding, styles.CardLayout)}>
                    <div>
                        <div className="d-flex">
                            {_.includes(this.props.loadingQueue, empId) ?
                                <span className={styles.loaderBackground}>
                                    <img className={styles.loader} src={loader} alt='' />
                                </span>
                            :    <span>
                                    <img
                                        src={this.props.taskData.profilePicUrl ? 
                                                (this.props.images[empId] ? 
                                                    this.props.images[empId]['image'] 
                                                : profile)
                                            : profile}
                                        className={styles.Profile}
                                        alt=""
                                    />
                                </span>
                            }
                            <div>
                                { this.props.taskData.fullName ?
                                    <label className={this.props.disabled ? styles.fullNameInactive : styles.fullNameActive}>
                                        {this.props.taskData.fullName}
                                    </label>
                                : null }<br />
                                <label className={this.props.disabled ? styles.OptionWithHeadingInactive : styles.OptionWithHeading}>
                                    {this.props.taskData.current_employeeId ? this.props.taskData.current_employeeId : ""} 
                                    {this.props.taskData.current_employeeId && !_.isEmpty(this.props.defaultRole) ? " | " : ""}
                                    {!_.isEmpty(this.props.defaultRole) ? this.props.defaultRole : ""}
                                </label>
                            </div>
                        </div>
                        <div style={{ marginTop: "2rem" }} className='d-flex flex-row justify-content-between no-gutters'>
                            <div className="row no-gutters">
                                <div className="col-8 px-0 d-flex flex-column">
                                    <span id="address" className={this.props.disabled ? styles.ValueInactive : styles.Value}>
                                        {(!_.isEmpty(this.props.taskData.address.addressLine1) ? this.props.taskData.address.addressLine1 + ', ' : '') +
                                            (!_.isEmpty(this.props.taskData.address.addressLine2) ? this.props.taskData.address.addressLine2 + ', ' : '') +
                                            (!_.isEmpty(this.props.taskData.address.landmark) ? this.props.taskData.address.landmark + ", " : '') +
                                            (!_.isEmpty(this.props.taskData.address.city) ? this.props.taskData.address.city + ", " : '') +
                                            (!_.isEmpty(this.props.taskData.address.district) ? this.props.taskData.address.district + ", " : '') +
                                            (!_.isEmpty(this.props.taskData.address.state) ? this.props.taskData.address.state + ", " : '') +
                                            (!_.isEmpty(this.props.taskData.address.pincode) ? this.props.taskData.address.pincode : '')
                                        }
                                    </span>
                                    <span className={this.props.disabled ? styles.SubHeadingInactive : styles.SubHeading}>{t('translation_docVerification:manualAddress.address')}</span>
                                </div>
                            
                                <div className={cx(styles.idValuePosition)}>
                                    <CopyCard id="address" textToCopy={this.props.taskData.address} manualAddress/>
                                </div>
                            </div>
                            <div><img className={cx("ml-auto",styles.hover)} src={(this.props.seconds !== 0 && !this.props.disabled)? checkId : inactiveCheck} alt='' onClick={() => this.openGoogleLinkHandler()} /></div>
                        </div>
                        <hr className={cx('mb-0',styles.HorizontalLine)} />
                        <div className="row no-gutters">

                                {this.props.taskData.address.addressLine1 ?
                                    <div className="d-flex flex-column col-4" style={{ marginTop: "2rem" }}>
                                        <span className={this.props.disabled ? styles.ValueInactive : styles.Value}>{this.props.taskData.address.addressLine1}</span>
                                        <span className={this.props.disabled ? styles.SubHeadingInactive : styles.SubHeading}>{t('translation_docVerification:manualAddress.addressLine1')}</span>
                                    </div>
                                    : null}

                                {this.props.taskData.address.addressLine2 ?
                                    <div className="d-flex flex-column col-4" style={{ marginTop: "2rem" }}>
                                        <span className={this.props.disabled ? styles.ValueInactive : styles.Value}>{this.props.taskData.address.addressLine2}</span>
                                        <span className={this.props.disabled ? styles.SubHeadingInactive : styles.SubHeading}>{t('translation_docVerification:manualAddress.addressLine2')}</span>
                                    </div>
                                    : null}
                            {this.props.taskData.address.pincode ?
                                <div className="d-flex flex-column col-4" style={{ marginTop: "2rem" }}>
                                    <span className={this.props.disabled ? styles.ValueInactive : styles.Value}>{this.props.taskData.address.pincode}</span>
                                    <span className={this.props.disabled ? styles.SubHeadingInactive : styles.SubHeading}>{t('translation_docVerification:manualAddress.pincode')}</span>
                                </div>
                                : null}

                            <div className="d-flex flex-column col-4" style={{ marginTop: "2rem" }}>
                                <span className={this.props.disabled ? styles.ValueInactive : styles.Value}>{this.props.taskData.address.district}</span>
                                <span className={this.props.disabled ? styles.SubHeadingInactive : styles.SubHeading}>{t('translation_docVerification:manualAddress.district')}</span>
                            </div>
                            <div className="d-flex flex-column col-4" style={{ marginTop: "2rem" }}>
                                <span className={this.props.disabled ? styles.ValueInactive : styles.Value}>{this.props.taskData.address.state}</span>
                                <span className={this.props.disabled ? styles.SubHeadingInactive : styles.SubHeading}>{t('translation_docVerification:manualAddress.state')}</span>
                            </div>
                        </div>
                    </div>
                    <hr className={styles.horizontalCardLine} />
                    <CommentsSection 
                        seconds={this.props.seconds}
                        taskData={this.props.taskData}
                        cardType={this.props.cardType}
                        searchType={this.props.searchType}
                        searchResult={this.props.searchResult}
                        successNotificationHandler={this.props.successNotificationHandler}
                    />
                </div>
            :   <EmptyState cardType={this.props.cardType}/>
        )
    }
}

const mapStateToProps = state => {
    return {
        images: state.imageStore.images,
        loadingQueue:  state.imageStore.loadingQueue
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetProfilePic: (empId, filePath) => dispatch(imageStoreActions.getProfilePic(empId, filePath)),
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ManualAddressVerification));
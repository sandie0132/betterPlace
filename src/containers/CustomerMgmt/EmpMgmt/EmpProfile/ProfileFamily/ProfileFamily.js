import React, { Component } from 'react';
import { withRouter } from "react-router";
import { connect } from "react-redux";
import _ from 'lodash';
import cx from "classnames";
import styles from "./ProfileFamily.module.scss";
import phone from "../../../../../assets/icons/phone.svg";
import dob from "../../../../../assets/icons/birthdayCake.svg";
import person from "../../../../../assets/icons/familyProfile.svg";
import blood from "../../../../../assets/icons/bloodGroupIcon.svg";
import current_address from "../../../../../assets/icons/currentAddressIcon.svg";
import permanent_address from "../../../../../assets/icons/permanentAddressIcon.svg";
import height from "../../../../../assets/icons/heightIcon.svg";
import weight from "../../../../../assets/icons/weightIcon.svg";
import mark from "../../../../../assets/icons/identificationMark.svg";
import email from "../../../../../assets/icons/emailIcon.svg";
import largePhone from "../../../../../assets/icons/phoneIcon.svg";

import { withTranslation } from 'react-i18next';
import ProfileDocuments from '../ProfileDocuments/ProfileDocuments';

// translation_empProfile
class ProfileFamily extends Component {

    dateFormat = (date) => {
        let values = date.split('-');
        let updatedDate = '';
        updatedDate = values[2] + ' • ' + values[1] + ' • ' + values[0];
        return updatedDate;
    }



    render() {
        
        const { t } = this.props;

        let noEmail = true, noMobile = true;
        if (!_.isEmpty(this.props.empData)) {
            if (!_.isEmpty(this.props.empData.contacts)) {
                _.forEach(this.props.empData.contacts, function (value) {
                    if (value.type === "EMAIL" && !_.isEmpty(value.contact)) { noEmail = false }
                    else if (value.type === "MOBILE") { noMobile = false }
                })
            }
        }

        let mobiles = [];
        let thisRef = this;
        if (!_.isEmpty(this.props.empData.contacts)) {
            thisRef.props.empData.contacts.map((mob, index) =>
                mob.type === 'MOBILE' ? mobiles.unshift(mob.contact) : null//mobiles.push(mob.contact)
            )
        }

        let healthObject = this.props.empData.healthDetails;

        return (
            <React.Fragment>

                <div className={cx(styles.Card, "col-12")}>

                    <div className={cx("card-body d-flex row", styles.HeadCard)}>
                        <div className="ml-2 d-flex pt-4 pb-4 mb-2 flex-column col-12">

                            <label className={cx('mb-3',styles.orgSecondaryHeading)}>
                                {t('translation_empProfile:texts_empProfile.profileFamily.family')} &amp; {t('translation_empProfile:texts_empProfile.profileFamily.references')}
                                <br />
                            </label>

                            {!_.isEmpty(this.props.empData.familyRefs) ? this.props.empData.familyRefs.map((family, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <label className={cx(styles.LabelHeading, "mb-4 ml-0")}>{family.relationship.toLowerCase()}</label>
                                        <div className="row mb-4 ml-0">
                                            <div className="col-4">
                                                <div className="row">
                                                    <img src={person} alt={t('translation_empProfile:image_alt_empProfile.profileFamily.img')} className="mt-2 mr-2" />
                                                    <div className="col-9 pl-2" style={{ lineHeight: '1.5' }}>
                                                        <span className={cx("mb-0", styles.Heading)}> {family.name} </span>
                                                        <br />
                                                        <span className={cx("pt-1", styles.HeadingContent)}>{t('translation_empProfile:span_label_empProfile.profileFamily.name')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {!_.isEmpty(family.dob) ?
                                                <div className="col-4">
                                                    <div className="row">
                                                        <img src={dob} alt={t('translation_empProfile:image_alt_empProfile.profileFamily.img')} className="mt-2 mr-2" />
                                                        <div className="col-9 pl-1" style={{ lineHeight: '1' }}>
                                                            <span className={cx("mb-0", styles.Heading)}>{!_.isEmpty(family.dob) ? this.dateFormat(family.dob) : null}</span>
                                                            <br />
                                                            <span className={cx("pt-1", styles.HeadingContent)}>{t('translation_empProfile:span_label_empProfile.profileFamily.dob')}</span>
                                                        </div>
                                                    </div>
                                                </div> : null}

                                            {!_.isEmpty(family.mobile) ?
                                                <div className="col-4">
                                                    <div className="row">
                                                        <img src={phone} alt={t('translation_empProfile:image_alt_empProfile.profileFamily.img')} className="mt-2 mr-2" />
                                                        <div className="col-9 pl-2" style={{ lineHeight: '1' }}>
                                                            <span className={cx("mb-0", styles.Heading)}>{family.mobile}</span>
                                                            <br />
                                                            <span className={cx("pt-1", styles.HeadingContent)}>{t('translation_empProfile:span_label_empProfile.profileFamily.phone')}</span>
                                                        </div>
                                                    </div>
                                                </div> : null}
                                        </div>

                                    </React.Fragment>
                                )
                            })
                                : <div className={styles.AlignCenter}><div className={cx(styles.EmptyInformation, 'mb-2')}>&emsp;{t('translation_empProfile:span_label_empProfile.profileFamily.emptyInfo')}&emsp;</div></div>}
                            <hr className={cx(styles.horizontalLine)} />

                            <label className={styles.orgSecondaryHeading}> {t('translation_empProfile:texts_empProfile.profileFamily.healthDetails')} </label>
                            {!_.isEmpty(healthObject) ?
                                <React.Fragment>
                                    <div className="row mt-2 ml-0">
                                        {!_.isEmpty(healthObject["weight"]) ?
                                            <div className="col-4">
                                                <div className="row">
                                                    <img src={weight} alt={t('translation_empProfile:image_alt_empProfile.profileFamily.img')} className="mt-2 mr-2" />
                                                    <div className="col-9 pl-2" style={{ lineHeight: '1' }}>
                                                        <span className={cx("mb-0", styles.Heading)}>{healthObject["weight"]}&nbsp;{healthObject["weightUnit"]}</span>
                                                        <br />
                                                        <span className={cx("pt-1", styles.HeadingContent)}>{t('translation_empProfile:span_label_empProfile.profileFamily.weight')}</span>
                                                    </div>
                                                </div>
                                            </div> : null
                                        }

                                        {!_.isEmpty(healthObject["height"]) ?
                                            <div className="col-4">
                                                <div className="row">
                                                    <img src={height} alt={t('translation_empProfile:image_alt_empProfile.profileFamily.img')} className={cx(styles.HeightIcon, "mt-2 mr-2")} />
                                                    <div className="col-9 pl-2" style={{ lineHeight: '1' }}>
                                                        <span className={cx("mb-0", styles.Heading)}>{healthObject["height"]}&nbsp;{healthObject["heightUnit"]}</span>
                                                        <br />
                                                        <span className={cx("pt-1", styles.HeadingContent)}>{t('translation_empProfile:span_label_empProfile.profileFamily.height')}</span>
                                                    </div>
                                                </div>
                                            </div> : null}

                                        {!_.isEmpty(healthObject["bloodGroup"]) ?
                                            <div className="col-4">
                                                <div className="row">
                                                    <img src={blood} alt={t('translation_empProfile:image_alt_empProfile.profileFamily.img')} className={cx("mt-2 mr-2")} />
                                                    <div className="col-9 pl-2" style={{ lineHeight: '1' }}>
                                                        <span className={cx("mb-0", styles.Heading)}>{healthObject["bloodGroup"]}</span>
                                                        <br />
                                                        <span className={cx("pt-1", styles.HeadingContent)}>{t('translation_empProfile:span_label_empProfile.profileFamily.bloodType')}</span>
                                                    </div>
                                                </div>
                                            </div> : null}
                                    </div>

                                    {!_.isEmpty(healthObject["identificationMark"]) ?
                                        <div className={!_.isEmpty(healthObject["bloodGroup"]) || !_.isEmpty(healthObject["height"]) || !_.isEmpty(healthObject["weight"]) ? "row ml-0 mt-5" : "row ml-0"}>
                                            <img src={mark} alt={t('translation_empProfile:image_alt_empProfile.profileFamily.img')} className={cx("mt-2 mr-2")} />
                                            <div className="col-11 pl-2" style={{ lineHeight: '1' }}>
                                                <span className={cx("mb-0", styles.Heading)}>{healthObject["identificationMark"]}</span>
                                                <br />
                                                <span className={cx("pt-1", styles.HeadingContent)}>{t('translation_empProfile:span_label_empProfile.profileFamily.idMark')}</span>
                                            </div> <br />
                                        </div> : null}

                                </React.Fragment>

                                : <div className={styles.AlignCenter}><div className={cx(styles.EmptyInformation, 'mb-2')}>&emsp;{t('translation_empProfile:span_label_empProfile.profileFamily.emptyInfo')}&emsp;</div></div>}

                            <hr className={styles.horizontalLine} />

                            <label className={styles.orgSecondaryHeading}>
                                {t('translation_empProfile:texts_empProfile.profileFamily.address')}
                            </label>

                            {!_.isEmpty(this.props.empData.addresses) ?
                                <span className="ml-0 row">
                                    {this.props.empData.addresses.map((address, index) => {

                                        return (
                                            <React.Fragment key={index} >
                                                <div className="col-6 row">

                                                    <div className=" px-0 mt-2 mr-3">
                                                        {address.addressType === 'PERMANENT_ADDRESS' ? <img src={permanent_address} alt={t('translation_empProfile:image_alt_empProfile.profileFamily.img')} /> : <img src={current_address} alt={t('translation_empProfile:image_alt_empProfile.profileFamily.img')} />}
                                                    </div>

                                                    <div className="col-sm-10 px-0 py-0">
                                                        <span className={cx(styles.tagSecondText)}>
                                                            {this.props.empData.isCurrAndPerAddrSame &&  address.addressType !== 'CUSTOM_ADDRESS'
                                                            ? "current and permanent address" :
                                                                address.addressType.replace(/_/gi, " ").toLowerCase()
                                                            }
                                                        </span>
                                                        <br />
                                                        <p className={styles.tagText}>
                                                            {(!_.isEmpty(address.addressLine1) ? address.addressLine1 + ', ' : '') + (!_.isEmpty(address.addressLine2) ? address.addressLine2 + ', ' : '')}
                                                            <br />
                                                            {!_.isEmpty(address.landmark) ? address.landmark + ', ' : ''}
                                                            {!_.isEmpty(address.city) ? <span>{address.city}</span> : ''}
                                                            {(!_.isEmpty(address.landmark) || !_.isEmpty(address.city)) ? <br /> : null}
                                                            {(!_.isEmpty(address.district) ? address.district + ', ' : '') + (!_.isEmpty(address.state) ? address.state + ', ' : '') + (!_.isEmpty(address.country) ? address.country + ', ' : '') + address.pincode}
                                                            {/* {address.district},&nbsp;{address.state},&nbsp;{address.country},&nbsp;{address.pincode} */}
                                                        </p>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        )
                                    })}
                                </span> :
                                <div className={styles.AlignCenter}><div className={cx(styles.EmptyInformation, 'mb-2')}>&emsp;{t('translation_empProfile:span_label_empProfile.profileFamily.emptyInfo')}&emsp;</div></div>
                            }

                            <hr className={styles.horizontalLine} />

                            <label className={styles.orgSecondaryHeading}>
                                {t('translation_empProfile:texts_empProfile.profileFamily.contact')}
                            </label>
                            <div className="row mt-2 ml-2">
                                {noMobile === false ?
                                    <React.Fragment>
                                        <div className="px-0 mt-2 mr-3">
                                            <img src={largePhone} alt={t('translation_empProfile:image_alt_empProfile.profileFamily.img')} />&nbsp;
                                    </div>

                                        <div className="col-sm-5 px-0 py-0">
                                            <span className={cx(styles.tagSecondText, "mb-0")}>
                                                {t('translation_empProfile:span_label_empProfile.profileFamily.phone')}
                                            </span>
                                            {mobiles.map((mob, index) => {
                                                return (<p key={index} className={cx(styles.smallText)}>{mob}</p>)
                                            })}
                                        </div>
                                    </React.Fragment>
                                    : null}

                                {noEmail === false ?
                                    <React.Fragment>
                                        <div className="px-0 mt-2 mr-3">
                                            <img src={email} alt={t('translation_empProfile:image_alt_empProfile.profileFamily.img')} />
                                            &nbsp;
                                    </div>
                                        <div className="col-sm-5 px-0 py-0">
                                            <span className={cx(styles.tagSecondText, "mb-0")}>{t('translation_empProfile:span_label_empProfile.profileFamily.emailId')}</span>
                                            {!_.isEmpty(this.props.empData.contacts) ? this.props.empData.contacts.map((mob, index) => {
                                                return (mob.type === 'EMAIL' ?
                                                    <p key={index} className={cx(styles.smallText)}>{mob.contact}</p> : null
                                                )
                                            }) : null}
                                        </div>
                                    </React.Fragment> : null}
                            </div>

                            {noEmail && noMobile ?
                                <div className={styles.AlignCenter}><div className={cx(styles.EmptyInformation, 'mb-2')}>&emsp;{t('translation_empProfile:span_label_empProfile.profileFamily.emptyInfo')}&emsp;</div></div>
                                : null}

                            <hr className={styles.horizontalLine} />

                            <ProfileDocuments/>

                            
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        empData: state.empMgmt.empProfile.empData,
        error: state.empMgmt.empProfile.error,
    };
};

export default withTranslation()(withRouter(connect(mapStateToProps, null)(ProfileFamily)));
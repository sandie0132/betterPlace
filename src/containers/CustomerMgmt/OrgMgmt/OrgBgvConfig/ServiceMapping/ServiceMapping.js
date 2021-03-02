import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import _ from 'lodash';
import cx from 'classnames';
import styles from './ServiceMapping.module.scss';
import queryString from 'query-string';

import * as actions from './Store/action';
import * as actionsOrgMgmt from '../../OrgMgmtStore/action';

import CardHeader from '../../../../../components/Atom/PageTitle/PageTitle';
import ArrowLink from '../../../../../components/Atom/ArrowLink/ArrowLink';
import { Button } from 'react-crux';
import TagSearchModal from '../../../../TagSearch/TagSearchModal/TagSearchModal';
import ErrorNotification from '../../../../../components/Organism/Notifications/ErrorNotification/ErrorNotification';
import Loader from '../../../../../components/Organism/Loader/BGVConfigServiceLoader/BGVConfigServiceLoader';
import Checkbox from '../../../../../components/Atom/CheckBox/CheckBox';
import VendorDropdown from '../../../../VendorSearch/VendorDropdown/VendorDropdown';

import bgv_service from '../../../../../assets/icons/bgvService.svg';
import plus from '../../../../../assets/icons/plusSign.svg';
import minus from '../../../../../assets/icons/minusSign.svg';
import panConfigIcon from '../../../../../assets/icons/panConfigIcon.svg';
import voterConfigIcon from '../../../../../assets/icons/voterConfigIcon.svg';
import aadhaarConfigIcon from '../../../../../assets/icons/aadhaarConfigIcon.svg';
import permanentaddressConfigIcon from '../../../../../assets/icons/permanentaddressConfigIcon.svg';
import currentAddressConfigIcon from '../../../../../assets/icons/currentAddressConfigIcon.svg';
// import defaultIcon from '../../../../../assets/icons/defaultIcon.svg';
import drivingLicenseConfigIcon from '../../../../../assets/icons/drivingLicenseConfigIcon.svg';
import globalDb from '../../../../../assets/icons/databaseWithBackground.svg';
import educationConfigIcon from '../../../../../assets/icons/educationConfigIcon.svg';
import employmentConfigIcon from '../../../../../assets/icons/employmentConfigIcon.svg';
import healthConfigIcon from '../../../../../assets/icons/healthConfigIcon.svg';
import refConfigIcon from '../../../../../assets/icons/refConfigIcon.svg';
import courtSmallIcon from '../../../../../assets/icons/courtConfigIcon.svg';
import vehicleregistrationConfigIcon from '../../../../../assets/icons/rcConfigIcon.svg';
import policeVerificationConfigIcon from '../../../../../assets/icons/policeConfigIcon.svg';

import HasAccess from '../../../../../services/HasAccess/HasAccess';

const serviceCards = {
    "PAN": { icon: panConfigIcon, label: "pan card" },
    "AADHAAR": { icon: aadhaarConfigIcon, label: "aadhaar card" },
    "VOTER": { icon: voterConfigIcon, label: "voter card" },
    "DL": { icon: drivingLicenseConfigIcon, label: "driving license" },
    "RC": { icon: vehicleregistrationConfigIcon, label: "vehicle registration" },

    "CURRENT_ADDRESS": { icon: currentAddressConfigIcon, label: "current address" },
    "PERMANENT_ADDRESS": { icon: permanentaddressConfigIcon, label: "permanent address" },
    "ADDRESS_AGENCY_VERIFICATION": { icon: permanentaddressConfigIcon, label: "address agency" },

    "CRC_CURRENT_ADDRESS": { icon: courtSmallIcon, label: "current address" },
    "CRC_PERMANENT_ADDRESS": { icon: courtSmallIcon, label: "permanent address" },
    "POLICE_VERIFICATION": { icon: policeVerificationConfigIcon, label: "police verification" },
    "GLOBALDB": { icon: globalDb, label: "database verification" },
    "PHYSICAL": { icon: globalDb, label: "physical verification" },
    "POSTAL": { icon: globalDb, label: "postal verification" },

    "EDUCATION": { icon: educationConfigIcon, label: "education verification" },
    "EMPLOYMENT": { icon: employmentConfigIcon, label: "employment verification" },

    "HEALTH": { icon: healthConfigIcon, label: "health check verification" },
    "REFERENCE": { icon: refConfigIcon, label: "reference verification" }
}

let hasEditAccess = false;

class ServiceMapping extends Component {
    state = {
        formData: [],
        selectedRow: null,
        showModal: false,
        selectTagType: 'include',
        tagInfo: [],
        checkAccess: true,
        // hasEditAccess: false,
    }

    componentDidMount() {
        this._isMounted = true;
        const { match, location } = this.props;
        
        const orgId = match.params.uuid;
        let params = queryString.parse(location.search);
        let from = '', to ='', viaUrl = '';
        if(!_.isEmpty(params.vendorId)) {
            if(!_.isEmpty(params.subVendorId)){
                from = params.subVendorId;
                to = orgId;
                viaUrl = 'vendorId='+params.vendorId;
            } else {
                from = params.vendorId;
                to = orgId;
            }
        } else if(!_.isEmpty(params.clientId)){
            if(!_.isEmpty(params.superClientId)){
                from = orgId;
                to = params.superClientId;
                viaUrl = `clientId=${params.clientId}`;
            } else {
                from = orgId;
                to = params.clientId;
            }
        }

        this.props.onGetData(orgId, from, to, viaUrl);
        if (orgId) {
            if (_.isEmpty(this.props.orgData)) {
                this.props.getOrgData(orgId)
            }
            // this.props.getEnabledPlatformServices(orgId);
        }
        if (orgId !== this.props.rightnavOrgId) {
            this.props.getOrgData(orgId, from, to)
        }
        this.setState({ mounted: true })
    }

    componentDidUpdate(prevProps, prevState) {

        if (prevProps.getDataState !== this.props.getDataState && this.props.getDataState === 'SUCCESS') {
            let updatedFormData = [];
            if(!_.isEmpty(this.props.tagMapList.servicesEnabled)){
                //add data fields 
                updatedFormData = this.props.tagMapList.servicesEnabled.map(service => {
                    return ({
                        ...service,
                        allTags: false,
                        includeTags: [],
                        excludeTags: []
                    })
                });

                if (!_.isEmpty(this.props.tagMapList.tagMappedServices)) {
                    let postedServices = this.props.tagMapList.tagMappedServices;
                    _.forEach(updatedFormData, function (each) {
                        _.forEach(postedServices, function (postedService) {
                            if (postedService.service === each.service && postedService.type === each.type) {
                                each.allTags = postedService.allTags;
                                each.excludeTags = postedService.excludeTags;
                                each.includeTags = postedService.includeTags;
                            }
                        });
                    })
                }
                this.setState({ formData: updatedFormData });
                this.getTagInfo(this.props.tagMapList.servicesEnabled);
            } else {
                const { match, location } = this.props;
                let params = queryString.parse(location.search);
                const orgId = match.params.uuid;
                let url = '/customer-mgmt/org/' + orgId + '/config/bgv-select';
                if(!_.isEmpty(params)){
                    url += location.search;
                }
                this.props.history.push(url);
            }
        }
        // if (prevProps.getEnabledPlatformServicesState !== this.props.getEnabledPlatformServicesState) {
        //     if (this.props.getEnabledPlatformServicesState === "SUCCESS") {
        //         let products = this.props.EnabledPlatformServices.products ? this.props.EnabledPlatformServices.products : [];
        //         let services = this.props.EnabledPlatformServices.services ? this.props.EnabledPlatformServices.services : [];
        //         let isPlatformBgvEnabled = false;
        //         if (this.props.enabledID && this.props.EnabledPlatformServices.products) {
        //             _.forEach(products, function (product) {
        //                 if (product.product === "BGV")
        //                     isPlatformBgvEnabled = true
        //             })
        //         }
        //         if (!isPlatformBgvEnabled) {
        //             products.push({ product: "BGV" })
        //             if (this.props.enabledID) {
        //                 let putData = { products: products, services: services, _id: this.props.enabledID }
        //                 this.props.onPutEnabledServices(putData, orgId)
        //             }
        //             else {
        //                 let postData = { products: products, services: services }
        //                 this.props.onPostEnabledServices(postData, orgId)
        //             }
        //         }
        //     }
        // }
        if (prevState.formData !== this.state.formData) {
            this.getTagInfo(this.state.formData);
        }
        if (prevProps.postTagInfoState !== this.props.postTagInfoState) {
            if (this.props.postTagInfoState === 'SUCCESS') {

                this.setState({
                    tagInfo: this.props.TagInfoData
                })
            }
        }
        // if (this.state.hasEditAccess !== prevState.hasEditAccess) {
        //     this.setState({ checkAccess: false })
        // }

        if(this.props.location.search !== prevProps.location.search) {
            const { match, location } = this.props;
            let orgId = match.params.uuid;
            let params = queryString.parse(location.search);
            let from = '', to ='', viaUrl;
            if(!_.isEmpty(params.vendorId)) {
                if(!_.isEmpty(params.subVendorId)){
                    from = params.subVendorId;
                    to = orgId;
                    viaUrl = 'vendorId='+params.vendorId;
                } else {
                    from = params.vendorId;
                    to = orgId;
                }
            } else if(!_.isEmpty(params.clientId)){
                if(!_.isEmpty(params.superClientId)){
                    from = orgId;
                    to = params.superClientId;
                    viaUrl = `clientId=${params.clientId}`;
                } else {
                    from = orgId;
                    to = params.clientId;
                }
            }
            this.props.onGetData(orgId, from, to, viaUrl);
        }
    }

    getTagInfo = (tags) => {
        let tagArr = [];
        const { location } = this.props;
        let params = queryString.parse(location.search);
        let isShared = false;
        if(!_.isEmpty(params)){
            isShared = true;
        } 
        _.forEach(tags, function (tag) {

            _.forEach(tag['includeTags'], function (incTag) {
                tagArr.push(incTag)
            })

            _.forEach(tag['excludeTags'], function (exTag) {
                tagArr.push(exTag)
            })
        })
        if (tagArr.length > 0) {
            this.props.onPostTagInfoData(tagArr, isShared)
        }
    }

    handleGetUuidFromTagList = (tagList) => {
        let updatedTagList = [];
        _.forEach(tagList, function (item) {
            updatedTagList.push(item.uuid)
        })
        return updatedTagList
    }

    handleInputChange = (event) => {
        let updatedFormData = _.cloneDeep(this.state.formData);
        const type = this.state.selectTagType === 'include' ? 'includeTags' : 'excludeTags';
        const targetIndex = this.state.selectedRow;
        updatedFormData[targetIndex][type] = this.handleGetUuidFromTagList(event.value)

        this.setState({
            formData: updatedFormData,
            showModal: false,
            selectedRow: 0
        });
    };

    handleSelectAll = (targetIndex) => {
        let updatedFormData = _.cloneDeep(this.state.formData);
        updatedFormData = updatedFormData.map((data, index) => {
            if (index === targetIndex) {
                data.allTags = !data.allTags
            }
            return data;
        })
        this.setState({
            formData: updatedFormData
        })
    }

    handleShowModal = (targetIndex, selectTagType) => {
        this.setState({
            showModal: true,
            selectedRow: targetIndex,
            selectTagType: selectTagType
        })
    }

    handleCloseModal = () => {
        this.setState({
            showModal: false,
            selectedRow: 0,
        })
    }

    componentWillUnmount = () => {
        this.props.initState();
    }

    handleFormSubmit = () => {
        let data = this.state.formData;
        const { match, location } = this.props;
        let orgId = match.params.uuid;
        let params = queryString.parse(location.search);
        let from = '', to ='', viaUrl = '';
        if(!_.isEmpty(params.vendorId)) {
            if(!_.isEmpty(params.subVendorId)){
                from = params.subVendorId;
                to = orgId;
                viaUrl = 'vendorId='+params.vendorId;
            } else {
                from = params.vendorId;
                to = orgId;
            }
        } else if(!_.isEmpty(params.clientId)){
            if(!_.isEmpty(params.superClientId)){
                from = orgId;
                to = params.superClientId;
                viaUrl = `clientId=${params.clientId}`;
            } else {
                from = orgId;
                to = params.clientId;
            }
        }
        // if (this.props.tagMapList._id) {
        //     this.props.onPutData(orgId, data);
        // }
        // else {
        let status = 'inProgress'
        if (this.props.tagMapList && this.props.tagMapList.status) {
            status = this.props.tagMapList.status === 'done' ? 'done' : status;
        }
        data = { tagMappedServices: data, status: status }
        this.props.onPostData(orgId, from, to, data, viaUrl);
        // }
    }

    showTags = (index, tagType) => {
        const type = tagType === 'include' ? 'includeTags' : 'excludeTags';
        const tagInfo = _.cloneDeep(this.state.tagInfo);
        let displayTag = [];
        if (this.state.formData && index !== null) {
            if (this.state.formData[index][type]) {
                _.forEach(this.state.formData[index][type], function (tags) {
                    _.forEach(tagInfo, function (id) {
                        if (id.uuid === tags) {
                            displayTag.push(id)
                        }
                    })
                })
            }
        }
        return displayTag;
    }

    hideTags = (index, tagType) => {
        const type = tagType === 'include' ? 'excludeTags' : 'includeTags';
        let hideTagsList = [];
        if (this.state.formData && index !== null) hideTagsList = this.state.formData[index][type];
        return hideTagsList;
    }

    showSingleTag = (uuid) => {
        const tagInfo = _.cloneDeep(this.state.tagInfo);
        let name;
        _.forEach(tagInfo, function (id) {
            if (id.uuid === uuid) {
                name = id.name
            }
        })
        name = this.shortenEmpName(name)
        return name;
    }

    componentWillUnmount() {
        this.props.initState();
    }

    handleSetEditAccess = () => {
        // this.setState({ hasEditAccess: true })
        hasEditAccess = true;
        return true
    }

    shortenEmpName = (empName) => {
        if (empName) {
            if (empName.length > 20) {
                const updatedEmpName = empName.substring(0, 10) + '...';
                return (updatedEmpName);
            }
        }
        return (empName);
    }

    checkManualReview = (service, form) => {
        let data = _.cloneDeep(this.props.tagMapList.servicesEnabled)
        if(!_.isEmpty(data)){
            let selected = data.filter(function (serviceEnable) {
                return serviceEnable.service === service
            })
            if(!_.isEmpty(selected)){
                if (form.type === 'LEGAL' && selected[0].addressManualReview) {
                    return "address review + ";
                }
                else if (form.type === 'ADDRESS' && selected[0].addressManualReview) {
                    return "address review + " + serviceCards[selected[0].verificationPreference]['label'];
                }
                else if (form.type === 'ADDRESS' && !selected[0].addressManualReview) {
                    return serviceCards[selected[0].verificationPreference]['label'];
                }
                else return '';
            } else return '';
        }
        return '';
    }

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
        const { match, location } = this.props;
        let params = queryString.parse(location.search);
        let orgId = match.params.uuid;
        let url = "/customer-mgmt/org/" + orgId + "/config/bgv-tat";
        if(!_.isEmpty(params)){
            url += location.search;
        }
        const showVendorDropDown = this.handleShowVendorDropDown();
        let NotificationPan =
            (this.props.error) ?
                <div className={this.props.error ? cx(styles.ShowErrorNotificationCard, 'flex align-items-center') : cx(styles.HideErrorNotificationCard)}>
                    <ErrorNotification error={this.props.error} />
                </div> :
                null

        let idCards = [], addressVerification = [], legalVerification = [], healthVerification = [], referenceVerification = [],
            careerVerification = [];

        if (!_.isEmpty(this.state.formData)) {
            this.state.formData.map((form, index) => {
                if (form.type === 'DOCUMENT') {
                    return (
                        idCards = idCards.concat(
                            <div key={index} className='row mt-2 mb-3'>
                                <div className="col-5 pr-0 ml-3 d-flex flex-row">
                                    <img className={cx(styles.serviceIcon, 'mt-2')} alt={t('translation_orgBgvServiceMapping:image_alt_orgBgvServiceMapping.IdIcon')} src={serviceCards[form.service].icon} />
                                    <label className={styles.Options}>{serviceCards[form.service].label} </label>
                                </div>
                                <div className='col-2 pl-0'>
                                    <div style={{ paddingLeft: '0rem' }}>
                                        <Checkbox
                                            type="medium"
                                            value={form.allTags}
                                            onChange={() => this.handleSelectAll(index)}
                                            disabled={!hasEditAccess}
                                            checkMarkStyle={styles.checkMarkStyle}
                                        />
                                    </div>
                                </div>
                                <div className='col-2 px-0'>
                                    <div style={{ paddingTop: '0.65rem' }}>
                                        {form.allTags ? form.includeTags = [] : null}
                                        <img
                                            src={plus} alt={t('translation_orgBgvServiceMapping:image_alt_orgBgvServiceMapping.img')}
                                            onClick={hasEditAccess ? form.allTags ? null : () => this.handleShowModal(index, 'include') : null}
                                            className={cx(form.allTags ? styles.imgDisable : styles.imgEnable, "px-2 py-2")}
                                        />
                                        {
                                            form.includeTags.length > 1 ?
                                                <React.Fragment>
                                                    <div className={styles.tableData}>{this.showSingleTag(form.includeTags[0])}</div>&nbsp;
                                                        <div className={styles.tableData}>+{form.includeTags.length - 1}</div>
                                                </React.Fragment>
                                                :
                                                form.includeTags.length === 1 ?
                                                    <span className={styles.tableData}>{this.showSingleTag(form.includeTags[0])}</span>
                                                    : null
                                        }
                                    </div> </div>
                                <div className='col-2 px-0'>
                                    <div style={{ paddingTop: '0.65rem' }}>
                                        <img src={minus} alt={t('translation_orgBgvServiceMapping:image_alt_orgBgvServiceMapping.img')}
                                            onClick={hasEditAccess ? () => this.handleShowModal(index, 'exclude') : null} className={cx('px-2 py-2', styles.imgEnable)} />
                                        {form.excludeTags.length > 1 ?
                                            <React.Fragment><span className={styles.tableData}>{this.showSingleTag(form.excludeTags[0])}</span>&nbsp;
                                        <span className={styles.tableData}>+{form.excludeTags.length - 1}</span></React.Fragment>
                                            :
                                            form.excludeTags.length === 1 ?
                                                <span className={styles.tableData}>{this.showSingleTag(form.excludeTags[0])}</span>
                                                : null
                                        }
                                    </div> </div>
                            </div>)
                    );
                }
                else if (form.type === 'ADDRESS') {
                    return (
                        addressVerification = addressVerification.concat(
                            <div key={index} className='row mt-2 mb-3'>
                                <div className="col-5 pr-0 ml-3 d-flex flex-row">
                                    <img className={cx(styles.serviceIcon, 'mt-2')} alt={t('translation_orgBgvServiceMapping:image_alt_orgBgvServiceMapping.IdIcon')} src={serviceCards[form.service].icon} />
                                    <div className={cx(styles.PaddingLeft)}>
                                        <div className='d-flex flex-column'><label className={styles.SubHeading}>{serviceCards[form.service].label}</label>
                                            <span className={styles.OptionWithHeading}> {this.checkManualReview(form.service, form)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-2 pl-0'>
                                    <div style={{ paddingLeft: '0rem' }}>
                                        <Checkbox
                                            type="medium"
                                            value={form.allTags}
                                            onChange={() => this.handleSelectAll(index)}
                                            disabled={!hasEditAccess}
                                            checkMarkStyle={styles.checkMarkStyle}
                                        />
                                    </div>
                                </div>
                                <div className='col-2 px-0'>
                                    <div style={{ paddingTop: '0.65rem' }}>
                                        {form.allTags ? form.includeTags = [] : null}
                                        <img
                                            src={plus} alt={t('translation_orgBgvServiceMapping:image_alt_orgBgvServiceMapping.img')}
                                            onClick={hasEditAccess ? form.allTags ? null : () => this.handleShowModal(index, 'include') : null}
                                            className={cx(form.allTags ? styles.imgDisable : styles.imgEnable, "px-2 py-2")}
                                        />
                                        {
                                            form.includeTags.length > 1 ?
                                                <React.Fragment>
                                                    <div className={styles.tableData}>{this.showSingleTag(form.includeTags[0])}</div>&nbsp;
                                                <div className={styles.tableData}>+{form.includeTags.length - 1}</div>
                                                </React.Fragment>
                                                :
                                                form.includeTags.length === 1 ?
                                                    <span className={styles.tableData}>{this.showSingleTag(form.includeTags[0])}</span>
                                                    : null
                                        }
                                    </div> </div>
                                <div className='col-2 px-0'>
                                    <div style={{ paddingTop: '0.65rem' }}>
                                        <img src={minus} alt={t('translation_orgBgvServiceMapping:image_alt_orgBgvServiceMapping.img')}
                                            onClick={hasEditAccess ? () => this.handleShowModal(index, 'exclude') : null} className={cx('px-2 py-2', styles.imgEnable)} />
                                        {form.excludeTags.length > 1 ?
                                            <React.Fragment><span className={styles.tableData}>{this.showSingleTag(form.excludeTags[0])}</span>&nbsp;
                                <span className={styles.tableData}>+{form.excludeTags.length - 1}</span></React.Fragment>
                                            :
                                            form.excludeTags.length === 1 ?
                                                <span className={styles.tableData}>{this.showSingleTag(form.excludeTags[0])}</span>
                                                : null
                                        }
                                    </div> </div>
                            </div>)
                    )
                }
                else if (form.type === 'LEGAL') {
                    return (
                        legalVerification = legalVerification.concat(
                            <div key={index} className='row mt-2 mb-3'>
                                <div className="col-5 pr-0 ml-3 d-flex flex-row">
                                    <img className={cx(styles.serviceIcon, 'mt-2')} alt={t('translation_orgBgvServiceMapping:image_alt_orgBgvServiceMapping.IdIcon')} src={serviceCards[form.service].icon} />
                                    {form.service === 'CRC_CURRENT_ADDRESS' || form.service === 'CRC_PERMANENT_ADDRESS' ?
                                        <div className={cx(styles.PaddingLeft, 'd-flex flex-column')}>
                                            <div><label className={styles.SubHeading}>{t('translation_orgBgvServiceMapping:label.l6')}</label>
                                                <span className={styles.smallLabel}> - {serviceCards[form.service].label}</span>
                                                <span className={styles.OptionWithHeading}> {this.checkManualReview(form.service, form)} {t('translation_orgBgvServiceMapping:label.l8')}
                                                </span>
                                            </div>
                                        </div>
                                        :
                                        <div className='d-flex flex-column'>
                                            <span className={styles.Options}>{serviceCards[form.service].label}</span>
                                        </div>}
                                </div>
                                <div className='col-2 pl-0'>
                                    <div style={{ paddingLeft: '0rem' }}>
                                        <Checkbox
                                            type="medium"
                                            value={form.allTags}
                                            onChange={() => this.handleSelectAll(index)}
                                            disabled={!hasEditAccess}
                                            checkMarkStyle={styles.checkMarkStyle}
                                        />
                                    </div>
                                </div>
                                <div className='col-2 px-0'>
                                    <div style={{ paddingTop: '0.65rem' }}>
                                        {form.allTags ? form.includeTags = [] : null}
                                        <img
                                            src={plus} alt={t('translation_orgBgvServiceMapping:image_alt_orgBgvServiceMapping.img')}
                                            onClick={hasEditAccess ? form.allTags ? null : () => this.handleShowModal(index, 'include') : null}
                                            className={cx(form.allTags ? styles.imgDisable : styles.imgEnable, "px-2 py-2")}
                                        />
                                        {
                                            form.includeTags.length > 1 ?
                                                <React.Fragment>
                                                    <div className={styles.tableData}>{this.showSingleTag(form.includeTags[0])}</div>&nbsp;
                                                        <div className={styles.tableData}>+{form.includeTags.length - 1}</div>
                                                </React.Fragment>
                                                :
                                                form.includeTags.length === 1 ?
                                                    <span className={styles.tableData}>{this.showSingleTag(form.includeTags[0])}</span>
                                                    : null
                                        }
                                    </div> </div>
                                <div className='col-2 px-0'>
                                    <div style={{ paddingTop: '0.65rem' }}>
                                        <img src={minus} alt={t('translation_orgBgvServiceMapping:image_alt_orgBgvServiceMapping.img')}
                                            onClick={hasEditAccess ? () => this.handleShowModal(index, 'exclude') : null} className={cx('px-2 py-2', styles.imgEnable)} />
                                        {form.excludeTags.length > 1 ?
                                            <React.Fragment><span className={styles.tableData}>{this.showSingleTag(form.excludeTags[0])}</span>&nbsp;
                                        <span className={styles.tableData}>+{form.excludeTags.length - 1}</span></React.Fragment>
                                            :
                                            form.excludeTags.length === 1 ?
                                                <span className={styles.tableData}>{this.showSingleTag(form.excludeTags[0])}</span>
                                                : null
                                        }
                                    </div>
                                </div>
                            </div>)
                    );
                }
                else if (form.type === 'CAREER') {
                    return (
                        careerVerification = careerVerification.concat(
                            <div key={index} className='row mt-2 mb-3'>
                                <div className="col-5 pr-0 ml-3 d-flex flex-row">
                                    <img className={cx(styles.serviceIcon, 'mt-2')} alt={t('translation_orgBgvServiceMapping:image_alt_orgBgvServiceMapping.IdIcon')} src={serviceCards[form.service].icon} />
                                    <label className={styles.Options}>{serviceCards[form.service].label} </label>
                                </div>
                                <div className='col-2 pl-0'>
                                    <div style={{ paddingLeft: '0rem' }}>
                                        <Checkbox
                                            type="medium"
                                            value={form.allTags}
                                            onChange={() => this.handleSelectAll(index)}
                                            disabled={!hasEditAccess}
                                            checkMarkStyle={styles.checkMarkStyle}
                                        />
                                    </div>
                                </div>
                                <div className='col-2 px-0'>
                                    <div style={{ paddingTop: '0.65rem' }}>
                                        {form.allTags ? form.includeTags = [] : null}
                                        <img
                                            src={plus} alt={t('translation_orgBgvServiceMapping:image_alt_orgBgvServiceMapping.img')}
                                            onClick={hasEditAccess ? form.allTags ? null : () => this.handleShowModal(index, 'include') : null}
                                            className={cx(form.allTags ? styles.imgDisable : styles.imgEnable, "px-2 py-2")}
                                        />
                                        {
                                            form.includeTags.length > 1 ?
                                                <React.Fragment>
                                                    <div className={styles.tableData}>{this.showSingleTag(form.includeTags[0])}</div>&nbsp;
                                                        <div className={styles.tableData}>+{form.includeTags.length - 1}</div>
                                                </React.Fragment>
                                                :
                                                form.includeTags.length === 1 ?
                                                    <span className={styles.tableData}>{this.showSingleTag(form.includeTags[0])}</span>
                                                    : null
                                        }
                                    </div> </div>
                                <div className='col-2 px-0'>
                                    <div style={{ paddingTop: '0.65rem' }}>
                                        <img src={minus} alt={t('translation_orgBgvServiceMapping:image_alt_orgBgvServiceMapping.img')}
                                            onClick={hasEditAccess ? () => this.handleShowModal(index, 'exclude') : null} className={cx('px-2 py-2', styles.imgEnable)} />
                                        {form.excludeTags.length > 1 ?
                                            <React.Fragment><span className={styles.tableData}>{this.showSingleTag(form.excludeTags[0])}</span>&nbsp;
                                        <span className={styles.tableData}>+{form.excludeTags.length - 1}</span></React.Fragment>
                                            :
                                            form.excludeTags.length === 1 ?
                                                <span className={styles.tableData}>{this.showSingleTag(form.excludeTags[0])}</span>
                                                : null
                                        }
                                    </div> </div>
                            </div>)
                    );
                }
                else if (form.type === 'REFERENCE') {
                    return (
                        referenceVerification = referenceVerification.concat(
                            <div key={index} className='row mt-2 mb-3'>
                                <div className="col-5 pr-0 ml-3 d-flex flex-row">
                                    <img className={cx(styles.serviceIcon, 'mt-2')} alt={t('translation_orgBgvServiceMapping:image_alt_orgBgvServiceMapping.IdIcon')} src={serviceCards[form.service].icon} />
                                    <label className={styles.Options}>{serviceCards[form.service].label} </label>
                                </div>
                                <div className='col-2 pl-0'>
                                    <div style={{ paddingLeft: '0rem' }}>
                                        <Checkbox
                                            type="medium"
                                            value={form.allTags}
                                            onChange={() => this.handleSelectAll(index)}
                                            disabled={!hasEditAccess}
                                            checkMarkStyle={styles.checkMarkStyle}
                                        />
                                    </div>
                                </div>
                                <div className='col-2 px-0'>
                                    <div style={{ paddingTop: '0.65rem' }}>
                                        {form.allTags ? form.includeTags = [] : null}
                                        <img
                                            src={plus} alt={t('translation_orgBgvServiceMapping:image_alt_orgBgvServiceMapping.img')}
                                            onClick={hasEditAccess ? form.allTags ? null : () => this.handleShowModal(index, 'include') : null}
                                            className={cx(form.allTags ? styles.imgDisable : styles.imgEnable, "px-2 py-2")}
                                        />
                                        {
                                            form.includeTags.length > 1 ?
                                                <React.Fragment>
                                                    <div className={styles.tableData}>{this.showSingleTag(form.includeTags[0])}</div>&nbsp;
                                                        <div className={styles.tableData}>+{form.includeTags.length - 1}</div>
                                                </React.Fragment>
                                                :
                                                form.includeTags.length === 1 ?
                                                    <span className={styles.tableData}>{this.showSingleTag(form.includeTags[0])}</span>
                                                    : null
                                        }
                                    </div> </div>
                                <div className='col-2 px-0'>
                                    <div style={{ paddingTop: '0.65rem' }}>
                                        <img src={minus} alt={t('translation_orgBgvServiceMapping:image_alt_orgBgvServiceMapping.img')}
                                            onClick={hasEditAccess ? () => this.handleShowModal(index, 'exclude') : null} className={cx('px-2 py-2', styles.imgEnable)} />
                                        {form.excludeTags.length > 1 ?
                                            <React.Fragment><span className={styles.tableData}>{this.showSingleTag(form.excludeTags[0])}</span>&nbsp;
                                        <span className={styles.tableData}>+{form.excludeTags.length - 1}</span></React.Fragment>
                                            :
                                            form.excludeTags.length === 1 ?
                                                <span className={styles.tableData}>{this.showSingleTag(form.excludeTags[0])}</span>
                                                : null
                                        }
                                    </div> </div>
                            </div>)
                    );
                }
                else if (form.type === 'HEALTH') {
                    return (
                        healthVerification = healthVerification.concat(
                            <div key={index} className='row mt-2 mb-3'>
                                <div className="col-5 pr-0 ml-3 d-flex flex-row">
                                    <img className={cx(styles.serviceIcon, 'mt-2')} alt={t('translation_orgBgvServiceMapping:image_alt_orgBgvServiceMapping.IdIcon')} src={serviceCards[form.service].icon} />
                                    <label className={styles.Options}>{serviceCards[form.service].label} </label>
                                </div>
                                <div className='col-2 pl-0'>
                                    <div style={{ paddingLeft: '0rem' }}>
                                        <Checkbox
                                            type="medium"
                                            value={form.allTags}
                                            onChange={() => this.handleSelectAll(index)}
                                            disabled={!hasEditAccess}
                                            checkMarkStyle={styles.checkMarkStyle}
                                        />
                                    </div>
                                </div>
                                <div className='col-2 px-0'>
                                    <div style={{ paddingTop: '0.65rem' }}>
                                        {form.allTags ? form.includeTags = [] : null}
                                        <img
                                            src={plus} alt={t('translation_orgBgvServiceMapping:image_alt_orgBgvServiceMapping.img')}
                                            onClick={hasEditAccess ? form.allTags ? null : () => this.handleShowModal(index, 'include') : null}
                                            className={cx(form.allTags ? styles.imgDisable : styles.imgEnable, "px-2 py-2")}
                                        />
                                        {
                                            form.includeTags.length > 1 ?
                                                <React.Fragment>
                                                    <div className={styles.tableData}>{this.showSingleTag(form.includeTags[0])}</div>&nbsp;
                                                        <div className={styles.tableData}>+{form.includeTags.length - 1}</div>
                                                </React.Fragment>
                                                :
                                                form.includeTags.length === 1 ?
                                                    <span className={styles.tableData}>{this.showSingleTag(form.includeTags[0])}</span>
                                                    : null
                                        }
                                    </div> </div>
                                <div className='col-2 px-0'>
                                    <div style={{ paddingTop: '0.65rem' }}>
                                        <img src={minus} alt={t('translation_orgBgvServiceMapping:image_alt_orgBgvServiceMapping.img')}
                                            onClick={hasEditAccess ? () => this.handleShowModal(index, 'exclude') : null} className={cx('px-2 py-2', styles.imgEnable)} />
                                        {form.excludeTags.length > 1 ?
                                            <React.Fragment><span className={styles.tableData}>{this.showSingleTag(form.excludeTags[0])}</span>&nbsp;
                                        <span className={styles.tableData}>+{form.excludeTags.length - 1}</span></React.Fragment>
                                            :
                                            form.excludeTags.length === 1 ?
                                                <span className={styles.tableData}>{this.showSingleTag(form.excludeTags[0])}</span>
                                                : null
                                        }
                                    </div> </div>
                            </div>)
                    );
                }
                else return null;
            })
        }

        return (
            <React.Fragment>
                {
                    (this.props.postDataState === 'SUCCESS' || this.props.putDataState === 'SUCCESS') ?
                        <Redirect to={url} /> : null
                }
                {this.state.checkAccess ?
                    <HasAccess
                        permission={["BGV_CONFIG:CREATE"]}
                        orgId={orgId}
                        yes={() => this.handleSetEditAccess()}
                    />
                    : null}

                {this.props.getDataState === 'LOADING' ?
                    <div className={styles.alignCenter} style={{ marginTop: '3.2rem' }}>
                        <Loader />
                    </div> :

                    <div className={styles.alignCenter}>
                        <ArrowLink
                            label={_.isEmpty(this.props.orgData) ? " " : this.props.orgData.name.toLowerCase()}
                            url={`/customer-mgmt/org/` + orgId + `/profile`}
                        />
                        <div className="d-flex">
                            <CardHeader label={t('translation_orgBgvServiceMapping:cardHeader')} iconSrc={bgv_service} />
                            <div className={cx("ml-auto mr-3",styles.paddingY)}>
                                {showVendorDropDown && <VendorDropdown type="primary"/>}
                            </div>
                            <div className={cx(styles.paddingY)}>
                                {showVendorDropDown && <VendorDropdown type="secondary"/>}
                            </div>
                        </div>
                        

                        <div className={cx(styles.CardLayout, 'card')}>
                            {NotificationPan}
                            <div className={cx('card-body', styles.CardPadding)} disabled={!_.isEmpty(params.vendorId)}>
                                <div className="row">
                                    <div className={cx('col-5 row', styles.Heading)}><label className={styles.HeadingVerify}>{t('translation_orgBgvServiceMapping:th.t1')}</label></div>
                                    <label className={cx('col-2 row justify-content-center', styles.Heading)}>{t('translation_orgBgvServiceMapping:th.t2')}</label>
                                    <label className={cx('col-3 pr-5 row justify-content-end', styles.Heading)}>{t('translation_orgBgvServiceMapping:th.t3')}</label>
                                    <label className={cx('col-3 row justify-content-center', styles.Heading)}>{t('translation_orgBgvServiceMapping:th.t4')}</label>
                                </div>
                                <hr className={cx(styles.horizonalLineTop)} />

                                {idCards.length !== 0 ?
                                    <label className={cx('ml-3 mb-0', styles.Label)}>{t('translation_orgBgvServiceMapping:label.l2')}</label> : null}
                                <div className='flex-column mt-1'>
                                    {idCards}
                                </div>

                                {idCards.length !== 0 ? <hr className={cx(styles.horizonalLineTop, 'my-4')} /> : null}

                                {addressVerification.length !== 0 ?
                                    <label className={cx('ml-3 mb-0', styles.Label)}>{t('translation_orgBgvServiceMapping:label.l7')}</label> : null}
                                <div className='flex-column mt-1'>
                                    {addressVerification}
                                </div>

                                {addressVerification.length !== 0 ? <hr className={cx(styles.horizonalLineTop, 'my-4')} /> : null}

                                {legalVerification.length !== 0 ?
                                    <label className={cx('ml-3 mb-0', styles.Label)}>{t('translation_orgBgvServiceMapping:label.l3')}</label> : null}
                                <div className='flex-column mt-1'>
                                    {legalVerification}
                                </div>

                                {legalVerification.length !== 0 ? <hr className={cx(styles.horizonalLineTop, 'my-4')} /> : null}

                                {careerVerification.length !== 0 ?
                                    <label className={cx('ml-3 mb-0', styles.Label)}>{t('translation_orgBgvServiceMapping:label.l4')}</label> : null}
                                <div className='flex-column mt-1'>
                                    {careerVerification}
                                </div>

                                {careerVerification.length !== 0 ? <hr className={cx(styles.horizonalLineTop, 'my-4')} /> : null}

                                {healthVerification.length !== 0 || referenceVerification.length !== 0 ?
                                    <label className={cx('ml-3 mb-0', styles.Label)}>{t('translation_orgBgvServiceMapping:label.l5')}</label> : null}
                                <div className='flex-column mt-1'>
                                    {healthVerification}
                                </div>
                                <div className='flex-column mt-1'>
                                    {referenceVerification}
                                </div>

                                {healthVerification.length !== 0 || referenceVerification.length !== 0 ? <hr className={cx(styles.horizonalLineTop, 'my-4')} /> : null}
                                {/* <thead>
                                            <tr className={styles.tableHead}>
                                                <th className={cx(styles.tableHeadContent30, "pl-5")}>{t('translation_orgBgvServiceMapping:th.t1')}</th>
                                                <th className={styles.tableHeadContent10}>{t('translation_orgBgvServiceMapping:th.t2')}</th>
                                                <th className={styles.tableHeadContent30}>{t('translation_orgBgvServiceMapping:th.t3')}</th>
                                                <th className={styles.tableHeadContent30}>{t('translation_orgBgvServiceMapping:th.t4')}</th>
                                            </tr>
                                        </thead>
                                         {this.state.formData ? this.state.formData.map((form, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    <tbody className="pt-2">
                                                        <tr className={styles.tableBodyContent} >
                                                            <td className={cx("pt-4", styles.tableHeadContent30)}>
                                                                <img alt={t('translation_orgBgvServiceMapping:image_alt_orgBgvServiceMapping.IdIcon')} src={serviceCards[form.service].icon} className={styles.Icon} />
                                                                {form.type === 'LEGAL' || form.type === 'ADDRESS_VERIFICATION' ?
                                                                    <span className={cx('d-flex flex-column  pl-5')}>
                                                                        <label className={styles.OptionWithHeading}>{form.type.replace("_", " ").toLowerCase()}</label>
                                                                        <span className={styles.SubHeading}>{serviceCards[form.service].label}</span>
                                                                    </span> :
                                                                    <label className={cx(styles.Options, "pl-5 mt-1")}>{serviceCards[form.service].label} </label>}

                                                            </td>
                                                            <td style={{ paddingLeft: '0.5rem' }}><label className={styles.container}>

                                                                <input type="checkbox"
                                                                    checked={form.allTags}
                                                                    onChange={() => this.handleSelectAll(index)}
                                                                    disabled={!this.state.hasEditAccess}

                                                                />

                                                                <span className={styles.checkmark}></span>
                                                            </label>
                                                            </td>
                                                            <td style={{ paddingLeft: '2rem' }}>
                                                                {form.allTags ? form.includeTags = [] : null}
                                                                <img
                                                                    src={plus} alt={t('translation_orgBgvServiceMapping:image_alt_orgBgvServiceMapping.img')}
                                                                    onClick={this.state.hasEditAccess ? form.allTags ? null : () => this.handleShowModal(index, 'include') : null}
                                                                    className={cx(form.allTags ? styles.imgDisable : styles.imgEnable, "px-2 py-2")}
                                                                />
                                                                {
                                                                    form.includeTags.length > 1 ?
                                                                        <React.Fragment>
                                                                            <div className={styles.tableData}>{this.showSingleTag(form.includeTags[0])}</div>&nbsp;
                                                                            <div className={styles.tableData}>+{form.includeTags.length - 1}</div>
                                                                        </React.Fragment>
                                                                        :
                                                                        form.includeTags.length === 1 ?
                                                                            <span className={styles.tableData}>{this.showSingleTag(form.includeTags[0])}</span>
                                                                            : null
                                                                }
                                                            </td>
                                                            <td style={{ paddingLeft: '3.5rem' }}>
                                                                <img src={minus} alt={t('translation_orgBgvServiceMapping:image_alt_orgBgvServiceMapping.img')} 
                                                                onClick={this.state.hasEditAccess ? () => this.handleShowModal(index, 'exclude') : null} className={cx('px-2 py-2', styles.imgEnable)} />
                                                                {form.excludeTags.length > 1 ?
                                                                    <React.Fragment><span className={styles.tableData}>{this.showSingleTag(form.excludeTags[0])}</span>&nbsp;
                                                                        <span className={styles.tableData}>+{form.excludeTags.length - 1}</span></React.Fragment>
                                                                    :
                                                                    form.excludeTags.length === 1 ?
                                                                        <span className={styles.tableData}>{this.showSingleTag(form.excludeTags[0])}</span>
                                                                        : null
                                                                }
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </React.Fragment>
                                            )
                                        }) : null} */}
                                <Button
                                    label={t('translation_orgBgvServiceMapping:button_orgBgvServiceMapping.next')}
                                    className="float-right mt-2"
                                    clickHandler={() => this.handleFormSubmit()} />
                            </div>


                        </div>
                    </div>}
                {
                    this.state.showModal ?
                        <TagSearchModal
                            showModal={this.state.showModal}
                            tagType={this.state.selectTagType + " tags"}
                            tags={this.showTags(this.state.selectedRow, this.state.selectTagType)}
                            selectTags={(value) => this.handleInputChange(value)}
                            disableTags={this.hideTags(this.state.selectedRow, this.state.selectTagType)}
                            closeModal={this.handleCloseModal}
                            sharedTagQuery={location.search}
                            orgId={params.superClientId || params.clientId ? params.clientId
                                    : params.subVendorId ? params.vendorId
                                        : params.vendorId ? orgId
                                            : orgId}
                            vendorId={params.superClientId || params.clientId ? orgId
                                : params.subVendorId ? params.subVendorId
                                    : params.vendorId ? params.vendorId
                                        : null}
                            clientId={params.superClientId ? params.superClientId
                                : params.clientId ? params.clientId
                                    : params.subVendorId || params.vendorId ? orgId
                                        : null}
                        /> : null
                }

            </React.Fragment >
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        initState: () => dispatch(actions.initState()),
        onGetData: (orgId, from, to, viaUrl) => dispatch(actions.getConfigTagMapList(orgId, from, to, viaUrl)),
        onPostData: (orgId, from, to, data, viaUrl) => dispatch(actions.PostConfigTagMapList(orgId, from, to, data, viaUrl)),
        onPutData: (orgId, data) => dispatch(actions.PutConfigTagMapList(orgId, data)),
        onPostTagInfoData: (data, isShared) => dispatch(actions.getTagName(data, isShared)),
        getOrgData: (orgId) => dispatch(actionsOrgMgmt.getDataById(orgId)),
        // getEnabledPlatformServices: (orgId) => dispatch(actions.getEnabledPlatformServices(orgId)),
        // onPostEnabledServices: (data, Id) => dispatch(actions.postEnabledPlatformServices(data, Id)),
        // onPutEnabledServices: (data, Id) => dispatch(actions.putEnabledPlatformServices(data, Id))
    };
};

const mapStateToProps = state => {
    return {
        getDataState: state.orgMgmt.orgBgvConfig.tagMapService.getConfigTagMapListState,
        tagMapList: state.orgMgmt.orgBgvConfig.tagMapService.TagMapList,
        TagInfoData: state.orgMgmt.orgBgvConfig.tagMapService.TagInfoData,
        postTagInfoState: state.orgMgmt.orgBgvConfig.tagMapService.postTagInfoState,
        postDataState: state.orgMgmt.orgBgvConfig.tagMapService.postConfigTagMapListState,
        putDataState: state.orgMgmt.orgBgvConfig.tagMapService.putConfigTagMapListState,
        servicesData: state.orgMgmt.orgBgvConfig.configStatus.servicesData,
        error: state.orgMgmt.orgBgvConfig.tagMapService.error,
        rightnavOrgId: state.orgMgmt.staticData.rightnavOrgId,
        // getEnabledPlatformServicesState: state.orgMgmt.orgBgvConfig.tagMapService.getEnabledPlatformServicesState,
        // EnabledPlatformServices: state.orgMgmt.orgBgvConfig.tagMapService.EnabledPlatformServices,
        // enabledID: state.orgMgmt.orgBgvConfig.tagMapService.enabledID,
        orgData: state.orgMgmt.staticData.orgData,
        enabledServices: state.orgMgmt.staticData.servicesEnabled,
    };
};

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(ServiceMapping)));
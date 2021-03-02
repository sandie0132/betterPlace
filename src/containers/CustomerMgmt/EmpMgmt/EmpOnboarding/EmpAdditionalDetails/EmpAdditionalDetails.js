import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import _ from 'lodash';
import cx from "classnames";
import ScrollableAnchor, { configureAnchors } from 'react-scrollable-anchor';

import * as onboardActions from '../Store/action';

import Loader from '../../../../../components/Organism/Loader/Loader';
import Spinnerload from '../../../../../components/Atom/Spinner/Spinner';
import Prompt from '../../../../../components/Organism/Prompt/Prompt';
import CancelButton from '../../../../../components/Molecule/CancelButton/CancelButton';
import { Button } from 'react-crux';
import WarningPopUp from '../../../../../components/Molecule/WarningPopUp/WarningPopUp';
import Notification from '../../../../../components/Molecule/Notification/Notification';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import CardHeader from '../../../../../components/Atom/PageTitle/PageTitle';
import ArrowLink from '../../../../../components/Atom/ArrowLink/ArrowLink';

import styles from "./EmpAdditionalDetails.module.scss";
import warn from '../../../../../assets/icons/warning.svg';
import inprogress from "../../../../../assets/icons/warningIcon.svg"
import error from "../../../../../assets/icons/bigWarningIcon.svg"
import container from '../../../../../assets/icons/additionalData.svg';

import { checkRequiredFields } from './EmpAdditionalDetailsUtility';
import { getSubSectionProgress } from '../Store/utility';

import FormFieldSearch from './FormFieldSearch/FormFieldSearch';
import EmpContactDetails from "./EmpContactDetails/EmpContactDetails";
import EmpAddress from "./EmpAddress/EmpAddress";
import EmpDocuments from "./EmpDocuments/EmpDocuments";
import EmpFamilyRef from './EmpFamilyRef/EmpFamilyRef';
import EmpEducation from './EmpEducation/EmpEducation';
import EmpEmployment from './EmpEmployment/EmpEmployment';
import EmpHealth from './EmpHealth/EmpHealth';
import EmpSkillPrefLanguage from './EmpSkillPrefLangugage/EmpSkillPrefLanguage';
import EmpSocial from './EmpSocial/EmpSocial';
import EmpBankDetails from './EmpBankDetails/EmpBankDetails';
import EmpOtherDetails from './EmpOtherDetails/EmpOtherDetails';

const defaultErrorMessage = 'unable to save! form validation(s) failed. please correct and retry.'

class EmpAdditionalDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formData: {},
            sectionProgress: {},
            errors: {},
            isEdited: false,
            allowCancel: false,
            isRequiredFieldsFilled: false,
            showNotification: false,
            showCancelPopUp: false,

        };
        this.myInput = React.createRef()
        this._isMounted = false;
    }

    componentDidMount() {
        configureAnchors({ offset: -310, scrollDuration: 20, keepLastAnchorHash: false })

        this._isMounted = true;
        const { match } = this.props;
        const orgId = match.params.uuid;
        const empId = match.params.empId;

        if (_.isEmpty(this.props.empData)) {
            this.props.onGetData(orgId, empId);
        }
        else {
            this.setState({
                formData: this.props.empData
            })
        }

        this.handleResize();

        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    handleResize = () => {
        if(!_.isEmpty(this.myInput)){
            if(!_.isEmpty(this.myInput.current)){
                let windowSize = this.myInput.current.offsetWidth
                return windowSize;
            }
            
        }else return 0
        
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.getDataState !== this.props.getDataState) {
            if (this.props.getDataState === 'SUCCESS') {
                this.setState({
                    formData: this.props.empData
                })
            }
        }

        if (prevProps.putDataState !== this.props.putDataState) {
            if (this.props.putDataState === 'SUCCESS') {
                this.setState({
                    formData: this.props.empData,
                    showNotification: true,
                    isEdited: false,
                    allowCancel: false,
                    isRequiredFieldsFilled: true,
                    errors: {}
                });
                setTimeout(() => {
                    if (this._isMounted) {
                        this.setState({ showNotification: false });
                    }
                }, 5000);
            }
            if (this.props.putDataState === "ERROR") {
                this.setState({
                    showNotification: true,
                    isEdited: false,
                    allowCancel: true,
                    isRequiredFieldsFilled: true,
                    errors: {}
                });
            }
        }

        if (!_.isEqual(prevState.formData, this.state.formData)) {
            const updatedSectionProgress = getSubSectionProgress('additionalDetails', this.state.formData);
            this.setState({
                sectionProgress: updatedSectionProgress
            })
        }

        if (!_.isEqual(prevState.sectionProgress, this.state.sectionProgress)) {
            this.props.onUpdateSubSectionProgress(this.state.sectionProgress);
        }

        if (!_.isEqual(prevProps.sectionStatus, this.props.sectionStatus)) {
            if (!this.state.isEdited && this.props.putDataState === 'ERROR') {
                this.setState({
                    sectionProgress: this.props.sectionStatus['subSectionStatus']
                })
            }
        }

    }

    handleGetSectionData = (sectionName) => {
        const formData = _.cloneDeep(this.state.formData);
        let data = {};
        switch (sectionName) {
            case 'contactDetails':
                data = formData['contacts']
                break;
            case 'addresses':
                data = {
                    addresses: formData['addresses'],
                    isCurrAndPerAddrSame: formData['isCurrAndPerAddrSame']
                }
                break;
            case 'governmentIds':
                data = formData['documents']
                break;
            case 'familyRefs':
                data = formData['familyRefs']
                break;
            case 'educationDetails':
                data = formData['educationDetails']
                break;
            case 'empHistory':
                data = formData['workDetails']
                break;
            case 'healthDetails':
                data = formData['healthDetails']
                break;
            case 'skillPref':
                data = {
                    skills: formData['skills'],
                    preferences: formData['preferences'],
                    languages: formData['languages']
                }
                break;
            case 'social':
                data = formData['socialNetworks']
                break;
            case 'bankDetails':
                data = formData['bankDetails']
                break;
            case 'otherDetails':
                data = {
                    fatherName: formData['fatherName'],
                    motherName: formData['motherName'],
                    nationality: formData['nationality'],
                    religion: formData['religion'],
                    maritalStatus: formData['maritalStatus'],
                }
                break;
            default:
                break;
        }
        return data;
    }

    handleStoreDataInState = (sectionName, data) => {
        let updatedFormData = _.cloneDeep(this.state.formData);
        switch (sectionName) {
            case 'contactDetails':
                updatedFormData['contacts'] = data
                break;
            case 'addresses':
                updatedFormData['addresses'] = data['addresses']
                updatedFormData['isCurrAndPerAddrSame'] = data['isCurrAndPerAddrSame']
                break;
            case 'governmentIds':
                updatedFormData['documents'] = data
                break;
            case 'familyRefs':
                updatedFormData['familyRefs'] = data
                break;
            case 'educationDetails':
                updatedFormData['educationDetails'] = data
                break;
            case 'empHistory':
                updatedFormData['workDetails'] = data
                break;
            case 'healthDetails':
                updatedFormData['healthDetails'] = data
                break;
            case 'skillPref':
                updatedFormData['skills'] = data['skills'];
                updatedFormData['preferences'] = data['preferences'];
                updatedFormData['languages'] = data['languages'];
                break;
            case 'social':
                updatedFormData['socialNetworks'] = data
                break;
            case 'bankDetails':
                updatedFormData['bankDetails'] = data
                break;
            case 'otherDetails':
                updatedFormData['fatherName'] = data['fatherName'];
                updatedFormData['motherName'] = data['motherName'];
                updatedFormData['nationality'] = data['nationality'];
                updatedFormData['religion'] = data['religion'];
                updatedFormData['maritalStatus'] = data['maritalStatus'];
                break;
            default:
                break;
        }
        this.setState({
            formData: updatedFormData,
            isEdited: true,
            allowCancel: true
        })
    }

    handleStoreErrorInState = (sectionName, data) => {
        let updatedErrors = _.cloneDeep(this.state.errors);
        updatedErrors[sectionName] = data
        this.setState({
            errors: updatedErrors
        })
    }

    handleSave = () => {
        const { updatedSectionProgress, updatedErrors } = checkRequiredFields(
            this.state.formData, this.state.sectionProgress, this.state.errors
        )
        if (_.isEmpty(updatedErrors)) {
            this.handleFormSubmit();
        } else {
            this.setState({
                sectionProgress: updatedSectionProgress,
                errors: updatedErrors,
                isEdited: false,
                isRequiredFieldsFilled: false,
                showNotification: true
            })
        }
    }

    handleFormSubmit = () => {
        const { match } = this.props;
        const orgId = match.params.uuid;
        const empId = match.params.empId;
        this.props.onPutData(orgId, empId, this.state.formData);
    }

    handleShowCancelPopUp = () => {
        this.setState({
            showCancelPopUp: !this.state.showCancelPopUp
        });
    }

    handleCancel = () => {
        this.props.onUpdateSectionStatus();
        this.setState({
            formData: this.props.empData,
            isEdited: false,
            allowCancel: false,
            errors: {},
            isRequiredFieldsFilled: false,
            showNotification: false,
            showCancelPopUp: false
        })
    }


    getIsSectionActive = (sectionHash) => {
        const hashId = this.props.location.hash;
        return hashId === sectionHash;
    }

    getSectionHeading = () => {
        let hashId = this.props.location.hash;
        switch (hashId) {
            case '#contact-details': return 'contact details';
            case '#address': return 'address';
            case '#government-id': return 'government ids';
            case '#family-reference': return 'family & reference';
            case '#education-details': return 'education details';
            case '#employment-history': return 'employment history';
            case '#health': return 'health details';
            case '#skills-pref': return 'skills & preference';
            case '#social': return 'social';
            case '#bank-details': return 'bank details';
            case '#other-details': return 'other details';
            default: return 'loading...';
        }
    }

    getSectionStatus = () => {
        let hashId = this.props.location.hash;
        let status = 'todo';
        let subSectionName = null;
        switch (hashId) {
            case '#contact-details': subSectionName = 'contactDetails'; break;
            case '#address': subSectionName = 'addresses'; break;
            case '#government-id': subSectionName = 'governmentIds'; break;
            case '#family-reference': subSectionName = 'familyRefs'; break;
            case '#education-details': subSectionName = 'educationDetails'; break;
            case '#employment-history': subSectionName = 'empHistory'; break;
            case '#health': subSectionName = 'healthDetails'; break;
            case '#skills-pref': subSectionName = 'skillPref'; break;
            case '#social': subSectionName = 'social'; break;
            case '#bank-details': subSectionName = 'bankDetails'; break;
            case '#other-details': subSectionName = 'otherDetails'; break;
            default:
                break;
        }
        if (!_.isEmpty(this.state.errors[subSectionName])) {
            status = 'error'
        } else if (!_.isEmpty(this.state.sectionProgress[subSectionName])) {
            status = this.state.sectionProgress[subSectionName]['status']
        }
        if (status === "inprogress") {
            return <img src={inprogress} alt="img" style={{ height: '24px' }} />
        } else if (status === "error") return <img src={error} alt="img" style={{ height: '24px' }} />;
    }

    render() {
        const orgId = this.props.match.params.uuid;
        const empId = this.props.match.params.empId ? this.props.match.params.empId : '';
        let empName = !_.isEmpty(this.props.empData) ?
        !_.isEmpty(this.props.empData.firstName) && !_.isEmpty(this.props.empData.lastName) ? this.props.empData.firstName.toLowerCase() + ' ' + this.props.empData.lastName.toLowerCase()
            : !_.isEmpty(this.props.empData.firstName) && _.isEmpty(this.props.empData.lastName) ? this.props.empData.firstName.toLowerCase()
                : 'person' : ''

        return (
            <React.Fragment>
                <Prompt
                    when={this.state.allowCancel}
                    takeActionOnCancel={this.props.onUpdateSectionStatus}
                />
                {
                    this.props.getDataState === "LOADING" ?
                        <div className={cx(styles.alignCenter, scrollStyle.scrollbar, "pt-2")}>
                            <Loader type='onboardForm' />
                        </div>
                        :
                        <React.Fragment>
                            <div className={styles.centerContent} style={{ width: this.handleResize() }} >
                                <div className={styles.fixedHeading} >
                                    <ArrowLink
                                        label={empName + "'s profile"}
                                        url={`/customer-mgmt/org/` + orgId + `/employee/` + empId + `/profile`}
                                    />
                                    <CardHeader label={"additional details"} iconSrc={container} />
                                    <div className={cx(styles.formHeader)}>
                                        <div className={cx(styles.notificationBar, "row mx-0")}>
                                            <div className={cx(styles.timeHeading, "col-8 mx-0 px-0 my-auto")}>
                                                {
                                                    this.state.showNotification && !this.state.isRequiredFieldsFilled ?
                                                        <Notification
                                                            type="warning"
                                                            message={defaultErrorMessage}
                                                        />
                                                        :
                                                        this.props.putDataState === "SUCCESS" && this.state.showNotification ?
                                                            <Notification
                                                                type="success"
                                                                message="employee updated successfully"
                                                            />
                                                            : this.state.showNotification && this.props.putDataState === "ERROR" ?
                                                                <Notification
                                                                    type="warning"
                                                                    message={this.props.error}
                                                                />
                                                                :
                                                                null
                                                }
                                            </div>
                                            <div className="ml-auto d-flex my-auto" style={{ position: "relative" }}>
                                                <CancelButton
                                                    className={styles.cancelButton}
                                                    isDisabled={!this.state.allowCancel}
                                                    clickHandler={this.handleShowCancelPopUp}
                                                />
                                                {
                                                    this.state.showCancelPopUp ?
                                                        <WarningPopUp
                                                            text={'cancel?'}
                                                            para={'Warning: this cannot be undone'}
                                                            confirmText={'yes, cancel'}
                                                            cancelText={'keep'}
                                                            icon={warn}
                                                            warningPopUp={this.handleCancel}
                                                            closePopup={this.handleShowCancelPopUp}
                                                        />
                                                        : null
                                                }
                                                {
                                                    this.props.putDataState === 'LOADING' ?
                                                        <Spinnerload type='loading' />
                                                        :
                                                        <Button
                                                            label={'save'}
                                                            type='save'
                                                            isDisabled={!this.state.isEdited}
                                                            clickHandler={this.handleSave}
                                                        />
                                                }
                                            </div>
                                        </div>
                                        <div className={styles.formPadding}>
                                            <FormFieldSearch />
                                        </div>
                                        <div className={styles.contentHeading}>
                                            <div className={styles.horizontalLine}></div>
                                            <span className={styles.formHeadActive}>{this.getSectionHeading()}</span>
                                            <span className={styles.warningImg}>{this.getSectionStatus()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.FormLayout} >
                                <div className={styles.formScroll} ref={this.myInput}>
                                    <ScrollableAnchor key={"contact-details"} id={"contact-details"}>
                                        <EmpContactDetails
                                            isActive={this.getIsSectionActive("#contact-details")}
                                            onChange={
                                                (data) => this.handleStoreDataInState('contactDetails', data)
                                            }
                                            onError={
                                                (error) => this.handleStoreErrorInState('contactDetails', error)
                                            }
                                            data={this.handleGetSectionData('contactDetails')}
                                            errors={this.state.errors['contactDetails']}
                                            isEdited={this.state.isEdited}
                                            bgvMissingInfo={this.props.missingInfo}
                                        />
                                    </ScrollableAnchor>

                                    <ScrollableAnchor key={"address"} id={"address"}>
                                        <EmpAddress
                                            isActive={this.getIsSectionActive("#address")}
                                            onChange={
                                                (data) => this.handleStoreDataInState('addresses', data)
                                            }
                                            onError={
                                                (error) => this.handleStoreErrorInState('addresses', error)
                                            }
                                            data={this.handleGetSectionData('addresses')}
                                            errors={this.state.errors['addresses']}
                                            isEdited={this.state.isEdited}
                                            empMgmtStaticData={this.props.empMgmtStaticData}
                                            bgvData={this.props.bgvData}
                                            bgvMissingInfo={this.props.missingInfo}
                                        />
                                    </ScrollableAnchor>

                                    <ScrollableAnchor key={"government-id"} id={"government-id"}>
                                        <EmpDocuments
                                            isActive={this.getIsSectionActive("#government-id")}
                                            onChange={
                                                (data) => this.handleStoreDataInState('governmentIds', data)
                                            }
                                            onError={
                                                (error) => this.handleStoreErrorInState('governmentIds', error)
                                            }
                                            data={this.handleGetSectionData('governmentIds')}
                                            errors={this.state.errors['governmentIds']}
                                            isEdited={this.state.isEdited}
                                            bgvData={this.props.bgvData}
                                            bgvMissingInfo={this.props.missingInfo}
                                        />
                                    </ScrollableAnchor>

                                    <ScrollableAnchor key={"family-reference"} id={"family-reference"}>
                                        <EmpFamilyRef
                                            isActive={this.getIsSectionActive("#family-reference")}
                                            onChange={
                                                (data) => this.handleStoreDataInState('familyRefs', data)
                                            }
                                            onError={
                                                (error) => this.handleStoreErrorInState('familyRefs', error)
                                            }
                                            data={this.handleGetSectionData('familyRefs')}
                                            errors={this.state.errors['familyRefs']}
                                            isEdited={this.state.isEdited}
                                            staticData={this.props.empMgmtStaticData}
                                            bgvData={this.props.bgvData}
                                            bgvMissingInfo={this.props.missingInfo}
                                        />
                                    </ScrollableAnchor>

                                    <ScrollableAnchor key={"education-details"} id={"education-details"}>
                                        <div>
                                            <EmpEducation
                                                isActive={this.getIsSectionActive("#education-details")}
                                                onChange={
                                                    (data) => this.handleStoreDataInState('educationDetails', data)
                                                }
                                                onError={
                                                    (error) => this.handleStoreErrorInState('educationDetails', error)
                                                }
                                                data={this.handleGetSectionData('educationDetails')}
                                                errors={this.state.errors['educationDetails']}
                                                isEdited={this.state.isEdited}
                                                staticData={this.props.empMgmtStaticData}
                                                bgvData={this.props.bgvData}
                                                bgvMissingInfo={this.props.missingInfo}
                                            />
                                        </div>
                                    </ScrollableAnchor>

                                    <ScrollableAnchor key={"employment-history"} id={"employment-history"}>
                                        <div>
                                            <EmpEmployment
                                                isActive={this.getIsSectionActive("#employment-history")}
                                                onChange={
                                                    (data) => this.handleStoreDataInState('empHistory', data)
                                                }
                                                onError={
                                                    (error) => this.handleStoreErrorInState('empHistory', error)
                                                }
                                                data={this.handleGetSectionData('empHistory')}
                                                errors={this.state.errors['empHistory']}
                                                isEdited={this.state.isEdited}
                                                staticData={this.props.empMgmtStaticData}
                                                bgvData={this.props.bgvData}
                                                bgvMissingInfo={this.props.missingInfo}
                                            />
                                        </div>
                                    </ScrollableAnchor>

                                    <ScrollableAnchor key={"health"} id={"health"}>
                                        <EmpHealth
                                            isActive={this.getIsSectionActive("#health")}
                                            onChange={
                                                (data) => this.handleStoreDataInState('healthDetails', data)
                                            }
                                            onError={
                                                (error) => this.handleStoreErrorInState('healthDetails', error)
                                            }
                                            data={this.handleGetSectionData('healthDetails')}
                                            errors={this.state.errors['healthDetails']}
                                            isEdited={this.state.isEdited}
                                            bgvData={this.props.bgvData}
                                            bgvMissingInfo={this.props.missingInfo}
                                        />
                                    </ScrollableAnchor>

                                    <ScrollableAnchor key={"skills-pref"} id={"skills-pref"}>
                                        <EmpSkillPrefLanguage
                                            isActive={this.getIsSectionActive("#skills-pref")}
                                            onChange={
                                                (data) => this.handleStoreDataInState('skillPref', data)
                                            }
                                            onError={
                                                (error) => this.handleStoreErrorInState('skillPref', error)
                                            }
                                            data={this.handleGetSectionData('skillPref')}
                                            errors={this.state.errors['skillPref']}
                                            isEdited={this.state.isEdited}
                                            staticData={this.props.empMgmtStaticData}
                                        />
                                    </ScrollableAnchor>

                                    <ScrollableAnchor key={"social"} id={"social"}>
                                        <EmpSocial
                                            isActive={this.getIsSectionActive("#social")}
                                            onChange={
                                                (data) => this.handleStoreDataInState('social', data)
                                            }
                                            onError={
                                                (error) => this.handleStoreErrorInState('social', error)
                                            }
                                            data={this.handleGetSectionData('social')}
                                            errors={this.state.errors['social']}
                                            isEdited={this.state.isEdited}
                                            staticData={this.props.empMgmtStaticData}
                                        />
                                    </ScrollableAnchor>

                                    <ScrollableAnchor key={"bank-details"} id={"bank-details"}>
                                        <EmpBankDetails
                                            isActive={this.getIsSectionActive("#bank-details")}
                                            onChange={
                                                (data) => this.handleStoreDataInState('bankDetails', data)
                                            }
                                            onError={
                                                (error) => this.handleStoreErrorInState('bankDetails', error)
                                            }
                                            data={this.handleGetSectionData('bankDetails')}
                                            errors={this.state.errors['bankDetails']}
                                            isEdited={this.state.isEdited}
                                        />
                                    </ScrollableAnchor>
                                    <ScrollableAnchor key={"other-details"} id={"other-details"}>
                                        <EmpOtherDetails
                                            isActive={this.getIsSectionActive("#other-details")}
                                            onChange={
                                                (data) => this.handleStoreDataInState('otherDetails', data)
                                            }
                                            onError={
                                                (error) => this.handleStoreErrorInState('otherDetails', error)
                                            }
                                            data={this.handleGetSectionData('otherDetails')}
                                            errors={this.state.errors['otherDetails']}
                                            isEdited={this.state.isEdited}
                                            staticData={this.props.empMgmtStaticData}
                                        />
                                    </ScrollableAnchor>
                                </div>
                            </div>

                        </React.Fragment>


                }
            </React.Fragment>
        )
    }
}


const mapStateToProps = state => {
    return {
        empMgmtStaticData: state.empMgmt.staticData.empMgmtStaticData,
        sectionStatus: state.empMgmt.empOnboard.onboard.sectionStatus.additionalDetails,
        empData: state.empMgmt.empOnboard.onboard.empData,
        error: state.empMgmt.empOnboard.onboard.error,
        getDataState: state.empMgmt.empOnboard.onboard.getEmpDataState,
        putDataState: state.empMgmt.empOnboard.onboard.putEmpDataState,
        bgvData: state.empMgmt.empOnboard.onboard.bgvData,
        bgvDataState: state.empMgmt.empOnboard.onboard.getBgvDataState,
        missingInfo: state.empMgmt.empOnboard.onboard.empMissingInfo
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onGetData: (orgId, empId) => dispatch(onboardActions.getEmpData(orgId, empId)),
        onPutData: (orgId, empId, data) => dispatch(onboardActions.putEmpData(orgId, empId, data)),
        onUpdateSectionStatus: () => dispatch(onboardActions.updateSectionStatus()),
        onUpdateSubSectionProgress: (subsectionData) => dispatch(onboardActions.updateSubSectionProgress('additionalDetails', subsectionData))
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EmpAdditionalDetails));
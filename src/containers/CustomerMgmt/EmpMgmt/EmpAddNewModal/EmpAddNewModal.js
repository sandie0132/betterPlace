import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './EmpAddNewModal.module.scss';
import Modal from '../../../../components/Atom/Modal/Modal';
import closePage from '../../../../assets/icons/closePage.svg';
import aadhaarCard from '../../../../assets/icons/aadhaarCard.svg';
import _ from 'lodash';
import { Button } from 'react-crux';
import Loader from '../../../../components/Organism/Loader/Loader';
import panCard from '../../../../assets/icons/panCard.svg';
import voterCard from '../../../../assets/icons/voterCard.svg';
import idCard from '../../../../assets/icons/empOnboard.svg';
// import plusSign from '../../../../assets/icons/plusSign.svg';
import dropdownIcon from '../../../../assets/icons/dropdownArrow.svg';
import dlCard from '../../../../assets/icons/drivinglicenseCard.svg';
import rcCard from '../../../../assets/icons/rcUpperCard.svg';
import mobileNoCard from '../../../../assets/icons/mobileNoCard.svg';
import * as actions from './Store/action';
import { withRouter } from "react-router";
import cx from 'classnames';
import HasAccess from '../../../../services/HasAccess/HasAccess';
import { withTranslation } from 'react-i18next';
import * as entityActions from '../EmpTermination/Store/action';
import initiateIcon from "../../../../assets/icons/initiate.svg";
import downloadExcel from "../../../../assets/icons/greyDownload.svg";
import emptyPage from '../../../../assets/icons/emptyVendorState.svg';

class EmpOnboard extends Component {
    state = {
        idValue: '',
        idState: '',
        idImage: idCard,
        showModal: false,
        enableNext: false,
        focus: false,
        showDropdown: false,
        showEmptyState: false
    }

    componentDidMount() {
        let idImage = idCard;
        if (this.props.idImage) {
            idImage = this.props.idImage
        }
        this.setState({
            idImage: idImage,
            showModal: this.props.showModal,
            idValue: this.props.idNo,
            idState: this.props.idState,
            enableNext: true
        })
        this.props.entityDataReset();
    }

    componentDidUpdate(prevProps, prevState) {
        const { match } = this.props;
        const orgId = match.params.uuid;

        // if (this.props.empCountState !== prevProps.empCountState && this.props.empCountState === 'SUCCESS') {
        //     if (this.props.empCount === 0) {
        //         this.setState({ showEmptyState: true })
        //     }
        // }

        if (this.props.empListState !== prevProps.empListState && this.props.empListState === 'SUCCESS') {
            if (this.props.empList && this.props.isListEmpty) {
                this.setState({ showEmptyState: true })
            }
        }

        if (this.props.entityCheckState !== prevProps.entityCheckState && this.props.entityCheckState === 'SUCCESS') {
            let redirectUrl = '/';
            if (_.isEmpty(this.props.entityData)) { redirectUrl = '/customer-mgmt/org/' + orgId + '/employee/onboard/addnew' }
            else { redirectUrl = '/customer-mgmt/org/' + orgId + '/employee/duplicate' }

            this.props.history.push(redirectUrl)
        }

        if (prevState.showModal !== this.state.showModal) {
            if (!this.state.showModal) {
                if (// this.props.empCountState === 'SUCCESS' && this.props.empCount === 0 && 
                    this.props.empListState === 'SUCCESS' && this.props.isListEmpty) {
                    this.setState({ showEmptyState: true })
                }
                this.props.initState();
            }
        }
        let idImage = idCard;
        if (prevProps.idNo !== this.props.idNo) {
            if (this.props.idImage) {
                idImage = this.props.idImage
            }
            this.setState({
                idImage: idImage,
                idValue: this.props.idNo,
                idState: this.props.idState,
                enableNext: true
            })
        }
    }

    handleButtonNext = (event) => {

        event.preventDefault();

        const { match } = this.props;
        const orgId = match.params.uuid;
        let docType = '';
        if (this.state.idState === 'Voter ID') { docType = 'Voter ID' }
        else if (this.state.idState === 'Pan Card') { docType = 'Pan Card' }
        else if (this.state.idState === 'Aadhaar Card') { docType = 'Aadhaar Card' }
        else if (this.state.idState === 'DL') { docType = 'DL' }
        else if (this.state.idState === 'Mobile') { docType = 'Mobile' }


        this.props.setId(this.state.idValue, this.state.idState, this.state.idImage)
        this.props.checkEntity(orgId, docType, this.state.idValue);
    }




    handleInput = (event) => {
        let idState = "";
        let idImage = idCard;
        let voterID = /^[a-zA-Z]{3}\d{7}$/;
        let pan = /^[a-zA-Z]{3}[PHABCGJLFT]{1}[a-zA-Z]{1}\d{4}[a-zA-Z]{1}$/;
        let adharCard = /^\d{12}$/;
        let RC = /^[a-zA-Z]{2}\d{2}[a-zA-Z]{2}\d{4}$/;
        let DL = /^[a-zA-Z]{2}\d{13}$/
        let MOBILE = /^([+][9][1]|[9][1]|[0]){0,1}([ ]{0,1})([0-9]{1})([0-9]{9})$/;
        let enableNext = false;

        if (voterID.test(event.target.value)) {
            idState = 'Voter ID';
            idImage = voterCard;
            enableNext = true;
        }
        else if (pan.test(event.target.value)) {
            idState = 'Pan Card';
            idImage = panCard;
            enableNext = true;
        }
        else if (adharCard.test(event.target.value)) {
            idState = 'Aadhaar Card';
            idImage = aadhaarCard;
            enableNext = true;
        }
        else if (RC.test(event.target.value)) {
            idState = 'RC';
            idImage = rcCard;
            enableNext = true;
        }
        else if (DL.test(event.target.value)) {
            idState = 'DL';
            idImage = dlCard;
            enableNext = true;
        }
        else if (MOBILE.test(event.target.value)) {
            idState = 'Mobile';
            idImage = mobileNoCard;
            enableNext = true;
        }

        this.setState({
            idValue: event.target.value.toUpperCase(),
            idState: idState,
            idImage: idImage,
            enableNext: enableNext
        });

    }

    toggleForm = () => {
        this.setState({
            showModal: !this.state.showModal,
            idValue: '',
            idImage: idCard,
            idState: "",
            enableNext: false,
            showDropdown: false,
            showEmptyState: false
        });
    }

    toggleDropdown = () => {
        this.setState({ showDropdown: !this.state.showDropdown })
    }

    onFocus = () => {
        this.setState({ focus: true })
    }

    onBlur = () => {
        this.setState({ focus: false })
    }

    handleOutsideClick = (e) => {
        if (!_.isEmpty(this.node)) {
            if (this.node.contains(e.target)) {
                return;
            }
            this.handleClick();
        }
    }

    handleClick = (event) => {
        if (event) {
            event.preventDefault();
        }
        if (!this.state.showDropdown) {
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }
        this.setState(prevState => ({
            showDropdown: !prevState.showDropdown
        }));
    }

    handleExcelTemplate = () => {
        this.props.onDownloadExcelTemplate();
    }

    handleExcelRedirect = () => {
        const { match } = this.props;
        const orgId = match.params.uuid;
        let redirectUrl = `/customer-mgmt/org/` + orgId + `/employee/excelonboard`;
        this.props.history.push(redirectUrl);
        this.setState({ showEmptyState: false })
    }

    render() {

        const { t } = this.props;
        const { match } = this.props;
        const orgId = match.params.uuid;
        return (
            <React.Fragment>
                <Modal show={this.state.showModal} className={styles.ModalPage} >
                    <div className={styles.ModalForm}>
                        <img onClick={this.toggleForm}
                            src={closePage} alt={t('translation_empOnboarding:image_alt_empOnboarding.close')} style={{ cursor: 'pointer' }}>
                        </img>
                        <br />

                        <img src={this.state.idImage} alt={t('translation_empOnboarding:image_alt_empOnboarding.IdImage')} className={styles.marginTop} />

                        <h4 className={"pt-4 mb-0"}>please enter any ID number or mobile number </h4>
                        <span><small>pan card, aadhaar card, driving license, voter id or mobile number</small></span>
                        <form>
                            <div>
                                <div className={cx(this.state.focus ? styles.InputPlace : styles.InputPlaceBlur, "row col-5 mx-auto my-4")}>
                                    <input
                                        type='text'
                                        placeholder="enter id number or mobile number"
                                        value={this.state.idValue}
                                        onChange={(event) => this.handleInput(event)}
                                        className={cx(styles.InputText, "ml-1 px-6 row")}
                                        onFocus={this.onFocus}
                                        onBlur={this.onBlur}
                                    />
                                    <span className={this.state.idState ? cx(styles.InputId) : null}>
                                        {this.state.idState.toLowerCase()}
                                    </span>

                                </div>
                                {/* <Link
                                    to={'/customer-mgmt/org/' + orgId + '/employee/addnew'} className={cx(styles.Headings)}>
                                    <small onClick={() => this.props.initState()}><u>{t('translation_empOnboarding:texts_empOnboarding.noId')}</u></small>
                                </Link> */}
                                {/* <br /> */}
                                {this.props.entityCheckState === 'LOADING' ?
                                    <div className='pt-4 pb-1'>
                                        <Loader type='buttonLoader' />
                                    </div> :
                                    <React.Fragment>
                                        <Button
                                            className={'mt-4 mb-1'}
                                            isDisabled={!this.state.enableNext}
                                            label={t('translation_empOnboarding:buttons_empOnboarding.next')}
                                            clickHandler={(event) => this.handleButtonNext(event)}
                                            type='largeWithArrow'>
                                        </Button>
                                        <br />
                                    </React.Fragment>
                                }
                                <small className={styles.Headings}>{t('translation_empOnboarding:texts_empOnboarding.consent')}<u>{t('translation_empOnboarding:texts_empOnboarding.info')}</u></small>
                            </div>
                        </form>

                    </div>
                </Modal>

                {this.state.showEmptyState ?
                    <div className={cx('d-flex flex-column', styles.Backdrop)} >
                        <div className={cx(styles.Container)}>
                            <div className={styles.CardPadding}>
                                <img src={emptyPage} alt='' style={{ height: '15rem' }} /> <br />
                                <p className={styles.EmptyPageText}>there is no employee added yet. You can add single employee
                                or add multiple employees from excel uploading.</p>

                                <HasAccess
                                    permission={["EMP_PROFILE:CREATE"]}
                                    orgId={orgId}
                                    yes={() => (
                                        <Button
                                            className='mt-2'
                                            label='onboard single employee'
                                            clickHandler={this.toggleForm}
                                            type='add'
                                        />
                                    )}
                                />
                                &emsp;
                                <HasAccess
                                    permission={["EMP_MGMT:EXCEL_UPLOAD"]}
                                    orgId={orgId}
                                    yes={() => (
                                        <Button
                                            className='mt-2'
                                            label='onboard mutiple employees'
                                            clickHandler={this.handleExcelRedirect}
                                            type='add'
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    : null}

                <HasAccess
                    permission={["EMP_MGMT:LIST"]}
                    orgId={orgId}
                    yes={() =>
                        <div ref={node => { this.node = node; }}>
                            {this.state.showDropdown ?
                                <div className={styles.Dropdown} onClick={this.handleClick}>
                                    <div className='d-flex flex-column'>
                                        <div className='d-flex flex-row pt-2 pb-1'>
                                            <label className={cx('mb-0 ml-3', styles.onBoardOption)}>onboard employee or download excel</label>
                                            <img src={dropdownIcon} style={{ marginLeft: '0.75rem' }} alt='' />
                                        </div>
                                        <hr className={styles.HorizontalLine} />
                                        <HasAccess
                                            permission={["EMP_PROFILE:CREATE"]}
                                            orgId={orgId}
                                            yes={() => (
                                                <div className={styles.MainDiv}>
                                                    <div className={cx(styles.DropdownOption)} onClick={this.toggleForm}>
                                                        &emsp;<img src={initiateIcon} alt='' />&emsp;
                                                        onboard employee from portal
                                            </div>
                                                </div>
                                            )}
                                        />
                                        <HasAccess
                                            permission={["EMP_MGMT:EXCEL_UPLOAD"]}
                                            orgId={orgId}
                                            yes={() => (
                                                <React.Fragment>
                                                    <div className={styles.MainDiv}>
                                                        <div className={cx(styles.DropdownOption)} onClick={this.handleExcelRedirect}>
                                                            &emsp;<img src={initiateIcon} alt='' />&emsp;
                                                                onboard employee from excel
                                                            </div>
                                                    </div>
                                                    <div className={styles.MainDivLast}>
                                                        <div className={this.props.downloadExcelTemplateState === 'LOADING' ? cx(styles.LastDropdownOptionLoading) : cx(styles.LastDropdownOption)}
                                                            onClick={this.props.downloadExcelTemplateState === 'LOADING' ? null : this.handleExcelTemplate}>
                                                            &emsp;<img src={downloadExcel} alt='' />&emsp;
                                                            download excel template
                                                </div>
                                                    </div>
                                                </React.Fragment>

                                            )}
                                        />


                                    </div>
                                </div> :
                                <Button clickHandler={this.handleClick} type='addDropdown' label={t('translation_empOnboarding:buttons_empOnboarding.onboard')} className={styles.Button} />
                            }
                        </div>
                    }
                />

            </React.Fragment>
        )
    }
}
const mapStateToProps = state => {
    return {
        idNo: state.empMgmt.empAddNew.idNo,
        idState: state.empMgmt.empAddNew.cardtype,
        idImage: state.empMgmt.empAddNew.idImage,
        showModal: state.empMgmt.empAddNew.showModal,

        entityCheckState: state.empMgmt.empAddNew.entityCheckState,
        entityData: state.empMgmt.empAddNew.entityData,
        downloadExcelTemplateState: state.empMgmt.empAddNew.downloadExcelTemplateState,
        // empCount: state.empMgmt.empList.dataCount,
        // empCountState: state.empMgmt.empList.getCountState,
        empList: state.empMgmt.empList.employeeList,
        isListEmpty: state.empMgmt.empList.isListEmpty,
        empListState: state.empMgmt.empList.getEmployeeListState
    }
}
const mapDispatchToProps = dispatch => {
    return {
        initState: () => dispatch(actions.initState()),
        setId: (idValue, idState, idImage) => dispatch(actions.setId(idValue, idState, idImage)),
        checkEntity: (orgId, docType, docNumber) => dispatch(actions.entityCheck(orgId, docType, docNumber)),
        entityDataReset: () => dispatch(entityActions.entityDataReset()),
        onDownloadExcelTemplate: () => dispatch(actions.downloadExcelTemplate())
    };
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(withRouter(EmpOnboard)));
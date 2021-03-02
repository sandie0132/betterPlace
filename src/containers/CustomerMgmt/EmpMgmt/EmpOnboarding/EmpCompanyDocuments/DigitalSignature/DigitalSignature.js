import React, { Component } from 'react';
import styles from './DigitalSignature.module.scss'
import cx from 'classnames';
import _ from 'lodash';
import { connect } from 'react-redux';

import * as actions from './Store/action';
import * as onboardActions from '../../Store/action';
import { Button } from 'react-crux';
import Loader from '../../../../../../components/Organism/Loader/Loader';
import Notification from '../../../../../../components/Molecule/Notification/Notification';
import CaptureSign from '../../../../../../components/Molecule/CaptureSign/CaptureSign';
import scrollStyle from '../../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import Prompt from '../../../../../../components/Organism/Prompt/Prompt';
import Spinnerload from '../../../../../../components/Atom/Spinner/Spinner';
import warn from '../../../../../../assets/icons/warning.svg';
import CancelButton from '../../../../../../components/Molecule/CancelButton/CancelButton';
import WarningPopUp from '../../../../../../components/Molecule/WarningPopUp/WarningPopUp';

//svg
import defaultSign from '../../../../../../assets/icons/signatureIcon.svg';
import deleteRed from '../../../../../../assets/icons/deleteRed.svg';


class DigitalSignature extends Component {

    state = {
        showNotification: false,
        showCancelPopUp: false,
        showModal: false,
        signatureURL: '',
        previewSignatureURL: '',
        signatureImage: null,
        enableSignButton: true,
        enableSubmit: false,
        isEdited: false
    }

    _isMounted = false;

    componentDidMount = () => {
        this._isMounted = true;

        if (!_.isEmpty(this.props.data)) {   ////////LOAD SIGN ON MOUNT
            let empData = _.cloneDeep(this.props.data);
            let previewSignatureUrl = empData.previewSignatureUrl;
            if (!_.isEmpty(previewSignatureUrl)) {
                this.props.getSignatureImage(previewSignatureUrl);
            }
        }
    }



    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.getSignatureState !== prevProps.getSignatureState && this.props.getSignatureState === "SUCCESS") {
            this.setState({
                signatureImage: this.props.signatureImage,
                enableSignButton: false,
            })
        }

        if (this.props.uploadSignatureState !== prevProps.uploadSignatureState && this.props.uploadSignatureState === "SUCCESS") {
            let signatureUrl = "";
            signatureUrl = this.props.signatureURL;
            this.setState({ signatureURL: signatureUrl })
        }

        if (this.props.uploadSignaturePreviewState !== prevProps.uploadSignaturePreviewState && this.props.uploadSignaturePreviewState === "SUCCESS") {

            let signaturePreviewUrl = "";
            signaturePreviewUrl = this.props.signaturePreviewURL;
            this.setState({ previewSignatureURL: signaturePreviewUrl })
        }

        if (!_.isEqual(this.state.signatureURL, prevState.signatureURL) || !_.isEqual(this.state.previewSignatureURL, prevState.previewSignatureURL)) {
            let enableSubmit = false;
            if ((!_.isEmpty(this.state.signatureURL) && !_.isEmpty(this.state.previewSignatureURL)) || (_.isEmpty(this.state.signatureURL) && _.isEmpty(this.state.previewSignatureURL))) {
                enableSubmit = true;
            }

            this.setState({ enableSubmit: enableSubmit })
        }


        if (this.props.putDataState !== prevProps.putDataState && this.props.putDataState === "SUCCESS") {
            this.setState({
                enableSubmit: false,
                isEdited: false,
                showNotification: true
            })
            setTimeout(() => {
                if (this._isMounted) {
                    this.setState({ showNotification: false });
                }
            }, 5000);
        }

        if (this.props.putDataState !== prevProps.putDataState && this.props.putDataState === "ERROR") {
            this.setState({
                showNotification: true
            })
            setTimeout(() => {
                if (this._isMounted) {
                    this.setState({ showNotification: false });
                }
            }, 5000);
        }

        if (!_.isEqual(this.props.data, prevProps.data) && !_.isEmpty(this.props.data)) { /////LOAD SIGN on RELOAD and after PUT
            let empData = _.cloneDeep(this.props.data);
            let previewSignatureUrl = empData.previewSignatureUrl;
            if (!_.isEmpty(previewSignatureUrl)) {
                if (!_.isEmpty(this.state.previewSignatureURL)) {
                    // console.log(previewSignatureUrl,this.state.previewSignatureURL);
                    if (previewSignatureUrl !== this.state.previewSignatureURL) {
                        this.props.getSignatureImage(previewSignatureUrl);
                    }
                } else {
                    this.props.getSignatureImage(previewSignatureUrl);
                }
            }
        }


    }


    toggleForm = () => {
        this.setState({
            showModal: !this.state.showModal
        })
    }

    getAndUploadSign = (originalFile, croppedFile) => {
        let formData_preview = new FormData();
        formData_preview.append('file', originalFile);
        let formData_cropped = new FormData();
        formData_cropped.append('file', croppedFile);
        let folder = 'employee_company_documents';
        this.props.uploadSignature(folder, formData_preview, "preview");
        this.props.uploadSignature(folder, formData_cropped, "cropped");
        this.setState({ isEdited: true })
    }

    removeSignature = () => {
        this.setState({
            signatureImage: null,
            signatureURL: '',
            previewSignatureURL: '',
            enableSignButton: true,
            enableSubmit: true,
            isEdited: true
        })
    }

    handleSubmit = () => {
        let empData = _.cloneDeep(this.props.data)
        empData.signatureUrl = this.state.signatureURL
        empData.previewSignatureUrl = this.state.previewSignatureURL

        let orgId = empData.orgId
        let empId = empData.uuid;
        this.props.onPutData(orgId, empId, empData);
    }

    handleCancelPopUp = () => {
        if (!this.state.isEdited) {
            // this.handleCancel();
        }
        else {
            this.setState({
                showCancelPopUp: !this.state.showCancelPopUp
            });
        }
    }

    handleCancel = () => {
        let empData = _.cloneDeep(this.props.data);
        let signatureUrl = empData.previewSignatureUrl;
        this.setState({ signatureImage: null, enableSubmit: false, isEdited: false, showCancelPopUp: false, enableSignButton: true })
        if (!_.isEmpty(signatureUrl)) {
            this.props.getSignatureImage(signatureUrl);
        }
    }

    render() {
        return (
            <React.Fragment>
                <Prompt
                    when={this.state.isEdited}
                />
                <div className={cx(styles.alignCenter, scrollStyle.scrollbar)}>
                    <div className={cx(styles.CardLayout, ' card p-relative')}>
                        <div className={styles.fixedHeader}>
                            <div className={cx(styles.formHeader, "row mx-0")} style={{ height: "3.5rem" }}>
                                <div className={styles.timeHeading}>
                                    {this.props.putDataState === "SUCCESS" && this.state.showNotification ?
                                        <Notification
                                            type="success"
                                            message="digital signature updated successfully"
                                        />
                                        : this.props.putDataState === "ERROR" && this.state.showNotification ?
                                            <Notification
                                                type="warning"
                                                message={this.props.error}
                                            />
                                            : ""}
                                </div>

                                <div className="ml-auto d-flex" >
                                    <div className={cx("row no-gutters justify-content-end")}>
                                        <CancelButton isDisabled={false} clickHandler={this.handleCancelPopUp} className={styles.cancelButton}>{"cancel"}</CancelButton>
                                        {this.state.showCancelPopUp ?
                                            <WarningPopUp
                                                text={"cancel?"}
                                                para={"Warning: this cannot be undone"}
                                                confirmText={"yes, cancel"}
                                                cancelText={"keep"}
                                                icon={warn}
                                                warningPopUp={this.handleCancel}
                                                closePopup={this.handleCancelPopUp}
                                            />
                                            : null
                                        }

                                        {this.props.putDataState === 'LOADING' ? <Spinnerload type='loading' /> :
                                            <Button label={'save'} isDisabled={!this.state.enableSubmit} clickHandler={this.handleSubmit} type='save' />}
                                    </div>

                                </div>


                            </div>
                        </div>

                        <div className={cx(styles.CardPadding, 'card-body')}>
                            <div className={cx(styles.innerContainer, "mx-auto")} style={{ marginTop: "0.5rem" }}>
                                {this.props.getSignatureState === "LOADING" || this.props.uploadSignatureState === "LOADING" ?
                                    <div className={cx(styles.innerLoadingContainer)}>
                                        <div style={{ position: "absolute", left: "19rem", top: "8rem" }}>
                                            <Loader type={"stepLoaderWhite"} />
                                        </div>
                                    </div>
                                    : null
                                }
                                <div className={cx(styles.innerWhiteContainer)}>

                                    {/* //////EMPTY CONTAINER/////// */}
                                    {_.isEmpty(this.state.signatureImage) ?
                                        <div className="d-flex flex-column">
                                            <img src={defaultSign} alt="default icon" style={{ marginTop: "3.5rem", width: '180px', height: '148px', alignSelf: 'center' }} />
                                            <label className={cx(styles.text)} style={{ marginTop: "2rem" }}>please add digital signature for documents</label>
                                        </div>
                                        :

                                        <div>

                                            <div style={{ position: "absolute", right: "1rem", top: "12px", cursor: "pointer" }}>
                                                <label className={cx(styles.text, styles.blueText, styles.underline, styles.pointer)} onClick={this.removeSignature}>remove signature</label>
                                                <img src={deleteRed} alt="delete icon" className={styles.deleteIcon} />
                                            </div>

                                            <div className="d-flex flex-column" style={{ alignItems: "center", marginTop: "3.5rem" }}>
                                                <div className={styles.showImageContainer}>
                                                    <img src={this.props.signatureImage} className={styles.showImageContainer} alt="employee signature" />
                                                </div>

                                                <label className={cx(styles.text, styles.greyText)} style={{ marginTop: "1rem" }}>remove current signature to add new</label>

                                            </div>

                                        </div>

                                    }

                                </div>

                                <div className={styles.signatureButtonContainer}>
                                    <Button label={'add signature'} isDisabled={!this.state.enableSignButton} clickHandler={() => this.toggleForm()} type='save' />
                                </div>

                                {this.state.showModal ?
                                    <CaptureSign
                                        show={this.state.showModal}
                                        close={this.toggleForm}
                                        onSavefile={(original, cropped) => this.getAndUploadSign(original, cropped)}
                                    />
                                    : null}

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
        putDataState: state.empMgmt.empOnboard.onboard.putEmpDataState,
        error: state.empMgmt.empOnboard.onboard.error,
        data: state.empMgmt.empOnboard.onboard.empData,
        uploadSignatureState: state.empMgmt.empOnboard.empCompanyDocuments.digitalSignature.signatureUploadState,
        uploadSignaturePreviewState: state.empMgmt.empOnboard.empCompanyDocuments.digitalSignature.signaturePreviewUploadState,
        signatureURL: state.empMgmt.empOnboard.empCompanyDocuments.digitalSignature.signatureURL,
        signaturePreviewURL: state.empMgmt.empOnboard.empCompanyDocuments.digitalSignature.signaturePreviewURL,
        getSignatureState: state.empMgmt.empOnboard.empCompanyDocuments.digitalSignature.signatureDownloadState,
        signatureImage: state.empMgmt.empOnboard.empCompanyDocuments.digitalSignature.signatureImage

    }
};

const mapDispatchToProps = dispatch => {
    return {
        initState: () => dispatch(actions.initState()),
        onPutData: (orgId, empId, data) => dispatch(onboardActions.putEmpData(orgId, empId, data, true, true)),
        uploadSignature: (folder, imageData, signatureType) => dispatch(actions.signatureUpload(folder, imageData, signatureType)),
        getSignatureImage: (url) => dispatch(actions.getSignature(url))
    }
};

export default (connect(mapStateToProps, mapDispatchToProps)(DigitalSignature));
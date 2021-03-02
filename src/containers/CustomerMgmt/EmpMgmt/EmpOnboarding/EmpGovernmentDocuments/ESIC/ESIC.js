import React, { Component } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as actions from '../../Store/action';
import styles from './ESIC.module.scss';
import ToggleDocConfig from "../../ToggleDocConfig/ToggleDocConfig";
import Loader from '../../../../../../components/Organism/Loader/Loader';
import { Button } from 'react-crux';
import Spinnerload from '../../../../../../components/Atom/Spinner/Spinner';
import CancelButton from '../../../../../../components/Molecule/CancelButton/CancelButton';
import WarningPopUp from '../../../../../../components/Molecule/WarningPopUp/WarningPopUp';
import DocumentUpload from '../../DocumentUpload/DocumentUpload';
import Notification from '../../../../../../components/Molecule/Notification/Notification';

import EsicDocGeneration from './EsicDocGeneration/EsicDocGeneration';

//svgs
import warn from '../../../../../../assets/icons/warning.svg';
import esicIcon from '../../../../../../assets/icons/esic.svg';
import blueWarn from '../../../../../../assets/icons/warnBlue.svg';


class ESIC extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isConfigDocGenerate: true,
            showToggleConfigPopup: false,
            showCancelPopUp: false,
            enableSubmit: false,
            documentURL: '',
            isEdited: false,
            showNotification: false,
            formData: {},
            resetForm: false,
            status: 'init'
        };

        this._isMounted = false;

    }


    componentDidMount = () => {
        this._isMounted = true;
        this.handlePropsToState();
    }

    componentDidUpdate = (prevProps, prevState) => {
        // if(this.state.documentURL!==prevState.documentURL){
        //     this.setState({enableSubmit: true})
        // }

        ////Show Notification for Success/Error for post call
        if (this.props.putEmpDataState !== prevProps.putEmpDataState && (this.props.putEmpDataState === "SUCCESS" || this.props.putEmpDataState === "ERROR")) {
            this.setState({ showNotification: true });
            if (this.props.putEmpDataState === "SUCCESS") { this.setState({ isEdited: false, enableSubmit: false }) }
            setTimeout(() => {
                if (this._isMounted) {
                    this.setState({ showNotification: false });
                }
            }, 5000);
        }

        if (!_.isEqual(this.props.empData, prevProps.empData)) {
            this.handlePropsToState();
        }


    }

    toggleDocumentConfiguration = () => {

        let showToggleConfigPopup = !_.isEmpty(this.state.formData.uuid) || this.state.isEdited;
        if (showToggleConfigPopup) {
            this.setState({
                showToggleConfigPopup: showToggleConfigPopup
            })
        } else {
            this.setState({
                isConfigDocGenerate: !this.state.isConfigDocGenerate
            })
        }
    }

    getDocumentUrl = (url) => {
        this.setState({ documentURL: url, isEdited: true, enableSubmit: true });
    }

    getFormDataFromChild = (data) => {
        this.setState({ formData: data })
    }



    handlePropsToState = () => {
        let empData = _.cloneDeep(this.props.empData);
        if (!_.isEmpty(empData)) {
            let govtDocs = [];
            if (!_.isEmpty(empData['government_documents'])) {
                govtDocs = empData['government_documents']
            }

            let documentURL = ''; let isConfigDocGenerate = true; let formData = {};
            if (!_.isEmpty(govtDocs)) {
                _.forEach(govtDocs, function (value, index) {
                    if (value.documentType === "ESIC") {
                        documentURL = value.downloadURL;
                        isConfigDocGenerate = value.isConfigDocGenerate;
                        formData = value;
                    }
                })
            }
            this.setState({
                documentURL: documentURL, isConfigDocGenerate: isConfigDocGenerate,
                enableSubmit: false, isEdited: false, showCancelPopUp: false, formData: formData
            })

        }
    }

    handleSubmit = () => {
        let updatedEmpData = _.cloneDeep(this.props.empData);
        let govtDocs = [];
        if (!_.isEmpty(updatedEmpData['government_documents'])) {
            govtDocs = updatedEmpData['government_documents']
        }

        if (!_.isEmpty(this.state.documentURL)) {
            let thisRef = this;
            let preExistDoc = false;
            if (!_.isEmpty(govtDocs)) {
                _.forEach(govtDocs, function (value, index) {
                    if (value.documentType === "ESIC") {
                        preExistDoc = true;
                        govtDocs[index]['downloadURL'] = thisRef.state.documentURL;
                        govtDocs[index]['isConfigDocGenerate'] = thisRef.state.isConfigDocGenerate;
                        govtDocs[index]['status'] = "done"
                    }

                })
            }
            if (!preExistDoc) {
                let doc = {};
                doc.documentType = "ESIC"; doc.downloadURL = this.state.documentURL;
                doc.isConfigDocGenerate = this.state.isConfigDocGenerate; doc.status = 'done'
                govtDocs.push(doc);
            }
            updatedEmpData['government_documents'] = govtDocs;
        }else{
            if (!_.isEmpty(govtDocs)) {
                let updatedGovtDocs = _.filter(govtDocs, function(op){
                    return op.documentType!=="ESIC"
                })
                updatedEmpData['government_documents'] = updatedGovtDocs
            }
        }

        let orgId = this.props.match.params.uuid;
        let empId = this.props.match.params.empId

        this.props.putEmpData(orgId, empId, updatedEmpData);
    }

    handleCancel = () => {
        this.handlePropsToState();
    }

    handleCancelPopUp = () => {
        if (!this.state.isEdited) {
            this.handleCancel();
        }
        else {
            this.setState({
                showCancelPopUp: !this.state.showCancelPopUp
            });
        }
    }

    handleShowToggleConfigPopup = (reset) => {
        let isConfigDocGenerate = this.state.isConfigDocGenerate;
        if (reset) isConfigDocGenerate = !isConfigDocGenerate;

        let isEdited = this.state.isEdited;
        if (reset) isEdited = false;

        // let enableSubmit = this.state.enableSubmit;
        // if (reset) enableSubmit = false;

        let resetForm = this.state.resetForm;
        if (reset) resetForm = true;

        let documentURL = this.state.documentURL;
        if (reset) documentURL = "";

        this.setState({
            showToggleConfigPopup: !this.state.showToggleConfigPopup,
            isConfigDocGenerate: isConfigDocGenerate,
            isEdited: isEdited,
            resetForm: resetForm,
            documentURL: documentURL
            // enableSubmit: enableSubmit
        })
    }

    getStatusFromChild = (status) => {
        this.setState({ status: status })
    }

    render() {
        // console.log("FormData in Parent ESIC: ", this.state.formData);
        // console.log("document url: ", this.state.documentURL);
        // console.log(this.state.status);
        return (
            <div>
                <ToggleDocConfig
                    value={this.state.isConfigDocGenerate}
                    changed={() => this.toggleDocumentConfiguration()}
                    docName="ESIC"
                    disabled={this.state.status === 'inProgress'}
                />

                {
                    this.state.showToggleConfigPopup ?
                        <WarningPopUp
                            text={this.state.isConfigDocGenerate ? 'upload available?' : 'generate new?'}
                            para={'Warning: this will delete any unsaved changes or previously ' +
                                (this.state.isConfigDocGenerate ? 'generated' : 'uploaded') + ' document.'}
                            confirmText={'yes'}
                            cancelText={'keep'}
                            icon={blueWarn}
                            warningPopUp={() => this.handleShowToggleConfigPopup(true)}
                            closePopup={() => this.handleShowToggleConfigPopup(false)}
                            isAlert
                        />
                        :
                        null
                }
                <div className="mt-4">
                    {this.props.getEmpDataState === "LOADING" ?
                        <div className={cx(styles.alignCenter, "pt-4")}>
                            <Loader type='onboardForm' />
                        </div>
                        :
                        !this.state.isConfigDocGenerate ?
                            <div className={cx(styles.alignCenter)}>
                                <div className={cx(styles.CardLayout, ' card p-relative')}>
                                    <div className={styles.fixedHeader}>
                                        <div className={cx(styles.formHeader, "row mx-0")} style={{ height: "3.5rem" }}>
                                            <div className={cx(styles.timeHeading,"col-8 mx-0 px-0")}>
                                                {/* ///////////////////// NOTIFICCATION COMPONENT ////////////////// */}
                                                {this.props.putEmpDataState === "SUCCESS" && this.state.showNotification ?
                                                    <Notification
                                                        type="success"
                                                        message="employee updated successfully"
                                                    />
                                                    : this.props.putEmpDataState === "ERROR" && this.state.showNotification ?
                                                        <Notification
                                                            type="warning"
                                                            message={this.props.error}
                                                        /> : null}
                                            </div>

                                            <div className="ml-auto d-flex my-auto" >
                                                <div className={cx("row no-gutters justify-content-end")}>
                                                    <CancelButton isDisabled={false} clickHandler={this.handleCancelPopUp} className={styles.cancelButton}>{'cancel'}</CancelButton>
                                                    {this.state.showCancelPopUp ?
                                                        <WarningPopUp
                                                            text={'cancel?'}
                                                            para={'WARNING: it can not be undone'}
                                                            confirmText={'yes, cancel'}
                                                            cancelText={'keep'}
                                                            icon={warn}
                                                            warningPopUp={this.handleCancel}
                                                            closePopup={this.handleCancelPopUp}
                                                        />
                                                        : null
                                                    }



                                                    {this.props.putEmpDataState === "LOADING" ? <Spinnerload type='loading' /> :
                                                        <Button label={"save"} isDisabled={!this.state.enableSubmit} clickHandler={this.handleSubmit} type='save' />}
                                                </div>


                                            </div>

                                        </div>
                                    </div>

                                    <div className={cx(styles.CardPadding, 'card-body')}>


                                        {/* /////DOC UPLOAD //////////// */}
                                        <div className="d-flex flex-column" style={{ paddingTop: "1.5rem" }}>
                                            <img src={esicIcon} alt="esic icon" style={{ paddingBottom: "1.5rem", width: '110px', height:'91px', alignSelf: 'center'}} />
                                            <label className={cx(styles.headingRed)} style={{ paddingTop: "1.5rem" }}>upload ESIC available document</label>
                                            <label className={cx(styles.subHeading)} style={{ paddingTop: "0.5rem" }}>please upload ESIC document downloaded from ESIC website here</label>
                                            <div style={{ paddingTop: "2rem" }}>
                                                <DocumentUpload
                                                    documentType="ESIC"
                                                    file={(url) => this.getDocumentUrl(url)}
                                                    url={this.state.documentURL}
                                                    folderName="employee_government_documents"
                                                    maxMbSize={5}
                                                />
                                            </div>

                                        </div>


                                    </div>
                                </div>

                            </div> :

                            <EsicDocGeneration
                                data={this.getFormDataFromChild}
                                resetForm={this.state.resetForm}
                                status={this.getStatusFromChild}
                            />
                    }

                </div>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        empData: state.empMgmt.empOnboard.onboard.empData,
        error: state.empMgmt.empOnboard.onboard.error,
        getEmpDataState: state.empMgmt.empOnboard.onboard.getEmpDataState,
        putEmpDataState: state.empMgmt.empOnboard.onboard.putEmpDataState
    }
}


const mapDispatchToProps = dispatch => {
    return {
        putEmpData: (orgId, empId, data) => dispatch(actions.putEmpData(orgId, empId, data, false, false))
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(ESIC));
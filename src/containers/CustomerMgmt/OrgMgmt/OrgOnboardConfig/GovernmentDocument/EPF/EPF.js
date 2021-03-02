import React, { Component } from 'react';
import cx from 'classnames';
import _ from "lodash";
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import * as actions from "../Store/action";
import * as actionsDocument from "../../Store/action";
import * as docmgmtActions from '../../DocumentManagement/Store/action';

// import HasAccess from '../../../../../../services/HasAccess/HasAccess';
// import Loader from '../../../../../../components/Organism/Loader/Loader';
import Spinnerload from '../../../../../../components/Atom/Spinner/Spinner';
import Prompt from '../../../../../../components/Organism/Prompt/Prompt';
import CancelButton from '../../../../../../components/Molecule/CancelButton/CancelButton';
import { Button, Input } from 'react-crux';
import WarningPopUp from '../../../../../../components/Molecule/WarningPopUp/WarningPopUp';
import Notification from '../../../../../../components/Molecule/Notification/Notification';
import scrollStyle from '../../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';

import warn from '../../../../../../assets/icons/warning.svg';
// import inprogress from "../../../../../../assets/icons/warningIcon.svg";
import error from "../../../../../../assets/icons/redSmallWarning.svg";
import epfIcon from "../../../../../../assets/icons/epf.svg";
import epfBuilding from "../../../../../../assets/icons/epfBg.svg";
import website from "../../../../../../assets/icons/websiteDesktop.svg";
import styles from "./EPF.module.scss";
import PasswordInput from '../../../../../../components/Atom/PasswordInput/PasswordInput';
import VerifyButton from '../../../../../../components/Atom/VerifyButton/VerifyButton';
import container from '../../../../../../assets/icons/selectDocument.svg';
import ArrowLink from '../../../../../../components/Atom/ArrowLink/ArrowLink';
import CardHeader from '../../../../../../components/Atom/PageTitle/PageTitle';

class EPF extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isEdited: false,
            formData: {
                "userName": "",
                "password": ""
            },
            showNotification: false,
            showCancelPopUp: false,
            documentType: "EPF"
        };
        this._isMounted = false;
    }

    componentDidMount() {
        this.handlePropsToState();
        this._isMounted = true;


        if (!_.isEmpty(this.props.configData)) {
            let docSectionData = this.handleCurrentSectionData(this.props.configData, this.state.documentType);
            this.props.setCurrentDocType(this.state.documentType, docSectionData.documentLabel);
        }


    }

    componentDidUpdate(prevProps, prevState) {

        if (!_.isEqual(this.props.configData, prevProps.configData) && !_.isEmpty(this.props.configData)) {
            let docSectionData = this.handleCurrentSectionData(this.props.configData, this.state.documentType);
            this.props.setCurrentDocType(this.state.documentType, docSectionData.documentLabel);
        }


        if (this.props.getConfigState !== prevProps.getConfigState) {
            if (this.props.getConfigState === "SUCCESS") {
                this.handlePropsToState();
            }
        }
        if (this.props.processState !== prevProps.processState) {
            this.handleButtonState()
        }
        if (this.props.configData !== prevProps.configData) {
            this.handlePropsToState()
        }
        if (this.props.postConfigState !== prevProps.postConfigState) {
            if (this.props.postConfigState === 'SUCCESS') {
                this.setState({
                    showNotification: true,
                    isEdited: false,
                    errors: {}
                });
                setTimeout(() => {
                    if (this._isMounted) {
                        this.setState({ showNotification: false });
                    }
                }, 5000);
            }
        }
    }

    handlePropsToState = () => {
        const configData = _.cloneDeep(this.props.configData);
        let prevFormData = {
            "userName": "",
            "password": ""
        }
        if (!_.isEmpty(configData)) {
            let epfData = configData.documents.find((doc) => {
                return doc.documentType === "EPF"
            })
            if (!_.isEmpty(epfData.userName) && !_.isEmpty(epfData.password)) {
                prevFormData["userName"] = epfData.userName
                prevFormData["password"] = epfData.password
            }
        }
        this.setState({
            formData: prevFormData
        })
    }

    handleInputChange = (value, identifier) => {
        let updatedFormData = _.cloneDeep(this.state.formData);
        updatedFormData[identifier] = value;
        this.setState({
            formData: updatedFormData,
            isEdited: true
        });
    }

    handleCurrentSectionData = (config, type) => {
        let docData = {};
        if (!_.isEmpty(config)) {
            if (!_.isEmpty(config.documents)) {
                _.forEach(config.documents, function (value) {
                    if (value.documentType === type) {
                        docData = value;
                    }
                })
            }
        }
        return docData;
    }

    handleProcess = () => {
        let payload = _.cloneDeep(this.state.formData);
        let orgId = this.props.match.params.uuid;

        this.props.onProcessDocument(orgId, "EPF", payload);
    }

    handleButtonState = () => {
        let formData = _.cloneDeep(this.state.formData);
        let processState = this.props.processState;

        if (!_.isEmpty(formData.userName) && !_.isEmpty(formData.password)) {
            if (processState === "LOADING") {
                return "inProgress"
            }
            else if (processState === "SUCCESS") {
                return "done"
            }
            else if (processState === "ERROR") {
                return "enable"
            }
            else {
                if (!_.isEmpty(this.props.configData)) {
                    const configDataArray = _.cloneDeep(this.props.configData.documents);

                    if (!_.isEmpty(configDataArray)) {

                        if (this.state.isEdited) {
                            return "enable"
                        }
                        else {
                            let epfData = configDataArray.find((doc) => {
                                return doc.documentType === "EPF"
                            })
                            if (!_.isEmpty(epfData.password) && !_.isEmpty(epfData.userName)) {
                                return "done"
                            } else {
                                return "enable"
                            }
                        }
                    }
                    else {
                        return "enable"
                    }
                }

            }

        } else {
            return "disable"
        }
    }

    componentWillUnmount() {
        this.props.initState();
    }

    handleSave = () => {
        const formData = _.cloneDeep(this.state.formData);
        const orgId = this.props.match.params.uuid;
        let configuration = _.cloneDeep(this.props.configData);

        _.forEach(configuration.documents, function (document, index) {
            if (document.documentType === "EPF") {
                configuration.documents[index] = {
                    ...configuration.documents[index], ...formData, "status": "done"
                };

            }
        })
        this.setState({
            isEdited: false
        })
        this.props.onPostOnboardConfig(orgId, configuration);
        this.props.initState();
    }

    handleShowCancelPopUp = () => {
        this.setState({
            showCancelPopUp: !this.state.showCancelPopUp
        });
    }

    handleCancel = () => {
        this.handlePropsToState();
        this.props.initState();
        this.setState({
            isEdited: false,
            allowCancel: false,
            showNotification: false,
            showCancelPopUp: false
        })
    }

    render() {
        const { match } = this.props;
        let orgId = match.params.uuid;
        return (
            <React.Fragment>
                <Prompt
                    when={this.state.isEdited}
                    takeActionOnCancel={this.handlePropsToState}
                />
                <div className={cx(styles.alignCenter, scrollStyle.scrollbar)}>
                    <div className={styles.positionHeading}>
                        <ArrowLink
                            label={!_.isEmpty(this.props.orgData) ? this.props.orgData.name.toLowerCase() : null}
                            url={`/customer-mgmt/org/` + orgId + `/profile`}
                        />
                        <CardHeader label={"document management - employee provident fund"} iconSrc={container} />
                        <div style={{ backgroundColor: 'white', padding: '8px', position: "relative", marginTop: '8px' }}>
                            <div className={cx(styles.formHeader, "row mx-0")}>
                                <div className={styles.timeHeading}>
                                    {
                                        this.props.postConfigState === "SUCCESS" && this.state.showNotification ?
                                            <Notification
                                                type="success"
                                                message="configuration updated successfully."
                                            />
                                            : this.state.showNotification && this.props.postConfigState === "ERROR" ?
                                                <Notification
                                                    type="warning"
                                                    message={this.props.configError}
                                                />
                                                :
                                                null
                                    }
                                </div>
                                <div className="ml-auto d-flex" style={{ position: "relative" }}>

                                    <React.Fragment>
                                        <CancelButton
                                            className={styles.cancelButton}
                                            isDisabled={!this.state.isEdited}
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
                                            this.props.postConfigState === 'LOADING' ?
                                                <Spinnerload type='loading' />
                                                :
                                                <Button
                                                    label={'save'}
                                                    type='save'
                                                    isDisabled={this.props.processState === "SUCCESS" ? false : true}
                                                    clickHandler={() => this.handleSave()}
                                                />
                                        }
                                    </React.Fragment>

                                </div>
                            </div>
                        </div>
                        <div className={styles.formPadding}>
                            <div className="row no-gutters">
                                <div className={cx("col-6", styles.borderRight)}>
                                    <div className={styles.textCenter}>
                                        <img src={epfIcon} alt="epf" />
                                    </div>
                                    <Input
                                        name='userName'
                                        className='pr-3'
                                        label={'user name'}
                                        type='text'
                                        placeholder={'enter user name'}
                                        value={this.state.formData["userName"]}
                                        onChange={(value) => this.handleInputChange(value, 'userName')}
                                        autocompleteOff
                                    />

                                    <PasswordInput
                                        name='userPassword'
                                        className='pr-3'
                                        label={'password'}
                                        type='text'
                                        placeholder={'enter password'}
                                        value={this.state.formData["password"]}
                                        onChange={(value) => this.handleInputChange(value, 'password')}
                                    />

                                    {this.props.processState === "ERROR" ?
                                        <div className={styles.errorMsg}>
                                            <img src={error} alt="error" className="mr-1" />
                                            {this.props.processError}
                                        </div>
                                        : null
                                    }

                                    <div className="ml-2 mt-4">
                                        <VerifyButton
                                            onClick={() => this.handleProcess()}
                                            type={this.handleButtonState()}
                                        />
                                    </div>

                                </div>
                                <div className="col-6 p-4" >
                                    <div className={styles.headingBold}>
                                        employee’s provident fund organisation
                                </div>
                                    <div className={cx(styles.textCenter, "mt-3")}>
                                        <img src={epfBuilding} alt="epf" />
                                    </div>
                                    <div className={styles.websiteBox}>
                                        <div className={styles.inlineBlock}>
                                            <div className={styles.headingBoldBlack}>visit website</div>
                                            <a className={styles.textSmall} href="https://unifiedportal-emp.epfindia.gov.in/epfo/" target="_blank" rel="noopener noreferrer">
                                                https://unifiedportal-emp.epfindia.gov.in/epfo/</a>
                                        </div>
                                        <div className={cx(styles.inlineBlock, "ml-auto")}>
                                            <img src={website} alt="website" />
                                        </div>

                                    </div>
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
        orgData: state.orgMgmt.staticData.orgData,
        configError: state.orgMgmt.orgOnboardConfig.onboardConfig.error,
        processError: state.orgMgmt.orgOnboardConfig.governmentDocuments.error,
        postConfigState: state.orgMgmt.orgOnboardConfig.onboardConfig.postOrgOnboardConfigState,
        processState: state.orgMgmt.orgOnboardConfig.governmentDocuments.documentProcessState,
        getConfigState: state.orgMgmt.orgOnboardConfig.onboardConfig.getOrgOnboardConfigState,
        configData: state.orgMgmt.orgOnboardConfig.onboardConfig.orgOnboardConfig


    }
}

const mapDispatchToProps = dispatch => {
    return {
        initState: () => dispatch(actions.initState()),
        onProcessDocument: (orgId, docType, payload) => dispatch(actions.documentProcess(orgId, docType, payload)),
        onPostOnboardConfig: (orgId, config) => dispatch(actionsDocument.postOnboardConfig(orgId, config)),
        setCurrentDocType: (type, label) => dispatch(docmgmtActions.setCurrentDocument(type, label)),

    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EPF));
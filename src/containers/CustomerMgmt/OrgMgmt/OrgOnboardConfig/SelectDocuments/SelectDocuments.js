import React, { Component } from 'react';
import * as actions from '../Store/action';
import * as actionsDocument from '../DocumentManagement/Store/action';
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import _ from "lodash";

import Notification from '../../../../../components/Molecule/Notification/Notification';
import Loader from '../../../../../components/Organism/Loader/Loader';
import Spinnerload from '../../../../../components/Atom/Spinner/Spinner';
import { withTranslation } from 'react-i18next';
import CancelButton from '../../../../../components/Molecule/CancelButton/CancelButton';
import WarningPopUp from '../../../../../components/Molecule/WarningPopUp/WarningPopUp';
import styles from "./SelectDocuments.module.scss";
import cx from "classnames";
import DocumentCard from './DocumentCard/DocumentCard';
import { Button } from 'react-crux';
import warn from '../../../../../assets/icons/warning.svg';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import Prompt from '../../../../../components/Organism/Prompt/Prompt';
import container from '../../../../../assets/icons/selectDocument.svg';
import ArrowLink from '../../../../../components/Atom/ArrowLink/ArrowLink';
import CardHeader from '../../../../../components/Atom/PageTitle/PageTitle';

class SelectDocuments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedDoc: null,
            showCancelPopUp: false,
            isEdited: false,
            showNotification: false,
        };
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        this.setState({ _isMounted: true });
        this.props.onGetDocumentList();
        this.props.resetCurrentDocument();
        this.getSelectedConfig()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.OnboardConfigState !== this.props.OnboardConfigState) {
            if (!_.isEmpty(this.props.selectedList)) {
                this.getSelectedConfig()
            }

        }

        if (this.props.postOrgOnboardConfigState !== prevProps.postOrgOnboardConfigState &&
            (this.props.postOrgOnboardConfigState === "SUCCESS" || this.props.postOrgOnboardConfigState === "ERROR")) {
            this.setState({ showNotification: true, isEdited: false });
            setTimeout(() => {
                if (this._isMounted) {
                    this.setState({ showNotification: false });
                }
            }, 5000);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;

    }

    getSelectedConfig = () => {
        if (!_.isEmpty(this.props.selectedList)) {
            const selectedConfig = _.cloneDeep(this.props.selectedList.documents);
            let selectedArrray = [];

            selectedConfig.map((doc) => {
                return selectedArrray.push(doc.documentType)
            })

            this.setState({
                selectedDoc: selectedArrray
            })
        } else {
            this.setState({
                selectedDoc: null
            })
        }

    }

    getCheckedValue = (value) => {
        if (_.includes(this.state.selectedDoc, value)) {
            return true
        } else return false
    }

    handleCheckBox = (value) => {
        let selectedInState = [];
        if (!_.isEmpty(this.state.selectedDoc)) {
            selectedInState = _.cloneDeep(this.state.selectedDoc);
        }
        if (_.includes(selectedInState, value)) {
            selectedInState = selectedInState.filter(doc => doc !== value);
        } else {
            selectedInState.push(value)
        }
        this.setState({
            selectedDoc: selectedInState,
            isEdited: true
        })
    }

    handleFormSubmit = () => {
        let selectedInState = [];
        const { match } = this.props;
        let orgId = match.params.uuid;

        const selectedPropsData = _.isEmpty(this.props.selectedList) ? [] :
            _.isEmpty(this.props.selectedList.documents) ? [] : _.cloneDeep(this.props.selectedList.documents);

        let payload = {
            "documents": []
        }

        if (!_.isEmpty(this.state.selectedDoc)) {
            selectedInState = _.cloneDeep(this.state.selectedDoc);

            _.forEach(selectedInState, function (doc) {
                if (!_.isEmpty(selectedPropsData)) {
                    let isPresentInProps = false;
                    _.forEach(selectedPropsData, function (selectedDoc) {
                        if (selectedDoc.documentType === doc) {
                            payload["documents"].push(selectedDoc)
                            isPresentInProps = true;
                        }
                    })
                    if (!isPresentInProps) payload["documents"].push({ "documentType": doc });
                } else {
                    payload["documents"].push({ "documentType": doc });
                }
            })

        }

        this.props.onPostOnboardConfig(orgId, payload)
    }

    handleShowCancelPopUp = () => {
        this.setState({
            showCancelPopUp: !this.state.showCancelPopUp
        });
    }

    handleCancel = () => {
        this.getSelectedConfig()
        this.setState({
            isEdited: false,
            showNotification: false,
            showCancelPopUp: false
        })
    }

    render() {
        const { t } = this.props;
        const { match } = this.props;
        let orgId = match.params.uuid;

        return (
            <React.Fragment>
                <Prompt
                    when={this.state.isEdited}
                />
                <div className={styles.alignCenter}>
                    {this.props.docListState === "LOADING" ?
                        <div className={cx(scrollStyle.scrollbar, "pt-4")}>
                            <Loader type='onboardForm' />
                        </div>
                        :
                        <React.Fragment>
                            <div className={styles.fixedHeader}>
                                <ArrowLink
                                    label={!_.isEmpty(this.props.orgData) ? this.props.orgData.name.toLowerCase() : null}
                                    url={`/customer-mgmt/org/` + orgId + `/profile`}
                                />
                                <CardHeader label={"select documents"} iconSrc={container} />
                                <div className={styles.formHeader} style={{ height: "3.5rem" }}>
                                    <div className={cx(styles.formHeaderContent, "row mx-0")}>
                                        <div className={styles.timeHeading}>
                                            {this.props.postOrgOnboardConfigState === "SUCCESS" && this.state.showNotification ?
                                                <Notification
                                                    type="success"
                                                    message="configuration saved successfully"
                                                />
                                                : this.props.postOrgOnboardConfigState === "ERROR" && this.state.showNotification ?
                                                    <Notification
                                                        type="warning"
                                                        message={this.props.error}
                                                    />

                                                    : ""}
                                        </div>
                                        <div className="ml-auto d-flex" >
                                            <div className={cx("row no-gutters justify-content-end")}>
                                                <CancelButton isDisabled={!this.state.isEdited} clickHandler={this.handleShowCancelPopUp} className={styles.cancelButton}>{t('translation_empBasicRegistration:button_empBasicDetails.cancel')}</CancelButton>
                                                {this.state.showCancelPopUp ?
                                                    <WarningPopUp
                                                        text={t('translation_empBasicRegistration:warning_empBasicDetails_cancel.text')}
                                                        para={t('translation_empBasicRegistration:warning_empBasicDetails_cancel.para')}
                                                        confirmText={t('translation_empBasicRegistration:warning_empBasicDetails_cancel.confirmText')}
                                                        cancelText={t('translation_empBasicRegistration:warning_empBasicDetails_cancel.cancelText')}
                                                        icon={warn}
                                                        warningPopUp={this.handleCancel}
                                                        closePopup={this.handleShowCancelPopUp}
                                                    />
                                                    : null
                                                }
                                                {this.props.postOrgOnboardConfigState === 'LOADING' ? <Spinnerload type='loading' /> :
                                                    <Button label={t('translation_empBasicRegistration:button_empBasicDetails.save')}
                                                        isDisabled={!this.state.isEdited} clickHandler={() => this.handleFormSubmit()} type='save' />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={cx(styles.cardLayout)}>
                                <div className={styles.sectionHeading}>government mandate documents</div>
                                <br />
                                <div className={"d-flex"}>
                                    {!_.isEmpty(this.props.docList) ?
                                        this.props.docList.government_documents.map((gov, index) => {
                                            return (
                                                <div key={index}>
                                                    <DocumentCard
                                                        type={"gov"}
                                                        initial={gov.documentInitial}
                                                        label={gov.documentLabel}
                                                        changed={() => this.handleCheckBox(gov.documentType)}
                                                        checked={this.getCheckedValue(gov.documentType)}
                                                    />
                                                </div>
                                            )
                                        }) : null}
                                </div>
                                <br />
                                <br />
                                <div className={styles.sectionHeading}>organisation specific documents</div>
                                <br />
                                <div >
                                    {!_.isEmpty(this.props.docList) ?
                                        this.props.docList.company_documents.map((doc, index) => {
                                            return (
                                                <React.Fragment key={index} >
                                                    <DocumentCard
                                                        initial={doc.documentInitial}
                                                        label={doc.documentLabel}
                                                        changed={() => this.handleCheckBox(doc.documentType)}
                                                        checked={this.getCheckedValue(doc.documentType)}
                                                    />
                                                </React.Fragment>
                                            )
                                        }) : null}
                                </div>
                            </div>
                        </React.Fragment>
                    }
                </div >
            </React.Fragment >
        )
    }
}

const mapStateToProps = state => {
    return {
        orgData: state.orgMgmt.staticData.orgData,
        docList: state.orgMgmt.orgOnboardConfig.onboardConfig.documentList,
        docListState: state.orgMgmt.orgOnboardConfig.onboardConfig.getDocumentListState,
        selectedList: state.orgMgmt.orgOnboardConfig.onboardConfig.orgOnboardConfig,
        OnboardConfigState: state.orgMgmt.orgOnboardConfig.onboardConfig.getOrgOnboardConfigState,
        postOrgOnboardConfigState: state.orgMgmt.orgOnboardConfig.onboardConfig.postOrgOnboardConfigState,
        error: state.orgMgmt.orgOnboardConfig.onboardConfig.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // initState: () => dispatch(actions.initState()),
        onGetDocumentList: () => dispatch(actions.getDocumentList()),
        onGetOnboardConfig: (orgId) => dispatch(actions.getOnboardConfig(orgId)),
        onPostOnboardConfig: (orgId, config) => dispatch(actions.postOnboardConfig(orgId, config)),
        resetCurrentDocument: () => dispatch(actionsDocument.resetCurrentDocument())
    };
}

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(SelectDocuments)));
import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";

import _ from 'lodash';
import cx from 'classnames';
import styles from './PostalAddress.module.scss';

import ArrowLink from '../../../../components/Atom/ArrowLink/ArrowLink';
import Loader from '../../../../components/Organism/Loader/Loader';
import SuccessNotification from '../../../../components/Organism/Notifications/SuccessNotification/SuccessNotification';
import CommentsSection from './CommentsSection/CommentsSection';
import BasicInfo from './BasicInfo/BasicInfo';

import greyTimer from '../../../../assets/icons/timerGreyBackground.svg';

import * as actions from './Store/action';
import * as docVerificationActions from '../../ServiceVerification/Store/action';
import { withTranslation } from "react-i18next";

class PostalAddress extends Component {

    state = {
        verificationResult: '',
        showSuccessNotification: false,
        agency: ''
    }

    componentDidMount = () => {
        const { match } = this.props;
        let _id = match.params._id;
        this.props.onGetIndividualTask(_id);
    }

    componentDidUpdate = (prevProps) => {
        const thisRef = this;
        
        if (prevProps.reassignDataState !== this.props.reassignDataState && this.props.reassignDataState === 'SUCCESS') {
            this.setState({ showSuccessNotification: true });
            setTimeout(() => {
                this.setState({ showSuccessNotification: false })
            }, 4000);
            if (!_.isEmpty(this.props.reassignData.payload)) {
                if (thisRef.props.reassignData.payload.agencyFromAgencyType === thisRef.props.reassignData.payload.agencyToAgencyType) {
                    const { match } = thisRef.props;
                    let _id = match.params._id;
                    thisRef.props.onGetIndividualTask(_id);
                }
                else {
                    let redirectUrl = !_.isEmpty(thisRef.props.location.prevPath)
                        ? thisRef.props.location.prevPath
                        : '/workload-mgmt/address/postal?dateRange=LAST_MONTH'
                    thisRef.props.history.push(redirectUrl);
                }
            }
        }
        if(this.props.postalTaskDetailsState !== prevProps.postalTaskDetailsState && this.props.postalTaskDetailsState === 'SUCCESS') {
            this.props.onGetComments(this.props.postalTaskDetails.orgId, 'postal_address');
        }

        if(prevProps.postTaskState !== this.props.postTaskState && this.props.postTaskState === 'SUCCESS') {
            let redirectUrl = !_.isEmpty(this.props.location.prevPath) 
                                ? this.props.location.prevPath 
                                : '/workload-mgmt/address/postal?dateRange=LAST_MONTH'
            this.props.history.push(redirectUrl);
            this.props.onSendNotificationData(this.state.verificationResult, this.props.postalTaskDetails.fullName);
            // this.props.onGetInitState();
        }
    }

    closeSuccessNotification = () => {
        this.setState({ showSuccessNotification: false })
    }

    successNotificationHandler = (color) => {
        this.setState({verificationResult : color });
    }

    handleReadOnly = () => {
        let policies = this.props.policies;
        let readOnly = true;
        if(this.props.user.userGroup === 'SUPER_ADMIN'){
            readOnly =  false;
        } else {
            _.forEach(policies, function (policy) {
                if (_.includes(policy.businessFunctions, "POSTAL_ADDRESS:CLOSE")) {
                    readOnly =  false;
                }  
            })
        }
        return readOnly;
    }


    render() {
        const { t } = this.props;
        return (
            <div className={cx(styles.WorkloadSection)}>
                <div className="d-flex flex-row">
                    <ArrowLink
                        label={t('translation_addressTaskClosure:dashboard')}
                        url={!_.isEmpty(this.props.location.prevPath) ? this.props.location.prevPath : '/workload-mgmt/address/postal?dateRange=LAST_MONTH'}
                    />
                </div>

                {this.state.showSuccessNotification && !_.isEmpty(this.props.reassignData) && !_.isEmpty(this.props.reassignData.agencyName) ?
                    <SuccessNotification
                        type='agencyNotification'
                        message={t('translation_addressTaskClosure:successNotif')}
                        boldText={this.props.reassignData.agencyName}
                        closeNotification={this.closeSuccessNotification}
                    />
                    : null}

                <div className="d-flex flex-row">
                </div>


                {this.props.postalTaskDetailsState === 'SUCCESS'
                    ?   <div className={cx('mt-3 mb-5', styles.CardLayout)}>
                            <BasicInfo
                                // postalAddress={this.props.postalAddress}    
                                verificationResult={this.state.verificationResult}    
                                
                            />
                            <div className={styles.padding}> 
                                {!_.isEmpty(this.props.postalTaskDetails.agency)
                                ?   <CommentsSection 
                                        taskData={this.props.postalTaskDetails}
                                        cardType={'postal_address'}
                                        formData = {this.state.formData}
                                        disabled = {this.handleReadOnly()}
                                        handleSubmitColor={this.handleSubmitColor}
                                        successNotificationHandler = {this.successNotificationHandler}
                                    />
                                :   <div className={cx(styles.GreyText, "mb-4")}>
                                        <label>{t('translation_addressTaskClosure:verificationStatus')}</label>
                                        <span className={"row no-gutters mt-2"}>
                                            <img src={greyTimer} alt="" />
                                            <span className="ml-1 mt-1">
                                                {this.props.postalTaskDetails.caseStatus.toLowerCase().replace(/_/g," ")}
                                            </span>
                                        </span>
                                    </div> 
                                }
                            </div>
                        </div>
                    :   <Loader />
                }

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        images: state.imageStore.images,
        tagDataState: state.workloadMgmt.addressVerification.postalAddress.tagDataState,
        tagData: state.workloadMgmt.addressVerification.postalAddress.tagData,

        postalTaskDetails: state.workloadMgmt.addressVerification.postalAddress.postalTaskDetails,
        postalTaskDetailsState: state.workloadMgmt.addressVerification.postalAddress.postalTaskDetailsState,
        postTaskState: state.workloadMgmt.addressVerification.postalAddress.postPostalTaskDetailsState,

        user: state.auth.user,
        userProfile: state.user.userProfile.profile,
        policies: state.auth.policies,

        reassignDataState: state.workloadMgmt.addressVerification.address.reassignDataState,
        reassignData: state.workloadMgmt.addressVerification.address.reassignData
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetIndividualTask: (serviceRequestId) => dispatch(actions.getPostalTaskDetails(serviceRequestId)),
        onGetComments: (orgId, cardType) => dispatch(docVerificationActions.getComments(orgId, cardType)),
        onSendNotificationData: (color, name) => dispatch(actions.sendNotificationData(color, name)),
        // onGetInitState: () => dispatch(workloadActions.initialState())
    }
}

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(PostalAddress)));
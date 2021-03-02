import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import cx from 'classnames';
import _ from 'lodash';

import styles from './ReAssignModal.module.scss';
import warning from '../../../../assets/icons/warningIcon.svg';
import close from '../../../../assets/icons/remove.svg';

import { agencyTypes } from "../TaskFilters/StaticFilterData";
import CustomSelect from '../../../../components/Atom/CustomSelect/CustomSelect';
import { Button } from 'react-crux';
import CancelButton from "../../../../components/Molecule/CancelButton/CancelButton";
import * as addressActions from "../Store/action";
import * as taskListActions from "../TaskList/Store/action";
import { withTranslation } from "react-i18next";


class ReAssignModal extends Component {

    state = {
        agencyType: 'select agency type',
        agencyName: 'select agency',
        agencyId: ''
    }

    componentDidMount = () => {
        this.props.onGetAgencyList(this.props.cardType, this.props.postalAgencyList, this.props.physicalAgencyList);
        if (this.props.cardType === 'postal') {
            this.setState({ agencyType: 'POSTAL' })
        }
        else if (this.props.cardType === 'physical') {
            this.setState({ agencyType: 'PHYSICAL' })
        }
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.reassignDataState !== this.props.reassignDataState && this.props.reassignDataState === 'SUCCESS') {
            this.props.closeModal();
        }

        if (prevProps.agencyListState !== this.props.agencyListState && this.props.agencyListState === 'SUCCESS') {
            let reassignAgencyList = [];
            if (this.state.agencyType === 'POSTAL' && !_.isEmpty(this.props.postalAgencyList)) {
                reassignAgencyList = this.props.postalAgencyList.filter(function (e) {
                    return e.value !== "*";
                });
            }
            else if (this.state.agencyType === 'PHYSICAL' && !_.isEmpty(this.props.physicalAgencyList)) {
                reassignAgencyList = this.props.physicalAgencyList.filter(function (e) {
                    return e.value !== "*";
                });
            }
            this.setState({ agencyId: reassignAgencyList[0].value, agencyName: reassignAgencyList[0].label });
        }
    }

    handleInputChange = (value, inputIdentifier) => {
        if (inputIdentifier === 'agencyType') {
            let updatedAgencyType = _.cloneDeep(this.state.agencyType);
            updatedAgencyType = value;

            if (updatedAgencyType !== this.state.agencyType) {
                if (updatedAgencyType === 'POSTAL' && _.isEmpty(this.props.postalAgencyList)) {
                    this.props.onGetAgencyList('postal', this.props.postalAgencyList, this.props.physicalAgencyList);
                }
                else if (updatedAgencyType === 'PHYSICAL' && _.isEmpty(this.props.physicalAgencyList)) {
                    this.props.onGetAgencyList('physical', this.props.postalAgencyList, this.props.physicalAgencyList);
                }
                this.setState({ agencyId: '', agencyName: 'select agency' });
            }
            this.setState({ agencyType: updatedAgencyType });
        }
        else {
            let updatedAgency = _.cloneDeep(this.state.agencyId);
            updatedAgency = value;

            let agencyName = this.state.agencyName;
            if (this.state.agencyType === 'POSTAL' && !_.isEmpty(this.props.postalAgencyList)) {
                agencyName = this.props.postalAgencyList.find(ele => ele.value === updatedAgency).label;
            }
            else if (this.state.agencyType === 'PHYSICAL' && !_.isEmpty(this.props.physicalAgencyList)) {
                agencyName = this.props.physicalAgencyList.find(ele => ele.value === updatedAgency).label;
            }
            this.setState({ agencyId: updatedAgency, agencyName: agencyName });
        }
    }

    handleReassign = () => {
        const { match } = this.props;

        let payload = {
            "agencyToAgencyType": this.state.agencyType.toUpperCase(),
            "agencyFromAgencyType": this.props.cardType.toUpperCase(),
            "agencyToAgencyId": this.state.agencyId,
            "objectIds": [match.params._id]
        }
        this.props.onReassign(payload, this.state.agencyName);
    }

    render() {
        const { t } = this.props;
        let reassignAgencyList = [];

        if (this.state.agencyType === 'POSTAL' && !_.isEmpty(this.props.postalAgencyList)) {
            reassignAgencyList = this.props.postalAgencyList.filter(function (e) {
                return e.value !== "*";
            });
        }
        else if (this.state.agencyType === 'PHYSICAL' && !_.isEmpty(this.props.physicalAgencyList)) {
            reassignAgencyList = this.props.physicalAgencyList.filter(function (e) {
                return e.value !== "*";
            });
        }

        let notificationPan =
            this.props.error ?
                <div className={cx(styles.ShowErrorNotificationCard, 'row no-gutters')}>
                    <div>
                        <img src={close} className='pr-2' alt='' />
                        <span className={styles.ErrorMsg}>{this.props.error}</span>
                    </div>
                </div>
                :
                <div className={styles.EmptyNotification}></div>

        return (
            <div className={cx('d-flex flex-column', styles.Backdrop)}>
                <div className={cx(styles.Container)}>
                    <div className={styles.Card}>
                        {notificationPan}
                        <div className={cx('d-flex flex-column', styles.Padding)}>
                            <label className={styles.AssignHeading}>
                                {this.props.caseStatus === 'UNASSIGNED' ? t('translation_addressTaskClosure:reassignModal.assignTask') : t('translation_addressTaskClosure:reassignModal.reassignTask')}
                            </label>
                            <div className={cx(styles.WarningBox, 'd-flex flex-row mt-2')}>
                                <span className='my-auto'>
                                    <img src={warning} style={{ height: '1.5rem' }} alt='' />
                                </span>
                                <p className='my-auto pl-2'>
                                    {(this.props.caseStatus === 'UNASSIGNED' ? "assigning" : "reassigning") + t('translation_addressTaskClosure:reassignModal.text')}
                                </p>
                            </div>

                            <div className='mt-2'>
                                <CustomSelect
                                    name='agencyType'
                                    className="col-8 px-0"
                                    label={t('translation_addressTaskClosure:reassignModal.agencyType')}
                                    required={true}
                                    options={agencyTypes}
                                    value={this.state.agencyType}
                                    onChange={(value) => this.handleInputChange(value, 'agencyType')}
                                />
                            </div>

                            {this.props.agencyListState === 'SUCCESS' ?
                                <div className='mt-2'>
                                    <CustomSelect
                                        name='agencyId'
                                        className="col-8 px-0"
                                        label={t('translation_addressTaskClosure:reassignModal.agency')}
                                        required={true}
                                        disabled={this.state.agencyType === 'select agency type'}
                                        options={reassignAgencyList}
                                        value={this.state.agencyId}
                                        onChange={(value) => this.handleInputChange(value, 'agencyId')}
                                    />
                                </div>
                                : null}

                            <div className='row no-gutters mt-4'>
                                <Button
                                    label={t('translation_addressTaskClosure:reassignModal.assign')}
                                    isDisabled={this.state.agencyType === 'select agency type' || _.isEmpty(this.state.agencyId) || this.props.reassignDataState === 'LOADING'}
                                    clickHandler={this.handleReassign}
                                />
                                <CancelButton clickHandler={this.props.closeModal} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        agencyListState: state.workloadMgmt.addressVerification.taskList.getAgencyTasksListState,
        physicalAgencyList: state.workloadMgmt.addressVerification.taskList.physicalAgencyList,
        postalAgencyList: state.workloadMgmt.addressVerification.taskList.postalAgencyList,

        reassignDataState: state.workloadMgmt.addressVerification.address.reassignDataState,
        reassignData: state.workloadMgmt.addressVerification.address.reassignData,

        error: state.workloadMgmt.addressVerification.address.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetAgencyList: (agencyType, postalAgencyList, physicalAgencyList) => dispatch(taskListActions.getAgencyList(agencyType, postalAgencyList, physicalAgencyList)),
        onReassign: (payload, agencyName) => dispatch(addressActions.reassignAgency(payload, agencyName))
    }
}

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(ReAssignModal)));
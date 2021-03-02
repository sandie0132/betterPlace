import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import _ from 'lodash';
import cx from 'classnames';
import styles from './TaskListFooter.module.scss';

import { Button } from 'react-crux';
import CancelButton from '../../../../../components/Molecule/CancelButton/CancelButton';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import arrowDown from '../../../../../assets/icons/greyDropdown.svg';
import arrowUp from '../../../../../assets/icons/dropdownArrow.svg';

const verificationTypes = ["physical verification", "postal verification"];

class TaskListFooter extends Component {

    state = {
        searchInput: '',
        showFieldExecutiveDropdown: false,
        executiveEmpId: '',
        showAgencyDropdown: false,
        selectedAgency: 'select agency',
        selectedAgencyId: '',
        showVerificationDropdown: false,
        selectedVerification: ''
    }

    componentDidMount = () => {
        if (this.props.type === 'reassign') {
            if (!_.isEmpty(this.props.cardType)) {
                this.setState({ selectedVerification: this.props.cardType + ' verification' })
            }
        }
    }

    handleSubmit = (value, empId) => {
        this.props.handleAssign(value, empId);
        this.props.closeFooter();
    }

    handleCancel = () => {
        this.props.closeFooter();
    }

    handleInputChange = (e) => {
        let key = e.target.value;

        this.props.searchExecutive(key);
        this.setState({ searchInput: key, showFieldExecutiveDropdown: true })
    }

    handleSelectedOption = (option, empId) => {
        this.setState({ searchInput: option, executiveEmpId: empId, showFieldExecutiveDropdown: false })
    }

    handleClickOutside = (name) => {
        if (name === 'agency') this.setState({ showAgencyDropdown: false })
        else if (name === 'verification') this.setState({ showVerificationDropdown: false })
        else this.setState({ showFieldExecutiveDropdown: false })
    }

    handleSelectedValues = (field, value) => {
        if (field === 'agency') {
            this.setState({ selectedAgency: value.label, selectedAgencyId: value.value });
        }
        else {
            this.setState({ selectedVerification: value, selectedAgency: 'select agency', selectedAgencyId: '' });

            //calling get agency list api only when respective data is empty
            if (value === 'postal verification' && _.isEmpty(this.props.postalAgencyList)) {
                this.props.onAgencyChange('postal');
            }
            else if (value === 'physical verification' && _.isEmpty(this.props.physicalAgencyList)) {
                this.props.onAgencyChange('physical');
            }
        }
    }

    handleReassign = () => {
        this.props.handleReassign(this.state.selectedVerification, this.state.selectedAgency, this.state.selectedAgencyId);
        this.props.closeFooter();
    }

    toggleReassignDropdown = (name) => {
        if (name === 'verification')
            this.setState({ showVerificationDropdown: !this.state.showVerificationDropdown });
        else
            this.setState({ showAgencyDropdown: !this.state.showAgencyDropdown });
    }

    render() {
        const { t } = this.props;

        let reassignAgencyList =
            this.state.selectedVerification === 'postal verification' ? this.props.postalAgencyList
                : this.state.selectedVerification === 'physical verification' ? this.props.physicalAgencyList
                    : [];

        if (!_.isEmpty(reassignAgencyList)) {
            reassignAgencyList = reassignAgencyList.filter(function (e) {
                return e.value !== "*";
            });
        }

        return (
            <React.Fragment>
                <div className={styles.Footer}>
                    <span className={styles.Number}>{this.props.selectedTaskCount}</span>&nbsp;{this.props.selectedTaskCount > 1 ?
                        <span>{t('translation_addressVerification:taskListFooter.tasks')}</span> : <span>{t('translation_addressVerification:taskListFooter.task')}</span>} {t('translation_addressVerification:taskListFooter.selected')}
                    <span className={cx(styles.verticalLine)}></span>
                    {this.props.type === 'reassign' ?
                        <span className="ml-4 pl-1">
                            &nbsp;{t('translation_addressVerification:taskListFooter.reassign')} {this.props.selectedTaskCount > 1 ? <span>{t('translation_addressVerification:taskListFooter.tasks')}</span> : <span>{t('translation_addressVerification:taskListFooter.task')}</span>}

                            <span className={("", styles.DisplayBlock)}>
                                <span className={cx("ml-3", styles.BorderField)} onClick={() => this.toggleReassignDropdown('verification')}>
                                    <span>{this.state.selectedVerification}</span>
                                    <img src={this.state.showVerificationDropdown ? arrowUp : arrowDown}
                                        className={cx(styles.Icon, this.state.showVerificationDropdown ? null : styles.DropdownIconDown)}
                                        alt=''
                                    />
                                </span>

                                <span onClick={() => this.handleClickOutside('verification')}>
                                    {this.state.showVerificationDropdown ?
                                        <span className={cx('row no-gutters', styles.VerifDropdown, scrollStyle.scrollbar)}>
                                            {(verificationTypes.length > 0) ?
                                                verificationTypes.map((verify, index) => {
                                                    return (<span key={index} className={styles.Options} onClick={() => this.handleSelectedValues('verification', verify)}>
                                                        {verify}
                                                    </span>)
                                                })
                                                : null}
                                        </span>
                                        : null}
                                </span>

                                <span className={cx("ml-3", styles.BorderField)} onClick={() => this.toggleReassignDropdown('agency')}>
                                    <span>{this.state.selectedAgency}</span>
                                    <img src={this.state.showAgencyDropdown ? arrowUp : arrowDown}
                                        className={cx(styles.Icon, this.state.showAgencyDropdown ? null : styles.DropdownIconDown)}
                                        alt=''
                                    />
                                </span>

                                <span onClick={() => this.handleClickOutside('agency')}>
                                    {this.state.showAgencyDropdown ?
                                        <span className={cx('row no-gutters', styles.AgencyDropdown, scrollStyle.scrollbar)}>
                                            {!_.isEmpty(reassignAgencyList) && reassignAgencyList.length > 0 ?
                                                reassignAgencyList.map((agency, index) => {
                                                    return (<span key={index} className={styles.Options} onClick={() => this.handleSelectedValues('agency', agency)}>
                                                        {agency.label}
                                                    </span>)
                                                })
                                                : null}
                                        </span>
                                        : null}
                                </span>

                                <span className={cx('d-flex', styles.AlignRight)}>
                                    <CancelButton clickHandler={this.handleCancel} />
                                    <Button label={t('translation_addressVerification:taskListFooter.done')} type="medium" clickHandler={this.handleReassign} isDisabled={this.state.selectedAgency === 'select agency'} />
                                </span>
                            </span>
                        </span>
                        :
                        <span className="ml-4 pl-1">
                            &nbsp;{t('translation_addressVerification:taskListFooter.assign')}&nbsp;
                            {this.props.selectedTaskCount > 1 ? <span>{t('translation_addressVerification:taskListFooter.tasks')}</span> : <span>{t('translation_addressVerification:taskListFooter.task')}</span>}
                            &nbsp;{t('translation_addressVerification:taskListFooter.to')}

                            <span className={('pl-3', styles.DisplayBlock)}>
                                <input
                                    type='text'
                                    placeholder={t('translation_addressVerification:taskListFooter.search')}
                                    value={this.state.searchInput}
                                    onPaste={(e) => this.handleInputChange(e)}
                                    onChange={e => this.handleInputChange(e)}
                                    className={cx('mb-2 px-3 ml-3', styles.SearchField)}
                                />

                                <span onClick={this.handleClickOutside}>
                                    {this.state.showFieldExecutiveDropdown ?
                                        <span className={cx('row no-gutters', styles.SearchDropdown, scrollStyle.scrollbar)}>
                                            {!_.isEmpty(this.props.searchExecutiveResults) && this.props.searchExecutiveResults.length > 0 ?
                                                this.props.searchExecutiveResults.map((emp, index) => {
                                                    let empName = emp.firstName + " " + emp.lastName
                                                    return (
                                                        <span key={index} className={styles.Options} onClick={() => this.handleSelectedOption(empName, emp.empId)}>
                                                            {empName}
                                                        </span>)
                                                })
                                                : null}
                                        </span>
                                        : null}
                                </span>

                                <span className={cx('d-flex', styles.AlignRight)}>
                                    <CancelButton clickHandler={this.handleCancel} />
                                    <Button label={t('translation_addressVerification:taskListFooter.assign')} type="medium" clickHandler={() => this.handleSubmit(this.state.searchInput, this.state.executiveEmpId)} isDisabled={!this.state.executiveEmpId} />
                                </span>
                            </span>
                        </span>
                    }
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        agencyListState: state.workloadMgmt.addressVerification.taskList.getAgencyTasksListState,
        agencyList: state.workloadMgmt.addressVerification.taskList.agencyTasksList,
        physicalAgencyList: state.workloadMgmt.addressVerification.taskList.physicalAgencyList,
        postalAgencyList: state.workloadMgmt.addressVerification.taskList.postalAgencyList,
    }
};

export default withTranslation()(connect(mapStateToProps, null)(TaskListFooter));
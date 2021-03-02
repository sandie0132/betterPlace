import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import _ from 'lodash';
import cx from 'classnames';
import styles from './VerificationExcel.module.scss';

import * as actions from '../Store/action';

import Loader from '../../../../../components/Organism/Loader/Loader';
import { Button } from 'react-crux';

import excelSuccess from '../../../../../assets/icons/excelSuccess.svg';
import reloadExcel from '../../../../../assets/icons/reloadExcel.svg';
import verify from '../../../../../assets/icons/verifyBigIcon.svg';
import up from '../../../../../assets/icons/up.svg';
import down from '../../../../../assets/icons/down.svg';

class VerificationExcel extends Component {

    state = {
        orgId: null,
        openVerifyTab: false,
        bgvInitiateState: 'INIT',
        reinitiateState: 'INIT'
    }

    componentDidMount = () => {
        const { match } = this.props;
        const orgId = match.params.uuid;
        this.setState({ orgId: orgId });
    }

    componentDidUpdate = (prevProps, prevState) => {

        //bgv initiate
        if (prevProps.bgvInitiateData !== this.props.bgvInitiateData && this.props.bgvInitiateExcelState === 'SUCCESS' && this.state.bgvInitiateState !== 'SUCCESS') {
            this.setState({ bgvInitiateState: 'SUCCESS' })
        }
        if (prevProps.bgvInitiateData !== this.props.bgvInitiateData && this.props.bgvInitiateExcelState === 'ERROR' && this.state.bgvInitiateState !== 'ERROR') {
            this.setState({ bgvInitiateState: 'ERROR' })
        }

        //re-initiate
        if (prevProps.reinitiateData !== this.props.reinitiateData && this.props.reinitiateExcelState === 'SUCCESS' && this.state.reinitiateState !== 'SUCCESS') {
            this.setState({ reinitiateState: 'SUCCESS' })
        }
        if (prevProps.reinitiateData !== this.props.reinitiateData && this.props.reinitiateExcelState === 'ERROR' && this.state.reinitiateState !== 'ERROR') {
            this.setState({ reinitiateState: 'ERROR' })
        }

        if (this.props.onboardCount >= 0 || this.props.updateCount >= 0 || this.props.terminateCount >= 0 ||
            (this.props.initiateCount > 0 && this.state.bgvInitiateState === 'SUCCESS') ||
            (this.props.reinitiateCount > 0 && this.state.reinitiateState === 'SUCCESS')) {
            this.props.verificationStatus(this.props, this.state);
        }
    }

    componentWillUnmount = () => {
        this.props.onGetInitState();
        this.setState({ bgvInitiateState: 'INIT', reinitiateState: 'INIT' })
    }

    handleVerification = (verificationType) => {
        if (verificationType === 'bgv') {
            this.setState({ bgvInitiateState: 'LOADING' })
            if (!_.isEmpty(this.props.checkExcelStatus)) {
                this.props.onBgvInitiate(this.state.orgId, this.props.checkExcelStatus._id)
            }
            else {
                this.props.onBgvInitiate(this.state.orgId, this.props.uploadResponse.data._id)
            }
        }
        else if (verificationType === 'reinitiate') {
            this.setState({ reinitiateState: 'LOADING' })
            if (!_.isEmpty(this.props.checkExcelStatus)) {
                this.props.onBgvReinitiate(this.state.orgId, this.props.checkExcelStatus._id)
            }
            else {
                this.props.onBgvReinitiate(this.state.orgId, this.props.uploadResponse.data._id)
            }
        }
    }

    handleToggleTab = () => {
        this.setState({ openVerifyTab: !this.state.openVerifyTab })
    }

    render() {
        const { t } = this.props;

        let empCount = this.props.initiateCount + this.props.reinitiateCount;
        let employees = empCount > 1 ? ' employees' : ' employee';

        return (
            <React.Fragment>
                <div className={styles.VerificationTab}>

                    {this.props.initiateCount > 0 || this.props.reinitiateCount > 0 ?
                        <div className={cx('row no-gutters', styles.VerifyBg)}>
                            <img src={verify} alt='' />
                            <span className='d-flex flex-column ml-3'>
                                <p className={styles.VerifyHeading}>{t('translation_empExcelOnboarding:verificationExcel.verify')}</p>
                                <p className={styles.VerifySubHeading}>{empCount + employees}  {t('translation_empExcelOnboarding:verificationExcel.empMarked')}</p>
                            </span>
                            <img src={this.state.openVerifyTab ? up : down}
                                className='ml-auto' style={{ cursor: 'pointer' }}
                                onClick={this.handleToggleTab} alt=''
                            />
                            {this.state.openVerifyTab ?
                                <hr className={cx(styles.HorizontalLine)} />
                                : null}

                            {/* initiate row*/}
                            {this.state.openVerifyTab && this.props.initiateCount > 0 ?
                                <React.Fragment>
                                    <div style={{ height: "3.5rem", width: "100%" }}>
                                        <div className={cx(styles.FlexContainer)}>
                                            <div>
                                                <label className={styles.ProcessHeading}> {t('translation_empExcelOnboarding:verificationExcel.initiate')}</label>
                                                {
                                                    // {this.state.bgvInitiateState === 'LOADING' ?
                                                    //     <div className={cx(styles.ProgressBarLayout)}>
                                                    //         <span className={styles.ProgressBarMessage}> initiating bgv for <label style={{ width: '1.8rem', textAlign: "center" }}>{this.props.bgvInitiateCount}</label>/ {this.props.bgvInitiateTotal} &nbsp; employees </span>
                                                    //         <ProgressSlider
                                                    //             min={0}
                                                    //             max={this.props.bgvInitiateTotal}
                                                    //             value={this.props.bgvInitiateCount}
                                                    //             status='LOADING'
                                                    //         />
                                                    //     </div> :
                                                    // this.state.bgvInitiateState === 'SUCCESS' ?
                                                    this.props.bgvInitiateExcelState === 'SUCCESS' ?
                                                        <div>
                                                            <label className={styles.ProgressBarMessage}>{t('translation_empExcelOnboarding:verificationExcel.initiateFor')} {this.props.initiateCount} {t('translation_empExcelOnboarding:verificationExcel.success')}</label>
                                                        </div>
                                                        // : this.state.bgvInitiateState === 'ERROR' ?
                                                        : this.props.bgvInitiateExcelState === 'ERROR' ?
                                                            <div>
                                                                <label className={styles.ProgressBarErrorMessage}>{t('translation_empExcelOnboarding:verificationExcel.failed')} {this.props.initiateCount} {t('translation_empExcelOnboarding:verificationExcel.employees')}</label>
                                                            </div>
                                                            // <div className={cx('row no-gutters')}>
                                                            //     <span className={styles.ProgressBarErrorMessage}>{this.props.bgvInitiateError}</span>
                                                            //     <span className={cx("ml-3", styles.ProgressBarErrorLoader)}></span>
                                                            // </div>
                                                            :
                                                            <div>
                                                                <label className={styles.ProcessSubheading}>{t('translation_empExcelOnboarding:verificationExcel.init')} {this.props.initiateCount} {t('translation_empExcelOnboarding:verificationExcel.employees')}</label>
                                                            </div>
                                                }
                                            </div>
                                            {this.props.bgvInitiateExcelState === 'LOADING' ?
                                                <div className={styles.StepLoader}>
                                                    <Loader type='stepLoader' />
                                                </div>
                                                : this.props.bgvInitiateExcelState === 'SUCCESS' ?
                                                    <img src={excelSuccess} alt='' className={styles.SuccessImage} />
                                                    : this.props.bgvInitiateExcelState === 'ERROR' ?
                                                        <img src={reloadExcel} style={{ cursor: 'pointer', marginRight: '0.5rem' }} alt='' onClick={() => this.handleVerification('bgv')} />
                                                        : <Button label={t('translation_empExcelOnboarding:verificationExcel.initBgv')} className='my-1' type='whiteButton' clickHandler={() => this.handleVerification('bgv')} isDisabled={this.props.disabled} />}
                                        </div>
                                    </div>
                                    {this.props.reinitiateCount > 0 ?
                                        <hr className={cx(styles.HorizontalLine)} />
                                        : null}
                                </React.Fragment>
                                : null}
                            {/* re-initiate row*/}
                            {this.state.openVerifyTab && this.props.reinitiateCount > 0 ?
                                <div style={{ height: "3.5rem", width: "100%" }}>
                                    <div className={cx(styles.FlexContainer)}>
                                        <div>
                                            <label className={styles.ProcessHeading}> {t('translation_empExcelOnboarding:verificationExcel.reinitiate')} </label>
                                            {
                                                // this.state.reinitiateState === 'LOADING' ?
                                                //     <div className={cx(styles.ProgressBarLayout)}>
                                                //         <span className={styles.ProgressBarMessage}> reinitiating bgv for <label style={{ width: '1.8rem', textAlign: "center" }}>{this.props.reinitiateCount}</label>/ {this.props.reinitiateTotal} &nbsp; employees </span>
                                                //         <ProgressSlider
                                                //             min={0}
                                                //             max={this.props.reinitiateTotal}
                                                //             value={this.props.reinitiateCount}
                                                //             status='LOADING'
                                                //         />
                                                //     </div> : 
                                                this.props.reinitiateExcelState === 'SUCCESS' ?
                                                    <div>
                                                        <label className={styles.ProgressBarMessage}>{t('translation_empExcelOnboarding:verificationExcel.reinitiateFor')} {this.props.reinitiateCount} {t('translation_empExcelOnboarding:verificationExcel.success')}</label>
                                                    </div>
                                                    : this.props.reinitiateExcelState === 'ERROR' ?
                                                        <div>
                                                            <label className={styles.ProgressBarErrorMessage}>{t('translation_empExcelOnboarding:verificationExcel.reinitFailed')} {this.props.reinitiateCount} {t('translation_empExcelOnboarding:verificationExcel.employees')}</label>
                                                        </div>
                                                        // <div className={cx('row no-gutters')}>
                                                        //     <span className={styles.ProgressBarErrorMessage}>failed due to some network issue</span>
                                                        //     <span className={cx("ml-3", styles.ProgressBarErrorLoader)}></span>
                                                        // </div> :
                                                        :
                                                        <div>
                                                            <label className={styles.ProcessSubheading}>{t('translation_empExcelOnboarding:verificationExcel.reinit')} {this.props.reinitiateCount} {t('translation_empExcelOnboarding:verificationExcel.employees')}</label>
                                                        </div>
                                            }
                                        </div>
                                        {this.props.reinitiateExcelState === 'LOADING' ?
                                            <div className={styles.StepLoader}>
                                                <Loader type='stepLoader' />
                                            </div>
                                            : this.props.reinitiateExcelState === 'SUCCESS' ?
                                                <img src={excelSuccess} alt='' className={styles.SuccessImage} />
                                                : this.props.reinitiateExcelState === 'ERROR' ?
                                                    <img src={reloadExcel} style={{ cursor: 'pointer', marginRight: '0.5rem' }} alt='' onClick={() => this.handleVerification('reinitiate')} />
                                                    : <Button label={t('translation_empExcelOnboarding:verificationExcel.reinitiate')} type='whiteButton' className='my-1' clickHandler={() => this.handleVerification('reinitiate')} isDisabled={this.props.disabled} />}
                                    </div>
                                </div>
                                : null}
                        </div>
                        : null}
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        bgvInitiateExcelState: state.empMgmt.excelOnboard.bgvInitiateState,
        bgvInitiateData: state.empMgmt.excelOnboard.bgvInitiateData,
        bgvInitiateError: state.empMgmt.excelOnboard.bgvInitiateError,

        reinitiateExcelState: state.empMgmt.excelOnboard.bgvReinitiateState,
        reinitiateData: state.empMgmt.excelOnboard.bgvReinitiateData,
        reinitiateError: state.empMgmt.excelOnboard.bgvReinitiateError
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetInitState: () => dispatch(actions.initState()),
        onBgvInitiate: (orgId, fileId) => dispatch(actions.bgvInitiate(orgId, fileId)),
        onBgvReinitiate: (orgId, fileId) => dispatch(actions.bgvReinitiate(orgId, fileId))
    }
}

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(VerificationExcel)));
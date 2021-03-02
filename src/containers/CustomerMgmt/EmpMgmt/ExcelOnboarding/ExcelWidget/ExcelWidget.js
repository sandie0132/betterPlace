import React, { Component } from "react";
import { NavLink } from 'react-router-dom';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { withTranslation } from "react-i18next";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";

import _ from 'lodash';
import cx from 'classnames';
import styles from './ExcelWidget.module.scss';

import * as actions from '../Store/action';

import excelIcon from '../../../../../assets/icons/excelIcon.svg';
import scanExcel from '../../../../../assets/icons/scanExcel.svg';
import processExcel from '../../../../../assets/icons/processExcel.svg';
import verificationExcel from '../../../../../assets/icons/verificationExcel.svg';
import excelSuccess from '../../../../../assets/icons/excelSuccess.svg';
import warning from '../../../../../assets/icons/errorWarning.svg';
import arrow from '../../../../../assets/icons/blueRightArrow.svg';

class ExcelWidget extends Component {

    state = {
        upload: 'INIT',
        scan: 'INIT',
        process: 'INIT',
        verify: 'INIT'
    }

    componentDidMount = () => {
        const { match } = this.props;
        const orgId = match.params.uuid;
        this.props.onCheckFile(orgId);
    }

    componentDidUpdate = (prevProps) => {

        if (this.props.checkExcelStatusState !== prevProps.checkExcelStatusState && this.props.checkExcelStatusState === 'SUCCESS') {
            if (!_.isEmpty(this.props.checkExcelStatus) && this.props.checkExcelStatus.status !== 'done') {
                if (this.props.checkExcelStatus.currentStatus === 'uploaded') {
                    this.setState({ upload: 'SUCCESS', scan: 'LOADING' })
                }
                else if (this.props.checkExcelStatus.currentStatus === 'scanned' || this.props.checkExcelStatus.currentStatus === 'processing') {
                    this.setState({ upload: 'SUCCESS', scan: 'SUCCESS', process: 'LOADING' })
                }
                else if (this.props.checkExcelStatus.currentStatus === 'processed') {
                    this.setState({ upload: 'SUCCESS', scan: 'SUCCESS', process: 'SUCCESS', verify: 'LOADING' })
                }
                else if (this.props.checkExcelStatus.currentStatus === 'reInitiated' || this.props.checkExcelStatus.currentStatus === 'initiated') {
                    this.setState({ upload: 'SUCCESS', scan: 'SUCCESS', process: 'SUCCESS', verify: 'SUCCESS' })
                }
            }
        }
    }

    render() {

        const { match } = this.props;
        const orgId = match.params.uuid;
        const { t } = this.props;

        let displayIcon = this.state.upload === 'LOADING' || this.state.upload === 'ERROR' ? excelIcon
            : this.state.scan === 'LOADING' || this.state.scan === 'ERROR' ? scanExcel
                : this.state.process === 'LOADING' || this.state.process === 'ERROR' ? processExcel
                    : this.state.verify === 'LOADING' || this.state.verify === 'SUCCESS' || this.state.verify === 'ERROR' ? verificationExcel
                        : excelIcon

        let percentage = this.state.verify === 'SUCCESS' ? 100
            : this.state.process === 'SUCCESS' ? 75
                : this.state.scan === 'SUCCESS' ? 50
                    : this.state.upload === 'SUCCESS' ? 25
                        : 0

        return (
            <React.Fragment>
                {this.props.checkExcelStatusState === 'SUCCESS' ?
                    !_.isEmpty(this.props.checkExcelStatus) && !_.isEmpty(this.props.checkExcelStatus.status) && this.props.checkExcelStatus.status !== 'done' ?
                        <div className={cx(styles.StickyCard, 'd-flex flex-row')}>
                            <div className={styles.StatusCircle}>
                                <CircularProgressbarWithChildren
                                    value={percentage}
                                    strokeWidth={5}
                                    background
                                    styles={buildStyles({
                                        pathColor: "#0059B2",
                                        trailColor: "#F4F7FB",
                                        backgroundColor: "#F4F7FB"
                                    })}
                                >
                                    <img src={displayIcon} height="50%" width="80%" y="33%" x="1" alt=""></img>
                                </CircularProgressbarWithChildren>
                            </div>

                            <div className='ml-1 d-flex flex-column' style={{ width: '65%' }}>
                                <label className={cx('mt-3', styles.Heading)}>{t('translation_empExcelOnboarding:excelWidget.empOnboarding')}</label>

                                <div className='d-flex flex-row'>
                                    {this.state.upload === 'INIT' ? <div className='row no-gutters'><div className={styles.PendingStatus}></div><hr className={styles.PendingHr} /></div>
                                        : this.state.upload === 'LOADING' ? <div className={cx('mr-1', styles.LoadingStatus)}>&emsp;{t('translation_empExcelOnboarding:excelWidget.uploading')}&emsp;</div>
                                            : this.state.upload === 'SUCCESS' ? <div className={cx(styles.SuccessStatus, 'row no-gutters')}><img src={excelSuccess} style={{ height: '14px' }} alt='' /><hr className={styles.SuccessHr} /></div>
                                                : <div className={cx('mr-1', styles.ErrorStatus)}>&nbsp;<img src={warning} style={{ height: '12px' }} alt='' />&nbsp;{t('translation_empExcelOnboarding:excelWidget.error')}&nbsp;</div>
                                    }

                                    {this.state.scan === 'INIT' ? <div className='row no-gutters'><div className={styles.PendingStatus}></div><hr className={styles.PendingHr} /></div>
                                        : this.state.scan === 'LOADING' ? <div className={cx('mr-1', styles.LoadingStatus)}>&emsp;{t('translation_empExcelOnboarding:excelWidget.scanning')}&emsp;</div>
                                            : this.state.scan === 'SUCCESS' ? <div className={cx(styles.SuccessStatus, 'row no-gutters')}><img src={excelSuccess} style={{ height: '14px' }} alt='' /><hr className={styles.SuccessHr} /></div>
                                                : <div className={cx('mr-1', styles.ErrorStatus)}>&nbsp;<img src={warning} style={{ height: '12px' }} alt='' />&nbsp;{t('translation_empExcelOnboarding:excelWidget.error')}&nbsp;</div>
                                    }

                                    {this.state.process === 'INIT' ? <div className='row no-gutters'><div className={styles.PendingStatus}></div><hr className={styles.PendingHr} /></div>
                                        : this.state.process === 'LOADING' ? <div className={cx('mr-1', styles.LoadingStatus)}>&emsp;{t('translation_empExcelOnboarding:excelWidget.processing')}&emsp;</div>
                                            : this.state.process === 'SUCCESS' ? <div className={cx(styles.SuccessStatus, 'row no-gutters')}><img src={excelSuccess} style={{ height: '14px' }} alt='' /><hr className={styles.SuccessHr} /></div>
                                                : <div className={cx('mr-1', styles.ErrorStatus)}>&nbsp;<img src={warning} style={{ height: '12px' }} alt='' />&nbsp;{t('translation_empExcelOnboarding:excelWidget.error')}&nbsp;</div>
                                    }

                                    {this.state.verify === 'INIT' ? <div className='row no-gutters'><div className={styles.PendingStatus}></div></div>
                                        : this.state.verify === 'LOADING' ? <div className={cx('mr-1', styles.LoadingStatus)}>&emsp;{t('translation_empExcelOnboarding:excelWidget.verifying')}&emsp;</div>
                                            : this.state.verify === 'SUCCESS' ? <div className={cx(styles.SuccessStatus, 'row no-gutters')}><img src={excelSuccess} style={{ height: '14px' }} alt='' /></div>
                                                : <div className={cx('mr-1', styles.ErrorStatus)}>&nbsp;<img src={warning} style={{ height: '12px' }} alt='' />&nbsp;{t('translation_empExcelOnboarding:excelWidget.error')}&nbsp;</div>
                                    }
                                </div>
                            </div>

                            <NavLink to={`/customer-mgmt/org/${orgId}/employee/excelonboard`}>
                                <div className='flex-row'>
                                    <img src={arrow} alt='' style={{ height: '10px', marginTop: '2rem', cursor: 'pointer' }} />
                                </div>
                            </NavLink>
                        </div>
                        : null
                    : null}
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        checkExcelStatusState: state.empMgmt.excelOnboard.checkExcelStatusState,
        checkExcelStatus: state.empMgmt.excelOnboard.checkExcelStatus
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onCheckFile: (orgId) => dispatch(actions.checkExcel(orgId))
    }
}

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(ExcelWidget)));
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import cx from 'classnames';
import styles from './ResultCard.module.scss';

import { Button } from 'react-crux';
import DownloadButton from '../../../../../components/Atom/DownloadButton/DownloadButton';

// import blackTick from '../../../../../assets/icons/blackTick.svg';
// import blackDownloadIcon from '../../../../../assets/icons/blackDownloadIcon.svg';
import tick from '../../../../../assets/icons/bigTick.svg';
import warning from '../../../../../assets/icons/bigWarningIcon.svg';

class ResultCard extends Component {

    state = {
        orgId: null
    }

    componentDidMount = () => {
        const { match } = this.props;
        const orgId = match.params.uuid;
        this.setState({ orgId: orgId })
    }

    render() {
        const { t } = this.props;
        let empRecord = '';
        if (this.props.errorCount > 1) empRecord = 'employee records'
        else empRecord = 'employee record'

        return (
            <React.Fragment>
                <div className='col-12 px-0'>
                    {this.props.type === 'error' ?
                        <div className={cx(styles.ErrorBackground, 'd-flex')}>
                            <div className='pl-2 pr-3 mt-2'>
                                <img src={warning} alt='' />
                            </div>
                            <div className='flex-column' style={{ width: '100%' }}>
                                <label className={styles.ErrorMessage}>{t('translation_empExcelOnboarding:resultCard.errors')}</label><br />
                                <label className={styles.ErrorMessageSubheading}>{this.props.errorCount}&nbsp;{empRecord} {this.props.noErrorExcelDownload ? t('translation_empExcelOnboarding:resultCard.noErrorDownloadFile') : t('translation_empExcelOnboarding:resultCard.found')}</label>
                            </div>

                            {this.props.noErrorExcelDownload ?
                                <Button
                                    type='whiteButton'
                                    label={t('translation_empExcelOnboarding:resultCard.done')}
                                    className={cx(styles.RedirectButton)}
                                    clickHandler={this.props.handleRedirect}
                                />
                                :
                                <DownloadButton
                                    type='errorExcelDownload'
                                    label={this.props.downloadExcelState}
                                    downloadState={this.props.downloadExcelState}
                                    clickHandler={this.props.handleDownload}
                                />}
                        </div>
                        :
                        this.props.type === 'success' ?
                            <div className={cx(styles.SuccessBackground, 'd-flex')}>
                                <div className='pl-2 pr-3 mt-2'>
                                    <img src={tick} alt='' />
                                </div>
                                <div className='flex-column'>
                                    <label className={styles.ErrorMessage}>{t('translation_empExcelOnboarding:resultCard.success')}</label>
                                    <label className={styles.ErrorMessageSubheading}>{this.props.successCount} {t('translation_empExcelOnboarding:resultCard.rows')}</label>
                                    {(this.props.bgvInitiateExcelState === 'INIT' && this.props.initiateCount > 0) || (this.props.reinitiateExcelState === 'INIT' && this.props.reInitiateCount > 0) ?
                                        <label className={cx('px-2', styles.SkipLabel)}>
                                            {t('translation_empExcelOnboarding:resultCard.skipLabel')} {this.props.successCount} {t('translation_empExcelOnboarding:resultCard.row')}
                                        </label>
                                        : null}
                                </div>
                                <Button
                                    type='whiteButton'
                                    label={t('translation_empExcelOnboarding:resultCard.done')}
                                    className={cx(styles.RedirectButton)}
                                    clickHandler={this.props.handleRedirect}
                                />
                            </div>
                            : null}
                </div>
            </React.Fragment>
        )
    }

}

const mapStateToProps = state => {
    return {
        authUser: state.auth.user,
        bgvInitiateExcelState: state.empMgmt.excelOnboard.bgvInitiateState,
        reinitiateExcelState: state.empMgmt.excelOnboard.bgvReinitiateState
    }
}

export default withTranslation()(withRouter(connect(mapStateToProps, null)(ResultCard)));
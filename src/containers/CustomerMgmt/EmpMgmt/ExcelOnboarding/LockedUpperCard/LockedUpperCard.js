
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import _ from 'lodash';
import cx from 'classnames';
import styles from './LockedUpperCard.module.scss';

import greyWarning from '../../../../../assets/icons/greyWarning.svg';
import profileIcon from '../../../../../assets/icons/defaultProfileBigIcon.svg';
import lockIcon from '../../../../../assets/icons/lockIcon.svg';

class LockedUpperCard extends Component {

    render() {
        const { t } = this.props;

        return (
            <div className={cx(styles.UpperCard, 'd-flex flex-row justify-content-between')}>
                <div className='d-flex flex-row mt-1' style={{ width: '63%' }}>
                    <span className='pr-3 mt-1'>
                        <img src={greyWarning} alt={t('translation_empExcelOnboarding:lockedCard.img')} />
                    </span>

                    <span className={styles.UpperCardLine1}>
                        {t('translation_empExcelOnboarding:lockedCard.excelUpload')}
                    </span>
                </div>

                <div className='d-flex flex-row'>
                    <span className='flex-column' style={{ marginTop: '0.4rem' }}>
                        <p className={styles.LockText}>{t('translation_empExcelOnboarding:lockedCard.currentExcel')}</p>
                        <p className={styles.UserName}>{!_.isEmpty(this.props.userDetails) ? this.props.userDetails.data.firstName + (!_.isEmpty(this.props.userDetails.data.lastName) ? ' ' + this.props.userDetails.data.lastName : '') : ''}</p>
                    </span>
                    <img
                        className={styles.ProfileImg}
                        src={!_.isEmpty(this.props.userDetails) && !_.isEmpty(this.props.userDetails.data.profilePicUrl) ?
                            (this.props.images[this.props.empId] ?
                                this.props.images[this.props.empId]['image'] : null)
                            : profileIcon}
                        alt={t('translation_empExcelOnboarding:lockedCard.img')}
                    />
                    <img className={styles.LockIcon} src={lockIcon} alt={t('translation_empExcelOnboarding:lockedCard.img')} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        userDetails: state.empMgmt.excelOnboard.userDetails,
        images: state.imageStore.images
    }
}

export default withTranslation()(withRouter(connect(mapStateToProps, null)(LockedUpperCard)));
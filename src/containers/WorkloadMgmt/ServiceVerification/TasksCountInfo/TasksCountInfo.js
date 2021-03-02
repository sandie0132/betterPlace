import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import styles from './TasksCountInfo.module.scss';
import cx from 'classnames';
import _ from 'lodash';

import Loader from '../../../../components/Organism/Loader/Loader';
import panCard from '../../../../assets/icons/panCard.svg';
import dl from '../../../../assets/icons/drivinglicenseCard.svg';
import aadharCard from '../../../../assets/icons/aadhaarCard.svg';
import voterCard from '../../../../assets/icons/voterCard.svg';
import courtCard from '../../../../assets/icons/courtCard.svg';
import pvcCard from '../../../../assets/icons/pvcBigIcon.svg';
import rcUpperCard from '../../../../assets/icons/rcUpperCard.svg';
import addressReviewcard from '../../../../assets/icons/addressReviewBigIcon.svg';
import empVerify from '../../../../assets/icons/empVerifyBigIcon.svg';
import empRef from '../../../../assets/icons/empRefBigIcon.svg';
import health from '../../../../assets/icons/healthCheckBigIcon.svg';
import globaldb from '../../../../assets/icons/global.svg';
import education from '../../../../assets/icons/educationCheckBigIcon.svg';

import { nameHandler } from '../initData';

import * as serviceVerificationActions from '../Store/action';

const IdCardImg = {
    'pan': panCard,
    'aadhaar': aadharCard,
    'voter-card': voterCard,
    'driving-license': dl,
    'court': courtCard,
    'police': pvcCard,
    'rc': rcUpperCard,
    'employment': empVerify,
    'reference': empRef,
    'education': education,
    'health': health,
    'globaldb': globaldb,
    'addressReview': addressReviewcard,
}

class PendingTasksCountInfo extends Component {

    render() {   
        const { t } = this.props;
        return (
            <React.Fragment>
                {this.props.getDocumentState === 'LOADING' ?
                    <Loader type='opsTask' />
                    :
                    <div className={cx('mt-4', styles.UpperCard)}>
                        <label className={styles.Font}>
                            {t('translation_docVerification:todo')}
                            {" " + nameHandler[this.props.taskType].replace(/_/g, " ")}
                        </label>
                        <img
                            align='right'
                            src={IdCardImg[this.props.taskType]}
                            alt={t('translation_docVerification:image_alt_docVerification.card')}
                        />
                        
                        <label className={cx('row', styles.Numbers)}>
                            {_.isEmpty(this.props.selectedSearchResult)
                                ? this.props.documentsList[nameHandler[this.props.taskType]]
                                :
                                this.props.documentsList[nameHandler[this.props.taskType]] > 0 ?
                                    this.props.documentsList[nameHandler[this.props.taskType]] - 1 : this.props.documentsList[nameHandler[this.props.taskType]]
                            }
                        </label>
                        
                    </div>
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        getDocumentState: state.opsHome.getDocumentsState,
        documentsList: state.opsHome.DocumentsList,
        postalTasksCount : state.workloadMgmt.DocVerification.postalTasksCount,
        addressAgencyCount : state.workloadMgmt.DocVerification.addressAgencyCount,
        addressAgencyCountState : state.workloadMgmt.DocVerification.addressAgencyCountState
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getPostalCount: (type,agencyName) => dispatch(serviceVerificationActions.excelTasksCount(type,agencyName))
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(PendingTasksCountInfo));
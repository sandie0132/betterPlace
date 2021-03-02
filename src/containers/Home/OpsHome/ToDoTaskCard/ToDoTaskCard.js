import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import cx from 'classnames';
import styles from './ToDoTaskCard.module.scss';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

import panCard from '../../../../assets/icons/panCardBigIcon.svg';
import aadharCard from '../../../../assets/icons/aadharCardBigIcon.svg';
import voterCard from '../../../../assets/icons/voterCardBigIcon.svg';
import dlCard from '../../../../assets/icons/dlBigIcon.svg';
import rcCard from '../../../../assets/icons/rcBigIcon.svg';
import addReviewCard from '../../../../assets/icons/manualVerification.svg';
import phyAddressCard from '../../../../assets/icons/physicalAddressCard.svg';
import postalCard from '../../../../assets/icons/postalConfigIcon.svg';
import courtCard from '../../../../assets/icons/courtCardBigIcon.svg';
import pvcCard from '../../../../assets/icons/pvcConfigIcon.svg';
import employmentCard from '../../../../assets/icons/empVerifyCard.svg';
import educationCard from '../../../../assets/icons/educationCheckCard.svg';
import healthCard from '../../../../assets/icons/healthCheckCard.svg';
import referenceCard from '../../../../assets/icons/empRefCard.svg';
import globaldb from '../../../../assets/icons/dbCheckCard.svg';
import rightArrowIcon from '../../../../assets/icons/arrowRightLongIcon.svg';


const cardsToBeDisplayed = {
    "pan": { icon: panCard, url: '/pan', cardBg: styles.TaskCardPan },
    "aadhaar": { icon: aadharCard, url: '/aadhaar', cardBg: styles.TaskCardAadhar },
    "voter": { icon: voterCard, url: '/voter-card', cardBg: styles.TaskCardVoter },
    "dl": { icon: dlCard, url: '/driving-license', cardBg: styles.TaskCardDl },
    "rc": { icon: rcCard, url: '/rc', cardBg: styles.TaskCardRc },

    "address_review": { icon: addReviewCard, url: '/addressReview', cardBg: styles.TaskCardManual },
    "globaldb": { icon: globaldb, url: '/globaldb', cardBg: styles.TaskCardRc },

    "postal_address": { icon: postalCard, url: '/address/postal', cardBg: styles.TaskCardPostal },
    "physical_address": { icon: phyAddressCard, url: '/address/physical', cardBg: styles.TaskCardRc },

    "crc": { icon: courtCard, url: '/court', cardBg: styles.TaskCardCourt },
    "pvc": { icon: pvcCard, url: '/police', cardBg: styles.TaskCardPvc },

    "employment": { icon: employmentCard, url: '/employment', cardBg: styles.TaskCardRc },
    "education": { icon: educationCard, url: '/education', cardBg: styles.TaskCardRc },

    "health": { icon: healthCard, url: '/health', cardBg: styles.TaskCardRc },
    "reference": { icon: referenceCard, url: '/reference', cardBg: styles.TaskCardRc },

    // "agency_physical_address": { icon: phyAddressCard, url: '/address/physical', cardBg: styles.TaskCardRc },
}

const ToDoTaskCard = (props) => {

    const { t } = props;

    let searchParam =
        // props.name === "agency_physical_address" ||
        props.name === "postal_address" || props.name === "physical_address" ? 'dateRange=LAST_MONTH'
            : "?filter=todos"

    return (
        <React.Fragment>
            {!_.isEmpty(cardsToBeDisplayed) && !_.isEmpty(cardsToBeDisplayed[props.name]) ?
                <NavLink to={{
                    pathname: '/workload-mgmt' + cardsToBeDisplayed[props.name].url,
                    data: {
                        count: props.count,
                        cardType: props.name
                    },
                    search: searchParam
                }}
                    className={cx('mt-3 mb-2 py-4 mr-4', cardsToBeDisplayed[props.name].cardBg, styles.hideUnderLine)}>
                    <div className='row no-gutters'>
                        <span className='ml-4'>
                            <img className={styles.DocumentIcon} src={cardsToBeDisplayed[props.name].icon} alt='icon' />
                        </span>

                        <div className='col-4 d-flex flex-column'>
                            <span className={styles.task}>{t('translation_opsHome:tasksToDo')}</span>
                            <span className={cx(styles.count)}>{props.count}</span>
                        </div>

                        <span className='ml-auto mr-4'>
                            <span className={cx('row no-gutters justify-content-end', styles.rightArrow)}>
                                <img src={rightArrowIcon} alt='icon' />
                            </span>
                        </span>
                    </div>
                </NavLink>
                : null}
        </React.Fragment>
    )
}

export default withTranslation()(withRouter(ToDoTaskCard));
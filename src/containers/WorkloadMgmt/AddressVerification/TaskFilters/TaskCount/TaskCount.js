import React from 'react';
import { withRouter } from "react-router";
import { connect } from "react-redux";

import styles from './TaskCount.module.scss';
import cx from 'classnames';
import _ from 'lodash';

import {colorStatus, numeratorLabel, denominatorLabel} from '../StaticFilterData';

import { withTranslation } from 'react-i18next';

const TaskCount = (props) => {

    const getNumeratorLabel = () => {
        let numerator = "";
        if(!_.isEmpty(props.caseStatus)){
            numerator = numeratorLabel[props.caseStatus];
            if(_.isEmpty(numerator)){
                if(!_.isEmpty(props.agency)){
                    numerator = props.cardType === 'physical' 
                                ?   props.agency === 'unassigned' 
                                    ? 'Open' : 'Ops Review Pending'
                                : 'Open';
                } else {
                    numerator = 'Picked';
                }

                if(!_.isEmpty(props.caseAssignee)){
                    numerator = ['unassigned','select assignee'].includes(props.caseAssignee)
                                ? 'Open' : 'Picked';
                }
            }
        }
        return numerator;
    }

    const getDenominatorLabel = () => {
        let denominator = ""
        if(!_.isEmpty(props.agency)){
            denominator = denominatorLabel[props.agency];
            if(_.isEmpty(denominator)){
                denominator = 'Assigned';
            }
        }else if(!_.isEmpty(props.caseAssignee)){
            denominator = denominatorLabel[props.caseAssignee];
            if(_.isEmpty(denominator)){
                denominator = 'Assigned';
            }
        } else {
            denominator = "Assigned To Me";
        }
        return denominator;
    }

    const isValid = () => {
        let isValid = true;
        if(props.cardType === 'postal'){
            if(props.agency === 'unassigned') isValid = false;
        } else if(props.cardType === 'physical' && _.isEmpty(props.agency)){
            if(!_.isEmpty(props.caseAssignee)){
                if(props.caseAssignee === 'assigned to me' && props.caseStatus === 'open cases'){
                    isValid = false;
                } else if(props.caseAssignee === 'unassigned') {
                    if(['picked cases', 'closed cases'].includes(props.caseStatus)){
                        isValid = false;
                    } else {
                        isValid = true;
                    }
                } else if(props.caseAssignee !== 'select assignee' && props.caseStatus === 'open cases') {
                    isValid = false;
                }
            } else {
                if(props.caseStatus === 'open cases') {
                    isValid = false;
                }
            }
        }
        return isValid;
    }

    const getStyles = () => {
        let styles = colorStatus[props.caseStatus];
        if(props.caseStatus === 'select case status' && props.cardType === 'physical') {
            if(!_.isEmpty(props.agency)){
                styles = props.agency !== 'unassigned' ? colorStatus['pending ops review'] : colorStatus[props.caseStatus];
            } else if (!_.isEmpty(props.caseAssignee)){
                styles = ['unassigned','select assignee'].includes(props.caseAssignee)
                        ? colorStatus['open cases'] : colorStatus['picked cases'];
            } else {
                styles = colorStatus['picked cases'];
            }
        }
        return styles;
    }


    const { t } = props;

    let numeratorValue = isValid() ? 
                            Math.abs(props.numerator) > 999 ?
                                Math.floor(props.numerator / 1000, 1) + "k"
                            : props.numerator
                         : '--';

    let denominatorValue = Math.abs(props.denominator) > 999 ?
        Math.floor(props.denominator / 1000, 1) + "k"
        : props.denominator;

    return (
        !_.isEmpty(props.caseStatus) ?
            <div className={cx(styles.BgSize)} style={{ backgroundColor : getStyles().background }}>
                <div className='row no-gutters'>
                    <label className={cx(styles.Numerator)} style={{ color: getStyles().numeratorColor }}>
                        {numeratorValue}
                    </label>
                    <label className={styles.Slash}>/</label>
                    <label className={cx(styles.Denominator)} style={{ color: getStyles().denominatorColor }}>
                        {denominatorValue}
                    </label>
                    <label className={cx("pl-2", styles.Tasks)}>{t('translation_addressVerification:taskFilters.tasks')} </label>
                </div>

                <div className='d-flex'>
                    <span className={cx(styles.Circle)} style={{ backgroundColor: getStyles().numeratorColor }}></span>
                    <small className={cx(styles.SmallLabel)}>
                        &nbsp;{getNumeratorLabel()}
                    </small>
                    <span className={cx('ml-2', styles.Circle)} style={{ backgroundColor: getStyles().denominatorColor }}></span>
                    <small className={cx(styles.SmallLabel)}>
                        &nbsp;{getDenominatorLabel()}
                    </small>
                </div>
            </div>
            : null
    )
}

const mapStateToProps = state => {
    return {
        user: state.auth.user,
        policies: state.auth.policies,
        userProfile: state.user.userProfile.profile
    }
}

export default withTranslation()(withRouter(connect(mapStateToProps, null)(TaskCount)));
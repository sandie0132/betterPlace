import React from 'react';
import cx from 'classnames';
import tick from '../../../../../assets/icons/tick.svg';
import cross from '../../../../../assets/icons/cancelPdf.svg';
import close_notification from '../../../../../assets/icons/closeNotification.svg';
import styles from './SuccessErrorNotification.module.scss';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withTranslation } from "react-i18next";

const SuccessErrorNotification = (props) => {
    const { t } = props;
    let Notification = null;
    let deployMessage;
    let terminateMessage;
    let initiateMessage;

    const errorMessage = 'Unable to complete requested action.';
    
    if (props.terminatedEmp > 0) {
        let msg = props.terminatedEmp + (props.terminatedEmp > 1 ? ' employees have been' : ' employee has been')
        terminateMessage = msg + ' terminated successfully';
    }

    let roles = 0, locations = 0, custom = 0;
    let empCount = (props.notificationData) ? props.notificationData.empCount : 0;
    
    initiateMessage = 'BGV has been initiated for ' + empCount + (empCount >1 ? ' employees.': ' employee.');

    if (!_.isEmpty(props.notificationData)) {
        if (!_.isEmpty(props.notificationData.tags)) {
            props.notificationData.tags.map(item => {
                if (item.category === 'functional') roles++;
                else if (item.category === 'geographical') locations++;
                else if(item.category === 'custom') custom++;
                return null;
            })
        }
    }

    let message = empCount + (empCount > 1 ? ' employees have been ' : ' employee has been ');

    let assignMessage = message + 'assigned to ';
    if (roles !== 0) { assignMessage += roles + (roles > 1 ? ' roles' : ' role') }
    if (locations !== 0) {
        if (roles !== 0) { assignMessage += ' & ' }
        assignMessage += locations + (locations > 1 ? ' locations' : ' location')
    }
    if (custom !== 0) {
        if (roles !== 0 || locations !== 0) { assignMessage += ' & ' }
        assignMessage += custom + (custom > 1 ? ' custom tags' : ' custom tag')
    }
    if (!_.isEmpty(props.clientData)) {
        let empCount = props.clientData.employeeList.length;
        deployMessage = empCount + (empCount > 1 ? ' employees have been' : ' employee has been') + ' deployed to 1 location of ' + props.clientData.client;
    }



    switch (props.type) {
        case 'assign': Notification =
            <div className={cx(styles.NotificationCard)}>
                <img className="ml-3" src={tick} alt={t('translation_empList:image_alt.tick')} />
                <span className="ml-3">{assignMessage}</span>
                <img className={cx('mr-3', styles.imgClose)} src={close_notification} align='right'
                    alt={t('translation_empList:image_alt.close')} onClick={props.closeNotification} />
            </div>
            break;

        case 'initiate': Notification =
            <div className={cx(styles.NotificationCard)}>
                <img className="ml-3" src={tick} alt={t('translation_empList:image_alt.tick')} />
                <span className="ml-3">{initiateMessage}</span>
                <img className={cx('mr-3', styles.imgClose)} src={close_notification} align='right'
                    alt={t('translation_empList:image_alt.close')} onClick={props.closeNotification} />
            </div>
            break;

        case 'deploy': Notification =
            <div className={cx(styles.NotificationCard)}>
                <img className="ml-3" src={tick} alt={t('translation_empList:image_alt.tick')} />
                <span className="ml-3">{deployMessage}</span>
                <img className={cx('mr-3', styles.imgClose)} src={close_notification} align='right'
                    alt={t('translation_empList:image_alt.close')} onClick={props.closeNotification} />
            </div>
            break;

        case 'terminate': Notification =
            <div className={cx(styles.NotificationCard)}>
                <img className="ml-3" src={tick} alt={t('translation_empList:image_alt.tick')} />
                <span className="ml-3">{terminateMessage}</span>
                <img className={cx('mr-3', styles.imgClose)} src={close_notification} align='right'
                    alt={t('translation_empList:image_alt.close')} onClick={props.closeNotification} />
            </div>
            break;

        case 'error': Notification =
        <div className={cx(styles.ErrorNotificationCard)}>
            <img className="ml-3" src={cross} alt={t('translation_empList:image_alt.tick')} />
            <span className="ml-3">{errorMessage}</span>
            <img className={cx('mr-3', styles.imgClose)} src={close_notification} align='right'
                alt={t('translation_empList:image_alt.close')} onClick={props.closeNotification} />
        </div>
        break;


        default: Notification = null
    }
    return (
        <React.Fragment>
            {Notification}
        </React.Fragment>
    )
};

const mapStateToProps = state => {
    return {
        notificationData: state.empMgmt.empList.notificationData,
        clientData: state.empMgmt.empDeploy.clientData,
        terminatedEmp: state.empMgmt.empTermination.selectedEmp
    }
}

export default withTranslation()(connect(mapStateToProps, null)(SuccessErrorNotification));
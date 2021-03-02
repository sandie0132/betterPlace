import React from 'react';
import cx from 'classnames';
import tick from '../../../../assets/icons/tick.svg';
import closeNotification from '../../../../assets/icons/closeNotification.svg';
import warningIcon from '../../../../assets/icons/warningIcon.svg';
import styles from './SuccessNotification.module.scss';
import { withTranslation } from 'react-i18next';
// import Loader from '../../Loader/Loader';
import _ from 'lodash';

const successNotification = (props) => {

    const { t } = props;
    let notificationCard = null;

    switch (props.type) {
        case 'bgvNotification': notificationCard =
            <div className={cx(styles.NotificationCardBGV)}>
                <img className="ml-3" src={tick} alt={t('translation_SuccessNotification:image_alt_SuccessNotification.greenTick')} />
                <span className="ml-3">
                    <font color={'#848792'}>
                        {(!_.isEmpty(props.msgDataName) && !_.isEmpty(props.msgDataColorName)) ?
                            props.msgDataName + " " : 'This profile '}
                    </font>
                    has been verified as a
                    <font color={props.msgDataColorName === 'yellow' ? '#FFB803' : props.msgDataColorName === 'red' ? '#EE3942' : props.msgDataColorName === 'green' ? '#4BB752' : ''}>
                        {"  " + props.msgDataColorName + ' case'}
                    </font>


                    {/* {props.message} */}
                </span>
                <img className={cx('mr-3', styles.imgClose)} src={closeNotification} align='right'
                    alt={t('translation_SuccessNotification:image_alt_SuccessNotification.close')} onClick={props.clicked} />
            </div>
            break;

        case 'greenCardWithBorder': notificationCard =
            <div className={cx(styles.GreenCardBorder, props.className)}>
                <img className="ml-3" src={tick} alt={t('translation_SuccessNotification:image_alt_SuccessNotification.greenTick')} />
                <span className="ml-3">
                    <font color={'#848792'}>
                        {props.message}
                    </font>
                </span>
                <img className={cx('mr-3', styles.imgClose)} src={closeNotification} align='right'
                    alt={t('translation_SuccessNotification:image_alt_SuccessNotification.close')} onClick={props.clicked} />
            </div>
            break;

        case 'taskReview': notificationCard =
            <div className={cx(styles.NotificationCardBGV)}>
                <img className="ml-3" src={tick} alt={t('translation_SuccessNotification:image_alt_SuccessNotification.greenTick')} />
                <span className="ml-3">
                    <font color={'#848792'}>
                        {(!_.isEmpty(props.msgDataName) && !_.isEmpty(props.msgDataColorName)) ?
                            props.msgDataName + " " : 'This '}
                    </font>
                    verification has been successfully
                    {props.msgDataColorName === props.changedColorName ? " updated" :
                        <font>
                            changed from
                            <font>
                                {"  " + props.msgDataColorName + ' case'}
                            </font> to
                            <font color={props.changedColorName === 'yellow' ? '#FFB803' : props.changedColorName === 'red' ? '#EE3942' : props.changedColorName === 'green' ? '#4BB752' : ''}>
                                {"  " + props.changedColorName + ' case'}
                            </font>
                        </font>
                    }
                </span>
                <img className={cx('mr-3', styles.imgClose)} src={closeNotification} align='right'
                    alt={t('translation_SuccessNotification:image_alt_SuccessNotification.close')} onClick={props.clicked} />
            </div>
            break;

        case 'excelNotification': notificationCard =
            <div className={cx(styles.NotificationCardBGV)}>
                <img className="ml-3" src={tick} alt={t('translation_SuccessNotification:image_alt_SuccessNotification.greenTick')} />
                <span className="ml-3">
                    excel has been downloaded successfully with {props.excelCount} {props.verificationType} verification tasks
                </span>
                <img className={cx('mr-3', styles.imgClose)} src={closeNotification} align='right' alt='' onClick={props.clicked} />
            </div>
            break;

        case 'missingDocument':
            notificationCard =
                <div className={cx(props.NotificationCardBGV_className)}>
                    <img className="mr-1" style={{ height: "0.95rem" }} src={warningIcon} alt={t('translation_SuccessNotification:image_alt_SuccessNotification.greenTick')} />
                    {!_.isEmpty(props.missingDataMessage) && !_.isEmpty(props.insuffInfoMessage) ?
                        <span>
                            <span className="ml-1">
                                missing details of
                            <span className={styles.boldFont}>
                                    {!_.isEmpty(props.missingDataMessage) ?
                                        " " + props.missingDataMessage : null}
                                </span>
                                {props.missingDataName.length > 1 ? " and " : null}
                                <span className={styles.boldFont}>
                                    {props.missingDataName.length > 1 ? props.missingDataName.slice(-1) : null}
                                </span>
                            </span>
                            <span className="ml-1">
                                and insufficient information in
                        <span className={styles.boldFont}>
                                    {!_.isEmpty(props.insuffInfoMessage) ?
                                        " " + props.insuffInfoMessage : null}
                                </span>
                                {props.insuffInfoName.length > 1 ? " and " : null}
                                <span className={styles.boldFont}>
                                    {props.insuffInfoName.length > 1 ? props.insuffInfoName.slice(-1) : null}
                                </span>
                            </span>
                        </span>
                        :
                        !_.isEmpty(props.missingDataMessage) ?
                            <span className="ml-1">
                                missing details of
                    <span className={styles.boldFont}>
                                    {!_.isEmpty(props.missingDataMessage) ?
                                        " " + props.missingDataMessage : null}
                                </span>
                                {props.missingDataName.length > 1 ? " and " : null}
                                <span className={styles.boldFont}>
                                    {props.missingDataName.length > 1 ? props.missingDataName.slice(-1) : null}
                                </span>
                            </span>
                            :
                            !_.isEmpty(props.insuffInfoMessage) ?
                                <span className="ml-1">
                                    insufficient information in
                                <span className={styles.boldFont}>
                                        {!_.isEmpty(props.insuffInfoMessage) ?
                                            " " + props.insuffInfoMessage : null}
                                    </span>
                                    {props.insuffInfoName.length > 1 ? " and " : null}
                                    <span className={styles.boldFont}>
                                        {props.insuffInfoName.length > 1 ? props.insuffInfoName.slice(-1) : null}
                                    </span>
                                </span>
                                : null}
                </div>
            break;

        case 'selectAll': notificationCard = <div className={cx(styles.WhiteCard, props.className, 'row no-gutters justify-content-center py-2')}>
            <span className={cx("py-1", styles.boldFont, styles.GreyText)}>{props.empCount}</span>
            <span className={cx("py-1", styles.GreyText)}>&nbsp;{props.message}</span>
            <span className={cx("ml-2 py-1 px-2", styles.ActiveText)} onClick={props.clickHandler}>{props.selectAllMsg}</span>
        </div>
            break;

    case 'agencyNotification': notificationCard = (
      <div className={cx(styles.NotificationCard, props.className, 'row no-gutters px-4 py-2')}>
        <img className={styles.IconSucces} src={tick} alt="" />
        <span className={cx('pl-2', styles.boldFont, styles.GreyText)}>{props.empCount}</span>
        <span className={styles.GreyText}>
          {props.message}
        </span>
        <span
          className={props.color === 'RED' ? cx(styles.redFont, styles.boldFont) : props.color === 'YELLOW' ? cx(styles.yellowFont, styles.boldFont) : props.color === 'GREEN' ? cx(styles.greenFont, styles.boldFont) : cx(styles.boldFont, props.boldTextStyle)}
          onClick={props.boldTextClickHandler}
        >
          {props.boldText}
        </span>
        <img
          className={cx('d-flex pr-0 ml-auto', styles.IconCancel)}
          src={closeNotification}
          alt=""
          onClick={props.closeNotification}
        />
    </div>
    );
    break;
          

        // case 'downloadTasks': notificationCard = <div className={cx(styles.WhiteCard, 'row no-gutters px-4 py-2')}>
        //     {props.downloadState === 'LOADING' ? <Loader type='stepLoaderBlue' />
        //         : props.downloadState === 'SUCCESS' ? <img className={styles.IconSucces} src={tick} alt='' />
        //             : props.downloadState === 'ERROR' ? <img className={styles.IconSucces} src={tick} alt='' />
        //                 : null}
        //     <span className={styles.GreyText}>&nbsp;{props.message}</span>
        //     <img className={cx('d-flex pr-0 ml-auto', styles.IconCancel)} src={closeNotification} alt=''
        //         onClick={props.closeNotification} />
        // </div>
        //     break;

        default: notificationCard = <div className="row">
            <div className={cx("offset-3 col-6 flex d-flex no-gutters justify-content-center")}>
                <img className={cx('my-auto', styles.IconSucces)} src={tick}
                    alt={t('translation_SuccessNotification:image_alt_SuccessNotification.success')} ></img>
                <p className={cx(styles.SuccessNotificationCard)}> &nbsp; {props.message ? props.message : t('translation_SuccessNotification:p.p1')}</p>
            </div>
            <div className={cx("offset-1 col-2 justify-content-right")}>
                <img className={cx('d-flex p-2 ml-auto', styles.IconCancel)} src={closeNotification}
                    alt={t('translation_SuccessNotification:image_alt_SuccessNotification.organisationDetails')} onClick={props.clicked} />
            </div>
        </div>
    }
    return (
        <React.Fragment>
            {notificationCard}
        </React.Fragment>
    )
};

export default withTranslation()(successNotification);
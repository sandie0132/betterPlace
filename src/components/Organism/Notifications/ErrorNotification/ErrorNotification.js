import React from 'react';
import cx from 'classnames';
import close from '../../../../assets/icons/remove.svg';
import close_notification from '../../../../assets/icons/closeNotification.svg';
import styles from './ErrorNotification.module.scss';
import { withTranslation } from 'react-i18next';

const errorNotification = (props) => {
    const { t } = props;
    return (
        <React.Fragment>
            {props.type === 'excelTaskUpload' ?
                <div className={cx(styles.NotificationCardBGV, props.className)}>
                    <img className="ml-3" src={close} alt='' />
                    <span className="ml-3">
                        {props.error}
                    </span>
                    <img className={cx('mr-3', styles.imgClose)} src={close_notification} align='right' alt='' onClick={props.clicked} />
                </div>
                :
                props.type === 'agencyErrorNotification' ?
                    <div className={cx(styles.AgencyErrorNotification, props.className, 'row no-gutters px-4 py-2')}>
                        <img src={close} alt='' />
                        <span className={cx("pl-2")}>{props.error}</span>
                        <img className={cx('d-flex pr-0 ml-auto', styles.IconCancel)} src={close_notification} alt='' onClick={props.clicked}/>
                    </div>
                    :
                    <div className="row">
                        <div className={cx("offset-3 col-6 d-flex no-gutters justify-content-center")}>
                            <img
                                className={styles.IconError}
                                src={close}
                                alt={t('translation_errorNotification:image_alt_errorNotification.organisationDetails')}
                            />
                            {props.error ?
                                <p className={styles.ErrorNotificationCard}>{props.error}</p>
                                :
                                <p className={cx(styles.ErrorNotificationCard)}>{t('translation_errorNotification:p.p1')}</p>
                            }

                        </div>
                        <div className={cx("offset-1 col-2 justify-content-right", styles.IconCancel)}>
                            <img className="d-flex p-2 ml-auto" src={close_notification}
                                alt={t('translation_errorNotification:image_alt_errorNotification.organisationDetails')} onClick={props.clicked} />
                        </div>
                    </div>
            }
        </React.Fragment>
    )
};

export default withTranslation()(errorNotification);
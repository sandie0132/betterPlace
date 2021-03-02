import React from 'react';
import styles from './BigNotification.module.scss';
import cx from 'classnames';
import warningIcon from '../../../assets/icons/warningIcon.svg';
import successIcon from '../../../assets/icons/successIcon.svg';


const BigNotification =(props)=>{

    let NotificationPan= null;

    switch(props.type){
        case 'warning':
            NotificationPan = <div className={cx('d-flex flex-row col-12',styles.WarningContainer, props.className)}>
                                <div className='d-flex flex-column '>
                                    <img className={styles.IconPadding} src={warningIcon} alt='' />
                                </div>
                                <div className='d-flex flex-column'>
                                    <h2 className={styles.Heading}>{props.heading}</h2>
                                    <label className={styles.Message}>{props.message}</label>
                                </div>
                            </div>
            break;

        case 'success':
                NotificationPan = <div className={cx('d-flex flex-row col-12',styles.SuccessContainer, props.className)}>
                <div className='d-flex flex-column '>
                    <img className={styles.IconPadding} src={successIcon} alt='' />
                </div>
                <div className='d-flex flex-column'>
                    <h2 className={styles.Heading}>{props.heading}</h2>
                    <label className={styles.Message}>{props.message}</label>
                </div>
            </div>
           break;

        default: 
              NotificationPan =  <div className={cx('d-flex flex-row',styles.WarningContainer, props.className)}>
                                <div className='d-flex flex-column '>
                                    <img className={styles.IconPadding} src={warningIcon} alt='' />
                                </div>
                                <div className='d-flex flex-column'>
                                    <h2 className={styles.Heading}>{props.heading}</h2>
                                    <label className={styles.Message}>{props.message}</label>
                                </div>
                            </div>
         break;
    }
                        
                        

      return(
          NotificationPan
      );
  }

export default BigNotification;
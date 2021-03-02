import React from 'react';
import styles from './SessionExpired.module.scss';
import cx from 'classnames';
import { Button } from 'react-crux';
import sessionExpiredClock from '../../../assets/icons/sessionExpired.svg';

import { AuthConsumer } from '../../../services/authContext';

const SessionExpired = () => {
    return (
        <AuthConsumer>
            {
                ({ clearSession }) => {
                    return(
                        <div className={cx('d-flex flex-column', styles.Backdrop)}>
                            <div className={cx(styles.Container, 'row d-flex justify-content-center')}>
                                <div className='col-12 px-0'>
                                    <div className={styles.Clock}>
                                        <img src={sessionExpiredClock} alt='' />
                                    </div>
                                    <h1 className={cx(styles.SessionHeading, 'mt-4')}>session expired!!</h1>
                                    <h4 className={cx(styles.SessionSubheading, 'mt-1')}>you have been logged out because of long time of inactivity</h4>
                                    <br />
                                    <div className='row justify-content-center'>
                                        <Button label='login again' type='largeWithArrow' clickHandler={clearSession} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            }
        </AuthConsumer>
    )
}

export default SessionExpired;
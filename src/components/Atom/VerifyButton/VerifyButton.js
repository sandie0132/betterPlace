import React from 'react';
import cx from 'classnames';

import styles from './VerifyButton.module.scss';
import arrow from "../../../assets/icons/rightArrowDashboard.svg";
import tick from "../../../assets/icons/whiteTick.svg"

import Loader from '../../../components/Organism/Loader/Loader';


const VerifyButton = (props) => {
    let button = null;

    switch (props.type) {
        case 'enable':
            button =
                <button className={cx(styles.button, styles.enableBg)} onClick={() => props.onClick()}>
                    <span className={styles.enabled}>
                        verify credentials
                    </span>
                    <img src={arrow} alt="arrow" className="ml-4" />
                </button>
            break;

        case 'inProgress':
            button =
                <button className={cx(styles.button, styles.enableBg)}>
                    <div className="d-flex">
                        <div className={styles.inProgress}>
                            verifying...
                        </div>
                        <Loader type='stepLoaderWhite' className={styles.stepLoader} />
                    </div>
                </button>
            break;

        case 'done':
            button =
                <button className={cx(styles.button, styles.successBg)}>
                    <span className={styles.enabled}>
                        verified successfully
                    </span>
                    <img src={tick} alt="arrow" className="ml-4" />
                </button>
            break;

        case 'diable':
            button =
                <button className={cx(styles.button, styles.disableBg)}>
                    <span className={styles.disable}>
                        verify credentials
                    </span>
                    <img src={arrow} alt="arrow" className={styles.arrowIcon} />
                </button>
            break;

        default:
            button =
                <button className={cx(styles.button, styles.disableBg)}>
                    <span className={styles.disable}>
                        verify credentials
                    </span>
                    <img src={arrow} alt="arrow" className={styles.arrowIcon} />
                </button>
    }

    return (
        <React.Fragment>
            {button}
        </React.Fragment>
    )
}

export default VerifyButton;
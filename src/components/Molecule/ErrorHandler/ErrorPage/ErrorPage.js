import React from 'react';
import styles from './ErrorPage.module.scss';
import cx from 'classnames';
import Error500 from '../../../../assets/icons/500Error.svg';
import Error403 from '../../../../assets/icons/403Error.svg';
import Error404 from '../../../../assets/icons/404Error.svg';
import ErrorUnknown from '../../../../assets/icons/UnknownError.svg';
import arrow from '../../../../assets/icons/orgRightArrow.svg';

const ErrorPage = (props) => {
    let errorBody = null;
    if (props.errorCode === 403) {
        errorBody =
            <div>
                <img src={Error403} alt="403" className="mt-5 pt-2" />
                <div className={cx("row mx-0 px-0", styles.lineHeight)}>
                    <div className={styles.errorCode}>{props.errorCode}</div>
                    <div className={styles.errorHeading}>you shall not pass</div>
                </div>
                <div className={styles.errorText}>
                    it appers you don’t have permission to view this page
                </div>
            </div>
    }
    else if (props.errorCode === 404) {
        errorBody =
            <div>
                <img src={Error404} alt="404" className="mt-5 pt-2" />
                <div className={cx("row mx-0 px-0", styles.lineHeight)}>
                    <div className={styles.errorCode}>{props.errorCode}</div>
                    <div className={styles.errorHeading}>nothing to see here</div>
                </div>
                <div className={styles.errorText}>
                    the page you’re looking for might have been removed, have
                <br /> its name changed or is temporarily unavailable
                </div>
            </div>
    }
    else if (props.errorCode > 499) {
        errorBody =
            <div>
                <img src={Error500} alt="500" className="mt-5 pt-2" />
                <div className={cx("row mx-0 px-0", styles.lineHeight)}>
                    <div className={styles.errorCode}>{props.errorCode}</div>
                    <div className={styles.errorHeading}>it's not you it's me</div>
                </div>
                <div className={styles.errorText}>
                    our servers are facing extreme load and is temporarily unable <br />
                    to service your request. Please try again after some time
                </div>
            </div>
    }
    else {
        errorBody =
            <div>
                <img src={ErrorUnknown} alt="unknown" className="mt-5 pt-2" />
                <div className={cx(styles.errorHeading, "mr-0 mt-5")}>unknown error</div>
            </div>
    }

    const goToHomePage = () => {
        window.location = "/";
    }

    return (
        <React.Fragment>
            <div className={styles.BackgroundImage}>
                {errorBody}
                <div className={cx(styles.button)} onClick={() => goToHomePage()}>
                    back to home <img src={arrow} alt="arrow" className="ml-3" />
                </div>
            </div>
        </React.Fragment>
    );
}

export default ErrorPage;

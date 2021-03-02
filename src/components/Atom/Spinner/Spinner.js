import React from 'react';
import styles from './Spinner.module.scss';
import cx from 'classnames';

class Spinnerload extends React.Component {
    render() {
        return (
            this.props.type === 'success' ?
                <svg className={styles.checkmark} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 52 52'>
                    <circle className={styles.checkmark__circle} cx='26' cy='26' r='25' fill='none'
                    />
                    <path className={styles.checkmark__check} fill='none' d='M14.1 27.2l7.1 7.2 16.7-16.8'
                    />
                </svg>
                :
                this.props.type === 'loading' ?
                    <div className={cx('', styles.Loader)}>
                    </div>
                    :
                    <svg className={styles.error__checkmark} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 52 52'>
                        <circle className={styles.error__checkmark__circle} cx='26' cy='26' r='25' fill='none'
                        />
                        <path className={styles.error__checkmark__check} fill='none' d="M16 16 36 36 M36 16 16 36"
                        />
                    </svg>
        );
    }
}
export default Spinnerload;
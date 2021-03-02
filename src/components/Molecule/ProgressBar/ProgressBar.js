import React, {Component} from 'react';
import cx from 'classnames';
import styles from './ProgressBar.module.scss';

class ProgressBar extends Component {
    render() {
        return (
            <div className={cx('row no-gutters ml-4 my-2 p-0', styles.CardLayout)}>
                <div className={cx('row no-gutters ml-0',styles.Loading)} style={{width : `${this.props.progress}%`}}></div>
                <label className={styles.Message}>{this.props.message}</label>
            </div>
        )
    }
}

export default ProgressBar;
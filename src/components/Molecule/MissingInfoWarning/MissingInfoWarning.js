import React from 'react';
import styles from './MissingInfoWarning.module.scss';
// import cx from 'classnames';
// import warning from "../../../assets/icons/onholdRed.svg"

const missingInfoWarning = (props) => (
    <div>
        { props.isWarningReuired ? <img className={styles.warnningImg} src={props.warningIcon} alt="warning" /> : null }
        <span className={styles.warningMsg}>{ props.isWarningReuired ? props.warningMsg: null }</span>
    </div>        
);

export default missingInfoWarning;
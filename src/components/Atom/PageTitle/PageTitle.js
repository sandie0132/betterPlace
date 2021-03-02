import React from 'react';
import container from '../../../assets/icons/orgDetailsIcon.svg';
import tooltip from '../../../assets/icons/question.svg';
import styles from './PageTitle.module.scss';
import cx from 'classnames';
// import warning from "../../../assets/icons/onholdRed.svg"

const pageTitle = (props) => (

    props.greyHeading ?
        <div className="d-flex">
            <div className={cx('px-0', styles.paddingY)}>
                <img className={cx(styles.containerSize, "pr-1")} src={props.iconSrc ? props.iconSrc : container} alt=""></img>
                <h4 className={cx("mb-0 px-2 align-self-center", styles.greyLabel)}>{props.label}</h4>
            </div>
        </div>
        :
        <div className="d-flex">
            <div className={cx('px-0', styles.paddingY)}>
                <img className={cx(styles.containerSize, "pr-2")} src={props.iconSrc ? props.iconSrc : container} alt=""></img>
                <h4 className="mb-0 px-2 align-self-center">{props.label}</h4>
                <img src={tooltip} alt="tooltip" className={cx("my-auto", styles.imgSize)} />

            </div>
            <div className={styles.warninContainer}>
                {props.isWarningReuired ? <img className={styles.warnningImg} src={props.warningIcon} alt="warning" /> : null}
                <span className={styles.warningMsg}>{props.isWarningReuired ? props.warningMsg : null}</span>
            </div>
        </div>
);

export default pageTitle;
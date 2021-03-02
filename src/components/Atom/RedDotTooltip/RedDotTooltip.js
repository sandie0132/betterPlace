import React from "react";
import styles from "./RedDotTooltip.module.scss";
import cx from 'classnames';

const redDotTooltip = (props) => {

    return (
        <React.Fragment>
            {props.icon ?
                <div className={props.yellow ? styles.tooltip : styles.greyTooltip}>&nbsp;
                <img src={props.icon} alt='' />
                    <span className={props.yellow ? cx(styles.tooltiptext) : styles.greyTooltiptext}>
                        <i>{props.info}</i>
                    </span>
                </div>
                :
                <div className={styles.tooltip}>&nbsp;<span className={styles.redDot}></span>
                    <span className={styles.tooltiptext}>
                        <i>{props.info}</i>
                    </span>
                </div>
            }
        </React.Fragment>
    )
}

export default redDotTooltip;
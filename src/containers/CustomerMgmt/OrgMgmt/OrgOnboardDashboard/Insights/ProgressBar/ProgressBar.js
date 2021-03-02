import React from "react";
import cx from "classnames";
import { withRouter } from "react-router";

import styles from "./ProgressBar.module.scss";
import arrow from "../../../../../../assets/icons/arrowDownPink.svg";

const ProgressBar = (props) => {

    const handlePercentComplete = () => {
        let percent = (props.completed / props.total) * 100;

        if (percent === 0) {
            return false
        } else {
            return percent + "%"
        }
    }

    const handleColor = () => {
        let type = props.category

        switch (type) {
            case 'basic': return '#0E6170'
            case 'additional': return '#FFB9BE'
            case 'employee': return '#FFDBBA'
            case 'company': return '#88ABD3'
            case 'government': return '#CDB8FF'
            default: return '#CDB8FF'
        }
    }


    return (
        <div className="row mx-0 px-0 mb-4">
            <div className={cx("px-0 my-auto ", styles.textBold,styles.labelColumn)}>
                {props.label}
            </div>

            {
                props.total === 0 ?
                    <div className={cx("my-auto pl-3",styles.barColumn)}>
                        <div className={styles.noDataLabel}>
                            no data
                    </div>
                    </div>
                    :
                    <div className={cx("my-auto pl-3",styles.barColumn)} onClick={() => props.history.push(props.url)}>
                        <div className={handlePercentComplete() ? styles.ProgressBar : null} style={handlePercentComplete() ? { width: handlePercentComplete(), backgroundColor: handleColor() } : null}>
                            <div className={styles.progressTitle} style={{ color: handleColor() }}>
                                {props.completed} profiles
                    </div>
                        </div>
                    </div>
            }
            {
                props.total - props.completed > 0 ?
                    <div className={cx("my-auto", styles.textBoldGrey,styles.profileColumn)}>
                        <img src={arrow} alt="arrow" className="mr-1" />{props.total - props.completed} profiles
                    </div>
                    : null
            }
        </div>
    )
}

export default withRouter(ProgressBar);
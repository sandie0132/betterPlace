import React from 'react';
import styles from "./RightNavUrls.module.scss";

import tick from '../../../../../../assets/icons/rightNavTick.svg';
import activeCircle from '../../../../../../assets/icons/rightNavCircle.svg';
import inactiveCircle from '../../../../../../assets/icons/rightNavInactive.svg';
import missingInfo from '../../../../../../assets/icons/missingInfo.svg';
import _ from "lodash";
import cx from "classnames";
import Loader from '../../../../../../components/Organism/Loader/Loader';

const RightNavUrls = (props) => {

    const putIcon = (state) => {
        if (state === "current") {
            return <img src={activeCircle} className={cx("mr-3", styles.activeCircle)} alt="img" />
        }
        else if (state === "done") {
            return <img src={tick} className="mr-3" alt="img" />
        }
        else {
            return <img src={inactiveCircle} className={cx("mr-3")} alt="img" />
        }
    }

    const putSubIcon = () => {
        const status = props.iconStatus;
        if (status !== undefined && status !== null) {
            if (status["status"] === "done") {
                return <div><img src={tick} alt="done" className={styles.smallTick} /></div>
            } else if ((status["status"] === "error") || (status["status"] === "inprogress")) {
                return <div style={pieStyle} />
            } else {
                return <div className={styles.ring} />
            }
        } else {
            return <div className={styles.ring} />
        }


    }

    const getColor = () => {
        const status = props.iconStatus
        if (status !== undefined && status !== null) {
            if (status["status"] === "error") {
                return "#EE3942"
            } else {
                return "#FFB803"
            }
        }
    }

    const getBgColor = () => {
        const status = props.iconStatus
        if (status !== undefined && status !== null) {
            if (status["status"] === "error") {
                return "#FDEBEC"
            } else {
                return "#FFF7E5"
            }
        }
    }

    const getPercent = () => {
        const status = props.iconStatus
        let percent = 0;
        if (status) {
            percent = (status["filled"] / status["total"]) * 360
        }
        return percent
    }

    const pieStyle = {
        background: 'conic-gradient(' + getColor() + ' ' + getPercent() + 'deg, ' + getBgColor() + ' 0deg)',
        borderRadius: '50%',
        height: '8px',
        width: '8px',
        position: 'absolute',
        marginTop: '4px'
    };

    let navUrl = null;

    switch (props.type) {
        case 'subSection':
            navUrl =

                <div className={props.headingState === 'inactive' ? styles.inactive : null}>
                    <div className={props.headingState === 'current' ? styles.navHeadActive : props.headingState === 'inactive' ? styles.navHeadInactive : styles.navHead} >
                        <div className={styles.alignSection}>
                            {putSubIcon()}
                            <div className="ml-4" onClick={props.headingState === "inactive" ? null : props.linkTo}>
                                {props.label}
                            </div>
                            {
                                props.hasMissingInfo ?
                                    <div className="ml-auto">
                                        <img src={missingInfo} alt="missing" />
                                    </div> :
                                    null
                            }
                            {
                                !_.isEmpty(props.iconStatus) ?
                                    props.iconStatus["status"] === "inProgress" ?
                                        <Loader type={"stepLoaderGreen"} className={styles.alignLoader} /> : null
                                    : null
                            }
                        </div>
                    </div>
                </div>
            break;

        default:
            navUrl =
                <div className={props.headingState === 'inactive' ? styles.inactive : null}>
                    <div className={props.headingState === 'active' ? styles.sectionHeadActive
                        : props.headingState === 'inactive' ? styles.sectionHeadInactive : styles.sectionHeadDone}
                        onClick={props.headingState === "inactive" ? null : props.linkTo}>
                        {putIcon(props.iconState)}
                        {props.label}
                    </div>
                </div>
            break;
    }



    return (
        <React.Fragment>
            {navUrl}
        </React.Fragment>

    )

}

export default RightNavUrls;
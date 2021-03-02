import React from 'react';
import { connect } from "react-redux";
import cx from 'classnames';

import * as actions from '../Store/action';

import styles from "./NotificationContent.module.scss";

import assign from "../../../../assets/icons/initiateActive.svg"
import CircularProgressBar from '../../../../components/Molecule/CircularProgressBar/CircularProgressBar';
import { Button } from 'react-crux';

const EmpAssignTags = (props) => {

    return (
        <div className={cx(styles.background, "row mx-0 px-0")}>
            <div className={styles.circleProgressAlign}>
                {props.state === "error" ?
                    <CircularProgressBar
                        type="progress"
                        percentValue={100}
                        centerImage={assign}
                        status={props.state}
                    /> :
                    <CircularProgressBar
                        type="progress"
                        percentValue={props.progressData["percent"]}
                        centerImage={assign}
                        status={props.state}
                    />
                }
            </div>
            {
                props.state === "inProgress" ?
                    <div className={styles.maxWidth}>
                        <div className={cx(styles.headingLarge)}>assign tags progress</div>
                        <div className={cx(styles.textProgress, "mt-2")}>assign tags for {props.progressData["success"] ? props.progressData["success"] : 0}/{props.progressData["total"]} selected employees is in progress</div>
                    </div>
                    :
                    props.state === "success" ?
                        <React.Fragment>
                            <div className={styles.maxWidth}>
                                <div className={cx(styles.headingLarge)}>assign tags successful</div>
                                <div className={cx(styles.textSuccess, "mt-2")}>assign tags for {props.progressData["success"] ? props.progressData["success"] : 0}/{props.progressData["total"]} selected employees is successful</div>
                            </div>
                            <div className={"ml-auto mt-5"}>
                                <Button
                                    label={"close"}
                                    clickHandler={() => props.onCloseNotification(props.orgId, props.data["_id"])}
                                    type='save'
                                />
                            </div>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <div className={styles.maxWidth}>
                                <div className={cx(styles.headingLarge)}>assign tags error</div>
                                <div className={cx(styles.textError, "mt-2")}>assign tags for {props.progressData["error"]}/{props.progressData["total"]} employees has failed</div>
                            </div>
                            <div className={"ml-auto mt-5"}>
                                <Button
                                    label={"close"}
                                    clickHandler={() => props.onCloseNotification(props.orgId, props.data["_id"])}
                                    type='save'
                                />
                            </div>
                        </React.Fragment>
            }
        </div>
    )
}


const mapStateToProps = state => {
    return {
        downloadCustMgmtFileState: state.notifications.downloadCustMgmtFileState
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onCloseNotification: (orgId, id) => dispatch(actions.closeNotification(orgId, id, null))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmpAssignTags);
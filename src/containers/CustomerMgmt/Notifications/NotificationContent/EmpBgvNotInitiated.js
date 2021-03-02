import React from 'react';
import cx from 'classnames';
import { connect } from "react-redux";
import { withRouter } from "react-router";

import * as actions from '../Store/action';

import styles from "./NotificationContent.module.scss";
import illustrator from "../../../../assets/icons/illustrator.svg";
import { Button } from 'react-crux';

const handleView = (props) => {
    props.history.push(`/customer-mgmt/org/${props.orgId}/employee?verificationStatus=NOT_INITIATED`)
}

const EmpBgvNotInitiated = (props) => {

    return (
        <div className={cx(styles.background, "row mx-0 px-0")}>
            <div>
                <img src={illustrator} className={styles.illustrator} alt='' />
            </div>

            <React.Fragment>
                <div className={styles.maxWidth}>
                    <div className={cx(styles.headingLarge)}>bgv not initiated</div>
                    <div className={cx(styles.textNormal, "mt-2")}>{props.data.data.empIds.length} employees need BGV initiation </div>
                </div>
                <div className={"ml-auto mt-5"}>
                    <Button
                        label={"ignore"}
                        clickHandler={() => props.onCloseNotification(props.orgId, props.data["name"])}
                        type='cancel'
                        className={styles.CancelButton}
                    />

                    <Button
                        label={"review"}
                        type='save'
                        clickHandler={() => handleView(props)}
                    />
                </div>
            </React.Fragment>
        </div>
    )
}


const mapDispatchToProps = dispatch => {
    return {
        onCloseNotification: (orgId, name) => dispatch(actions.closeNotification(orgId, null, name))
    }
}

export default connect(null, mapDispatchToProps)(withRouter(EmpBgvNotInitiated));
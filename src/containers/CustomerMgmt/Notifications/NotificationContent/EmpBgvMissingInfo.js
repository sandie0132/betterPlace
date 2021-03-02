import React from 'react';
import cx from 'classnames';
import { withRouter } from "react-router";

import styles from "./NotificationContent.module.scss";
import illustrator from "../../../../assets/icons/illustrator.svg";
import { Button } from 'react-crux';

const handleView = (props) => {
    props.history.push(`/customer-mgmt/org/${props.orgId}/employee?verificationStatus=missing_info`)
}

const EmpBgvMissingInfo = (props) => {

    return (
        <div className={cx(styles.background, "row mx-0 px-0")}>
            <div>
                <img src={illustrator} className={styles.illustrator} alt='' />
            </div>

            <React.Fragment>
                <div className={styles.maxWidth}>
                    <div className={cx(styles.headingLarge)}>missing data for {props.data.data.empIds.length} employees</div>
                    <div className={cx(styles.textNormal, "mt-2")}>missing data found for {props.data.data.empIds.length} BGV initiated profiles </div>
                </div>

                <div className={"mt-5 ml-auto"}>
                    <Button
                        label={"review"}
                        clickHandler={() => handleView(props)}
                        type='save'
                    />
                </div>
            </React.Fragment>

        </div>
    )
}

export default withRouter(EmpBgvMissingInfo);
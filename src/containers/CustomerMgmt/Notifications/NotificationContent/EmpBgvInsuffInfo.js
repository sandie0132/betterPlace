import React from 'react';
import cx from 'classnames';
import { withRouter } from "react-router";

import styles from "./NotificationContent.module.scss";
import illustrator from "../../../../assets/icons/illustrator.svg";
import { Button } from 'react-crux';

const handleView = (props) => {
    props.history.push(`/customer-mgmt/org/${props.orgId}/employee?verificationStatus=insufficient_info`)
}

const EmpBgvInsuffInfo = (props) => {

    return (
        <div className={cx(styles.background, "row mx-0 px-0")}>
            <div>
                <img src={illustrator} className={styles.illustrator} alt='' />
            </div>

            <React.Fragment>
                <div className={styles.maxWidth}>
                    <div className={cx(styles.headingLarge)}>insufficient information</div>
                    <div className={cx(styles.textNormal, "mt-2")}>insufficient data found for {props.data.data.empIds.length} BGV initiated profiles </div>
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

export default withRouter(EmpBgvInsuffInfo);
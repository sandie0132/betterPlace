import React from 'react';
import cx from 'classnames';
import { connect } from "react-redux";

import * as actions from '../Store/action';

import styles from "./NotificationContent.module.scss";
import illustrator from "../../../../assets/icons/illustrator.svg";
import { Button } from 'react-crux';
// import DownloadButton from "../../../../components/Atom/DownloadButton/DownloadButton";

const EmpBgvCheckUpdatedApproval = (props) => {

    return (
        <div className={cx(styles.background, "row mx-0 px-0")}>
            <div>
                <img src={illustrator} className={styles.illustrator} alt='' />
            </div>

            <React.Fragment>
                <div  style={{width:'45%'}}>
                    <div className={cx(styles.headingLarge)}>approval for re-initiation</div>
                    <div className={cx(styles.textNormal, "mt-2")}>
                        {props.data.data.empIds.length} employees verification items have been updated and need approval for re-initiation
                     </div>

                     {/* <div className='mt-1'>
                        <DownloadButton
                            type='excelDownload'
                            label='download excel'
                            downloadState={props.downloadReinitiateListState}
                            clickHandler={() => props.onDownloadReinitiateExcel(props.orgId, props.data["name"])}
                        />
                    </div> */}

                </div>
                <div className={"ml-auto mt-5"}>
                    <Button
                        label={"reject all"}
                        clickHandler={() => props.onReinitiateBgv(props.orgId, "REJECT", props.data["name"])}
                        type='cancel'
                        className={styles.CancelButton}
                    />
                    <Button
                        label={"approve all"}
                        clickHandler={() => props.onReinitiateBgv(props.orgId, "APPROVE", props.data["name"])}
                        type='save'
                    />
                </div>
            </React.Fragment>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        downloadReinitiateListState: state.notifications.downloadReinitiateListState
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onReinitiateBgv: (orgId, action, name) => dispatch(actions.reInitiateAll(orgId, action, name)),
        onDownloadReinitiateExcel: (orgId, name) => dispatch(actions.downloadReinitiateList(orgId, name))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmpBgvCheckUpdatedApproval);
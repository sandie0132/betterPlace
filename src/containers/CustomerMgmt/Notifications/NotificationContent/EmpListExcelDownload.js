import React, { useEffect } from 'react';
import { connect } from "react-redux";
import cx from 'classnames';

import styles from "./NotificationContent.module.scss";

import excel from "../../../../assets/icons/excelIcon.svg"
import CircularProgressBar from '../../../../components/Molecule/CircularProgressBar/CircularProgressBar';
import DownloadButton from '../../../../components/Atom/DownloadButton/DownloadButton';
import { Button } from 'react-crux';
import * as actions from '../Store/action';

const EmpListExcelDownload = (props) => {
    
        useEffect(() => {
          if (props.downloadBgvReportFileState === 'SUCCESS') {
            props.onCloseNotification(props.orgId, props.data._id);
          }
        }, // eslint-disable-next-line
        [props.downloadBgvReportFileState]);

    return (
        <div className={cx(styles.background, "row mx-0 px-0")}>
            <div className={styles.circleProgressAlign}>
                {props.data.data.status === "inProgress" ?
                    <CircularProgressBar
                        type="loading"
                        centerImage={excel}
                    />
                    :
                    props.data.data.status === "success" ?
                        <CircularProgressBar
                            type="progress"
                            percentValue={100}
                            centerImage={excel}
                            status={"success"}
                        />
                        : <CircularProgressBar
                            type="progress"
                            percentValue={100}
                            centerImage={excel}
                            status={"error"}
                        />
                }
            </div>
            {
                props.data.data.status === "inProgress" ?
                    <div className={styles.maxWidth}>
                        <div className={cx(styles.headingLarge)}>excel generation is in progress</div>
                        <div className={cx(styles.textProgress, "mt-2")}>excel generation for {props.progressData["total"]} employee profiles is in progress</div>
                    </div>
                    :
                    props.data.data.status === "success" ?
                        <React.Fragment>
                            <div className={styles.maxWidth}>
                                <div className={cx(styles.headingLarge)}>excel generation has been successfull</div>
                                <div className={cx(styles.textSuccess, "mt-2")}>excel generation has been completed for {props.progressData["total"]} profiles you can download from here</div>
                            </div>
                            <div className={"ml-auto mt-5"}>
                                <DownloadButton
                                    type='onboaardMgmtDocument'
                                    label='download'
                                    clickHandler={props.downloadCustMgmtFileState === 'LOADING' ? null : () => props.onDownloadEmpProfileList(props.orgId, props.data["_id"], props.data.data.downloadURL, props.progressData["total"])}
                                    downloadState={props.downloadCustMgmtFileState}
                                />
                            </div>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <div className={styles.maxWidth}>
                                <div className={cx(styles.headingLarge)}>Excel generation failed !</div>
                                <div className={cx(styles.textError, "mt-2")}>Excel generation for {props.progressData["total"]} employee profiles has been failed !</div>
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
        onDownloadEmpProfileList: (orgId, notificationId, url, empCount) => dispatch(actions.downloadCustMgmtFile(orgId, notificationId, url, empCount)),
        onCloseNotification: (orgId, id) => dispatch(actions.closeNotification(orgId, id, null))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmpListExcelDownload);
import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import styles from './PvcUploadDownload.module.scss';
// import _ from 'classnames';
import download from '../../../../../../../assets/icons/greyDownload.svg';
import excelSuccess from '../../../../../../../assets/icons/excelSuccess.svg';
import xlsx from '../../../../../../../assets/icons/excelIcon.svg';
// import downloadWhite from '../../../../../../../assets/icons/downloadWhite.svg';
// import tick from '../../../../../../../assets/icons/blackTick.svg';
import DownloadButton from '../../../../../../../components/Atom/DownloadButton/DownloadButton';
import Loader from '../../../../../../../components/Organism/Loader/Loader';
import ExcelUploadSmall from '../../../../../../../components/Molecule/ExcelUploadSmall/ExcelUplaodSmall';

import * as actions from '../../../../Store/action';

class PvcUploadDownload extends Component {

    state = {
        isChecked : "",
        file: '',
        id: 'fileUpload',
        uploadExcelState : "INIT",
        empDetailsUploadState : "INIT",
        processEmpDetailsState: "INIT",
        successState: "INIT",
        showExcelDownloaded : false
    }

    componentDidMount = () => {
        this.props.getPvcTasksCount('police');
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.downloadPvcTasksState !== prevProps.downloadPvcTasksState && this.props.downloadPvcTasksState === "SUCCESS") {
            this.setState({ showExcelDownloaded: true })
            setTimeout(() => {
                this.setState({ showExcelDownloaded: false })
            }, 1000);
        }
    }

    onChangedHandler =  (type) => {
        this.setState({isChecked: type})
    }

    handleExcelDownload = () => {
        if(this.props.pvcTasksCount.count > 0)
            this.props.downloadPvcTasks('police verification tasks');
    }

    render(){
        const {t} = this.props;
        return(
            <div className={cx("row no-gutters", styles.CardPadding, styles.CardLayout)}>
                <div className={cx(styles.verticalLine,styles.leftDivPadding)} style={{width:"50%"}}>
                    <div>
                        <span><img className={styles.img} src={download} alt="img"/></span>
                        <span className={styles.heading}>{t('translation_docVerification:police.downloadTasks')}</span> 
                    </div>
                    {/* <div className={cx(styles.marginTop,styles.smallSecondaryText)}>
                        64 new police verificartion tasks have been added since your last download on 12.01.2020. download new tasks from below
                    </div> */}
                    <div className={cx("d-flex",styles.upDownBackground)}>
                        <div className="d-flex flex-column" style={{marginTop:"2rem",width:"40%"}}>
                            <span><img style={{marginLeft:"1.5rem"}} src={xlsx} alt='img'/></span>
                            <span className={cx(styles.smallPrimaryText,styles.spacing,"text-center")}>{t('translation_docVerification:police.tasks')}</span>
                        </div>
                        <div className="d-flex flex-column" style={{marginTop:"1.5rem",marginLeft:"3rem"}} disabled={this.props.pvcTasksCount.count === 0}>
                            {/* <div className="d-flex">
                                <span><input className={styles.RadioButton} type='radio' name="download" disabled={false} onChange={() => this.onChangedHandler("new")} checked={this.state.isChecked === "new"}/></span>
                                <label className={cx(styles.smallSecondaryText,"ml-2 mb-0 mt-1")}>download 64 newly added tasks</label>
                            </div>
                            <div className="d-flex" style={{marginTop:"1rem"}}>
                                <span><input className={styles.RadioButton} type='radio' name="download" disabled={false} onChange={() => this.onChangedHandler("all")} checked={this.state.isChecked === "all"}/></span>
                                <label className={cx(styles.smallSecondaryText,"ml-2 mb-0 mt-1")}>download all 128 open tasks</label> 
                            </div> */}
                            <DownloadButton
                                type='tasksExcelDownload'
                                label={t('translation_docVerification:police.downloadExcel')}
                                downloadState={this.props.downloadPvcTasksState}
                                showButton={this.state.showExcelDownloaded}
                                clickHandler={this.props.downloadPvcTasksState === 'LOADING' ? null : this.handleExcelDownload}
                            />
                        </div>
                    </div>
                </div>
                <div disabled = {true} className={styles.rightDivPadding} style={{width:"50%"}}>
                    <div>
                        <span><img className={cx(styles.img,styles.rotate)} src={download} alt="img"/></span>
                        <span className={styles.heading}>{t('translation_docVerification:police.uploadTasks')}</span> 
                    </div>
                    {/* <div className={cx(styles.marginTop,styles.smallSecondaryText)}>
                        128 open tasks have been downloaded in excel on 12.01.2020. close the tasks by uploading excel below
                    </div> */}
                    <div className={cx(styles.upDownBackground,"row no-gutters")} >
                        <div 
                            className="col-12"
                        >
                            <ExcelUploadSmall uploadState={this.state.uploadExcelState}
                                disabled={this.props.uploadExcelState !== 'INIT'}
                            />
                        </div>
                        {this.state.uploadExcelState !== "INIT" ? 
                            <div className={cx("col-9 pl-2",styles.paddingExcelUploadData)}>
                                <div className="d-flex">
                                    <div className="col-2 px-0">
                                        {this.state.empDetailsUploadState === "INIT" ?
                                            <div className={cx(styles.inactiveCircle)}>
                                                <div className={styles.stepNumber}>
                                                    <div className={styles.numberFont}>
                                                        {1}
                                                    </div>
                                                </div>
                                            </div>
                                            : this.state.empDetailsUploadState === "LOADING" ?
                                                <Loader type="stepLoaderGreen"/>
                                            : this.state.empDetailsUploadState === "SUCCESS" ?
                                                <span><img src={excelSuccess} alt='img'/></span>
                                            : null
                                        }
                                        <div className={cx(styles.verticalLineDisabled,"mt-3")}/>
                                    </div>
                                    <div className="col-10 d-flex flex-column px-0">
                                        <span className={styles.smallPrimaryText}>{t('translation_docVerification:police.fileName')}</span>
                                        {this.state.empDetailsUploadState === "LOADING" ?
                                            <span className={styles.smallSecondaryText}>{t('translation_docVerification:police.wait')}</span>
                                            : this.state.empDetailsUploadState === "SUCCESS" ? 
                                                <span>{t('translation_docVerification:police.success')}</span>
                                        : null}
                                    </div>
                                </div>

                                <div className="d-flex">
                                    <div className="col-2 px-0">
                                        {this.state.processEmpDetailsState === "INIT" ?
                                            <div className={cx(styles.inactiveCircle)}>
                                                <div className={styles.stepNumber}>
                                                    <div className={styles.numberFont}>
                                                        {2}
                                                    </div>
                                                </div>
                                            </div>
                                            : this.state.processEmpDetailsState === "LOADING" ?
                                                <Loader type="stepLoaderGreen"/>
                                            : this.state.processEmpDetailsState === "SUCCESS" ?
                                                <span><img src={excelSuccess} alt='img'/></span>
                                                : null
                                        }
                                        <div className={cx(styles.verticalLineDisabled,"mt-3")}/>
                                    </div>
                                    <div className="col-10 d-flex flex-column px-0">
                                        <span className={this.state.processEmpDetailsState === "INIT" ? styles.smallSecondaryText : styles.smallPrimaryText}>
                                            {t('translation_docVerification:police.process')}
                                        </span>
                                        {this.state.processEmpDetailsState === "LOADING" ?
                                            <span className={styles.smallSecondaryText}>{t('translation_docVerification:police.updating')}</span>
                                            :  this.state.processEmpDetailsState === "SUCCESS" ?
                                                <span> {t('translation_docVerification:police.updated')}</span>
                                        : null}
                                    </div>
                                </div>

                                <div className="d-flex">
                                    <div className="col-2 px-0">
                                    {this.state.successState === "INIT" ?
                                            <div className={cx(styles.inactiveCircle)}>
                                                <div className={styles.stepNumber}>
                                                    <div className={styles.numberFont}>
                                                        {3}
                                                    </div>
                                                </div>
                                            </div>
                                            : this.state.successState === "LOADING" ?
                                                <Loader type="stepLoaderGreen"/>
                                            : this.state.successState === "SUCCESS" ?
                                                <span><img src={excelSuccess} alt='img'/></span>
                                                : null
                                        }
                                    </div>
                                    <div className="col-10 d-flex flex-column px-0">
                                        {this.state.successState === "INIT" ?
                                            <span className={styles.smallSecondaryText}>{t('translation_docVerification:police.confirm')}</span>
                                            : this.state.successState === "SUCCESS" ?
                                                <span className={styles.smallPrimaryText}>{t('translation_docVerification:police.updateFail')}</span>
                                        : null }
                                    </div>
                                </div>
                            </div>
                        : null}
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        downloadPvcTasksState: state.workloadMgmt.DocVerification.getExcelDownloadTasksState,
        pvcTasksCount : state.workloadMgmt.DocVerification.pvcTasksCount
    }
}
const mapDispatchToProps = dispatch => {
    return {
        downloadPvcTasks: (type) => dispatch(actions.downloadExcelTasks(type)),
        getPvcTasksCount: (type) => dispatch(actions.excelTasksCount(type))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PvcUploadDownload);

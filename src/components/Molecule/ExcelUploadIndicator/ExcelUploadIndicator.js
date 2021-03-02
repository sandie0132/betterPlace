import React from 'react';
import styles from './ExcelUploadIndicator.module.scss';
import cx from 'classnames';
import excelError from '../../../assets/icons/excelError.svg';
import excelSuccess from '../../../assets/icons/excelSuccess.svg';
import { Button } from 'react-crux';
import Loader from '../../Organism/Loader/Loader';
import ProgressSlider from '../ProgressBarSlider/ProgressBarSlider';

const ExcelUploadIndicator = (props) => {
    let stepProgress;
    if (props.first) {
        stepProgress = (
            <div className={cx('py-0 px-0 d-flex flex-row', styles.divHeight)}>
                <div className="col-1 pl-0 flex-column justify-content-center">
                    {props.imageState === 'ERROR' ?
                        <React.Fragment>
                            <img className={cx(styles.activeCircle, styles.iconMarginLeft, 'mr-2')} src={excelError} alt='activeCircle' />
                            <div className={styles.verticleLineDisabledError} />
                        </React.Fragment> :
                        props.imageState === 'SUCCESS' ?
                            <React.Fragment>
                                <img className={cx('mr-2', styles.iconMarginLeft)} src={excelSuccess} alt='tick' />
                                <div className={styles.verticleLineActive} />
                            </React.Fragment> :
                            props.imageState === 'LOADING' ?
                                <React.Fragment>
                                    <Loader type='stepLoaderSmall' />
                                    <div className={cx(styles.verticleLineDisabled, 'mt-4')} />
                                </React.Fragment>
                                :
                                <div>
                                    <div className={cx(styles.inactiveCircle)}>
                                        <div className={styles.stepNumber}>
                                            <div className={styles.numberFont}>
                                                {props.stepNumber}
                                            </div>
                                        </div> <div className={styles.verticleLineDisabled} />
                                    </div>
                                </div>}
                </div>
                <div className="flex-column ml-2">
                    {props.imageState === 'INIT' ?
                        <div>
                            <label className={cx(styles.LabelPrev)}>{props.label}</label> <br />
                            <span className={styles.Description}>upload excel to add employees to the system</span>
                        </div>
                        : props.imageState === 'LOADING' ?
                            <div>
                                <label className={cx(styles.LabelPrev)}>{props.label}</label> <br />
                                <span className='d-flex flex-column'>
                                    {props.fileName ?
                                        <span className={styles.FileName}>{props.fileName}</span>
                                        : null}
                                    <span className={styles.Description}>please wait while employee details are getting processed</span>
                                </span>
                            </div>
                            : props.imageState === 'ERROR' ?
                                <div>
                                    <label className={cx(styles.LabelPrev)}>{props.label}</label> <br />
                                    <span className='d-flex flex-column'>
                                        <span>
                                            {props.fileName ? <span className={styles.FileName}>{props.fileName}</span> : null}
                                        </span>
                                        <span>
                                            <span className={styles.DescriptionError}>excel uploading failed due to network problem</span>
                                            {props.disabled ? null :
                                                <span className={styles.Retry} onClick={() => props.newFileUpload()}>
                                                    &nbsp;<u>retry</u></span>
                                            }
                                        </span>
                                    </span>
                                </div>
                                :
                                <div>
                                    <label className={cx(styles.LabelPrev)}>{props.label}</label> <br />
                                    <span className='d-flex flex-column mt-1'>
                                        {props.fileName ? <span className={cx(styles.FileName)}>{props.fileName}</span> : null}
                                        <span className={styles.Description}>{props.fileName}&nbsp;has been successfully uploaded</span>
                                    </span>
                                </div>
                    }
                </div>
            </div>
        )
    }
    else if (props.second) {
        stepProgress = (
            <div className={cx('py-0 px-0 d-flex flex-row', styles.divHeight)}>
                <div className="col-1 pl-0 flex-column justify-content-center">
                    {props.imageState === 'ERROR' ?
                        <React.Fragment>
                            <img className={cx(styles.activeCircle, styles.iconMarginLeft, 'mr-2')} src={excelError} alt='activeCircle' />
                            <div className={cx(styles.verticleLineDisabled, 'mt-4')} />
                        </React.Fragment> :
                        props.imageState === 'SUCCESS' ?
                            <React.Fragment>
                                <img className={cx('mr-2', styles.iconMarginLeft)} src={excelSuccess} alt='tick' />
                                <div className={styles.verticleLineActive} />
                            </React.Fragment> :
                            props.imageState === 'LOADING' ?
                                <React.Fragment>
                                    <Loader type='stepLoaderSmall' />
                                    <div className={cx(styles.verticleLineDisabled, 'mt-4')} />
                                </React.Fragment>
                                :
                                <div>
                                    <div className={cx(styles.inactiveCircle)}>
                                        <div className={styles.stepNumber}>
                                            <div className={styles.numberFont}>
                                                {props.stepNumber}
                                            </div>
                                        </div>
                                        <div className={styles.verticleLineDisabled} />
                                    </div>
                                </div>}
                </div>
                <div className="flex-column ml-2">
                    {props.imageState === 'LOADING' ?
                        <div>
                            <label className={cx(styles.LabelPrev)}>{props.label}</label> <br />
                            <div className={cx(styles.ProgressBarLayout)}>
                                <span className={styles.ProgressBarMessage}> scanning <label style={{ width: '1.8rem', textAlign: "center" }}>{props.scannedRowCount}</label>/ {props.totalRows} &nbsp; employees </span>
                                {/* <div className={cx(styles.ProgressBarLoader)}></div> */}

                                <ProgressSlider
                                    min={0}
                                    max={props.totalRows}
                                    value={props.scannedRowCount}
                                    status={props.imageState}
                                />
                            </div>
                        </div>
                        : props.imageState === 'ERROR' ?
                            <div> <label className={cx(styles.LabelPrev)}>{props.label}</label> <br />
                                <div className={cx(styles.ProgressBarLayout)}>
                                    <span className={styles.ProgressBarMessageError}> {props.scannedErrorMsg ? props.scannedErrorMsg : "scanning has failed due to network problem"} </span>
                                    {props.disabled ?
                                        null :
                                        <span className={styles.Retry} onClick={props.scannedErrorMsg ? () => props.newUpload() : () => props.retry()}>
                                            &nbsp;<u>retry</u></span>
                                    }
                                    {/* <div className={cx(styles.ProgressBarLoaderError)}></div> */}
                                    <ProgressSlider
                                        min={0}
                                        max={props.totalRows === '--' ? 1 : props.totalRows}
                                        value={props.scannedRowCount === '-' ? 0 : props.scannedRowCount}
                                        status={props.imageState}
                                    />
                                </div>
                            </div>
                            :
                            props.imageState === 'SUCCESS' ?
                                <div>
                                    <label className={cx(styles.LabelPrev)}>{props.label}</label> <br />
                                    <label className={cx(styles.scanMessage)}>scanned {props.successScannedCount ? props.successScannedCount : props.scannedRowCount}/{props.successScannedCount ? props.successScannedCount : props.totalRows} employees successfully</label>
                                </div>
                                :
                                <div>
                                    <label className={cx(styles.LabelPrev)}>{props.label}</label>
                                </div>
                    }
                </div>
            </div>
        )
    }
    else if (props.third) {
        stepProgress = (
            <React.Fragment>
                <div className={cx('py-0 px-0 d-flex flex-row', styles.divHeight)}>
                    <div className="col-1 pl-0 flex-column justify-content-center">
                        {props.imageState === 'ERROR' ?
                            <React.Fragment>
                                <img className={cx(styles.activeCircle, styles.iconMarginLeft, 'mr-2')} src={excelError} alt='activeCircle' />
                                {/* <div className={styles.verticleLineDisabledError} style={props.length === 1 ? { height: '13rem' } : props.length === 2 ? { height: '18rem' } : props.length === 3 ? { height: '24rem' } : { height: '6.5rem' }} /> */}
                            </React.Fragment>
                            :
                            props.imageState === 'SUCCESS' ?
                                <React.Fragment>
                                    <img className={cx('mr-2', styles.iconMarginLeft)} src={excelSuccess} alt='tick' />
                                    {/* <div className={styles.verticleLineActive} style={props.length === 1 ? { height: '13rem' } : props.length === 2 ? { height: '18rem' } : props.length === 3 ? { height: '24rem' } : { height: '6.5rem' }} /> */}
                                </React.Fragment>
                                :
                                props.imageState === 'LOADING' ?
                                    <React.Fragment>
                                        <Loader type='stepLoaderSmall' />
                                        {/* <div className={cx(styles.verticleLineDisabled, 'mt-4')} style={props.length === 1 ? { height: '13rem' } : props.length === 2 ? { height: '18rem' } : props.length === 3 ? { height: '24rem' } : { height: '6.5rem' }} /> */}
                                    </React.Fragment>
                                    :
                                    <div>
                                        <div className={cx(styles.inactiveCircle)}>
                                            <div className={styles.stepNumber}>
                                                <div className={styles.numberFont}>
                                                    {props.stepNumber}
                                                </div>
                                            </div> 
                                            {/* <div className={styles.verticleLineDisabled} /> */}
                                        </div>
                                    </div>
                        }
                    </div>
                    <div className="flex-column ml-2">
                        <label className={props.imageState === 'LOADING' ? styles.LabelPrev : cx(styles.LabelPrev)}> {props.label} </label><br />
                        {props.imageState === 'SUCCESS' || props.imageState === 'LOADING' ?
                            <span>
                                <span className={styles.scanMessage}>{props.successScannedCount ? props.successScannedCount : props.processedDataCount}/{props.successScannedCount ? props.successScannedCount : props.processedDataCount} employees scanned successfully</span> <br />
                                <span className={styles.Description}>approve to process all following data </span>
                            </span>
                            : props.imageState === 'ERROR' ?
                                <span>
                                    <span className={styles.scanMessage}>{props.successScannedCount ? props.successScannedCount : props.processedDataCount}/{props.successScannedCount ? props.successScannedCount : props.processedDataCount} employees scanned successfully</span> <br />
                                    <span className={styles.DescriptionError}>reconnecting...</span>
                                </span>
                                : null}
                    </div>

                    {props.imageState === 'SUCCESS' ?
                        <div className='ml-auto mt-4'>
                            <Button label='process all' type='save' clickHandler={props.handleProcess} isDisabled={(props.processCompleted === 'SUCCESS' || props.disabled) ? true : false} />
                        </div>
                        : props.imageState === 'ERROR' ?
                            null
                            // <div className='ml-auto mt-4'>
                            //     <Button label='retry all' type='save' clickHandler={props.handleProcess} isDisabled={props.processCompleted === 'SUCCESS' ? true : false}/>
                            // </div>
                            : props.imageState === 'LOADING' ?
                                <Loader type='stepLoader' />
                                : null}
                </div>
            </React.Fragment>
        )
    }
    // else {
    //     stepProgress = (
    //         <React.Fragment>
    //             <div className={cx('py-0 px-0 d-flex flex-row', styles.divHeight)}>
    //                 <div className="col-1 pl-0 flex-column justify-content-center">
    //                     {props.imageState === 'ERROR' ?
    //                         <React.Fragment>
    //                             <img className={cx(styles.activeCircle, styles.iconMarginLeft, 'mr-2')} src={excelError} alt='activeCircle' />
    //                             <div className={styles.verticleLineDisabled} />
    //                         </React.Fragment>
    //                         :
    //                         props.imageState === 'SUCCESS' ?
    //                             <React.Fragment>
    //                                 <img className={cx('mr-2', styles.iconMarginLeft)} src={excelSuccess} alt='tick' />
    //                             </React.Fragment>
    //                             :
    //                             props.imageState === 'LOADING' ?
    //                                 <React.Fragment>
    //                                     <Loader type='stepLoaderSmall' />
    //                                 </React.Fragment>
    //                                 :
    //                                 <div>
    //                                     <div className={cx(styles.inactiveCircle)}>
    //                                         <div className={styles.stepNumber}>
    //                                             <div className={styles.numberFont}>
    //                                                 {props.stepNumber}
    //                                             </div>
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                     }
    //                 </div>
    //                 <div className="flex-column ml-2">
    //                     <label className={props.imageState === 'LOADING' ? styles.LabelPrev : cx(styles.LabelPrev)}> {props.label} </label><br />
    //                     {props.imageState === 'SUCCESS' && (props.initiateCount > 0 || props.reinitiateCount > 0) ?
    //                         <span>
    //                             <span className={styles.scanMessage}>please process the following</span> <br />
    //                             <span className={styles.Description}>approve to process all following data </span>
    //                         </span>
    //                         : null}
    //                 </div>
    //             </div>
    //         </React.Fragment>
    //     )
    // }

    return (
        stepProgress
    )
};

export default ExcelUploadIndicator;
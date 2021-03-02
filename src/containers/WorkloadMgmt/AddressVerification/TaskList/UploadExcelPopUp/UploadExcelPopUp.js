import React, { Component } from 'react';
import { withRouter } from "react-router";
import { connect } from "react-redux";

import _ from 'lodash';
import cx from 'classnames';
import styles from './UploadExcelPopUp.module.scss';

import { Button } from 'react-crux';
import CancelButton from '../../../../../components/Molecule/CancelButton/CancelButton';

import xls from '../../../../../assets/icons/xls.svg';
import xlsxUpload from '../../../../../assets/icons/xlsxUpload.svg';

import * as actions from '../Store/action';
import { withTranslation } from 'react-i18next';

class UploadExcelPopUp extends Component {
    fileInputRef = React.createRef();

    state = {
        file: '',
        fileName : '',
        id: 'fileUpload',
    }

    openFileDialog = () => {
        if (this.props.disabled) return;
        this.fileInputRef.current.click();
    }

    onFilesAdded = (event) => {
        event.preventDefault();
        if (this.props.disabled) return;
        
        let file = event.target.files;
        this.handleImageChange(file);
        document.getElementById(this.state.id).value = '';
    }

    readAsDataURL = (fileReader, file) => {
        fileReader.readAsDataURL(file);
    }

    handleImageChange = (file) => {
        const excelRegex = /application/;
        const fileSize = 5120000;
        let error = null

        for (let i = 0; i < file.length; i++) {
            let reader = new FileReader();
            if (excelRegex.test(file[i].type) && file[i].size < fileSize) {
                error = null;
                reader.addEventListener('loadend', this.readAsDataURL(reader, file[i]));
                this.props.fileUpload(file[i]);
            }
            else {
                error = '* file size exceed 5 MB';
            }
            
            this.setState({ error: error, file: file[i], fileName : file[i].name})
        }
        // if (error === null) { this.props.fileUpload(file) }

    }

    onImageLoaded = (image) => {
        this.imageRef = image;
    }

    onDragOver = (event) => {
        event.preventDefault();   
        if (this.props.disabled) return;
        this.setState({ highlight: true }); 
    }

    onDragLeave = () => {
        this.setState({ highlight: false });
    }

    onDrop = (event) => {
        event.preventDefault();
        if (this.props.disabled) return;
        const file = event.dataTransfer.files;
        this.handleImageChange(file);

        this.setState({ highlight: false });
    }

    handleDisabled = () => {
        let isdisabled = true;
        if(this.props.processingState === 'SUCCESS') {
            if(this.props.processedData.processedCount + this.props.processedData.failedCount === this.props.processedData.totalTask) {
                isdisabled = false;
            }
            if(!_.isEmpty(this.props.processedData.errorPath)) {
                isdisabled =  false;
            }
        } else if(this.props.processingState === 'ERROR'){
            isdisabled =  false;
        }
        return isdisabled;
    }

    handleCancel = () => {
        this.props.closeFooter();
        this.props.onGetPostalUploadInitState();
    }

    render () {
        const { t } = this.props;
        let processedData = this.props.processedData;
        let value = processedData.processedCount;
        let min = 0, max= processedData.totalTask;

        let percentage = (value - parseInt(min)) / (parseInt(max) - parseInt(min)) * 100;
        return (
            <div className={styles.Footer}>
                
                <div>
                    <div className={styles.border}>
                        {this.props.uploadState === 'SUCCESS' ?
                            this.props.processingState === 'ERROR'
                            ?   <React.Fragment>
                                    <img src={xlsxUpload} alt='xlsx'/>
                                    <span className={cx("d-flex flex-column")}>
                                        <span className={cx(styles.smallRedText, "d-flex flex-column")}>
                                            <span>{this.props.processedData.failedCount}{t('translation_addressVerification:uploadExcel.failedUpdate')}</span>
                                            <span>{t('translation_addressVerification:uploadExcel.invalidFile')}</span>
                                        </span>
                                    </span>
                                </React.Fragment>
                            :   !_.isEmpty(this.props.processedData) ?
                                    this.props.processedData.processedCount !== this.props.processedData.totalTask
                                    ?   !this.props.processedData.errorPath
                                        ?   <React.Fragment>
                                                <img src={xlsxUpload} alt='xlsx'/>
                                                <div className="d-flex flex-column">
                                                    <span className={styles.activeText}>{this.state.fileName}{t('translation_addressVerification:uploadExcel.isUploading')}</span>
                                                    <span className={styles.smallSecondary}>{t('translation_addressVerification:uploadExcel.excelUpload')}</span>
                                                    <input className={styles.ProgressBarSlider}
                                                        style={{ backgroundImage: "linear-gradient(90deg, #0059B2 " + percentage + "% , #EBECFD 0%)" }}
                                                        type="range"
                                                        min={min}
                                                        max={max}
                                                        defaultValue={value}
                                                    >
                                                    </input>
                                                </div>
                                            </React.Fragment>
                                        :   <React.Fragment>
                                                <img src={xlsxUpload} alt='xlsx'/>
                                                <span className={cx("d-flex flex-column")}>
                                                    <span className={styles.activeText}>
                                                        {this.state.fileName}{t('translation_addressVerification:uploadExcel.success3')}
                                                        {" " + this.props.processedData.processedCount + "/" + this.props.processedData.totalTask + " "}{t('translation_addressVerification:uploadExcel.tasks')}
                                                    </span>
                                                    <span>
                                                        <span className={styles.smallRedText}>
                                                            {this.props.processedData.failedCount}{t('translation_addressVerification:uploadExcel.updateFail')}
                                                        </span>
                                                        <span onClick = {this.props.downloadPostalErrorExcel} className={styles.error}>{t('translation_addressVerification:uploadExcel.errorDownload')}</span>
                                                    </span>
                                                </span>
                                            </React.Fragment>
                                    :   <React.Fragment>
                                            <img src={xlsxUpload} alt='xlsx'/>
                                            <span className={cx("d-flex flex-column")}>
                                                <span className={styles.activeText}>{this.state.fileName}{t('translation_addressVerification:uploadExcel.success1')}</span>
                                                <span className={styles.smallGreenText}>{this.props.processedData.processedCount}{t('translation_addressVerification:uploadExcel.success2')}</span>
                                            </span>
                                        </React.Fragment>
                            :     
                            
                                <React.Fragment>
                                    <img src={xlsxUpload} alt='xlsx'/>
                                    <div className="d-flex flex-column">
                                        <span className={styles.activeText}>{this.state.fileName}{t('translation_addressVerification:uploadExcel.isUploading')}</span>
                                        <span className={styles.smallSecondary}>{t('translation_addressVerification:uploadExcel.excelUpload')}</span>
                                        <input className={styles.ProgressBarSlider}
                                            style={{ backgroundImage: "linear-gradient(90deg, #0059B2 0% , #EBECFD 0%)" }}
                                            type="range"
                                            min={min}
                                            max={max}
                                            defaultValue={value}
                                        >
                                        </input>
                                    </div>
                                </React.Fragment>
                        :   this.props.uploadState === 'LOADING' ?
                                <React.Fragment>
                                <img src={xlsxUpload} alt='xlsx'/>
                                <div className="d-flex flex-column">
                                    <span className={styles.activeText}>{this.state.fileName}{t('translation_addressVerification:uploadExcel.isUploading')}</span>
                                    <span className={styles.smallSecondary}>{t('translation_addressVerification:uploadExcel.excelUpload')}</span>
                                    <input className={styles.ProgressBarSlider}
                                        style={{ backgroundImage: "linear-gradient(90deg, #0059B2 0% , #EBECFD 0%)" }}
                                        type="range"
                                        min={min}
                                        max={max}
                                        defaultValue={value}
                                    >
                                    </input>
                                </div>
                            </React.Fragment>
                        :
                            <div    style={{ cursor: this.props.disabled ? 'default' : 'pointer'}}
                                    onClick={this.openFileDialog}
                                    onDragOver={this.onDragOver}
                                    onDragLeave={this.onDragLeave}
                                    onDrop={(e) => this.onDrop(e)}
                                    className="d-flex flex-row"
                            >
                                <input disabled={this.props.disabled}
                                    ref={this.fileInputRef}
                                    className={styles.FileInput}
                                    type="file"
                                    id={this.state.id}
                                    onChange={this.onFilesAdded}
                                    multiple
                                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel.sheet.macroenabled.12"
                                />
                                <img src={xls} alt='xlsx'/>
                                <span className={"d-flex flex-column"}>
                                    <span className={styles.mediumSecondary} >{t('translation_addressVerification:uploadExcel.dragDrop')}</span>
                                    <span className={cx(styles.browse, styles.activeText)}>{t('translation_addressVerification:uploadExcel.browse')}</span>
                                </span>
                            </div>
                        }
                    </div>
                </div>

                <span className={cx('d-flex', styles.AlignRight)}>
                    {this.props.uploadState === 'SUCCESS' ? '' : <CancelButton clickHandler={this.handleCancel} />}
                    <Button label={t('translation_addressVerification:uploadExcel.done')} type="medium" clickHandler={() => this.handleCancel()} isDisabled = {this.handleDisabled()}/>
                </span>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetPostalUploadInitState : () => dispatch(actions.getPostalUploadInitState())
    }
}

export default withTranslation()(withRouter(connect(null, mapDispatchToProps)(UploadExcelPopUp)));
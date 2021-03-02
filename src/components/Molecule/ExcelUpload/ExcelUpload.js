import React, { Component } from 'react';
import styles from './ExcelUpload.module.scss';
import _ from 'lodash';
import cx from 'classnames';
import "react-image-crop/dist/ReactCrop.css";
import excelIcon from '../../../assets/icons/excelIcon.svg';
import {
    CircularProgressbarWithChildren,
    buildStyles
} from "react-circular-progressbar";

import 'react-circular-progressbar/dist/styles.css';

class ExcelUpload extends Component {
    state = {
        highlight: false,
        error: null,
        file: '',
        id: 'fileUpload'
    }

    fileInputRef = React.createRef();

    componentDidMount = () => {
        if (!_.isEmpty(this.props.id)) {
            this.setState({ id: this.props.id })
        }
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
        const excelRegex = /application/
        const fileSize = 20480000;
        let error = null

        for (let i = 0; i < file.length; i++) {
            let reader = new FileReader();
            if (excelRegex.test(file[i].type) && file[i].size < fileSize) {
                error = null;
                reader.addEventListener('loadend', this.readAsDataURL(reader, file[i]));
                this.props.fileUpload(file[i]);
            }
            else {
                error = '* file size exceeds 20 MB';
            }
            this.setState({ error: error, file: file[i] })
        }
        // if (error === null) { this.props.fileUpload(file) }

    }

    onImageLoaded = (image) => {
        this.imageRef = image;
    }

    onDragOver = (event) => {
        event.preventDefault();   //useCase
        if (this.props.disabled) return;
        this.setState({ highlight: true }); //makeitwork
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

    render() {
        let percentage = this.props.percentCompleted === 'undefined' ? 0 : this.props.percentCompleted
        return (
            <React.Fragment>
                <div
                    style={{ cursor: this.props.disabled ? 'default' : 'pointer' }}
                    onClick={this.openFileDialog}
                    onDragOver={this.onDragOver}
                    onDragLeave={this.onDragLeave}
                    onDrop={(e) => this.onDrop(e)}
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

                    {this.props.excelLoadingState === 'LOADING' ?
                        <div style={{ width: "70%", height: "70%", marginLeft: "0.75rem" }}>
                            <CircularProgressbarWithChildren
                                value={percentage}
                                strokeWidth={2.5}
                                background
                                styles={buildStyles({
                                    pathColor: "#0059B2",
                                    trailColor: "#F4F7FB",
                                    backgroundColor: "#F4F7FB"
                                })}
                            >
                                <img src={excelIcon} height="30%" width="80%" y="33%" x="1" alt="img"></img>
                            </CircularProgressbarWithChildren>
                        </div>
                        : this.props.excelLoadingState === 'SUCCESS' ?
                            <div style={{ width: "70%", height: "70%", marginLeft: "0.75rem" }}>
                                <CircularProgressbarWithChildren
                                    value={100}
                                    strokeWidth={2.5}
                                    background
                                    styles={buildStyles({
                                        pathColor: "#0059B2",
                                        trailColor: "#F4F7FB",
                                        backgroundColor: "#F4F7FB"
                                    })}
                                >
                                    <img src={excelIcon} height="30%" width="80%" y="33%" x="1" alt="img"></img>
                                </CircularProgressbarWithChildren>
                            </div>
                            :
                            this.props.excelLoadingState === 'ERROR' ?
                                <div style={{ width: "70%", height: "70%", marginLeft: "0.75rem" }}>
                                    <CircularProgressbarWithChildren
                                        value={percentage}
                                        strokeWidth={2.5}
                                        background
                                        styles={buildStyles({
                                            pathColor: "#EE3942",
                                            trailColor: "#F4F7FB",
                                            backgroundColor: "#FDEBEC"
                                        })}
                                    >
                                        <img src={excelIcon} height="30%" width="80%" y="33%" x="1" alt="img"></img>
                                    </CircularProgressbarWithChildren>
                                </div>
                                :
                                <label className={this.props.className}>
                                    <img className={cx(this.props.imgClassName, styles.UploadImage)} src={this.props.upload} alt="upload document" />
                                    {this.props.message}
                                </label>
                    }

                </div>
                {!_.isEmpty(this.state.error) ?
                    <div>
                        <label className={styles.errorMessage}>{this.state.error}</label>
                    </div> : ""}
            </React.Fragment>
        )
    }
}

export default ExcelUpload;
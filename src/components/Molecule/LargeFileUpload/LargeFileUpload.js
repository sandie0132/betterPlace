import React, { Component } from 'react';
import styles from './LargeFileUpload.module.scss';
import _ from 'lodash';
import cx from 'classnames';
import "react-image-crop/dist/ReactCrop.css";
import fileIcon from '../../../assets/icons/docIcon.svg';
import {
    CircularProgressbarWithChildren,
    buildStyles
} from "react-circular-progressbar";

import 'react-circular-progressbar/dist/styles.css';

class LargeFileUpload extends Component {
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
        // const fileRegex = /application/
        let maxMbSize = 5;
        if (!isNaN(this.props.maxMbSize)) {
            maxMbSize = this.props.maxMbSize
        }
        const fileSize = Math.abs(maxMbSize * 1024 * 1024);
        let error = null



        for (let i = 0; i < file.length; i++) {
            let reader = new FileReader();
            let supportedList = _.cloneDeep(this.props.supportedExtensions)

            let fileExt = "." + file[i].name.split('.').pop();
            if (!_.isEmpty(supportedList)) {
                if (supportedList.includes(fileExt)) {

                    if (file[i].size < fileSize) {
                        error = null;
                        reader.addEventListener('loadend', this.readAsDataURL(reader, file[i]));
                        this.props.fileUpload(file[i]);
                    } else {
                        error = "* file size exceeds " + maxMbSize + " MB"
                    }
                }
                else {
                    let supportedString = '';
                    for (let i = 0; i < supportedList.length; i++) {
                        
                        if (i === supportedList.length - 1) { supportedString += supportedList[i] }
                        else { supportedString += supportedList[i] + ", " }
                    }

                    error = "* invalid file selected. only supported types are " + supportedString;
                }
            } else {
                error = "* no supporting file types are found"
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
                    style={{ cursor: this.props.disabled ? 'default' : 'pointer', textAlign:"center" }}
                    onClick={this.openFileDialog}
                    onDragOver={this.onDragOver}
                    onDragLeave={this.onDragLeave}
                    onDrop={(e) => this.onDrop(e)}
                >
                    {this.props.multiple ?

                        <input disabled={this.props.disabled}
                            ref={this.fileInputRef}
                            className={styles.FileInput}
                            type="file"
                            id={this.state.id}
                            onChange={this.onFilesAdded}
                            multiple
                            accept={this.props.accept}
                        />
                        :
                        <input disabled={this.props.disabled}
                            ref={this.fileInputRef}
                            className={styles.FileInput}
                            type="file"
                            id={this.state.id}
                            onChange={this.onFilesAdded}
                            accept={this.props.accept}
                        />
                    }

                    {this.props.fileLoadingState === 'LOADING' ?
                        <div style={{ width: "10rem", height: "10rem", marginLeft: "auto", marginRight:"auto" }}>
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
                                <img src={fileIcon} height="30%" width="80%" y="33%" x="1" alt="img"></img>
                            </CircularProgressbarWithChildren>
                        </div>
                        : this.props.fileLoadingState === 'SUCCESS' ?
                            <div style={{ width: "10rem", height: "10rem", marginLeft: "auto", marginRight:"auto" }}>
                                <CircularProgressbarWithChildren
                                    value={100}
                                    strokeWidth={2.5}
                                    background
                                    styles={buildStyles({
                                        pathColor: "#42AC5C",
                                        trailColor: "#F4F7FB",
                                        backgroundColor: "rgba(54,168,82,0.1)"
                                    })}
                                >
                                    <img src={fileIcon} height="30%" width="80%" y="33%" x="1" alt="img"></img>
                                </CircularProgressbarWithChildren>
                            </div>
                            :
                            this.props.fileLoadingState === 'ERROR' ?
                                <div style={{ width: "10rem", height: "10rem", marginLeft: "auto", marginRight:"auto" }}>
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
                                        <img src={fileIcon} height="30%" width="80%" y="33%" x="1" alt="img"></img>
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

export default LargeFileUpload;



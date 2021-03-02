import React, {Component} from 'react';
import { connect } from 'react-redux';
import styles from './ExcelUploadSmall.module.scss';
import cx from 'classnames';
// import _ from 'lodash';

import uploadImg from '../../../assets/icons/uploadBrowse.svg';
import excelIcon from '../../../assets/icons/excelIcon.svg';

import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

class ExcelUploadSmall extends Component {

    fileInputRef = React.createRef();

    state = {
        file: '',
        id: 'fileUpload',
        uploadExcelState : "INIT"
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

    render () {
        let percentage = this.props.percentCompleted === 'undefined' ? 0 : this.props.percentCompleted

        return(
            <div
                style={{ cursor: this.props.disabled ? 'default' : 'pointer'}}
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
                {this.props.getExcelUploadTasksState === "INIT" ?
                    <div className={cx(styles.browse,"d-flex flex-column col-8 offset-2")}>
                        <span className="d-flex justify-content-center"><img src={uploadImg} alt='img'/></span>
                        <span className={cx(styles.smallSecondaryText,"text-center mt-4")}>drag excel files to upload</span>
                        <span className={cx("text-center",styles.smallSecondaryText)}>or</span>
                        <span className={cx("text-center",styles.browseLink)}>browse</span>
                    </div>
                : this.props.getExcelUploadTasksState === "LOADING" ?
                    <div style={{ width: "95%", height: "70%", marginLeft: "0.5rem", marginTop: "2.5rem" }}>
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
                : this.props.getExcelUploadTasksState === "SUCCESS" ?
                    <div style={{ width: "95%", height: "70%", marginLeft: "0.5rem", marginTop: "2.5rem"  }}>
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
                : null}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        getExcelUploadTasksState : state.workloadMgmt.DocVerification.getExcelUploadTasksState
    }
}
const mapDispatchToProps = dispatch => {
    return {

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ExcelUploadSmall);
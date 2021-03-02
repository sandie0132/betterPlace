import React, { Component } from 'react';
import styles from './DocumentUpload.module.scss'
import Loader from '../../../../../components/Organism/Loader/Loader';
import { connect } from 'react-redux';
import cx from 'classnames';
import _ from 'lodash'

import WarningPopUp from '../../../../../components/Molecule/WarningPopUp/WarningPopUp';
import warn from '../../../../../assets/icons/warning.svg';
//svg
import docLoading from '../../../../../assets/icons/docIcon_2.svg';
import uploadDoc from '../../../../../assets/icons/uploadDocIcon.svg';
import download from '../../../../../assets/icons/downloadIcon.svg';
import blueCross from '../../../../../assets/icons/blueCross.svg';

import * as actions from '../Store/action';


//// Attributes for DocumentUpload
// uploadState //uploadPercentage //url //fileUpload(fn)
//downloadState //fileDownload
class DocumentUpload extends Component {

    state = {
        highlight: false,
        id: 'fileUpload',
        fileName: "",
        error: [],
        documentURL: '',
        fileNames: [],
        documentURLs: [],
        selectedIndex: null,
        downloadIndex: null,
        isEdited: false,
        showRemovePopup: false
    }

    fileInputRef = React.createRef();

    componentDidMount = () => {
        if (!_.isEmpty(this.props.url)) {
            this.setState({ documentURLs: this.props.url, error: '' })
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (!_.isEqual(this.props.url, prevProps.url) && !_.isEqual(this.props.url, this.state.documentURLs)){ 
            this.setState({ documentURLs: this.props.url, error: [] }) // to handle url on cancel
        }
        if (this.props.docUploadState !== prevProps.docUploadState && this.props.docUploadState === "SUCCESS") {
            let updatedDocumentURLs = _.cloneDeep(this.state.documentURLs);
            this.props.documentURL.forEach((url) => {
                updatedDocumentURLs.push(url);
            })
            this.setState({ documentURLs: updatedDocumentURLs })
            this.props.file(updatedDocumentURLs);
        }
    }

    onImageLoaded = (image) => {
        this.imageRef = image;
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

    handleImageChange = (file) => {
        let maxMbSize = 5;
        if (!isNaN(this.props.maxMbSize)) {
            maxMbSize = this.props.maxMbSize
        }
        const fileSize = Math.abs(maxMbSize * 1024 * 1024);

        let formData = new FormData();
        let updatedFileNames = [];
        let sizeErrorFileNames = [];
        let typeErrorFileNames = [];

        for (let i = 0; i < file.length; i++) {
            let fileSizeError = false;
            let fileTypeError = false;
            const supportedType = ["application/pdf", "image/png", "image/jpeg"]
            let reader = new FileReader();

            if (!supportedType.includes(file[i].type)) {
                fileTypeError = true;
                let errorFileName = file[i]['name'];
                typeErrorFileNames.push(errorFileName);
            }
            if (!fileTypeError) {
                if (file[i].size < fileSize) {
                    reader.addEventListener('loadend', reader.readAsDataURL(file[i]));
                } else {
                    fileSizeError = true;
                    let errorFileName = file[i]['name'];
                    sizeErrorFileNames.push(errorFileName);
                }
            }
            /////File append for upload 

            if (!fileSizeError && !fileTypeError) {
                let fileName = file[i]['name'];
                formData.append("file", file[i])
                updatedFileNames.push(fileName);
            }
        }

        if (!_.isEmpty(formData.getAll('file'))) {
            this.setState({ fileNames: updatedFileNames, isEdited: true })
            let folder = this.props.folderName;
            this.props.documentUpload(folder, formData);
        }
        let updatedError = [];
        if (!_.isEmpty(sizeErrorFileNames)) {
            updatedError.push("* file(s) size exceeds " + maxMbSize + ' MB ( ' + sizeErrorFileNames.join(' , ') + ' ) ');
        }
        if (!_.isEmpty(typeErrorFileNames)) {
            updatedError.push(" ** file(s) are not supported ( " + typeErrorFileNames.join(' , ') + ' )');
        }
        this.setState({ error: updatedError })

    }

    handleFileDownload = (url, index) => {
        // let documentUrl = this.state.documentURL;
        this.props.documentDownload(url);
        this.setState({
            downloadIndex: index
        })
    }

    toggleRemovePopup = (index) => {
        let selectedIndex = (index !== null && !Number.isNaN(index)) ? index : null;
        this.setState({ showRemovePopup: !this.state.showRemovePopup, selectedIndex: selectedIndex })
    }

    handleRemove = (targetUrl) => {
        let documentURLs = _.cloneDeep(this.state.documentURLs);
        let updatedDocumentUrls = documentURLs.filter((url) => url !== targetUrl)
        this.setState({ showRemovePopup: false, documentURLs: updatedDocumentUrls });
        this.props.file(updatedDocumentUrls);
    }

    render() {
        return (
            <div className={cx(styles.cardContainer, this.props.className)}>

                {/* ///////////container design for 3 cases ////// */}

                {/* /////UPLOAD STATE -> LOADING////// */}
                {this.props.docUploadState === "LOADING" ?
                    <div className={cx(styles.dottedContainer)} style={{ marginTop: '1rem' }}>
                        <div className={cx("d-flex flex-row")} style={{ padding: "0.5rem 1rem 1rem 1rem", height: "8.25rem" }}>
                            <img src={docLoading} alt="document loading" className={cx(styles.loadingIcon, 'mt-3')} />

                            <div className="d-flex flex-column" style={{ paddingLeft: "1rem", }}>
                                <span className="d-flex">
                                    <label className={cx(styles.headingText, styles.blueText, 'd-flex')} style={{ paddingTop: "1rem", textAlign: "left" }}>
                                        <label>uploading&nbsp;</label>
                                        <label className={styles.loadingElipsis}>{this.state.fileNames[0]}&nbsp;</label>
                                    </label>
                                    {!_.isEmpty(this.state.fileNames) && this.state.fileNames.length > 1 && (<label className={cx(styles.headingText, styles.blueText, 'pt-3')}>{` + ${Math.abs(this.state.fileNames.length - 1)} more`}</label>)}
                                </span>
                                <label className={cx(styles.smallText)} style={{ textAlign: "left" }}>please wait while uploading is being done.</label>
                                {/* ///////// Upload percentage/////// */}

                                <div className={cx(styles.loadingOuter)} style={{ marginTop: "0.5rem", alignSelf: "flex-start" }}>
                                    <div className={cx(styles.loadingInner)} style={{ width: this.props.percentUpload + "%" }}>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    :

                    /////////// NO URL /////////////////
                    <div className={cx(styles.dottedContainer)}
                        style={{ marginTop: '1rem' }}
                        onDragOver={this.onDragOver}
                        onDragLeave={this.onDragLeave}
                        onDrop={(e) => this.onDrop(e)}>
                        <div style={{ opacity: this.state.highlight ? "0.5" : "1" }}>
                            <div className={cx("d-flex flex-row")} style={{ padding: "1rem", marginTop: '0.5rem' }}>

                                <img src={uploadDoc} alt="upload doc" style={{ alignSelf: "center" }} />
                                <div className="d-flex flex-column" style={{ paddingLeft: "0.5rem" }}>
                                    <label className={cx(styles.headingText)} style={{ alignSelf: "flex-start", paddingTop: "1rem" }}>drag and drop documents here</label>
                                    <label onClick={this.openFileDialog} className={cx(styles.headingText, styles.blueText, styles.underline, styles.pointer)} style={{ alignSelf: "flex-start" }}>browse your files</label>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {!_.isEmpty(this.state.error) &&
                    (<div className="d-flex flex-column" style={{ minHeight: "1.2rem", textAlign: "left" }}>
                        {this.state.error.map((err)=>{
                            return(
                                <label key={err} className={cx(styles.errorMessage, 'my-0')}>{err}</label>
                            );
                        })}
                       
                    </div>)}

                {/* ///////////////////// VALID URL //////////////// */}
                {!_.isEmpty(this.state.documentURLs) && this.state.documentURLs.map((url, index) => (
                    <div className={cx(styles.dottedContainer)} style={{ marginTop: '1rem', position: "relative" }} key={url}>
                        <img onClick={() => this.toggleRemovePopup(index)} src={blueCross} alt="remove" className={styles.closeIcon} />
                        {
                            this.state.showRemovePopup && index === this.state.selectedIndex ?
                                <WarningPopUp
                                    text={"remove ?"}
                                    para={"WARNING: it cannot be undone"}
                                    confirmText={"yes, remove"}
                                    cancelText={"keep"}
                                    icon={warn}
                                    warningPopUp={() => this.handleRemove(url)}
                                    closePopup={this.toggleRemovePopup}
                                />
                                : null
                        }
                        <div className={cx("d-flex flex-row")} style={{ padding: "1rem", minHeight: "8.25rem" }}>
                            <img src={docLoading} alt="document loading" className={styles.loadingIcon} />
                            <div className="d-flex flex-column" style={{ paddingLeft: "1.25rem" }}>
                                <label className={cx(styles.headingText, styles.blueText, styles.loadingElipsis)} style={{ paddingTop: "0.5rem", textAlign: "left", maxWidth: "30rem" }}>{url.split('/').pop()} successfully uploaded </label>
                                {/* ////// Download button/////////// */}
                                <div className="d-flex flex-row">
                                    <div style={{ marginTop: "0.5rem" }}>
                                        <div onClick={() => this.handleFileDownload(url, index)} className={cx(styles.downloadButtonContainer, styles.pointer, "d-flex flex-row mx-auto")}>
                                            {this.props.docDownloadState === "LOADING" && this.state.downloadIndex === index ?
                                                <div style={{ marginLeft: "10px", paddingRight: "12px" }}><Loader type='stepLoaderBlue' /></div>
                                                :
                                                <img src={download} alt="icon" style={{ height: "16px", width: "16px", marginLeft: "6px", marginTop: "4px" }} />}
                                            <label className={cx(styles.smallText, styles.blueText, styles.pointer)} style={{ paddingLeft: "8px", paddingTop: "4px", paddingRight: "4px" }}>download document</label>
                                        </div>
                                    </div>

                                    {/* <label onClick={this.openFileDialog} className={cx(styles.smallText, styles.blueText, styles.underline, styles.pointer)} style={{ alignSelf: "center", paddingTop: "0.5rem", paddingLeft: "1rem" }}>upload again</label> */}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <input disabled={false}
                    ref={this.fileInputRef}
                    className={styles.FileInput}
                    type="file"
                    id={this.state.id}
                    onChange={this.onFilesAdded}
                    multiple
                    accept='application/pdf, image/png, image/jpeg'
                />

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        docUploadState: state.empMgmt.empOnboard.onboard.uploadDocumentState,
        percentUpload: state.empMgmt.empOnboard.onboard.percentCompleted,
        documentURL: state.empMgmt.empOnboard.onboard.documentURL,
        docDownloadState: state.empMgmt.empOnboard.onboard.downloadDocumentState,
        error: state.empMgmt.empOnboard.onboard.error
    }
}


const mapDispatchToProps = dispatch => {
    return {
        documentUpload: (folder, image) => dispatch(actions.documentUpload(folder, image)),
        documentDownload: (url) => dispatch(actions.documentDownload(url))
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(DocumentUpload));
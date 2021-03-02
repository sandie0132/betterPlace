import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from "react-redux";

import cx from 'classnames';
import _ from 'lodash';
import styles from './UploadPictureMultiple.module.scss';

import ReactCrop from 'react-image-crop';
import "react-image-crop/dist/ReactCrop.css";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";

import addMoreLarge from '../../../../../../assets/icons/addMoreLarge.svg';

import * as actions from './Store/action';

let refCount = 0;
let verCount = 0;

class UploadPictureMultiple extends Component{

    fileInputRef = React.createRef();
    
    state = {
        error: null,
        fileCropped: false,
        fileLoaded: false,
        file: '',
        localImgSrc: '',
        imagePreviewUrl: '',
        removeButton: false,
        imageAspect: '',
        crop: {
            unit: "%",
            height: 50,
            width: 50,
        },
        cropImage: null,
        imgUrl : '',
    }

    constructor(props) {
        super(props);
        this.fileInputRef = React.createRef();
        this.openFileDialog = this.openFileDialog.bind(this);
        this.onFilesAdded = this.onFilesAdded.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
    }

    componentDidMount = () => {
        this.setState({})
    }

    componentWillUnmount = () => {
        refCount = 0;
        verCount = 0;
    }

    openFileDialog() {
        this.fileInputRef.current.click()
    }

    onFilesAdded(evt) {
        let files = evt.target.files;
        this.handleImageChange(evt);
    
        let formData = new FormData();
        formData.append('file', files[0]);
        this.setState({
            fileCropped: false,
        })
        if (document.getElementById("fileInput")!== null) {
            document.getElementById("fileInput").value = "";
        }
    }

    handleImageChange(e) {
        let reader = new FileReader();
        let file = e.target.files[0];

        const imageRegex = /image/


        if (imageRegex.test(file.type) && file.size < 5242880) {
            reader.addEventListener('load', () => {
                this.setState({
                    file: file,
                    imagePreviewUrl: reader.result,
                    imgUrl : [reader.result],
                    error: null,
                    fileLoaded: true,
                });
            });
            reader.readAsDataURL(file)
        }
        else {
            this.setState({
                fileLoaded: false,
                error: '* file size exceeded 5 MB'
            })
        }
    }

    onCancelUpload = () => {
        this.setState({
            file: '',
            imagePreviewUrl: '',
            cropImage: null,
            fileCropped: false,
        });
    }
    
    onImageLoaded = image => {
        this.imageRef = image;
        let imageAspectRatio = this.imageRef.width / this.imageRef.height
        this.setState({ imageAspect: imageAspectRatio })
    }
    
    onCropComplete = (crop) => {
        this.makeCrop(crop);
    }
    
    onCropChange = crop => {
        this.setState({ crop });
    }
    
    makeCrop = (crop) => {
        if (this.imageRef && crop.width && crop.height) {
            this.getCroppedImg(this.imageRef, crop, this.state.file.name);
        }
    }
    
    getCroppedImg(image, crop, fileName) {
    
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
        );
    
        canvas.toBlob(blob => {
        const fd = new FormData();
        fd.set('a', blob, fileName);
        const finalImageFile = fd.get('a');
        this.setState({ cropImage: finalImageFile });
        });
    }
    
    
    onSaveImageClick = () => {
        let reader = new FileReader();
        let file = this.state.cropImage;
        this.getAndUploadImage(file );

        const imageRegex = /image/
    
    
        if (imageRegex.test(file.type)) {
        reader.addEventListener('load', () => {
            this.setState({
                file: '',
                imagePreviewUrl: reader.result,
                imgUrl : [reader.result],
                error: null,
                fileCropped: true,
                showDeleteButton :false,
            });
        })
        
        
        reader.readAsDataURL(file)
        }
    
    }
    
    onCancelImageClick = () => {
        this.onCancelUpload();
        this.setState({fileLoaded: false})
    }

    getAndUploadImage = (file) => {
        let diff = this.props.type === "reference" ? ++refCount : ++verCount;
        let type = this.props.addressLine+ "_" +(diff);
        let action = this.props.addressLine+(diff)+"Action";
        let formData = new FormData();
        formData.append('file', file);
        this.props.onUploadImage("PHYSICAL_ADDRESS", formData, type, action, this.props.serviceRequestId, this.props.type);
    }

    deleteImage = (type, action) => {
        let fileName = this.props.addressUrl[type];
        if(_.isEmpty(fileName)){
            this.props.images.forEach(img => {
                if(img.label === type){
                    fileName = img.imgUrl;
                }
            })
        }
        if(!_.isEmpty(fileName)){
            this.props.onDeleteImage('PHYSICAL_ADDRESS', fileName, type, action, this.props.serviceRequestId);
        }
    }

    render () {
        const { crop, imagePreviewUrl } = this.state;
        let percentage = this.props.percentCompleted === 'undefined' ? 0 : this.props.percentCompleted;
        return(
            <React.Fragment>
                {this.props.showUpload 
                ?   <div className={cx(styles.addressBackground, this.props.className)}>
                        <div>
                            {(!this.state.file) ?
                                <div>
                                    {this.props.addAddressUrlState === 'LOADING' ?
                                        <div className="position-relative">
                                            <img className={styles.imageUrl} src={this.state.imgUrl} alt='img' />
                                            <div className={styles.transperancy}>
                                                <div className={cx(styles.circularProgress)}>
                                                    <CircularProgressbarWithChildren
                                                        value={percentage}
                                                        strokeWidth={6}
                                                        background
                                                        styles={buildStyles({
                                                            pathColor: "#0059B2",
                                                            trailColor: "#F4F7FB",
                                                            backgroundColor: "#F4F7FB"
                                                        })}
                                                    >
                                                        <span className={styles.percentage}>{percentage}%</span>
                                                    </CircularProgressbarWithChildren>
                                                </div>
                                            </div>
                                        </div>
                                    :
                                        <div className={cx(styles.emptyPicBackground)}>
                                            <img alt='add' src={addMoreLarge}
                                                                className={cx(styles.addMore, styles.hover)}   
                                                                onClick={this.openFileDialog} 
                                                                // className={}
                                            /> 
                                        </div>
                                    }
                                    <input disabled={this.props.disabled}
                                        ref={this.fileInputRef}
                                        className={styles.FileInput}
                                        type="file"
                                        id='fileInput'
                                        onChange={this.onFilesAdded}
                                        accept="image/x-png, image/jpeg"
                                        multiple
                                    />
                                </div>
                                        
                            :   (!this.state.fileCropped && this.state.fileLoaded) ?
                                    <div className={cx(styles.backdrop, "d-flex flex-column justify-content-center")}>
                                        <div className={cx(styles.cropContainer, "container-fluid ")} >
                            
                                            <div className={cx(styles.ImageCropView, "row mt-4 mb-3 mx-3 d-flex justify-content-center")}>
                                                {imagePreviewUrl && (
                                                    <ReactCrop
                                                        src={imagePreviewUrl}
                                                        crop={crop}
                                                        className={this.state.imageAspect < 0.9 ? styles.cropStylePotrait : styles.cropStyleBasic}
                                                        onImageLoaded={this.onImageLoaded}
                                                        onComplete={this.onCropComplete}
                                                        onChange={this.onCropChange}
                                                    />
                                                )}
                                            </div>
                                
                                            <div className={cx("row pb-3 pr-4 d-flex justify-content-end")} style={{ backgroundColor: "white" }}>
                                                <button type='button' onClick={this.onCancelImageClick} className={cx(styles.cancelButton)}>
                                                cancel
                                                </button>
                                                <button type='button' onClick={this.onSaveImageClick} className={cx("ml-2", styles.saveButton)}>
                                                upload
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                            :   ''}
                        </div>
                        <div className={cx(styles.addressLine)}>
                            <img className={cx(styles.addressLineIcon)} src={this.props.addressLineIcon} alt='add' />
                            <span className={styles.smallSecondaryText}>{this.props.addressLine}</span>
                        </div>
                    </div>
                : null}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        percentCompleted : state.workloadMgmt.addressVerification.multipleUploadReducer.percentCompleted,
        addressUrl: state.workloadMgmt.addressVerification.multipleUploadReducer.addressUrl,
        addAddressUrlState: state.workloadMgmt.addressVerification.multipleUploadReducer.addAddressUrlState,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onUploadImage: (type, file, urlType, action, serviceRequestId, otherType) => dispatch(actions.uploadPhysicalAddressUrl(type, file, urlType, action, serviceRequestId, otherType)),
        onDeleteImage: (type, fileName, urlType, action, url) => dispatch(actions.deletePhysicalAddressUrl(type, fileName, urlType, action, url)),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UploadPictureMultiple));
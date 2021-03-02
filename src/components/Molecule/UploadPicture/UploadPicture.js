import React,{ Component } from 'react';
import styles from './UploadPicture.module.scss';
import cx from 'classnames';
import _ from 'lodash';
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css'

import ReactCrop from 'react-image-crop';
import "react-image-crop/dist/ReactCrop.css";

import addMoreLarge from '../../../assets/icons/addMoreLarge.svg';
import greenTickEmptyCircle from '../../../assets/icons/greenTickEmptyCircle.svg';
import redTickEmptyCircle from '../../../assets/icons/redTickEmptyCircle.svg';
import close from '../../../assets/icons/closeNotification.svg';
import deleteIcon from '../../../assets/icons/deleteBinIcon.svg';
import mountain from '../../../assets/icons/companyEmptyLogo.svg';

import Loader from '../../../components/Organism/Loader/Loader';

class UploadPicture extends Component{

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
        showDeleteButton : false
    }

    constructor(props) {
        super(props);
        this.fileInputRef = React.createRef();
        this.openFileDialog = this.openFileDialog.bind(this);
        this.onFilesAdded = this.onFilesAdded.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
    }
    
    changTick = (action, imageType) => {
        this.props.handleAction(action, imageType, this.props.index);
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
        this.props.file(file);
        const imageRegex = /image/
    
    
        if (imageRegex.test(file.type)) {
        reader.addEventListener('load', () => {
            this.setState({
                file: '',
                imagePreviewUrl: reader.result,
                imgUrl : [reader.result],
                error: null,
                fileCropped: true,
                showDeleteButton :false
            });
        })
        reader.readAsDataURL(file)
        }
    
    }
    
    onCancelImageClick = () => {
        this.onCancelUpload();
        this.setState({fileLoaded: false})
    }

    handleOnImageHover = (value) => {
        if(!_.isEmpty(this.props.imgUrl) && !this.props.shouldShowAddMore && !this.props.disabled){
            this.setState({showDeleteButton : value})
        }
    }

    render() {
        const { crop, imagePreviewUrl } = this.state;
        let percentage = this.props.percentCompleted === 'undefined' ? 0 : this.props.percentCompleted;
        return(
            <div className={cx(styles.addressBackground, this.props.className)}>
                <div>
                    {(!this.state.file) ?
                        <React.Fragment>
                            {!_.isEmpty(this.props.imgUrl) ?
                                <div    className={this.props.shouldShowAddMore ? cx(styles.preAddedPicStyle) : cx(styles.picStyle) } 
                                        onMouseEnter={() => this.handleOnImageHover(true)} 
                                        onMouseLeave={() => this.handleOnImageHover(false)}
                                >
                                    <div style={{position:"relative"}}>
                                        <img className={cx(this.props.shouldShowAddMore ? styles.preAddedImgUrl : styles.imageUrl, this.props.actionTaken === 'rejected' ? styles.disabled : '')}
                                             src={this.props.imgUrl} alt='img' />
                                    </div>
                                    
                                    {this.state.showDeleteButton ? 
                                        <img onClick={() => this.props.delete()} className={styles.onImgHover} src={deleteIcon} alt=""/> 
                                    : null}
                                </div>
                            :
                                <div className={cx(styles.emptyPicBackground, this.props.showLoader || this.props.showUploading || this.props.disabled ? "" : styles.hover, "position-relative")} 
                                     
                                >
                                    {this.props.showUploading ? 
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
                                    : this.props.showLoader
                                        ? 
                                            <span className={styles.loaderBackground}>
                                                <Loader type='physicalSpinner'/> 
                                                <img className={cx(styles.loaderImg)} src={mountain} alt='' />
                                            </span>
                                        :   <img alt='add' src={addMoreLarge}
                                                className={cx(styles.addMore)}   
                                                onClick={this.props.showLoader || this.props.showUploading ? null : this.openFileDialog} 
                                            />
                                    }  
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
                        </React.Fragment>
                                
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
                    {this.props.required ? 
                        <span className={styles.smallPrimaryText}>{this.props.addressLine.replace(/_/g, " ")} *</span>
                        : <span className={styles.smallSecondaryText}>{this.props.addressLine.replace(/_/g, " ")}</span>
                    }
                </div>
                {this.props.shouldShowAddMore?
                    this.props.actionTaken === 'approved' ?
                        <div className={cx(styles.ticks,styles.approve)}>
                            <span>approved</span>
                            {this.props.showUpdateAction ? 
                                <img onClick={() => this.changTick('', this.props.addressLine)} className={cx('my-auto', styles.greenFilter)} src={close} alt='img'/>  
                            : null}
                        </div>
                    : this.props.actionTaken === 'rejected' ?
                        <div className={cx(styles.ticks,styles.reject)}>
                            <span>rejected</span>
                            {this.props.showUpdateAction ? 
                                <img onClick={() => this.changTick('', this.props.addressLine)} className={cx('my-auto', styles.redFilter)} src={close} alt='img'/> 
                            : null}
                        </div>
                    :
                    <div className={cx(styles.ticks)}>
                        <img 
                             className={cx("float-left",styles.tickImage, styles.greenFilIcon)} alt='greenTick'
                             src={greenTickEmptyCircle}  
                             onClick={() => this.changTick('approved', this.props.addressLine)} />
                        <img 
                             className={cx("float-right",styles.tickImage,styles.redFillIcon)} alt='redTick' 
                             src={redTickEmptyCircle}
                             onClick={() => this.changTick('rejected', this.props.addressLine)} />
                    </div>
                : null }
            </div>
        );
    }
}

export default UploadPicture;
import React, { Component } from 'react';
import _ from 'lodash';
import styles from '../ProfilePicture/ProfilePicture.module.scss';
import profilepic from '../../../assets/icons/profilepic.svg';
import cx from 'classnames';
import upload from '../../../assets/icons/uploadProPic.svg';
import ReactCrop from 'react-image-crop';
import "react-image-crop/dist/ReactCrop.css";
import loader from '../../../assets/icons/profilepicLoader.svg';
import defaultPic from '../../../assets/icons/defaultPic.svg';

class ProfilePicture extends Component {
  

  constructor(props) {
    super(props)
    this.fileInputRef = React.createRef();
    this.openFileDialog = this.openFileDialog.bind(this)
    this.onFilesAdded = this.onFilesAdded.bind(this)
    this.handleImageChange = this.handleImageChange.bind(this);
    this.state = {
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
        aspect: 1
      },
      cropImage: null
    }
  }

  componentWillMount = () => {
    if (!_.isEmpty(this.props)) {
      let imgSrc = this.props.src ? this.props.src : '';
      this.setState({ localImgSrc: imgSrc });
    }
  }


  componentDidUpdate = (prevProps) => {
    if (this.props.src !== prevProps.src) {
      let imgSrc = this.props.src ? this.props.src : '';
      this.setState({ localImgSrc: imgSrc });
    }


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
      this.getCroppedImg(
        this.imageRef,
        crop,
        this.state.file.name
      );
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
    let file = this.state.cropImage
    this.props.file(file);
    const imageRegex = /image/


    if (imageRegex.test(file.type)) {
      reader.addEventListener('load', () => {
        this.setState({
          file: '',
          imagePreviewUrl: reader.result,
          error: null,
          fileCropped: true,
          // removeButton:true
        });
      })
      reader.readAsDataURL(file)
    }

  }

  onCancelImageClick = () => {
    this.onCancelUpload();
    this.setState({
      fileLoaded: false,
    })
  }


  render() {
    const { crop, imagePreviewUrl } = this.state;
    let label = (this.props.src === null || this.props.src === '') ? 'upload profile pic' : 'change profile pic';

    let profilePic =

      (!this.state.file) ?
        <div className="d-flex flex-column">
          <div className="d-flex flex-row" >
            <div onMouseEnter={() => this.setState({ removeButton: true })}
              onMouseLeave={() => this.setState({ removeButton: false })}>
              {this.props.state === 'LOADING' ?
                <span className={styles.loaderBackground}><img className={styles.loader} src={loader} alt='' /></span>
                : ''}
              {this.state.removeButton && !this.props.disabled && !_.isEmpty(this.props.src) ? <div className={styles.removeOption} onClick={this.props.delete}><small className={styles.removeText}>remove</small></div> : ''}
              <img src={this.state.localImgSrc !== '' ? this.state.localImgSrc : profilepic} className={styles.ImgPreview} alt="upload logo" />

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

            <div className="d-flex flex-column pl-3">
              <label className={styles.profileLabel}>{label}</label>
              <img className={styles.MarginLeft} style={this.props.disabled ? { cursor: 'default' } : { cursor: 'pointer' }} alt='upload' src={upload} onClick={this.openFileDialog} />
              <small className={styles.errorMessage}>{this.state.error}</small>
            </div>
          </div>
        </div>



        : (!this.state.fileCropped && this.state.fileLoaded) ?

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
                  />)}
              </div>

              <div className={cx("row pb-3 pr-4 d-flex justify-content-end")} style={{ backgroundColor: "white" }}>


                <button
                  type='button'
                  onClick={this.onCancelImageClick}
                  className={cx(styles.cancelButton)}
                >
                  cancel
            </button>


                <button
                  type='button'
                  onClick={this.onSaveImageClick}
                  className={cx("ml-2", styles.saveButton)}
                >
                  upload
            </button>

              </div>
            </div>
          </div>

          : ''





    return (

      <React.Fragment>
        {this.props.src === null || this.props.src === '' ?
          profilePic
          :

          this.state.fileLoaded ? profilePic :

            <div className="d-flex flex-column">

              <div className="d-flex flex-row">
                <div onMouseEnter={() => this.setState({ removeButton: true })}
                  onMouseLeave={() => this.setState({ removeButton: false })} style={{height:"6rem" , width:"6rem"}}>
                  {this.state.removeButton && !this.props.disabled ? <div className={styles.removeOption} onClick={this.props.delete}><small className={styles.removeText}>remove</small></div> : ''}

                  <img
                    className={cx(styles.ImgPreview)}
                    src={this.props.src? this.props.src : defaultPic}
                    alt="PREVIEW"

                  />

                </div>





                <input disabled={this.props.disabled}
                  ref={this.fileInputRef}
                  className={styles.FileInput}
                  type="file"
                  onChange={this.onFilesAdded}
                />
                <div className="d-flex flex-column pl-3">
                  <label className={styles.profileLabel}>{label}</label>
                  <img className={styles.MarginLeft} style={this.props.disabled ? { cursor: 'default' } : { cursor: 'pointer' }} alt='upload' src={upload} onClick={this.openFileDialog} />
                  <small className={styles.errorMessage}>{this.state.error}</small>
                </div>

              </div>

            </div>

        }



      </React.Fragment>
    )
  }
}



export default ProfilePicture;



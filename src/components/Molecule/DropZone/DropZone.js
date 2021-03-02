import React, { Component } from 'react';
import styles from '../DropZone/DropZone.module.scss';
import cx from 'classnames';
import ReactCrop from 'react-image-crop';
import "react-image-crop/dist/ReactCrop.css";
import upload from '../../../assets/icons/upload.svg';
import pdf from '../../../assets/icons/pdfUpload.svg';
import cancel from '../../../assets/icons/cancelPdf.svg';
import plus from '../../../assets/icons/plusSign.svg';


class Dropzone extends Component {
  state = {
    highlight: false,
    error: null,
    fileCropped: false,
    fileLoaded: false,
    file: '',
    fileType: '',
    fileName: '',
    imagePreviewUrl: '',
    removeButton: false,
    crop: {
      unit: "%",
      height: 50,
      width: 50,
      aspect: 1.586
    },
    cropImage: null
  }

  fileInputRef = React.createRef();

  openFileDialog = () => {
    if (this.props.disabled) return;
    this.fileInputRef.current.click();
  }

  onFilesAdded = (event) => {
    if (this.props.disabled) return;
    let file = event.target.files;
    this.handleImageChange(event);
    if (this.props.onFilesAdded) {
      let formData = new FormData();
      formData.append('file', file[0]);
    }
  }

  handleImage = (file) => {
    let reader = new FileReader();
    const imageRegex = /image/
    const pdfRegex = /application/
    if (imageRegex.test(file.type) && file.size < 512000) {
      reader.onloadend = () => {
        this.setState({
          file: '',
          imagePreviewUrl: reader.result,
          error: null,
          fileLoaded: true
        });
        this.props.fileUpload(file);
      }
      reader.readAsDataURL(file)
      let localFileType = file.name.split('.');
      localFileType = localFileType[localFileType.length - 1]
      let localFileName = file.name.split('/');
      localFileName = localFileName[localFileName.length - 1]
      this.setState({
        fileType: localFileType,
        fileName: localFileName 
      })
    }
    else if (pdfRegex.test(file.type) && file.size < 512000) {
      reader.onloadend = () => {
        this.setState({
          file: '',
          imagePreviewUrl: reader.result,
          error: null,
          fileLoaded: false
        });
        this.props.fileUpload(file);
      }
      reader.readAsDataURL(file)
      let localFileType = file.name.split('.');
      localFileType = localFileType[localFileType.length - 1]
      let localFileName = file.name.split('/');
      localFileName = localFileName[localFileName.length - 1]
      this.setState({
        fileType: localFileType,
        fileName: localFileName 
      })
    }
    else {
      this.setState({
        error: 'File Size Exceeded.'
      })
    }
  }

  handleImageChange = (event) => {
    let reader = new FileReader();
    let file = event.target.files;
    const imageRegex = /image/
    const pdfRegex = /application/
    if (imageRegex.test(file[0].type)) {
      reader.onloadend = () => {
        this.setState({
          file: '',
          imagePreviewUrl: reader.result,
          error: null,
          fileLoaded: true
        });
        this.props.fileUpload(file[0]);
      }
      reader.readAsDataURL(file[0])
      let localFileType = file[0].name.split('.');
      localFileType = localFileType[localFileType.length - 1]
      let localFileName = file[0].name.split('/');
      localFileName = localFileName[localFileName.length - 1]
      this.setState({
        fileType: localFileType,
        fileName: localFileName 
      })
    }
    else if (pdfRegex.test(file[0].type) && file[0].size < 512000) {
      reader.onloadend = () => {
        this.setState({
          file: '',
          imagePreviewUrl: reader.result,
          error: null,
          fileLoaded: false
        });
        this.props.fileUpload(file[0]);
      }
      reader.readAsDataURL(file[0])
      let localFileType = file[0].name.split('.');
      localFileType = localFileType[localFileType.length - 1]
      let localFileName = file[0].name.split('/');
      localFileName = localFileName[localFileName.length - 1]
      this.setState({
        fileType: localFileType,
        fileName: localFileName 
      })

    }
    else {
      this.setState({
        error: 'File Size Exceeded.'
      })
    }
  }

  

 

  onDragOver = (event) => {
    event.preventDefault();
    if (this.props.disabled) return;
    this.setState({ hightlight: true });
  }

  onDragLeave = () => {
    this.setState({ hightlight: false });
  }


  pdfOpen=()=>{
    window.open(process.env.REACT_APP_CUSTOMER_MGMT_API_URL + '/' +this.props.url);
  }

  onDrop = (event) => {
    event.preventDefault();

    if (this.props.disabled) return;

    const file = event.dataTransfer.files;

    this.handleImage(file[0]);
    if (this.props.onFilesAdded) {
      let formData = new FormData();
      formData.append('file', file[0]);
    }
    this.setState({ hightlight: false });
  }


  

  

  render() {
    const { crop, imagePreviewUrl } = this.state;
    let fileType = this.props.url === null || this.props.url === '' || this.props.url === undefined ? '' :
      this.props.url.split('.');
    fileType = fileType[fileType.length - 1];

    let fileName = this.props.url === null || this.props.url === '' || this.props.url === undefined ? '' :
      this.props.url.split('/');
    fileName = fileName[fileName.length - 1]

    let documentPic =
     (!this.state.file) ?
    
        <div className={cx(styles.Dropzone)}
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
            onChange={this.onFilesAdded}
            multiple
          />
        <label className={cx(this.props.Background)}>
            <img src={plus} height='12px' alt='plus' />&ensp;attachment 
        </label>          
      </div>
        : ""

    return (
      <React.Fragment>
         

        <label className={styles.LabelWithValue}>{this.props.label}</label>
        {this.props.url === null || this.props.url === '' || this.props.url === undefined ?
          documentPic
          :
        
         

          (fileType === 'PDF' || fileType === 'pdf') ?
            <div className="row" style={{ cursor: 'pointer', width: '100%', paddingLeft: '6%' }}>

              <img className={styles.pdfIcon} src={pdf} onClick={this.pdfOpen} alt='' />
              <small className={styles.pdfFileName} onClick={this.pdfOpen}>{fileName}</small>

              <img src={cancel} className={cx(styles.deleteIcon, "ml-2")} onClick={this.props.clicked} alt='' />


            </div>

            :
            <div>
              <div onMouseEnter={() => this.setState({ removeButton: true })}
                onMouseLeave={() => this.setState({ removeButton: false })}>
                 {this.state.removeButton && !this.props.disabled  ? <div className={cx(styles.removeOption)} onClick={this.props.clicked}><small className={styles.removeText}>remove</small></div> : ''}
                <img className={this.props.className} src={process.env.REACT_APP_CUSTOMER_MGMT_API_URL +'/' + this.props.url} alt="PREVIEW" />
              </div>


            </div>
        }
      </React.Fragment>


    )
  }
}



export default Dropzone;


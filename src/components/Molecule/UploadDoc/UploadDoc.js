import React, { Component } from 'react';
import styles from '../UploadDoc/UploadDoc.module.scss';
import cx from 'classnames';
import _ from 'lodash';
import "react-image-crop/dist/ReactCrop.css";

class uploadDoc extends Component {
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

  //method is called when file dialog is closed and files are selected
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


    const imageRegex = /image/
    const pdfRegex = /application/
    const fileSize = this.props.vendorDetails ? 10240000 : 5120000;
    let error = null
    
    if (this.props.single && file.length > 1) {
      error = "* choose only one file"
      this.setState({ error: error })
    }
    else {
    for (let i = 0; i < file.length; i++) {
      let reader = new FileReader();
      if (imageRegex.test(file[i].type) && file[i].size < fileSize) {
         error = null;
         reader.addEventListener('loadend', this.readAsDataURL(reader,file[i]));
      }
      else if (pdfRegex.test(file[i].type) && file[i].size < fileSize) {
         error = null;
         reader.addEventListener('loadend', this.readAsDataURL(reader,file[i]));
      }
      else {
        error = this.props.vendorDetails ? '*file size exceeds 10 MB' : '* file size exceed 5 MB';
      }
        this.setState({
          error: error,
          file: file[i]
        })

      }
    }
    if (error === null) { this.props.fileUpload(file) }

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

    return (
      <React.Fragment>
        <div
          style={{ cursor: this.props.disabled ? 'default' : 'pointer' }}
          onClick={this.openFileDialog}
          onDragOver={this.onDragOver}
          onDragLeave={this.onDragLeave}
          onDrop={(e) => this.onDrop(e)}
        >
          {this.props.single ?
            <input disabled={this.props.disabled}
              ref={this.fileInputRef}
              className={styles.FileInput}
              type="file"
              id={this.state.id}
              onChange={this.onFilesAdded}
              accept="image/x-png, image/gif, image/jpeg, application/pdf"
            />
            :
            <input disabled={this.props.disabled}
              ref={this.fileInputRef}
              className={styles.FileInput}
              type="file"
              id={this.state.id}
              onChange={this.onFilesAdded}
              multiple
              accept="image/x-png, image/gif, image/jpeg, application/pdf"
            />}
          {this.props.addState === 'LOADING' ?
            <div className={cx("", styles.Loader)}>
              {/* <p className={styles.FileName}>{this.state.file.name}</p> */}
              <div className={cx(styles.loading)}></div>
              <p className={styles.TextLoader}> uploading... </p>
            </div>
            :
            <label className={cx(this.props.className, "")}>
              <img className={cx(this.props.imgClassName)} src={this.props.upload} alt="upload document" />
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

export default uploadDoc;

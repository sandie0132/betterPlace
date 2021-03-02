import React, { Component } from 'react';
import cx from 'classnames';
import { Button } from 'react-crux';
import styles from './PasteUpload.module.scss';
import Modal from '../../Atom/Modal/Modal';
import close from '../../../assets/icons/closePage.svg';
// import plus from '../../../assets/icons/midium.svg';
import inactivePlus from '../../../assets/icons/inactivePlus.svg';

class PasteUpload extends Component {
    state = {
        showModal: false,
        image: null,
        file: ''
    }
    componentDidMount() {

        const thisRef = this;
        window.addEventListener("paste", function (e) {

            // Handle the event
            retrieveImageFromClipboardAsBlob(e, function (imageBlob) {
                // If there's an image, display it in the canvas
                if (imageBlob && thisRef.refs.canvas) {
                    const canvas = thisRef.refs.canvas
                    const ctx = canvas.getContext("2d");

                    // Create an image to render the blob on the canvas
                    let img = new Image();

                    // Once the image loads, render the img on the canvas
                    img.onload = function () {
                        // Update dimensions of the canvas with the dimensions of the image
                        canvas.width = "650";
                        canvas.height = "320";

                        // Draw the image
                        ctx.drawImage(img, 0, 0, img.width, img.height,
                            0, 0, canvas.width, canvas.height);
                    };

                    // Crossbrowser support for URL
                    let URLObj = window.URL || window.webkitURL;

                    // Creates a DOMString containing a URL representing the object given in the parameter
                    // namely the original Blob
                    img.src = URLObj.createObjectURL(imageBlob);

                    //Save Image in state
                    thisRef.setState({
                        image: imageBlob
                    });
                }
            });
        }, false);
        function retrieveImageFromClipboardAsBlob(pasteEvent, callback) {
            if (pasteEvent.clipboardData === false) {
                if (typeof (callback) == "function") {
                    callback(undefined);
                }
            };

            let items = pasteEvent.clipboardData.items;

            if (items === undefined) {
                if (typeof (callback) == "function") {
                    callback(undefined);
                }
            };

            for (let i = 0; i < items.length; i++) {
                // Skip content if not image
                if (items[i].type.indexOf("image") === -1) continue;
                // Retrieve image on clipboard as blob
                let blob = items[i].getAsFile();

                if (typeof (callback) === "function") {
                    callback(blob);
                }
            }
        }


    }

    toggleForm = () => {
        if (this.props.seconds !== 0) {
            if (this.state.showModal) {
                let canvasElement = document.getElementById("canvas");
                let ctx = canvasElement.getContext("2d");
                ctx.clearRect(0, 0, 650, 320);

                this.setState({
                    showModal: false,
                    image: null
                });
            }
            else {
                this.setState({
                    showModal: true,
                });
            }
        }
    }

    handleUploadFile = () => {
        this.props.uploadFile(this.state.image, 'paste');

        let canvasElement = document.getElementById("canvas");
        let ctx = canvasElement.getContext("2d");
        ctx.clearRect(0, 0, 650, 320);

        this.setState({
            image: null,
            showModal: false
        })
    }

    fileInputRef = React.createRef();

    openFileDialog = () => {
        if (this.props.disabled) return;
        this.fileInputRef.current.click();
    }

    onFilesAdded = (event) => {
        event.preventDefault();
        if (this.props.disabled) return;
        let file = event.target.files;
        this.handleImageChange(file);
        // document.getElementById(this.state.id).value = '';
    }

    readAsDataURL = (fileReader, file) => {
        fileReader.readAsDataURL(file);
    }

    handleImageChange = (file) => {


        const imageRegex = /image/
        const pdfRegex = /application/
        const fileSize = 5120000;
        let error = null


        for (let i = 0; i < file.length; i++) {
            let reader = new FileReader();
            if (imageRegex.test(file[i].type) && file[i].size < fileSize) {
                error = null;
                reader.addEventListener('loadend', this.readAsDataURL(reader, file[i]));
            }
            else if (pdfRegex.test(file[i].type) && file[i].size < fileSize) {
                error = null;
                reader.addEventListener('loadend', this.readAsDataURL(reader, file[i]));

            }
            else {
                error = '* file size exceed 5 MB';
            }
            this.setState({
                error: error,
                file: file[i]
            })

        }
        if (error === null) { this.props.uploadFile(file, 'select') }
        this.toggleForm();
    }

    render() {
        // console.log(this.state.file)
        return (
            <React.Fragment>

                <Modal show={this.props.seconds !== 0 && this.props.showModal && this.state.showModal} className={styles.ModalPage} >

                    <img onClick={this.toggleForm} className={cx(styles.ImgPadding)} src={close} alt='close' />
                    <div className={cx(styles.container, "col-6")}>

                        <canvas id={"canvas"} ref="canvas" height="148" className={styles.canv}></canvas>
                        <p className={styles.txt}>paste the screenshot copied in clipboard or choose file from system </p>
                        <div className={cx(styles.AlignMiddle, 'd-flex flex-column')}>
                            <Button clickHandler={this.handleUploadFile} type={"save"}
                                label="attach" isDisabled={this.state.image === null}
                            />
                           {this.state.image === null ?
                            <span onClick={this.openFileDialog} style={{ color: '#0059B2', cursor: 'pointer', marginTop: '1rem' }}>
                                <input disabled={this.props.disabled}
                                ref={this.fileInputRef}
                                className={styles.FileInput}
                                type="file"
                                onChange={this.onFilesAdded}
                                hidden
                                accept="image/x-png, image/gif, image/jpeg, application/pdf"
                            />
                                <span className={styles.UploadFileActive}>
                                    choose file from system
                                </span> 
                            </span>
                            :
                            <span className={styles.UploadFileDisabled}>
                                choose file from system
                            </span>
                            }
                        </div>
                    </div>
                </Modal>
                <button onClick={this.toggleForm} disabled={this.props.disabled} className={this.props.seconds !== 0 ? styles.attachBtn : styles.attachBtnInactive}>
                    {!this.props.disabled ? <span><img src={inactivePlus} alt="img" className={styles.plusFilter} /> &nbsp;attachment</span> : <span>uploading...</span>}
                </button>
            </React.Fragment>
        )
    }
}
export default PasteUpload;
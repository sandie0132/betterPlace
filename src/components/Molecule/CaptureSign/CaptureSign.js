import React, { Component } from 'react';
import styles from './CaptureSign.module.scss';
import Modal from '../../Atom/Modal/Modal';
import { Button } from 'react-crux';
import closePage from '../../../assets/icons/closePage.svg';
import cx from 'classnames';
// import _ from 'lodash';
import Signature from "react-signature-canvas";
import ReactCrop from 'react-image-crop';
import "react-image-crop/dist/ReactCrop.css";

import eraser from '../../../assets/icons/eraser.svg';
import smallSignRed from '../../../assets/icons/smallSignRed.svg';
import sideSignRed from '../../../assets/icons/sideSignRed.svg';
import correctSignGreen from '../../../assets/icons/correctSignGreen.svg';
import penBlue from '../../../assets/icons/penToolBlue.svg';
import penGrey from '../../../assets/icons/penToolGrey.svg';
import uploadGrey from '../../../assets/icons/uploadGrey.svg';
import uploadBlue from '../../../assets/icons/uploadBlue.svg';

// import uploadWhite from '../../../assets/icons/uploadWhite.svg';


class CaptureSign extends Component {

    constructor(props) {
        super(props);
        this.signCanvas = React.createRef();
        this.fileUpload = React.createRef();
        this.state = {
            signMethod: "DRAW",

            fileCropped: false,
            file: '',
            imagePreviewUrl: null,
            error: '',
            fileLoaded: false,
            crop: {
                unit: "%",
                height: 40,
                width: 80,
                aspect: 2
            },
            cropImage: null
        };

        this.openFileDialog = this.openFileDialog.bind(this)
        this.onFilesAdded = this.onFilesAdded.bind(this)
        this.handleImageChange = this.handleImageChange.bind(this);
    }


    stateReset = () => {
        this.setState({
            signMethod: "DRAW",

            fileCropped: false,
            file: '',
            imagePreviewUrl: null,
            error: '',
            fileLoaded: false,
            crop: {
                unit: "%",
                height: 40,
                width: 80,
                aspect: 2
            },
            cropImage: null
        })
    }
    openFileDialog(event) {
        event.preventDefault();
        this.fileUpload.current.click()
    }

    onFilesAdded(evt) {
        let files = evt.target.files;
        this.handleImageChange(evt);
        let formData = new FormData();
        formData.append('file', files[0]);
        this.setState({
            fileCropped: false,
        })
        if (document.getElementById("fileInput") !== null) {
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

    onSaveImageClick = (event) => {
        event.preventDefault();
        let file = this.state.cropImage;
        this.resizeImage(file);
    }

    resizeImage = (file) => {
        let oldFileName = file.name;

        let thisRef = this
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            var image = new Image();
            image.src = reader.result;
            image.onload = function () {
                var qualityDecimal = 1.0
                var canvas = document.createElement("canvas");

                var width = 120;
                var height = 60;
                var ctx = canvas.getContext("2d");
                canvas.width = width
                canvas.height = height
                ctx.drawImage(image, 0, 0, width, height);

                let resizeUrl = canvas.toDataURL(`image/png`, qualityDecimal);
                fetch(resizeUrl)
                    .then(res => res.blob())
                    .then(blob => {
                        let fileName = "cropped_"+oldFileName;
                        const fd = new FormData();
                        fd.set('a', blob, fileName);
                        const croppedImageFile = fd.get('a');
                        thisRef.saveSignature(file, croppedImageFile);
                    })
            };
        };

        // let image = new Image()
        // image.src = reader.result;

        // image.onload = function(){
        //     ctx.drawImage(image, 0, 0, width, height);
        // };

        // let resizeUrl= canvas.toDataURL(`image/png`, qualityDecimal);
        // fetch(resizeUrl)
        //     .then(res => res.blob())
        //     .then(blob => {
        //         let fileName = "signature.png"
        //         const fd = new FormData();
        //         fd.set('a', blob, fileName);
        //         const finalImageFile = fd.get('a');
        //         this.saveSignature(finalImageFile);
        //         console.log(finalImageFile);
        //     })

    }

    saveSignature = (originalFile, croppedFile) => {
        this.stateReset();
        this.props.onSavefile(originalFile, croppedFile);
        this.props.close();
    }


    clear = () => {
        this.signCanvas.current.clear();
    }

    save = (event) => {
        event.preventDefault();
        let drawSignSrc = this.signCanvas.current.getCanvas().toDataURL("image/png", 1.0);
        fetch(drawSignSrc)
            .then(res => res.blob())
            .then(blob => {
                //  console.log(blob);
                let fileName = "signature" + Math.floor(Math.random() * 1000) + ".png"
                const fd = new FormData();
                fd.set('a', blob, fileName);
                const finalImageFile = fd.get('a');
                this.resizeImage(finalImageFile);
                //  console.log(finalImageFile);
            })
    }

    switchSignMethod = (value) => {
        this.setState({
            signMethod: value
        })
    }

    closeAndReset = () => {
        this.props.close();
        this.stateReset();
    }



    render() {
        const { crop, imagePreviewUrl } = this.state;

        return (
            <div >
                <Modal show={this.props.show} className={styles.alignModal}>

                    <img onClick={this.closeAndReset} src={closePage} alt={"close"} className={styles.closeImg}></img>
                    <div className={styles.heading}>digital signature</div>
                    <div className={styles.modalContent}>
                        <div style={{ backgroundColor: "white" }}>
                            <div className={styles.signatureOption}>
                                <div className={this.state.signMethod === "DRAW" ? styles.signatureActive : styles.signatureInactive} onClick={() => this.switchSignMethod("DRAW")}>
                                    {this.state.signMethod === "DRAW" ? <img src={penBlue} className={styles.optionIcon} alt="draw icon" /> : <img src={penGrey} alt="draw icon" className={styles.optionIcon} />}
                                    draw signature
                                </div>
                                <div className={this.state.signMethod === "UPLOAD" ? styles.signatureActive : styles.signatureInactive} onClick={() => this.switchSignMethod("UPLOAD")}>
                                    {this.state.signMethod === "UPLOAD" ? <img src={uploadBlue} className={styles.optionIcon} alt='upload icon' /> : <img src={uploadGrey} alt='upload icon' className={styles.optionIcon} />}
                                    upload signature
                                </div>

                            </div>

                            {
                                this.state.signMethod === "DRAW" ?
                                    <React.Fragment>
                                        <div className={cx(styles.signatureCanvasstyle)}>
                                            <Signature
                                                ref={this.signCanvas}
                                                canvasProps={{ width: 358, height: 171 }}
                                            />

                                            <div onClick={() => this.clear()} className={styles.alignClear}>
                                                <img src={eraser} alt="eraser" className="mb-auto mr-2" /><span className={styles.text}>clear</span>
                                            </div>

                                        </div>


                                    </React.Fragment>
                                    : this.state.signMethod === "UPLOAD" && !this.state.fileLoaded ?
                                        <div className="d-flex flex-column">
                                            <label className={cx(styles.uploadHeading)}>please make sure that you crop image in 2:1 ratio as shown in following sample</label>
                                            <div className="row no-gutters" style={{ paddingTop: "2rem" }}>
                                                <div className="col-6 d-flex flex-column" style={{ paddingLeft: "0.5rem" }}>
                                                    <img src={smallSignRed} alt="small sign" />
                                                    <label className={cx(styles.smallText)} style={{ paddingTop: "1rem" }}>signature should not be too small for the box to crop</label>
                                                </div>

                                                <div className="col-6 d-flex flex-column" style={{ paddingRight: "0.5rem" }}>
                                                    <img src={sideSignRed} alt="side sign" />
                                                    <label className={cx(styles.smallText)} style={{ paddingTop: "1rem" }}>signature should not be on left/right side of box</label>
                                                </div>

                                            </div>

                                            <div className="d-flex flex-row justify-content-center no-gutters" style={{ paddingTop: "2rem" }}>
                                                <div className="col-6 d-flex flex-column">
                                                    <img src={correctSignGreen} alt="side sign" />
                                                    <label className={cx(styles.smallText)} style={{ paddingTop: "1rem" }}>signature should be in center of croping box with minimum margins</label>
                                                </div>
                                            </div>
                                        </div> :

                                        <div>
                                            <ReactCrop
                                                src={imagePreviewUrl}
                                                crop={crop}
                                                className={styles.cropStyleBasic}
                                                onImageLoaded={this.onImageLoaded}
                                                onComplete={this.onCropComplete}
                                                onChange={this.onCropChange}
                                            />

                                        </div>
                            }
                            <br />

                            <div>
                                <input disabled={this.props.disabled}
                                    ref={this.fileUpload}
                                    className={styles.FileInput}
                                    type="file"
                                    id='fileInput'
                                    onChange={this.onFilesAdded}
                                    accept="image/x-png, image/gif, image/jpeg"
                                />
                            </div>


                        </div>
                        {this.state.signMethod === "DRAW" ?
                            <Button clickHandler={(event) => this.save(event)} label="add signature" type="save" className="mt-4" />
                            :
                            this.state.signMethod === "UPLOAD" && !this.state.fileLoaded ?
                                <Button clickHandler={(event) => this.openFileDialog(event)} label="upload signature" type="upload" className="mt-4" />
                                :
                                <div className="d-flex flex-column mt-2">
                                    <label className={cx(styles.blueText)} onClick={(event) => this.openFileDialog(event)}>upload again</label>
                                    <Button clickHandler={(event) => this.onSaveImageClick(event)} label="add signature" type="save" className="mt-4" />
                                </div>
                        }


                    </div>

                    {/* {imageURL ? (
                        <img
                            src={imageURL}
                            alt="my signature"
                            style={{
                                display: "block",
                                margin: "0 auto",
                                border: "1px solid black",
                                width: "150px"
                            }}
                        />
                    ) : null} */}



                </Modal>


            </div>


        )
    }

}

export default CaptureSign;

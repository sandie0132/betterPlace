import React from 'react';
import styles from './FileView.module.scss';
import pdf from '../../../assets/icons/pdfUpload.svg';
import jpg from '../../../assets/icons/jpg.svg';
import cx from 'classnames';
import close from '../../../assets/icons/close.svg';
import _ from 'lodash';

const fileView = (props) => {

    let fileType = props.url === null || props.url === '' || props.url === undefined ? '' :
        props.url.split('.');
    fileType = fileType[fileType.length - 1];

    let fileName = props.url === null || props.url === '' || props.url === undefined ? '' :
        props.url.split('/');
    fileName = fileName[fileName.length - 1]

    let fileState = !_.isEmpty(props.url) ?
        <div 
            className={props.downloadFileState === 'LOADING' ? cx(props.className, styles.ThumbnailLoading) : cx(props.className, styles.Thumbnail)}
            onClick={props.fileClicked}>

            {!props.disabled ?
                <img className={styles.Close} src={close} onClick={props.clicked} alt='' />
                : null}

            {(fileType === 'PDF' || fileType === 'pdf') ?
                <img className={styles.pdfIcon} src={pdf} alt='' /> :
                <img className={styles.jpgIcon} src={jpg} alt='' />}

            <p className={styles.pdfFileName}>{fileName}</p>
        </div>
        : null

    return (
        fileState
    )
}

export default fileView;
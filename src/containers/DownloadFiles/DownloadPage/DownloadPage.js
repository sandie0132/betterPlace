import React, { Component } from "react";
import cx from 'classnames';
import styles from './DownloadPage.module.scss';
import { connect } from 'react-redux';

import { Button } from 'react-crux';

import verify from '../../../assets/icons/verifyWhiteIcon.svg';
import bpLogo from '../../../assets/icons/betterplaceLogo.svg';
import downloadScreen from '../../../assets/icons/downloadScreen.svg';
import pdfBlue from '../../../assets/icons/pdfBlue.svg';

class DownloadPage extends Component {

    render() {

        let userName = '';
        if (this.props.authUser && this.props.authUser.firstName) {
            userName = this.props.authUser.firstName + (this.props.authUser.lastName ? " " + this.props.authUser.lastName : "");
        }

        return (
            <React.Fragment>
                <div className={cx('row', styles.Background)}>
                    <div className='col-4' style={{ marginLeft: "3.9%", marginTop: "2.6%" }}>
                        <div className={cx('d-flex flex-column')}>
                            <span>
                                <img src={this.props.product === "verify" ? verify : verify} alt='' />
                            </span>
                            <span className={styles.Product}>
                                {this.props.product}
                            </span>
                            <span className={cx('d-flex flex-row', styles.Logo)}>
                                by&emsp;<img src={bpLogo} style={{ height: "18px" }} alt='' />
                            </span>
                        </div>

                        <div className={cx('d-flex flex-column', styles.DownloadCard)}>
                            {this.props.downloadState === 'LOADING' ?
                                <div className={styles.CircularProgressBar}>
                                    <svg className={styles.CircleLoading} viewBox="25 25 50 50" >
                                        <circle className={styles.loaderPath}
                                            cx="50" cy="50" r="45.5%"
                                            fill="#F4F7FB" stroke="#0059B2" stroke-width="1.15" />
                                    </svg>
                                    <img src={pdfBlue} className={styles.PdfIcon} alt='' />
                                </div>
                                : this.props.downloadState === 'SUCCESS' ?
                                    <div className={styles.CircularProgressBar}>
                                        <svg className={styles.Circle} viewBox="25 25 50 50" >
                                            <circle
                                                cx="50" cy="50" r="45.5%"
                                                fill="#F4F7FB" stroke="#0059B2" stroke-width="1.15" />
                                        </svg>
                                        <img src={pdfBlue} className={styles.PdfIcon} alt='' />
                                    </div>
                                    : this.props.downloadState === 'ERROR' ?
                                        <div className={styles.CircularProgressBar}>
                                            <svg className={styles.Circle} viewBox="25 25 50 50" >
                                                <circle
                                                    cx="50" cy="50" r="45.5%"
                                                    fill="#FDEBEC" stroke="#EE3942" stroke-width="1.15" />
                                            </svg>
                                            <img src={pdfBlue} className={styles.PdfIcon} alt='' />
                                        </div>
                                        :
                                        <div className={styles.CircularProgressBar}>
                                            <svg className={styles.Circle} viewBox="25 25 50 50" >
                                                <circle
                                                    cx="50" cy="50" r="45.5%"
                                                    fill="#F4F7FB" stroke="#F4F7FB" stroke-width="1.15" />
                                            </svg>
                                            <img src={pdfBlue} className={styles.PdfIcon} alt='' />
                                        </div>
                            }

                            <label className={styles.Greeting}>
                                hello, {userName}
                            </label>

                            <span className={styles.GreyText}>
                                {this.props.label}
                            </span>

                            <hr className={styles.HorizontalLine} />

                            <span className='align-self-center mt-2'>
                                <Button
                                    type='download'
                                    label={'download ' + this.props.fileType}
                                    isDisabled={this.props.downloadState === 'LOADING'}
                                    clickHandler={this.props.downloadState === 'LOADING' ? null : this.props.handleDownload}
                                    downloadState={this.props.downloadState}
                                />
                            </span>
                        </div>
                    </div>

                    <div className='col-5 px-0' style={{ marginTop: "15%" }}>
                        <img src={downloadScreen} alt='' />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.auth.user,
        downloadState: state.downloadFiles.downloadFileState
    }
}

export default connect(mapStateToProps, null)(DownloadPage);
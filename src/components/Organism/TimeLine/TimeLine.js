import React, { Component } from 'react';
import styles from './TimeLine.module.scss';
import cx from 'classnames';
import _ from 'lodash';
import scrollStyle from '../../Atom/ScrollBar/ScrollBar.module.scss';
import samplepic from '../../../assets/icons/opsProfile.svg';
import { withRouter } from 'react-router';
// import floatHelpIcon from '../../../../assets/icons/floatingHelpIcon.svg';

class TimeLine extends Component {

    state = {
        data: "",
        currentIndex: null,
        showTooltip: false
    }

    componentDidMount = () => {
        if (!_.isEmpty(this.props.data)) {
            this.setState({ data: this.props.data })
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.data !== prevProps.data && !_.isEmpty(this.props.data)) {
            this.setState({ data: this.props.data })
        }
    }

    statusColorHandler = (status) => {
        if (status === 'success') {
            return (<div className={styles.GreenBorder}></div>)
        }
        else if (status === 'inProgress') {
            return (<div className={styles.GreyBorder}></div>)
        }
        else if (status === 'error') {
            return (<div className={styles.RedBorder}></div>)
        }
        else {
            return (<div className={styles.YellowBorder}></div>)
        }
    }

    fileUploadStatusHandler = (status) => {
        if (status === 'success' || status === 'cancelled') {
            return ("upload successful")
        }
        else if (status === 'inProgress') {
            return ("upload in progress")
        }
        else if (status === 'error') {
            return ("upload failed")
        }
        // else if(status === 'cancelled') {
        //     return ("cancelled")
        // }
        else {
            return ("re-uploaded")
        }
    }

    handleMouseEnter = (index, value) => {
        this.props.getEmpData(value);
        this.setState({ showTooltip: true, currentIndex: index })
    }

    handleDownload = (index, value) => {
        this.props.clickHandler(value);
    }

    shortenDisplayName = (displayName) => {
        if (displayName.length > 30) {
            const updatedDisplayName = displayName.substring(0, 30) + '...';
            return (updatedDisplayName);
        }
        return (displayName);
    }

    render() {
        return (
            <React.Fragment>
                {/* <hr className={cx('row mr-2 mt-4 pb-0 mb-0', styles.hr1)} /> */}
                <div className={cx(this.props.height, styles.scroll, scrollStyle.scrollbar)}>
                    <div className={cx("d-flex flex-row", styles.timelineHeight)}>
                        <div className={cx("col-6 no-gutters px-0", styles.RightBorder)}>
                            <div className={cx("d-flex flex-column justify-content-end", styles.fullHeight)}>
                                {!_.isEmpty(this.state.data) ?
                                    /////////array length of one handled  ////////////
                                    this.state.data.length === 1 ?
                                        this.state.data.map((value, index) => {
                                            return (
                                                <div key={index} className={cx("d-flex flex-row justify-content-end", styles.rowHeight, styles.leftPaddingTop)}>
                                                    <div className={cx("d-flex flex-column")}>
                                                        <label className={this.props.downloadTimelineFileState === 'LOADING' ? cx(styles.timeLineTextLeft, styles.timelineDownloadLoading) : cx(styles.timeLineTextLeft, styles.timelineDownload)}
                                                            onClick={this.props.downloadTimelineFileState === 'LOADING' ? null : () => this.handleDownload(index, value)}>{this.shortenDisplayName(value.fileName)}</label>
                                                        <label className={styles.timeLineTextLeft}>{this.fileUploadStatusHandler(value.status)}</label>
                                                    </div>

                                                    <div className="mr-3">
                                                        <div className={styles.GreenBorder}></div>
                                                    </div>


                                                    <div className={cx("d-flex flex-column")} style={{ marginRight: "-0.25rem", position: "absolute", marginLeft: "0.25rem" }}>

                                                        <div style={{ marginTop: "0.7rem" }}>
                                                            <div className={styles.blueDot}
                                                                onMouseEnter={() => this.handleMouseEnter(index, value)}
                                                                onMouseLeave={() => this.setState({ showTooltip: false, currentIndex: null })}
                                                            ></div>
                                                        </div>

                                                    </div>

                                                </div>)
                                        })

                                        : this.state.data.map((value, index) => {
                                            if (index === 0) {
                                                ///////////handle the first item design
                                                return (
                                                    <div key={index} className={cx("d-flex flex-row justify-content-end", styles.rowHeight, styles.leftPaddingTop)}>
                                                        <div className={cx("d-flex flex-column")}>
                                                            <label className={this.props.downloadTimelineFileState === 'LOADING' ? cx(styles.timeLineTextLeft, styles.timelineDownloadLoading) : cx(styles.timeLineTextLeft, styles.timelineDownload)}
                                                                onClick={this.props.downloadTimelineFileState === 'LOADING' ? null : () => this.handleDownload(index, value)}>{this.shortenDisplayName(value.fileName)}</label>
                                                            <label className={styles.timeLineTextLeft}>{this.fileUploadStatusHandler(value.status)}</label>
                                                        </div>

                                                        <div className="mr-3">
                                                            {this.statusColorHandler(value.status)}
                                                        </div>

                                                        <div className={cx("d-flex flex-column")} style={{ marginRight: "-0.25rem", position: "absolute", marginLeft: "0.25rem" }}>

                                                            <div style={{ marginTop: "0.7rem" }}>
                                                                <div className={styles.blueDot}
                                                                    onMouseEnter={() => this.handleMouseEnter(index, value)}
                                                                    onMouseLeave={() => this.setState({ showTooltip: false, currentIndex: null })}>
                                                                </div>
                                                            </div>
                                                            <div >
                                                                <div className={styles.blueLineVertical}></div>
                                                            </div>

                                                        </div>

                                                    </div>


                                                )
                                            }

                                            else if (index === this.state.data.length - 1) {
                                                ///////handle last item design 
                                                return (
                                                    <div key={index} className={cx("d-flex flex-row justify-content-end", styles.rowHeight, styles.leftPaddingTop)}>
                                                        <div className="d-flex flex-column" >
                                                            <label className={this.props.downloadTimelineFileState === 'LOADING' ? cx(styles.timeLineTextLeft, styles.timelineDownloadLoading) : cx(styles.timeLineTextLeft, styles.timelineDownload)}
                                                                onClick={this.props.downloadTimelineFileState === 'LOADING' ? null : () => this.handleDownload(index, value)}>{this.shortenDisplayName(value.fileName)}</label>
                                                            <label className={styles.timeLineTextLeft}>{this.fileUploadStatusHandler(value.status)}</label>
                                                        </div>

                                                        <div className="mr-3">
                                                            {this.statusColorHandler(value.status)}
                                                        </div>


                                                        <div className={cx("d-flex flex-column")} style={{ marginRight: "-0.25rem", position: "absolute", marginLeft: "0.25rem", marginTop: "0.7rem" }}>


                                                            <div>
                                                                <div className={styles.blueLineVertical} style={{ bottom: "0" }}></div>
                                                            </div>
                                                            <div>
                                                                <div className={styles.blueDot}
                                                                    onMouseEnter={() => this.handleMouseEnter(index, value)}
                                                                    onMouseLeave={() => this.setState({ showTooltip: false, currentIndex: null })}>
                                                                </div>
                                                            </div>


                                                        </div>

                                                    </div>

                                                )
                                            }
                                            else {
                                                ///////////handle items in between //////////////
                                                return (
                                                    <div key={index} className={cx("d-flex flex-row justify-content-end", styles.rowHeight, styles.leftPaddingTop)}>
                                                        <div className="d-flex flex-column" >
                                                            <label className={this.props.downloadTimelineFileState === 'LOADING' ? cx(styles.timeLineTextLeft, styles.timelineDownloadLoading) : cx(styles.timeLineTextLeft, styles.timelineDownload)}
                                                                onClick={this.props.downloadTimelineFileState === 'LOADING' ? null : () => this.handleDownload(index, value)}>{this.shortenDisplayName(value.fileName)}</label>
                                                            <label className={styles.timeLineTextLeft}>{this.fileUploadStatusHandler(value.status)}</label>
                                                        </div>

                                                        <div className="mr-3">
                                                            {this.statusColorHandler(value.status)}
                                                        </div>

                                                        <div className={cx("d-flex flex-column")} style={{ marginRight: "-0.25rem", position: "absolute", marginLeft: "0.25rem" }}>

                                                            <div style={{ marginTop: "0.7rem" }}>
                                                                <div className={styles.blueDot}
                                                                    onMouseEnter={() => this.handleMouseEnter(index, value)}
                                                                    onMouseLeave={() => this.setState({ showTooltip: false, currentIndex: null })}></div>
                                                            </div>
                                                            <div style={{ position: "absolute" }}>
                                                                <div className={styles.blueLineVertical}></div>
                                                            </div>

                                                        </div>

                                                    </div>

                                                )
                                            }
                                        })

                                    : null

                                }
                            </div>

                        </div>
                        <div className="col-6 no-gutters px-0">
                            <div className={cx("d-flex flex-column justify-content-end", styles.fullHeight)}>

                                {!_.isEmpty(this.state.data) ?
                                    this.state.data.map((value, index) => {
                                        return (
                                            <div key={index} className={cx("d-flex flex-row", styles.rowHeight)}>
                                                <div className={cx("d-flex flex-column", styles.rowHeight, styles.rightPaddingTop)} style={{ paddingLeft: "1rem" }}>
                                                    <label className={styles.timeLineTextRight}>{value.date}</label>
                                                    <label className={styles.timeLineTextRightSmall}>{value.time}</label>
                                                </div>
                                                {/* //////////////////Handle Tooltip design here////////////// */}
                                                {this.state.showTooltip === true && this.state.currentIndex === index ?
                                                    <div className={cx(styles.tooltipContainer, "d-flex flex-row mb-5")}>
                                                        <div>
                                                            <img
                                                                className={styles.tooltipProfilePic}
                                                                src={!_.isEmpty(value.profilePicUrl) ?
                                                                    (this.props.images[value.uuid] ? this.props.images[value.uuid]['image'] : null)
                                                                    // process.env.REACT_APP_CUSTOMER_MGMT_IMG_URL + '/' + this.props.data.profilePicUrl
                                                                    : samplepic
                                                                }
                                                                alt="profilePic"
                                                            />
                                                        </div>
                                                        <div className="d-flex flex-column pt-2">
                                                            <label className={styles.tooltipHeading}>{value.uploadedBy}</label>
                                                            <label className={styles.tooltipText}>{value.employeeId}</label>
                                                            <label className={styles.tooltipText}>{value.role}</label>
                                                        </div>

                                                    </div>
                                                    : null}
                                            </div>
                                        )

                                    })
                                    : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <hr className={cx('row mr-2 pb-0 mb-0', styles.hr1)} />
            </React.Fragment>

        )
    }
}

export default withRouter(TimeLine);
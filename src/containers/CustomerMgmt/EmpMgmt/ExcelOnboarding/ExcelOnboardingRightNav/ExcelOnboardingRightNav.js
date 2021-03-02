import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import { withTranslation } from 'react-i18next';

import _ from 'lodash';
import cx from 'classnames';
import styles from './ExcelOnboardingRightNav.module.scss';

import TimeLine from '../../../../../components/Organism/TimeLine/TimeLine';

import * as actions from './Store/action';
import * as imageStoreActions from "../../../../Home/Store/action";

class ExcelOnboardingRightNav extends Component {

    state = {
        orgId: null,
        timeLineData: [],
        finalData: '',
        testData: ''
    }

    componentDidMount = () => {
        const { match } = this.props;
        const orgId = match.params.uuid;
        this.setState({ orgId: orgId })
        this.props.onGetTimelineData(orgId);
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.timelineDataState !== this.props.timelineDataState && this.props.timelineDataState === 'SUCCESS') {
            this.handlePropsToState();
        }

        if (prevProps.userDetailsState !== this.props.userDetailsState && this.props.userDetailsState === 'SUCCESS') {
            this.handleUserDetails('');
            if (!_.isEmpty(this.props.userDetails.data) && !_.isEmpty(this.props.userDetails.data.defaultRole)) {
                this.props.onGetTagName(this.props.userDetails.data.defaultRole);
            }
        }

        if (prevProps.tagDataState !== this.props.tagDataState && this.props.tagDataState === 'SUCCESS' && !_.isEmpty(this.props.tagData)) {
            let defaultRole = _.cloneDeep(this.props.tagData);
            defaultRole = _.cloneDeep(this.props.tagData[0]);
            this.handleUserDetails(defaultRole);
        }
    }

    handlePropsToState = () => {
        let updatedTimelineData = _.cloneDeep(this.state.timeLineData);

        this.props.timeLineData.map(item => {
            let data = {
                fileName: item.fileUrl,
                status: item.status,
                uploadedOn: item.uploadedOn,
                userId: item.userId,
                fileId: item._id
            }
            updatedTimelineData.push(data);
            return null
        })
        this.setState({ timeLineData: updatedTimelineData })
        this.handleTimeDescOrder(updatedTimelineData);
    }

    shortenDisplayName = (displayName) => {
        if (displayName.length > 12) {
            const updatedDisplayName = displayName.substring(0, 12) + '...';
            return (updatedDisplayName);
        }
        return (displayName);
    }

    handleTimeDescOrder = (updatedTimelineData) => {
        let timeLineData = _.cloneDeep(updatedTimelineData);

        let sortedDateObjs = timeLineData.sort(function (obj1, obj2) {
            var a = new Date(obj1.uploadedOn * 1000), b = new Date(obj2.uploadedOn * 1000);
            if (a < b) return 1;
            if (a === b) return 1;
            if (a > b) return -1;
            return 0;
        });

        let finalObj = [];

        _.forEach(sortedDateObjs, function (value, index) {
            let date = new Date(value.uploadedOn);
            date = date.toString().split(" ")
            let finalDate = date[2] + "th " + date[1].toLowerCase() + ", " + date[3];
            let time = date[4].split(":")
            let finalTime = '';
            if (parseInt(time[0]) === 0) { finalTime = "12:" + time[1] + " am"; }
            else if (parseInt(time[0]) > 0 && parseInt(time[0]) < 12) { finalTime = time[0].replace("0", "") + ":" + time[1] + " am"; }
            else if (parseInt(time[0]) === 12) { finalTime = "12:" + time[1] + " pm"; }
            else { finalTime = time[0].replace("0", "") + ":" + time[1] + " pm"; }

            let fileName = value.fileName.split('/');
            fileName = fileName[1];

            let obj = {};
            obj.fileName = fileName;
            obj.status = value.status;
            obj.userId = value.userId;
            obj.date = finalDate;
            obj.time = finalTime;
            obj.fileId = value.fileId;

            finalObj.push(obj);
        })
        this.setState({ finalData: finalObj })
    }

    getEmpData = (value) => {
        this.props.onGetUserDetails(this.state.orgId, value.userId);
        this.props.onGetProfilePic(value.uuid, value.profilePicUrl);
    }

    handleUserDetails = (defaultRole) => {
        let thisRef = this;
        let updatedFinalData = this.state.finalData;

        _.forEach(updatedFinalData, function (finalData) {
            if (finalData.userId === thisRef.props.userDetails.data.userId) {
                finalData['employeeId'] = thisRef.props.userDetails.data.employeeId;
                finalData['uuid'] = thisRef.props.userDetails.data.uuid;
                finalData['uploadedBy'] = thisRef.shortenDisplayName(thisRef.props.userDetails.data.firstName + (!_.isEmpty(thisRef.props.userDetails.data.lastName) ? ' ' + thisRef.props.userDetails.data.lastName : ''));
                finalData['profilePicUrl'] = thisRef.props.userDetails.data.profilePicUrl ? thisRef.props.userDetails.data.profilePicUrl : null;

                if (defaultRole && defaultRole.uuid === thisRef.props.userDetails.data.defaultRole) {
                    finalData['role'] = defaultRole.name;
                }
                else {
                    finalData['role'] = '';
                }
            }
        })
        this.setState({ finalData: updatedFinalData });
    }

    handleDownload = (value) => {
        const { match } = this.props;
        const orgId = match.params.uuid;
        this.props.onDownloadFile(value.fileId, orgId);
    }

    render() {
        const { t } = this.props;
        return (
            <div className={styles.RightNavAlign}>
                <div className={cx('no-gutters px-0', styles.Timeline)}>
                    <TimeLine
                        data={this.state.finalData}
                        getEmpData={this.getEmpData}
                        clickHandler={this.handleDownload}
                        downloadTimelineFileState={this.props.timelineFileState}
                        images={this.props.images}
                    //height = {styles.timelineHeight}
                    />
                    <p className={styles.Heading}>{t('translation_empExcelOnboarding:excelRightNav.upload')}</p>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        timelineDataState: state.empMgmt.excelTimeline.getTimelineDataState,
        timeLineData: state.empMgmt.excelTimeline.timeLineData,
        error: state.empMgmt.excelTimeline.error,
        userDetailsState: state.empMgmt.excelTimeline.getUserDetailsState,
        userDetails: state.empMgmt.excelTimeline.userDetails,
        tagDataState: state.empMgmt.excelTimeline.tagDataState,
        tagData: state.empMgmt.excelTimeline.tagData,
        timelineFileData: state.empMgmt.excelTimeline.timelineFileData,
        timelineFileState: state.empMgmt.excelTimeline.timelineFileState,
        images: state.imageStore.images
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onInitState: () => dispatch(actions.initState()),
        onGetTimelineData: (orgId) => dispatch(actions.getTimelineData(orgId)),
        onGetUserDetails: (orgId, userId) => dispatch(actions.getUserDetails(orgId, userId)),
        onGetTagName: tagArray => dispatch(actions.getTagName(tagArray)),
        onDownloadFile: (file, orgId) => dispatch(actions.getDownloadFile(file, orgId)),
        onGetProfilePic: (empId, filePath) => dispatch(imageStoreActions.getProfilePic(empId, filePath))
    }
}

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(ExcelOnboardingRightNav)));
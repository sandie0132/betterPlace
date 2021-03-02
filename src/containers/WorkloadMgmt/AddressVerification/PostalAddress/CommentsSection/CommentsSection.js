import React, { Component } from 'react' ;
import styles from './CommentsSection.module.scss';
import cx from 'classnames';
import _ from 'lodash';
import { connect } from 'react-redux';

import {POSTAL_ACTIVITY} from '../PostalAddressInitData';
import commentIcon from '../../../../../assets/icons/comment.svg';
import activeStatus from '../../../../../assets/icons/activeStatus.svg';
import inactiveStatus from '../../../../../assets/icons/inactiveStatus.svg';
import removeAttachment from '../../../../../assets/icons/removeAttachment.svg';
import attach from '../../../../../assets/icons/attach.svg';
import inactiveDropdown from '../../../../../assets/icons/downArrow.svg';
import redOption from '../../../../../assets/icons/redOption.svg';
import yellowOption from '../../../../../assets/icons/yellowOption.svg';
import greenOption from '../../../../../assets/icons/greenOption.svg';
import inactivePlus from '../../../../../assets/icons/inactivePlus.svg';
import redDown from '../../../../../assets/icons/redDown.svg';
import greenDown from '../../../../../assets/icons/greenDown.svg';
import yellowDown from '../../../../../assets/icons/yellowDown.svg';
import redEdit from '../../../../../assets/icons/editRed.svg';
import greenEdit from '../../../../../assets/icons/editGreen.svg';
import yellowEdit from '../../../../../assets/icons/editYellow.svg';
import chatIcon from '../../../../../assets/icons/chat.svg';

import themes from '../../../../../theme.scss';
// actions
import * as actions from '../../../Store/action';
import * as postalActions from '../Store/action';

import PasteUpload from '../../../../../components/Molecule/PasteUpload/PasteUpload';
import Modal from '../../../ServiceVerification/TaskSearchCloseReview/TaskCloseReview/CommentsSection/VerificationModal/VerificationModal';
import StatusDropdown from '../../../ServiceVerification/TaskSearchCloseReview/TaskCloseReview/CommentsSection/StatusDropdown/StatusDropdown';
import { withTranslation } from 'react-i18next';

// const COLORS = {
//     verificationIcon: {
//         'green': greenOption, 'yellow': yellowOption, 'red': redOption, '': chatIcon,
//         'awaiting_generate_tracking_number': chatIcon, 'delivered': chatIcon, 'delivery_failed': chatIcon,
//         'in_transit': chatIcon, 'label_generataed': chatIcon, 'label_printed': chatIcon,
//         'shipment_cancelled': chatIcon, 'shipment_rejected': chatIcon, 'shipped': chatIcon,
//         'tracking_number_assigned': chatIcon, 'tracking_number_assignment_failed': chatIcon
//     },

//     dropdown: {
//         'green': greenDown, 'yellow': yellowDown, 'red': redDown, '': inactiveDropdown,
//         'awaiting_generate_tracking_number': inactiveDropdown, 'delivered': inactiveDropdown, 'delivery_failed': inactiveDropdown,
//         'in_transit': inactiveDropdown, 'label_generataed': inactiveDropdown, 'label_printed': inactiveDropdown,
//         'shipment_cancelled': inactiveDropdown, 'shipment_rejected': inactiveDropdown, 'shipped': inactiveDropdown,
//         'tracking_number_assigned': inactiveDropdown, 'tracking_number_assignment_failed': inactiveDropdown
//     },

//     EditIcon: {
//         'green': greenEdit, 'yellow': yellowEdit, 'red': redEdit, '': inactiveDropdown,
//         'awaiting_generate_tracking_number': inactiveDropdown, 'delivered': inactiveDropdown, 'delivery_failed': inactiveDropdown,
//         'in_transit': inactiveDropdown, 'label_generataed': inactiveDropdown, 'label_printed': inactiveDropdown,
//         'shipment_cancelled': inactiveDropdown, 'shipment_rejected': inactiveDropdown, 'shipped': inactiveDropdown,
//         'tracking_number_assigned': inactiveDropdown, 'tracking_number_assignment_failed': inactiveDropdown
//     },

//     Background: {
//         'green': styles.greenBackground, 'yellow': styles.yellowBackground, 'red': styles.redBackground, '': styles.Background,
//         'awaiting_generate_tracking_number': styles.Background, 'delivered': styles.Background, 'delivery_failed': styles.Background,
//         'in_transit': styles.Background, 'label_generataed': styles.Background, 'label_printed': styles.Background,
//         'shipment_cancelled': styles.Background, 'shipment_rejected': styles.Background, 'shipped': styles.Background,
//         'tracking_number_assigned': styles.Background, 'tracking_number_assignment_failed': styles.Background
//     },

//     caseBackground: {
//         'green': styles.greenStatus, 'yellow': styles.yellowStatus, 'red': styles.redStatus, '': styles.selectStatus,
//         'awaiting_generate_tracking_number': styles.selectStatus, 'delivered': styles.selectStatus, 'delivery_failed': styles.selectStatus,
//         'in_transit': styles.selectStatus, 'label_generataed': styles.selectStatus, 'label_printed': styles.selectStatus,
//         'shipment_cancelled': styles.selectStatus, 'shipment_rejected': styles.selectStatus, 'shipped': styles.selectStatus,
//         'tracking_number_assigned': styles.selectStatus, 'tracking_number_assignment_failed': styles.selectStatus
//     }
// }

var I = 0;

class CommentsSection extends Component {

    state = {
        attachedFiles: [],
        attachmentUrl: [],
        verificationStatusIcon: inactivePlus,
        selectedComment: 'add comment',
        dropdownIcon: inactiveDropdown,
        commentBackground: themes.warningBackground,
        showDropdown: false,
        colorName: '',
        selectCaseStatus: 'select case status',
        statusDropdown: false,
        submitColorName: '',
        sucessName: '',
        setAttachmentUrl: false,
        prevColor : '',
        addressObject : {},
        showSelectStatusIcon : false,
    }

    componentDidMount = () => {
        let updatedAttachments = [];
        let updatedAttachmentUrl=[];
        let obj,verificationResult,updatedComment=this.state.selectedComment ;
        let commentBackground =this.state.commentBackground,verificationStatusIcon=this.state.verificationStatusIcon;
        if(!_.isEmpty(this.props.taskData) && !_.isEmpty(this.props.taskData.result))
        { 
            obj = !_.isEmpty(this.props.taskData.result) ? this.props.taskData.result[this.props.taskData.result.length-1]: '';
            updatedAttachments = obj && obj.attachments ? obj.attachments : [];
            updatedAttachmentUrl =  obj && obj.attachments ? obj.attachments : [];
            let newAttachments = [];
            _.forEach(updatedAttachments, function(value) {
                let attachObject = {"name" : "", "url" : "", "manualReview": ""};
                attachObject.url = value;
                attachObject.name = value.split('/').pop();
                attachObject.manualReview = obj.manualReview;
                newAttachments.push(attachObject)
            })

            updatedAttachments = [];
            updatedAttachments = [...updatedAttachments, ...newAttachments];
            
            
            if(obj.verificationResult){
                updatedComment = this.handleDefaultStyles(obj.verificationResult.toLowerCase(), 'result');//obj.verificationResult.toLowerCase() + " case";
                verificationStatusIcon = this.handleDefaultStyles(obj.verificationResult.toLowerCase(), 'verificationIcon');//COLORS.verificationIcon[obj.verificationResult.toLowerCase()];
                commentBackground = this.handleDefaultStyles(obj.verificationResult.toLowerCase(), 'Background');//COLORS.Background[obj.verificationResult.toLowerCase()];
                verificationResult = obj.verificationResult;
            }
        }
        this.setState({
            attachedFiles: updatedAttachments,
            attachmentUrl: updatedAttachmentUrl,
            selectedComment : updatedComment,
            commentBackground: commentBackground,
            verificationStatusIcon: verificationStatusIcon,
            colorName: !_.isEmpty(verificationResult) ? verificationResult.toLowerCase() : '',
            submitColorName: !_.isEmpty(verificationResult) ? verificationResult.toLowerCase() : '',
            selectCaseStatus: !_.isEmpty(verificationResult) ? verificationResult.replace(/_/g, " ").toLowerCase() + ' case' : 'select case status',
            prevColor : !_.isEmpty(verificationResult) ? verificationResult.toLowerCase() : '',
        })
    }

    componentDidUpdate = (prevProps) => {
        if(this.props.attachmentUrlState!==prevProps.attachmentUrlState && this.props.attachmentUrlState==="SUCCESS" && this.props.addAttachmentType !== "CRC"){
            const thisRef = this;
            let updatedAttachedFiles = !_.isEmpty(this.state.attachedFiles) ? _.cloneDeep(this.state.attachedFiles): [];
            let updatedAttachmentUrl = !_.isEmpty(this.state.attachmentUrl) ? _.cloneDeep(this.state.attachmentUrl): [];
            let imageObj = {"name" : "image_", "url": ""}

            imageObj.url = thisRef.props.attachmentUrl.slice(-1)
            if(thisRef.props.attachmentUrl.slice(-1)[0].slice(-3) === 'pdf'){
                imageObj.name = "pdf_" + (I)
            }
            else{
                imageObj.name = "image_" + (I)
            }
            updatedAttachedFiles = [...updatedAttachedFiles, imageObj];
            updatedAttachmentUrl = [...updatedAttachmentUrl,...imageObj.url];
            I++;

            this.setState({attachedFiles: updatedAttachedFiles , attachmentUrl : updatedAttachmentUrl});
        }

        if (prevProps.deleteDocumentState !== this.props.deleteDocumentState && this.props.deleteDocumentState === "SUCCESS" && this.props.deleteAttachmentType !== "CRC") {
            let updatedAttachmentUrl = [];
            if( !_.isEmpty(this.props.taskData.result) ){
                _.forEach(this.props.taskData.result,function(result){
                    if( !_.isEmpty(result.attachments) ){
                        updatedAttachmentUrl.push(result.attachments)
                    }
                })
            }
            this.setState({attachmentUrl: _.isEmpty(this.props.taskData.result) ?  this.props.attachmentUrl 
                                            : !_.isEmpty(updatedAttachmentUrl) 
                                                    ? [...updatedAttachmentUrl, ...this.props.attachmentUrl]
                                                    : this.props.attachmentUrl });
        }
        
        if (prevProps.postDocumentTasksState !== this.props.postDocumentTasksState && this.props.postDocumentTasksState === "SUCCESS") {
            this.props.onAttachmentInitialState();
            this.setState({ 
                dropdownIcon: inactiveDropdown,
                selectedComment: 'add comment',
                selectCaseStatus: 'select case status', 
                verificationStatusIcon: inactivePlus,
                commentBackground: themes.warningBackground,
                attachedFiles: [], attachmentUrl: [],
                googleLink: '',
                statusDropdown:false,
                showDropdown:false
            })
        }
    }

    shortenDisplayName = (displayName) => {
        if (displayName.length > 12) {
            const updatedDisplayName = displayName.substring(0, 6) + '...';
            return (updatedDisplayName);
        }
        return (displayName);
    }

    handleDeleteFile = (targetIndex) => {
        if (this.props.seconds !== 0) {
            if (I === targetIndex) {
                I--
            }

            this.props.onImageDeleted('postal_address', '', this.state.attachmentUrl[targetIndex].split('/').pop(), this.state.attachmentUrl[targetIndex])
            
            
            let updatedAttachedFiles = this.state.attachedFiles.filter((url, index) => {
                if (index === targetIndex) return null;
                else return url;
            })
            let updatedAttachmenturl;
            if (!_.isEmpty(this.state.attachmentUrl)) {
                updatedAttachmenturl = this.state.attachmentUrl.filter((url, index) => {
                    if (index === targetIndex) return null;
                    else return url;
                })
            }

            this.setState({
                attachedFiles: updatedAttachedFiles,
                attachmentUrl: updatedAttachmenturl
            })
        }
    }

    handleDropdown = () => {
        let showDropdown = this.state.showDropdown;
        showDropdown = !showDropdown;
        this.setState({ showDropdown: showDropdown})
    }

    handleStatusDropdown = () => {
        if (!this.state.statusDropdown) {
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }
        this.setState({ statusDropdown: !this.state.statusDropdown })
    }

    handleOutsideClick = (e) => {
        if (!_.isEmpty(this.dropdownNode)) {
          if (this.dropdownNode.contains(e.target)) {
            return;
          }
          if(this.state.statusDropdown){
            this.setState({statusDropdown:false})
          }
        }
    }

    handleSubmit = () => { 
        let updatedComments = !_.isEmpty(this.props.taskData.result) && !_.isEmpty(this.props.taskData.result[this.props.taskData.result.length-1].comments) ? 
                            [   ...this.props.taskData.result[this.props.taskData.result.length-1].comments,
                                this.state.selectedComment
                            ]
                            : [this.state.selectedComment]

        let result = {
            type: this.props.taskData.service,
            verificationResult: this.state.submitColorName.toUpperCase(),
            comments: updatedComments,
            attachments: this.state.attachmentUrl,
            agency : !_.isEmpty(this.props.taskData.agency) ? this.props.taskData.agency.agency : '',
            agencyType : !_.isEmpty(this.props.taskData.agency)  && !_.isEmpty(this.props.taskData.agency.type) 
                            ? this.props.taskData.agency.type 
                            : this.props.taskData.verificationPreference.toLowerCase(),
            trackingNumber : this.props.taskData.trackingNumber
        }
        let data = {
            empId: this.props.taskData.empId,
            orgId: this.props.taskData.orgId,
            requestId: this.props.taskData.requestId,
            serviceRequestId: this.props.taskData.serviceRequestId,
            isReAssigned : this.props.taskData.isReAssigned,
            addressId : this.props.taskData._id,
            service: this.props.taskData.service,
            result: result,
            agency : this.props.taskData.agency,
            type: "inProgress",
            status: ["GREEN","YELLOW","RED"].includes(this.state.submitColorName.toUpperCase()) ? "done" :"inProgress",
            verificationPreference : "POSTAL",
        }
        if (this.props.taskData.org_from) { data = { ...data, org_from: this.props.taskData.org_from }; }
        if (this.props.taskData.org_to) { data = { ...data, org_to: this.props.taskData.org_to }; }
        if (this.props.taskData.org_via) { data = { ...data, org_via: this.props.taskData.org_via }; }
        this.props.successNotificationHandler(this.state.submitColorName);
        this.props.onPostPostalTasks(data, 'postal_address', this.props.taskData.serviceRequestId);
    }

    getCommentData = (commentsFromModal) => {
        let writtenComment = commentsFromModal.writtenComment;
        let comment = writtenComment !== '' ? writtenComment : commentsFromModal.selectedComment;
        let color = commentsFromModal.selectedCommentCase;
        this.handleCommentCase(comment, color, writtenComment);
    }

    handleCommentCase = (comment, color, writtenComment) => {
        let showSelectStatusIcon = writtenComment === "" ? false : true;
        let updatedDropDownIcon = this.state.dropdownIcon;
        let updatedSelectedComment = this.state.selectedComment;
        let updatedMessageIcon = this.state.verificationStatusIcon;
        let commentBackground = this.state.commentBackground;
        let updatedSelectStatus = this.state.selectCaseStatus;
        let updatedSubmitColor = color.toUpperCase().replace(/ /g,"_");
        let status;
    
        if (color === "green" || color === "red" || color === "yellow") {
            status = color + " case";
        }
        else if (color === "") {
            status = "select case status";
        }
        else {
            status = color;
            color = '';
        }
        updatedSelectStatus = status;

        commentBackground = this.handleDefaultStyles(color, 'Background');//COLORS.Background[color];

        updatedMessageIcon = this.handleDefaultStyles(color, 'verificationIcon');//COLORS.verificationIcon[color];

        updatedDropDownIcon = this.handleDefaultStyles(color, 'EditIcon');//COLORS.EditIcon[color];

        updatedSelectedComment = comment;
        this.setState({
            selectedComment: updatedSelectedComment,
            showDropdown: false,
            commentBackground: commentBackground,
            verificationStatusIcon: updatedMessageIcon,
            dropdownIcon: updatedDropDownIcon,
            colorName: color,
            submitColorName: updatedSubmitColor,
            selectCaseStatus: updatedSelectStatus,
            showSelectStatusIcon : showSelectStatusIcon
        })
    }

    handleStatusClick = (selectedOption, color) => {
        let updatedDropDownIcon = this.state.dropdownIcon;
        let verificationStatusIcon = this.state.verificationStatusIcon;
        let  statusComment=this.state.commentBackground, statusDropdown;
        let updatedSelectStatus = this.state.selectCaseStatus;
        let updatedSubmitColor = color.toUpperCase().replace(/ /g,"_");

        let status;
        if (color === "green" || color === "red" || color === "yellow") {
            status = color + " case";
        }
        else if (color === "") {
            status = selectedOption;
            color = '';
            updatedSubmitColor = selectedOption.toUpperCase().replace(/ /g,"_");
        }
        else {
            status = color;
            color = '';
        }
        updatedSelectStatus = status;

        statusComment = this.handleDefaultStyles(color, 'Background');//COLORS.Background[color];

        updatedDropDownIcon = this.handleDefaultStyles(color, 'EditIcon');//COLORS.EditIcon[color];

        verificationStatusIcon = this.handleDefaultStyles(color, 'verificationIcon');//COLORS.verificationIcon[color];

        statusDropdown = !this.state.statusDropdown;

        this.setState({ 
            submitColorName: updatedSubmitColor, 
            selectCaseStatus: updatedSelectStatus, 
            statusDropdown: statusDropdown, 
            commentBackground: statusComment, 
            dropdownIcon: updatedDropDownIcon,
            verificationStatusIcon: verificationStatusIcon,
            colorName : color,
        })
    }

    handleUploadFile = (file, type) => {
        const formData = new FormData();
        if (type === 'paste') {
            formData.append('file', file);
        }
        else {
            var i;
            for (i = 0; i < file.length; i++) {
                formData.append('file', file[i]);
            }
        }
        this.props.onImageAdded('postal_address', formData, this.props.taskData.serviceRequestId);
    }

    enableSubmitHandler = () => {
        if(this.state.selectCaseStatus === "select case status")
            return false;
        if(this.props.disabled || this.props.attachmentUrlState === 'LOADING') return false;
        else return true;
    }

    handleDownload = (url) => {
        this.props.onDownloadAttachment(url)
    }

    handleDefaultStyles = (status, type) => {
        if (type === 'result') {
            let result = status === 'green' ? 'green case'
                : status === 'yellow' ? 'yellow case'
                    : status === 'red' ? 'red case'
                        : status.replace(/_/g, " ")
            return result;
        }
        if (type === 'verificationIcon') {
            let verificationIcon = status === 'green' ? greenOption
                : status === 'yellow' ? yellowOption
                    : status === 'red' ? redOption
                        : chatIcon
            return verificationIcon;
        }
        if (type === 'dropdown') {
            let dropdown = status === 'green' ? greenDown
                : status === 'yellow' ? yellowDown
                    : status === 'red' ? redDown
                        : inactiveDropdown
            return dropdown;
        }
        if (type === 'EditIcon') {
            let EditIcon = status === 'green' ? greenEdit
                : status === 'yellow' ? yellowEdit
                    : status === 'red' ? redEdit
                        : inactiveDropdown
            return EditIcon;
        }
        if (type === 'Background') {
            let Background = status === 'green' ? styles.greenBackground
                : status === 'yellow' ? styles.yellowBackground
                    : status === 'red' ? styles.redBackground
                        : styles.Background;
            return Background;
        }
        if (type === 'caseBackground') {
            let caseBackground = status === 'green' ? styles.greenStatus
                : status === 'yellow' ? styles.yellowStatus
                    : status === 'red' ? styles.redStatus
                        : styles.selectStatus
            return caseBackground;
        }
    }

    handleActivityMessage(activity){
        let message = POSTAL_ACTIVITY[activity.trackingStatus];
        let date = new Date(activity.timeStamp);
        date = date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear();
        date = date.replace(/\//g,".")
        return !_.isEmpty(message) ? message + date : "";
    }

    render () {
        const { t } = this.props;
        let attachmentList = !_.isEmpty(this.state.attachedFiles) ? this.state.attachedFiles.map((attachment, attachmentIndex) => {
            if (!_.isEmpty(attachment.url)) {
                return (
                    <label key={attachmentIndex} className={cx(styles.Attachment, 'ml-2')}>
                        <span className={this.props.downloadAttachmentState === 'LOADING' ? styles.hoverLoading : styles.hoverHand} onClick={this.props.downloadAttachmentState === 'LOADING' ? null : () => this.handleDownload(attachment.url, 
                            )} disabled={this.props.disabled}>
                            <img src={attach} height='12px' alt=''/>&ensp;{_.isEmpty(attachment.name) ? '' : this.shortenDisplayName(attachment.name)}
                        </span>  
-                       <img src={removeAttachment} height='10px' className={cx('ml-4', styles.hoverHand)} alt='' onClick={() => this.handleDeleteFile(attachmentIndex)} />
                    </label>
                )
            }
            else return null;
        }) : null

        return(
            <div>
                <div className='mt-2 d-flex flex-column'>
                    
                    <label className={cx(styles.smallLabel, "mb-0")}>{t('translation_addressTaskClosure:comments')}</label>
                    {this.props.taskData.activity ?
                        <div className="row no-gutters mb-1">
                            {this.props.taskData.activity.map((activity,index) => {
                                return (
                                    <label key={index} className={cx('pl-2 mr-2', styles.CommentBackground)}>
                                            <img src={commentIcon} alt='comment' />&ensp;
                                        {!_.isEmpty(this.handleActivityMessage(activity)) 
                                            ?   this.handleActivityMessage(activity)
                                            :   null}
                                        </label>
                                )
                            })}
                        </div>
                    : null}

                    {/* comments */}
                    {!this.props.disabled ?
                        <React.Fragment>
                            <div>
                                {this.state.selectedComment !== ''  ? 
                                    <label className={this.state.selectedComment === 'add comment' ? cx(styles.Background, 'mb-1') : cx(styles.Background, 'mb-1', this.state.commentBackground)} onClick={this.handleDropdown}>
                                        <img className={this.state.selectedComment === 'add comment' ? cx(styles.addCommentImg) : null} src={this.state.verificationStatusIcon} height='12px' alt='' />
                                        <span className='mt-1'>&ensp;{this.state.selectedComment} &ensp;</span>
                                        <img src={this.state.dropdownIcon} style={this.state.dropdownIcon === inactiveDropdown ? { float: "right", marginTop: ".35rem" } : { float: "right", marginTop: ".2rem" }} alt='' />
                                    </label> 
                                : null }
                            </div>
                        
        
                            {/* comments modal */}
                            {this.state.showDropdown?
                                <Modal
                                    comments={this.props.comments}
                                    toggle={this.handleDropdown}
                                    submitData={this.getCommentData}
                                    dropdownOption={this.state.selectedComment}
                                /> 
                            : null}
                            
                            <div className='row no-gutters my-1' style={{position:"relative"}}>
                                    {/* attachments  */}
                                    <React.Fragment>
                                        <PasteUpload
                                            uploadFile={(file, type) => this.handleUploadFile(file, type)}
                                            seconds={this.props.seconds}
                                            showModal = {true}
                                            disabled = {this.props.attachmentUrlState === 'LOADING' ? true : false || this.props.disabled}
                                        />
                                        {attachmentList}
                                    </React.Fragment> 

                                {this.state.selectedComment !== 'add comment' ?
                                    <span className={cx('ml-auto mt-auto')} ref={node => { this.dropdownNode = node; }}>
                                        <label className={cx(this.handleDefaultStyles(this.state.colorName, 'caseBackground'), 'd-flex flex-row justify-content-between')}>
                                            {/* cx(COLORS.caseBackground[this.state.colorName] */}
                                            <span style={this.state.showSelectStatusIcon ? { cursor: "pointer" } : { cursor: "default" }}
                                                className={cx(styles.statusAlign)}
                                                onClick={this.state.showSelectStatusIcon ? this.handleStatusDropdown : null}>
                                                {this.state.selectCaseStatus}
                                            </span>
                                            <span>
                                                {this.state.showSelectStatusIcon ?
                                                    <img
                                                        className={cx(styles.ImageInvert)}
                                                        onClick={this.handleStatusDropdown}
                                                        src={this.handleDefaultStyles(this.state.colorName, 'dropdown')}//{COLORS.dropdown[this.state.colorName]}
                                                        alt=''
                                                    />
                                                    : null} &emsp;&emsp;
                                                <img onClick={!(this.enableSubmitHandler()) ? null : this.handleSubmit}
                                                    className={cx(styles.imgClose)}
                                                    src={!(this.enableSubmitHandler()) ? inactiveStatus : activeStatus}
                                                    alt=''
                                                />
                                            </span>
                                        </label>
                                    </span>
                                : ''}
                                
                                <StatusDropdown
                                    statusType={this.props.comments}
                                    className={styles.dropdownStatus}
                                    showDropdown={this.state.statusDropdown}
                                    changed={(selectedOption, color) => this.handleStatusClick(selectedOption, color)}
                                />
                            </div>
                        </React.Fragment>
                    : null }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        attachmentUrl: state.workloadMgmt.attachmentUrl.downloadURL,
        attachmentUrlState: state.workloadMgmt.attachmentUrl.addDocumentState,
        addAttachmentType: state.workloadMgmt.attachmentUrl.addDocumentType,
        deleteAttachmentType: state.workloadMgmt.attachmentUrl.deleteDocumentType,
        deleteDocumentState: state.workloadMgmt.attachmentUrl.deleteDocumentState,
        postTaskState: state.workloadMgmt.addressVerification.postalAddress.postPostalTaskDetailsState,
        comments: state.workloadMgmt.DocVerification.Comments,
        downloadAttachmentState: state.workloadMgmt.attachmentUrl.downloadAttachmentState
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onImageAdded: (type, formData, serviceRequestId) => dispatch(actions.addImage(type, formData, serviceRequestId)),
        onAttachmentInitialState: () => dispatch(actions.initialState()),
        onImageDeleted: (type, dataId, fileName, url) => dispatch(actions.deleteImage(type, dataId, fileName, url)),
        onDownloadAttachment: (url) => dispatch(actions.downloadAttachment(url)),
        onPostPostalTasks : (data, service, requestId) => dispatch(postalActions.onPostPostalTasks(data, service,requestId)),
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(CommentsSection));
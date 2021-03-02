import React, { Component } from 'react' ;
import styles from './CommentsSection.module.scss';
import cx from 'classnames';
import _ from 'lodash';
import { connect } from 'react-redux';

// import dropdown from '../../../../../../assets/icons/dropdownArrow.svg';
import commentIcon from '../../../../../../assets/icons/comment.svg';
import activeStatus from '../../../../../../assets/icons/activeStatus.svg';
import inactiveStatus from '../../../../../../assets/icons/inactiveStatus.svg';
import removeAttachment from '../../../../../../assets/icons/removeAttachment.svg';
import attach from '../../../../../../assets/icons/attach.svg';
import inactiveDropdown from '../../../../../../assets/icons/downArrow.svg';
import redOption from '../../../../../../assets/icons/redOption.svg';
import yellowOption from '../../../../../../assets/icons/yellowOption.svg';
import greenOption from '../../../../../../assets/icons/greenOption.svg';
import inactivePlus from '../../../../../../assets/icons/inactivePlus.svg';
import redDown from '../../../../../../assets/icons/redDown.svg';
import greenDown from '../../../../../../assets/icons/greenDown.svg';
import yellowDown from '../../../../../../assets/icons/yellowDown.svg';
import redEdit from '../../../../../../assets/icons/editRed.svg';
import greenEdit from '../../../../../../assets/icons/editGreen.svg';
import yellowEdit from '../../../../../../assets/icons/editYellow.svg';
import chatIcon from '../../../../../../assets/icons/chat.svg';

import themes from '../../../../../../theme.scss';
// actions
import * as actions from '../../../../Store/action';
import * as docVerificationActions from '../../../Store/action';

import PasteUpload from '../../../../../../components/Molecule/PasteUpload/PasteUpload';
import {Input} from 'react-crux';
import { validation, message } from './CommentsSectionValidation';
import Modal from './VerificationModal/VerificationModal';
import StatusDropdown from './StatusDropdown/StatusDropdown';
import StatusDropdownOptions from './StatusDropdown/StatusDropdownOptions';
import {documents} from './CommentsSectionInitdata';
import { withTranslation } from 'react-i18next';
import WarningPopUp from '../../../../../../components/Molecule/WarningPopUp/WarningPopUp';
import warn from '../../../../../../assets/icons/warning.svg';

const COLORS = {
    verificationIcon : {'green': greenOption, 'yellow' : yellowOption, 'red' : redOption, '' : chatIcon},
    dropdown: {'green': greenDown, 'yellow' : yellowDown, 'red' : redDown, '' : inactiveDropdown},
    EditIcon:{'green': greenEdit, 'yellow' : yellowEdit, 'red' : redEdit, '' : inactiveDropdown},
    Background : {'green': styles.greenBackground, 'yellow' : styles.yellowBackground, 'red' : styles.redBackground, '' : styles.Background},
    caseBackground : {'green' : styles.greenStatus, 'yellow' : styles.yellowStatus, 'red' : styles.redStatus, '' : styles.selectStatus}
}

var I = 0;

class CommentsSection extends Component {

    state = {
        attachedFiles: [],
        attachmentUrl: [],
        verificationStatusIcon: {"in progress" : inactivePlus, "closed" : inactivePlus},
        selectedComment: {"in progress" : 'add comment', "closed" : 'add comment'},
        dropdownIcon: {"in progress" : inactiveDropdown, "closed" : inactiveDropdown},
        commentBackground: {"in progress" : themes.warningBackground, "closed" : themes.warningBackground},
        showDropdown: false,
        googleLink: "",
        colorName: '',
        selectCaseStatus: 'select case status',
        statusDropdown: false,
        submitColorName: '',
        successColorName: '',
        changedColor: '',
        setAttachmentUrl: false,
        prevColor : '',
        addressObject : {},
        showSelectStatusIcon : false,
        agencyVerificationResult : "",
        errors: {},
        showDeleteWarning: false,
        toDeleteAttachment: null,
    }

    componentDidMount = () => {
        let updatedAttachments = [];
        let updatedAttachmentUrl=[];
        let obj,googleLink,verificationResult,updatedComment=this.state.selectedComment,dropdownIcon = this.state.dropdownIcon,agencyVerificationResult ;
        let commentBackground =this.state.commentBackground,verificationStatusIcon=this.state.verificationStatusIcon;
        // if (this.props.cardType !== "crc") {
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
                
                if(this.props.searchType==="closed"){

                    googleLink = obj && obj.googleLink ? obj.googleLink : ''
                    updatedComment["in progress"] = obj && obj.comments ? obj.comments[obj.comments.length-1] : '';
                    verificationResult = obj && obj.verificationResult ? obj.verificationResult : '';
                    verificationStatusIcon["in progress"] = COLORS.verificationIcon[verificationResult.toLowerCase()];
                    commentBackground["in progress"] = COLORS.Background[verificationResult.toLowerCase()];
                
                } else {
                    if(this.props.cardType === "physical_address" && obj.verificationResult){
                        updatedComment["in progress"] = obj.verificationResult.toLowerCase() + " case";
                        verificationStatusIcon["in progress"] = COLORS.verificationIcon[obj.verificationResult.toLowerCase()];
                        commentBackground["in progress"] = COLORS.Background[obj.verificationResult.toLowerCase()];
                        dropdownIcon["in progress"]  = COLORS.dropdown[obj.verificationResult.toLowerCase()] ;
                        verificationResult = obj.verificationResult;
                        agencyVerificationResult = obj.agencyVerificationResult
                    }
                }
            } 
        // }
        this.setState({
            attachedFiles: updatedAttachments,
            attachmentUrl: updatedAttachmentUrl,
            selectedComment : updatedComment,
            commentBackground: commentBackground,
            verificationStatusIcon: verificationStatusIcon,
            colorName: !_.isEmpty(verificationResult) ? verificationResult.toLowerCase() : '',
            submitColorName: !_.isEmpty(verificationResult) ? verificationResult.toLowerCase() : '',
            selectCaseStatus: !_.isEmpty(verificationResult) ? verificationResult.toLowerCase()+' case' : 'select case status',
            prevColor : !_.isEmpty(verificationResult) ? verificationResult.toLowerCase() : '',
            googleLink : googleLink,
            agencyVerificationResult : agencyVerificationResult
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

        // if (prevProps.deleteDocumentState !== this.props.deleteDocumentState && this.props.deleteDocumentState === "SUCCESS" && this.props.deleteAttachmentType !== "CRC") {
        //     let updatedAttachmentUrl = [];
        //     if( !_.isEmpty(this.props.taskData.result) ){
        //         _.forEach(this.props.taskData.result,function(result){
        //             if( !_.isEmpty(result.attachments) ){
        //                 updatedAttachmentUrl = [...updatedAttachmentUrl, ...result.attachments];
        //                 // updatedAttachmentUrl.push(result.attachments)
        //             }
        //         })
        //     }
        //     this.setState({attachmentUrl: _.isEmpty(this.props.taskData.result) ?  this.props.attachmentUrl 
        //                                     : !_.isEmpty(updatedAttachmentUrl) 
        //                                             ? [...updatedAttachmentUrl, ...this.props.attachmentUrl]
        //                                             : this.props.attachmentUrl });
        // }
        
        if (prevProps.postDocumentTasksState !== this.props.postDocumentTasksState && this.props.postDocumentTasksState === "SUCCESS") {
            this.props.attachmentInitialState();
            
            let colorName = this.state.submitColorName;
            if (this.props.cardType !== "crc") {
                I=0;
            }
            
            this.setState({ 
                successColorName: colorName,
                dropdownIcon: {"in progress" : inactiveDropdown, "closed" : inactiveDropdown},
                selectedComment: {"in progress" : 'add comment', "closed" : 'add comment'},
                selectCaseStatus: 'select case status' , 
                verificationStatusIcon: {"in progress" : inactivePlus, "closed" : inactivePlus},
                commentBackground: {"in progress" : themes.warningBackground, "closed" : themes.warningBackground},
                attachedFiles: [], attachmentUrl: [],
                googleLink: '',
                statusDropdown:false,
                showDropdown:false
            })
        }

        if(prevProps.taskData !== this.props.taskData && !_.isEmpty(this.props.taskData))
        {
            let obj, verificationResult = '';
            let {googleLink, attachedFiles, attachmentUrl, verificationStatusIcon, 
                selectedComment, dropdownIcon, commentBackground,showDropdown, agencyVerificationResult} = this.state;
            if(this.props.cardType === "employment") {
                obj = !_.isEmpty(this.props.taskData.result) ? this.props.taskData.result.find(obj => {return obj.verifiedBy === "ops"}) : '';
            } else {
                obj = !_.isEmpty(this.props.taskData.result) ? this.props.taskData.result[this.props.taskData.result.length-1]: '';
            }
            
            attachedFiles = obj && obj.attachments ? obj.attachments : [];
            attachmentUrl =  obj && obj.attachments ? obj.attachments : [];
            let newAttachments = [];
            _.forEach(attachedFiles, function(value) {
                let attachObject = {"name" : "", "url" : ""};
                attachObject.url = value;
                attachObject.name = value.split('/').pop();
                attachObject.manualReview = obj.manualReview;
                newAttachments.push(attachObject)
            })

            attachedFiles = [];
            attachedFiles = [...attachedFiles, ...newAttachments];
            
            if(this.props.searchType==="closed")
            {
                let comment = obj && obj.comments ? obj.comments[obj.comments.length-1] : '';

                verificationResult = obj && obj.verificationResult ? obj.verificationResult : '';
                googleLink = obj && obj.googleLink && !_.isEmpty(obj.googleLink) ? obj.googleLink : ''
                
                selectedComment = {"in progress" : comment, "closed" : "add comment"};
                verificationStatusIcon = { "in progress" : COLORS.verificationIcon[verificationResult.toLowerCase()], "closed" : inactivePlus};
                commentBackground = { "in progress" : COLORS.Background[verificationResult.toLowerCase()], "closed" : themes.warningBackground};
                dropdownIcon = {"in progress" : inactiveDropdown, "closed" : inactiveDropdown}
            }
            else{
                if(this.props.cardType === "physical_address"  && obj.verificationResult){
                    selectedComment["in progress"] = obj.verificationResult.toLowerCase() + " case";
                    verificationStatusIcon["in progress"] = COLORS.verificationIcon[obj.verificationResult.toLowerCase()];
                    commentBackground["in progress"] = COLORS.Background[obj.verificationResult.toLowerCase()];
                    dropdownIcon["in progress"]  = COLORS.dropdown[obj.verificationResult.toLowerCase()] ;
                    verificationResult = obj.verificationResult;
                    agencyVerificationResult = obj.agencyVerificationResult
                }
                else {
                    dropdownIcon = {"in progress" : inactiveDropdown, "closed" : inactiveDropdown}
                    selectedComment = {"in progress" : 'add comment', "closed" : 'add comment'}
                    verificationStatusIcon = {"in progress" : inactivePlus, "closed" : inactivePlus}
                    commentBackground = {"in progress" : themes.warningBackground, "closed" : themes.warningBackground}
                    showDropdown = false;
                }
            }
            this.setState({
                attachedFiles: attachedFiles,
                attachmentUrl: attachmentUrl,
                dropdownIcon : dropdownIcon,
                selectedComment : selectedComment,
                commentBackground: commentBackground,
                verificationStatusIcon: verificationStatusIcon,
                showDropdown: showDropdown,
                colorName: verificationResult !== '' ? verificationResult.toLowerCase() : '',
                submitColorName: verificationResult !== '' ? verificationResult.toLowerCase() : '',
                selectCaseStatus: verificationResult !== '' ? verificationResult.toLowerCase()+' case' : 'select case status',
                statusDropdown : false,
                prevColor : verificationResult.toLowerCase(),
                googleLink : googleLink,
                agencyVerificationResult : agencyVerificationResult
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

    openNewTab = (url, check) => {
        if (!_.isEmpty(url) && this.props.seconds !== 0 && !check) {
            window.open(process.env.REACT_APP_PLATFORM_BASE_URL + process.env.REACT_APP_WORKLOAD_MGMT_IMG_URL + '/' + url)
        }
        if (!_.isEmpty(url) && check) {
            window.open(url)
        }
    }

    handleDeleteWarning = (targetIndex) => {
        const { showDeleteWarning } = this.state;
        if (targetIndex !== undefined || targetIndex !== null) {
          this.setState({ toDeleteAttachment: targetIndex });
        }
        this.setState({ showDeleteWarning: !showDeleteWarning });
      }

    handleDeleteFile = (targetIndex) => {
        if (this.props.seconds !== 0) {
            if (I === targetIndex) {
                I--
            }

            let cardType = (this.props.cardType).toUpperCase();
            if(cardType === "CRC") {
                cardType = "DOCUMENT"
            }
            this.props.onImageDeleted(cardType, '', this.state.attachmentUrl[targetIndex].split('/').pop(), this.state.attachmentUrl[targetIndex])
            
            
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
                attachmentUrl: updatedAttachmenturl,
                showDeleteWarning: false,
                toDeleteAttachment: null,
            })
        }
    }

    handleDropdown = () => {
        let showDropdown = this.state.showDropdown;
        if(this.props.cardType === "physical_address")
        {
            // if(!this.props.isApiResponse){
                showDropdown = !showDropdown;
            // }
        }
        else showDropdown = !showDropdown;
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
        let updatedComments;
        let service = this.props.cardType ;
        if(this.props.searchType === ("in progress" && documents.includes(this.props.cardType) && !_.isEmpty(this.props.taskData.result) ) || this.props.cardType === "physical_address"  ){
            updatedComments = this.props.taskData.result && this.props.taskData.result[this.props.taskData.result.length-1].comments ? 
                                [   ...this.props.taskData.result[this.props.taskData.result.length-1].comments,
                                    this.state.selectedComment[this.props.searchType]
                                ]
                                : [this.state.selectedComment[this.props.searchType]]

        } else
        {
            updatedComments = [this.state.selectedComment[this.props.searchType]]
        }
        let result = {
                        type: this.props.taskData.service,
                        verificationResult: this.state.submitColorName.toUpperCase(),
                        comments: updatedComments,
                        attachments: this.state.attachmentUrl
                    }
        if(this.props.cardType === "address_review"){
            result = {
                type: this.props.taskData.service,
                verificationResult: this.state.submitColorName.toUpperCase(),
                comments: updatedComments,
                googleLink: this.state.googleLink
            }
        } else if (this.props.cardType === "crc") {
            result = {
                ...result,
                matched_case_details: !_.isEmpty(this.props.matched_case_details) ? this.props.matched_case_details : [],
            }
        } else if (this.props.cardType === "physical_address"){
            result = {
                ...result,
                addressObject : this.props.addressObject,
                agency : this.props.taskData.agency.agency,
                agencyVerificationResult : this.state.agencyVerificationResult
            }
            if(this.props.isManualAgency) {
                result = {
                    ...result,
                    referenceDetails : this.props.referenceDetails,
                    verificationDetails : this.props.verificationDetails
                }
            }
        } else if (this.props.cardType === "postal_address"){
            result = {
                ...result,
                agency : this.props.taskData.agency.agency,
                trackingNumber : this.props.taskData.trackingNumber,
            }
        }
        let data = {
            empId: this.props.taskData.empId,
            orgId: this.props.taskData.orgId,
            requestId: this.props.taskData.requestId,
            serviceRequestId: this.props.taskData.serviceRequestId,
            service: this.props.taskData.service,
            result: result,
            taskKey: this.props.taskData.taskKey,
            type: this.props.searchType === "closed" ? "review" : "inProgress",
            status: ["GREEN","YELLOW","RED"].includes(this.state.submitColorName) ? "done" :"inProgress"
        }
        if(this.props.cardType === "postal_address" || this.props.cardType === "physical_address"){
            data = {
                ...data,
                verificationPreference : this.props.taskData.verificationPreference
            }
        } 
        if (this.props.taskData.org_from) { data = { ...data, org_from: this.props.taskData.org_from }; }
        if (this.props.taskData.org_to) { data = { ...data, org_to: this.props.taskData.org_to }; }
        if (this.props.taskData.org_via) { data = { ...data, org_via: this.props.taskData.org_via }; }
        this.props.successNotificationHandler(this.state.prevColor,this.state.submitColorName);
        this.props.onPostDocumentTasks(data, service, this.props.taskData.serviceRequestId, this.props.addressViewType);
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
        if (this.props.cardType === "address_review") {
            if (color === "green") {
                status = "proceed for verification"
            }
            else if (color === "yellow") {
                status = "insufficient information"
            }
            else {
                status = 'select case status'
            }
            updatedSelectStatus = status;
        }
        else if (this.props.cardType === "pvc" || this.props.cardType === 'postal_address' || this.props.cardType === 'physical_address') {
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
        }
        else {
            updatedSelectStatus = color === "" ? "select case status" : color + " case";
        }
        commentBackground[this.props.searchType] = COLORS.Background[color];

        updatedMessageIcon[this.props.searchType] = COLORS.verificationIcon[color];

        updatedDropDownIcon[this.props.searchType] = COLORS.EditIcon[color];

        updatedSelectedComment[this.props.searchType] = comment;
        this.setState({
            selectedComment: updatedSelectedComment,
            showDropdown: false,
            commentBackground: commentBackground,
            verificationStatusIcon: updatedMessageIcon,
            dropdownIcon: updatedDropDownIcon,
            colorName: color,
            submitColorName: updatedSubmitColor,
            selectCaseStatus: updatedSelectStatus,
            changedColor: color,
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
        if (this.props.cardType === "address_review") {
            if (color === "green") {
                status = "proceed for verification"
            }
            else if (color === "yellow") {
                status = "insufficient information"
            }
            else {
                status = 'select case status'
            }
            updatedSelectStatus = status;
        }
        else if (this.props.cardType === "pvc" || this.props.cardType === 'postal_address' || this.props.cardType === 'physical_address') {
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
        }
        else {
            updatedSelectStatus = color === "" ? "select case status" : color + " case";
        }

        statusComment[this.props.searchType] = COLORS.Background[color];

        updatedDropDownIcon[this.props.searchType] = COLORS.EditIcon[color];

        verificationStatusIcon[this.props.searchType] = COLORS.verificationIcon[color];

        statusDropdown = !this.state.statusDropdown;

        this.setState({ 
            submitColorName: updatedSubmitColor, 
            selectCaseStatus: updatedSelectStatus, 
            statusDropdown: statusDropdown, 
            commentBackground: statusComment, 
            dropdownIcon: updatedDropDownIcon,
            verificationStatusIcon: verificationStatusIcon,
            colorName : color,
            changedColor:color
        })
    }

    handleUploadFile = (file, type) => {
        const formData = new FormData();
        let cardType = (this.props.cardType).toUpperCase();
        if (cardType === "CRC") {
            cardType = "DOCUMENT"
        }
        if (type === 'paste') {
            formData.append('file', file);
        }
        else {
            var i;
            for (i = 0; i < file.length; i++) {
                formData.append('file', file[i]);
            }
        }
        this.props.onImageAdded(cardType, formData, this.props.taskData.serviceRequestId);
    }

    googleLinkHandler = (value) => {
        this.setState({ googleLink: value });
    }

    handleError = (error, inputField) => {
        const currentErrors = _.cloneDeep(this.state.errors);
        let updatedErrors = _.cloneDeep(currentErrors);
        if (!_.isEmpty(error)) {
            updatedErrors[inputField] = error;
        }
        else {
            delete updatedErrors[inputField];
        }
        if (!_.isEqual(updatedErrors, currentErrors)) {
            this.setState({ errors: updatedErrors });
        }
    };

    enableSubmitHandler = () => {
        if(this.state.selectCaseStatus === "select case status")
            return false;
        if (this.props.searchType === "closed" && (this.state.selectedComment["closed"] === "add comment" || this.state.selectedComment["in progress"] === this.state.selectedComment["closed"])) {
            return false;
        } 
        if(this.props.cardType === "physical_address"  && !this.props.enableSubmit)
        // && this.props.isApiResponse 
            return false;
        else return true;
    }

    handleDownload = (url) => {
        this.props.downloadAttachment(url)
    }

    handleActivityMessage(activity){
        let message = "";
        if(activity.type && !_.isEmpty(activity.type) ) {
            message = this.props.cardType === "employment" ? " sent to " + activity.sendTo + " on " : "sent on" ; 
            message = activity.type.toLowerCase() + " " + message;
        } 
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
                            )} disabled={this.props.seconds === 0}>
                            <img src={attach} height='12px' alt='attach'/>&ensp;{_.isEmpty(attachment.name) ? '' : this.shortenDisplayName(attachment.name)}
                        </span>
                        {this.props.searchType === 'closed' ? null
                        : (
                            <img
                            src={removeAttachment}
                            height="10px"
                            className={cx('ml-4', styles.hoverHand)}
                            alt="attach"
                            onClick={attachment.manualReview
                                ? () => this.handleDeleteWarning(attachmentIndex)
                                : () => this.handleDeleteFile(attachmentIndex)}
                            disabled={this.props.seconds === 0}
                            />
                        )}
                        {/* {attachment.manualReview || this.props.searchType === "closed" ? null :
                            <img src={removeAttachment} height='10px' className={cx('ml-4', styles.hoverHand)} alt='attach' onClick={() => this.handleDeleteFile(attachmentIndex)} disabled={this.props.seconds === 0} /> 
                        */}
                    </label>
                )
            }
            else return null;
        }) : null

        return(
            <div>
                <label className={cx(styles.smallLabel, "mb-0")}>{t('translation_docVerification:commentsSection.comments')}</label>
                <div className='mt-2 d-flex flex-column'>
                    {/* mail/Sms activity information */}
                    {!_.isEmpty(this.props.taskData.activity) ?
                        <div className="row no-gutters mb-1">
                            {this.props.taskData.activity.map((activity,index) => {
                                return (
                                    !_.isEmpty(activity.type)
                                    ?   <label key={index} className={cx('pl-2 mr-2', styles.CommentBackground)}>
                                            <img src={commentIcon} alt='comment' />&ensp;
                                        {this.handleActivityMessage(activity)}
                                        </label>
                                    :   ""
                                )
                            })}
                        </div>
                    :null}

                    {( (!_.isEmpty(this.props.taskData)  && documents.includes(this.props.cardType)) || this.props.cardType === "physical_address" ) && this.props.taskData.result?
                        <div className='row no-gutters mb-1'>
                            {this.props.taskData.result[this.props.taskData.result.length-1].comments ? 
                                this.props.taskData.result[this.props.taskData.result.length-1].comments
                                    .map((comment, index) => {
                                            return (
                                                comment !== "" ? 
                                                <label key={index} className={cx('pl-2 mr-2', this.props.seconds !== 0 ? styles.CommentBackground : styles.CommentBackgroundInactive)}>
                                                    <img src={commentIcon} alt='comment' />&ensp;
                                                    {comment}
                                                </label> : null
                                            ) 
                                        })
                            : null}
                            
                        </div> : null 
                    }
                    {/* comments */}
                    <div>
                        {this.state.selectedComment["in progress"] !== ''  ? 
                            <label className={this.state.selectedComment["in progress"] === 'add comment' ? cx(styles.Background, 'mb-1',this.props.searchType === "in progress") : cx(styles.Background, 'mb-1', this.state.commentBackground["in progress"])} 
                            onClick={this.props.searchType === "in progress"  ? this.handleDropdown : null}>
                                <img className={this.state.selectedComment["in progress"] === 'add comment' ? cx(styles.addCommentImg) : null} src={this.state.verificationStatusIcon["in progress"]} height='12px' alt='plus' />
                                <span className='mt-1'>&ensp;{this.state.selectedComment["in progress"]} &ensp;</span>
                                {this.props.searchType === "in progress" 
                                    // ? this.props.cardType === "physical_address" && this.props.isApiResponse
                                    //     ? null
                                        ? <img src={this.state.dropdownIcon["in progress"]} style={this.state.dropdownIcon["in progress"] === inactiveDropdown ? { float: "right", marginTop: ".35rem" } : { float: "right", marginTop: ".2rem" }} alt='dropdown' />
                                    : null
                                }    
                            </label> 
                        : null }
                    </div>
                    {/* closed task ---- to be added comments */}
                    <div>
                        {this.props.searchType === "closed" && !["address_review","postal_address","physical_address"].includes(this.props.cardType) ?
                            <label className={this.state.selectedComment["closed"] === 'add comment'? cx(styles.Background, 'mb-1') : cx(styles.Background, 'mb-1', this.state.commentBackground["closed"])} onClick={this.handleDropdown}>
                                <img className={this.state.selectedComment["closed"] === 'add comment' ? cx(styles.addCommentImg) : null} src={this.state.verificationStatusIcon["closed"]} height='12px' alt='plus' />
                                <span className='mt-1'>&ensp;{this.state.selectedComment["closed"]} &ensp;</span>
                                <img src={this.state.dropdownIcon["closed"]} style={this.state.dropdownIcon["closed"] === inactiveDropdown ? { float: "right", marginTop: ".35rem" } : { float: "right", marginTop: ".2rem" }} alt='dropdown' />
                            </label> 
                            : null
                        }
                    </div>
                    {/* comments modal */}
                    {this.state.showDropdown && this.props.seconds !== 0 && (_.isEmpty(this.props.taskData.doc) || (!_.isEmpty(this.props.taskData.doc) && this.props.seconds !== '' ))?
                        <Modal
                            comments={this.props.comments}
                            toggle={this.handleDropdown}
                            submitData={this.getCommentData}
                            dropdownOption={this.state.selectedComment[this.props.searchType]}
                        /> : null
                    }
                    <div className='row no-gutters my-1' style={{position:"relative"}}>
                        {/* google link for address review */}
                        {this.props.cardType === "address_review" ? 
                            <div className="d-flex flex-column" style={{width:"60%"}}>
                                <span className={cx(styles.smallLabel,"mb-0 mt-2")}>{t('translation_docVerification:commentsSection.link')}</span>
                                <Input
                                    name='googleLink'
                                    className='pl-0 pb-0'
                                    label=""
                                    type='text'
                                    placeholder={t('translation_docVerification:commentsSection.linkPlaceholder')}
                                    required={false}
                                    disabled = {this.props.searchType === "closed"}
                                    value={this.state.googleLink}
                                    onChange={(value) => this.googleLinkHandler(value)}
                                    validation={validation['googleLink']}
                                    message={message['googleLink']}
                                    errors={this.state.errors['googleLink']}
                                    onError={(error) => this.handleError(error, 'googleLink')}
                                />
                            </div>
                        :
                            // attachments 
                            <React.Fragment>
                                {["postal_address","physical_address"].includes(this.props.cardType) && this.props.searchType === "closed"
                                    ? ""
                                    : <PasteUpload
                                        uploadFile={(file, type) => this.handleUploadFile(file, type)}
                                        seconds={this.props.seconds}
                                        showModal = {this.props.seconds !== 0 && (_.isEmpty(this.props.taskData.doc) || (!_.isEmpty(this.props.taskData.doc) && this.props.seconds !== ''))}
                                        disabled = {this.props.addAttachmentType === "CRC" || this.props.addAttachmentType === "" ? false : this.props.attachmentUrlState === 'LOADING' ? true : false}
                                    />
                                }
                                {attachmentList}
                            </React.Fragment> 
                        }

                        {this.state.selectedComment["in progress"] !== 'add comment' ?
                            <span className={cx('ml-auto mt-auto')} disabled={(this.props.seconds === 0)} ref={node => { this.dropdownNode = node; }}>
                                <label className={cx(COLORS.caseBackground[this.state.colorName], 'd-flex flex-row justify-content-between')}>
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
                                                src={COLORS.dropdown[this.state.colorName]}
                                                alt='arrow'
                                            />
                                            : null} &emsp;&emsp;
                                        <img onClick={!(this.enableSubmitHandler()) ? null : this.handleSubmit}
                                            className={cx(styles.imgClose)}
                                            src={!(this.enableSubmitHandler()) ? inactiveStatus : activeStatus}
                                            alt='status'
                                        />
                                    </span>
                                </label>
                            </span>
                        : ''}

                        {this.state.showDeleteWarning
                        ? (
                        <WarningPopUp
                            text="are you sure you want to delete?"
                            para="this image has been attached by bot and this action cannot be undone"
                            confirmText="yes, delete"
                            cancelText="cancel"
                            icon={warn}
                            warningPopUp={() => this.handleDeleteFile(this.state.toDeleteAttachment)}
                            closePopup={this.handleDeleteWarning}
                        />
                        ) : null}
                        
                        { //manually select a case - dropdown below
                            <StatusDropdown
                                statusType={this.props.cardType === "address_review" ? StatusDropdownOptions.addressComments : this.props.comments}
                                className={styles.dropdownStatus}
                                showDropdown={this.state.statusDropdown}
                                disabled={this.props.seconds === 0 ? true : false}
                                changed={(selectedOption, color) => this.handleStatusClick(selectedOption, color)}
                            />
                        }
                    </div>
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
        postDocumentTasksState: state.workloadMgmt.DocVerification.postDocumentTasksState,
        comments: state.workloadMgmt.DocVerification.Comments,
        downloadAttachmentState: state.workloadMgmt.attachmentUrl.downloadAttachmentState
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onPostDocumentTasks: (data, service,requestId, addressViewType) => dispatch(docVerificationActions.postDocumentTasks(data, service,requestId, addressViewType)),
        onImageAdded: (type, formData, serviceRequestId) => dispatch(actions.addImage(type, formData, serviceRequestId)),
        attachmentInitialState: () => dispatch(actions.initialState()),
        onImageDeleted: (type, dataId, fileName, url) => dispatch(actions.deleteImage(type, dataId, fileName, url)),
        downloadAttachment: (url) => dispatch(actions.downloadAttachment(url))
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(CommentsSection));
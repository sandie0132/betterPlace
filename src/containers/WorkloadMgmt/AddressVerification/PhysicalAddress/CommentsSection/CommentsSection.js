import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import cx from 'classnames';
import styles from './CommentsSection.module.scss';
import themes from '../../../../../theme.scss';

import commentIcon from '../../../../../assets/icons/comment.svg';
import activeStatus from '../../../../../assets/icons/activeStatus.svg';
import inactiveStatus from '../../../../../assets/icons/inactiveStatus.svg';
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

import Modal from '../../../ServiceVerification/TaskSearchCloseReview/TaskCloseReview/CommentsSection/VerificationModal/VerificationModal';
import StatusDropdown from '../../../ServiceVerification/TaskSearchCloseReview/TaskCloseReview/CommentsSection/StatusDropdown/StatusDropdown';
import { withTranslation } from 'react-i18next';

// const COLORS = {
//     verificationIcon: { 'green': greenOption, 'yellow': yellowOption, 'red': redOption, '': chatIcon, 'reassign_case': chatIcon },
//     dropdown: { 'green': greenDown, 'yellow': yellowDown, 'red': redDown, '': inactiveDropdown, 'reassign_case': inactiveDropdown },
//     EditIcon: { 'green': greenEdit, 'yellow': yellowEdit, 'red': redEdit, '': inactiveDropdown, 'reassign_case': inactiveDropdown },
//     Background: { 'green': styles.greenBackground, 'yellow': styles.yellowBackground, 'red': styles.redBackground, '': styles.Background, 'reassign_case': styles.Background },
//     caseBackground: { 'green': styles.greenStatus, 'yellow': styles.yellowStatus, 'red': styles.redStatus, '': styles.selectStatus, 'reassign_case': styles.selectStatus }
// }

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
        changedColor: '',
        setAttachmentUrl: false,
        addressObject : {},
        showSelectStatusIcon : false,
        agencyVerificationResult : ""
    }

    componentDidMount = () => {
        let obj, verificationResult, agencyVerificationResult;
        let updatedComment = this.state.selectedComment;
        let commentBackground = this.state.commentBackground;
        let verificationStatusIcon = this.state.verificationStatusIcon;

        if (!_.isEmpty(this.props.taskData) && !_.isEmpty(this.props.taskData.result)) {
            obj = !_.isEmpty(this.props.taskData.result) ? this.props.taskData.result[this.props.taskData.result.length - 1] : '';
            if (obj.verificationResult) {
                updatedComment = this.handleDefaultStyles(obj.verificationResult.toLowerCase(), 'result'); //obj.verificationResult === 'REASSIGN_CASE' ? "reassign case" : obj.verificationResult.replace(/_/g, " ").toLowerCase() + " case";
                verificationStatusIcon = this.handleDefaultStyles(obj.verificationResult.toLowerCase(), 'verificationIcon');//COLORS.verificationIcon[obj.verificationResult.toLowerCase()];
                commentBackground = this.handleDefaultStyles(obj.verificationResult.toLowerCase(), 'Background');//COLORS.Background[obj.verificationResult.toLowerCase()];
                verificationResult = obj.verificationResult;
                agencyVerificationResult = obj.agencyVerificationResult
            }
        }

        // let updatedStatus = !_.isEmpty(verificationResult) ?
        //     (verificationResult === 'REASSIGN_CASE' ? "reassign case"
        //         : verificationResult.toLowerCase() + ' case')
        //     : 'select case status'
        let updatedStatus = !_.isEmpty(verificationResult) ?
            this.handleDefaultStyles(verificationResult.toLowerCase(), 'result')
            : 'select case status'

        this.setState({
            selectedComment: updatedComment,
            commentBackground: commentBackground,
            verificationStatusIcon: verificationStatusIcon,
            colorName: !_.isEmpty(verificationResult) ? verificationResult.toLowerCase() : '',
            submitColorName: !_.isEmpty(verificationResult) ? verificationResult.toLowerCase() : '',
            selectCaseStatus: updatedStatus,
            agencyVerificationResult: agencyVerificationResult
        })
    }

    shortenDisplayName = (displayName) => {
        if (displayName.length > 12) {
            const updatedDisplayName = displayName.substring(0, 6) + '...';
            return (updatedDisplayName);
        }
        return (displayName);
    }

    handleDropdown = () => {
        if(this.props.showModal) {
            let showDropdown = this.state.showDropdown;
            showDropdown = !showDropdown;
            this.setState({ showDropdown: showDropdown})
        }
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
        let updatedComments = this.props.taskData.result && this.props.taskData.result[this.props.taskData.result.length-1].comments ? 
                                [   ...this.props.taskData.result[this.props.taskData.result.length-1].comments,
                                    this.state.selectedComment
                                ]
                                : [this.state.selectedComment];
        this.props.handleSubmit(updatedComments, this.state.submitColorName.toUpperCase());
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
            changedColor: color,
            showSelectStatusIcon : showSelectStatusIcon
        })
        this.props.handleMandatory(updatedSelectStatus);
    }

    handleStatusClick = (selectedOption, color) => {
        let updatedDropDownIcon = this.state.dropdownIcon;
        let verificationStatusIcon = this.state.verificationStatusIcon;
        let statusComment=this.state.commentBackground, statusDropdown;
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
            colorName: color,
            changedColor: color
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
        this.props.onImageAdded('physical_address', formData, this.props.taskData.serviceRequestId);
    }

    enableSubmitHandler = () => {
        if (this.state.selectCaseStatus === "select case status")
            return false;
        if (this.props.attachmentUrlState === 'LOADING' || this.props.disabled){
            return false;
        }
        if(this.state.selectCaseStatus === "green case") {
            return this.props.enableSubmit 
        }
        else return true;
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

    render () {
        const { t } = this.props;
        return(
            <div>
                <label className={cx(styles.smallLabel, "mb-0")}>{t('translation_addressTaskClosure:comments')}</label>
                <div className='mt-2 d-flex flex-column'>
                    {!_.isEmpty(this.props.taskData.result) ? 
                        <div className='row no-gutters mb-1'>
                            {this.props.taskData.result[this.props.taskData.result.length-1].comments ? 
                                this.props.taskData.result[this.props.taskData.result.length-1].comments
                                    .map((comment, index) => {
                                            return (
                                                comment !== "" ? 
                                                <label key={index} className={cx('pl-2 mr-2', this.props.seconds !== 0 ? styles.CommentBackground : styles.CommentBackgroundInactive)}><img src={commentIcon} alt='' />&ensp;
                                                    {comment}
                                                </label> : null
                                            ) 
                                        })
                            : null}
                        </div> 
                    : null}

                    {/* comments */}
                    {!this.props.disabled ?
                        <React.Fragment>
                            <div>
                                {this.state.selectedComment !== ''  ? 
                                    <label className={this.state.selectedComment === 'add comment' ? cx(styles.Background, 'mb-1') : cx(styles.Background, 'mb-1', this.state.commentBackground)} onClick={this.handleDropdown}>
                                        <img className={this.state.selectedComment === 'add comment' ? cx(styles.addCommentImg) : null} 
                                            src={this.state.verificationStatusIcon} height='12px' alt='' 
                                        />
                                        <span className='mt-1'>&ensp;{this.state.selectedComment} &ensp;</span>
                                        {this.props.showModal ? 
                                            <img style={this.state.dropdownIcon === inactiveDropdown ? { float: "right", marginTop: ".35rem" } : { float: "right", marginTop: ".2rem" }} 
                                                alt='' src={this.state.dropdownIcon}/>
                                        : ""}
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
                            /> : null
                        }
                        <div className='row no-gutters my-1' style={{position:"relative"}}>
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
                                            <img onClick={!(this.enableSubmitHandler()) ? null : (this.props.postTaskState === 'LOADING' ? null : this.handleSubmit)}
                                                className={cx(styles.imgClose)}
                                                src={!(this.enableSubmitHandler()) ? inactiveStatus : activeStatus}
                                                alt=''
                                            />
                                        </span>
                                    </label>
                                </span>
                            : ''}
                            
                            { //manually select a case - dropdown below
                                <StatusDropdown
                                    statusType={this.props.comments}
                                    className={styles.dropdownStatus}
                                    showDropdown={this.state.statusDropdown}
                                    changed={(selectedOption, color) => this.handleStatusClick(selectedOption, color)}
                                />
                            }
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
        comments: state.workloadMgmt.DocVerification.Comments,
        postTaskState: state.workloadMgmt.addressVerification.physicalAddress.postIndividualTaskState
    }
}

export default withTranslation()(connect(mapStateToProps, null)(CommentsSection));
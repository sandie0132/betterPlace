import React, { Component } from "react";
import cx from 'classnames';
import styles from "./VerifyLink.module.scss"
import sampleDP from "../../../assets/icons/defaultPic.svg";
// import phone from '../../../assets/icons/phone.svg';
import location from '../../../assets/icons/locationIcon.svg';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from '../Store/action';
import downloadCertificate from '../../../assets/icons/downloadCertificate.svg';
import idCardMini from '../../../assets/icons/idCardMini.svg';
import securityGuard from '../../../assets/icons/securityGuard.svg';

class InfoCard extends Component {

    state = {
        enableSubmit: false,
        submitData: {},
        defaultRole:"",
        defaultLocation:"",
        profilePicUrl: null
    }

    componentDidMount=()=>{
        let profilePicUrl = '';
        let defaultRole="", defaultLocation="";
        if(!_.isEmpty(this.props.data)){
              if(this.props.type==='employment'){profilePicUrl = this.props.data.profilePicUrl}
              else if(this.props.type==='reference'){profilePicUrl = this.props.data.profilePicUrl}
              else{profilePicUrl = this.props.data.profilePicUrl}
              defaultRole = this.props.data.defaultRole;
              defaultLocation = this.props.data.defaultLocation;
        }
        this.setState({profilePicUrl: profilePicUrl , defaultRole: defaultRole, defaultLocation: defaultLocation})
    }

    componentDidUpdate=(prevProps)=>{
        if(this.props.data!==prevProps.data){
            let profilePicUrl = '';
            let defaultRole="", defaultLocation="";
            if(!_.isEmpty(this.props.data)){
                if(this.props.type==='employment'){profilePicUrl = this.props.data.employment.profilePicUrl}
                else if(this.props.type==='reference'){profilePicUrl = this.props.data.reference.profilePicUrl}
                else{profilePicUrl = this.props.data.education.profilePicUrl}

                defaultRole = this.props.data.defaultRole;
                defaultLocation = this.props.data.defaultLocation;

               
          }
          this.setState({profilePicUrl: profilePicUrl, defaultRole: defaultRole, defaultLocation: defaultLocation})
        }

    }

    handleSetName = (data) => {
        let name = '';
        if (!_.isEmpty(data)) {
            if (data.service === "EMPLOYMENT") { name = data.fullName; }
            else if (data.service === "EDUCATION") { name = data.fullName; }
            else { name = data.fullName; }
        }
        return name;
    }


    handleRadioButtonInput = (fieldName, value) => {
        let typeData = _.cloneDeep(this.state.submitData);
        let enableSubmit = this.state.enableSubmit;
        typeData[fieldName] = value;
        if (fieldName === 'isReferenceTrue') {
            enableSubmit = true;
        }
        this.setState({ submitData: typeData, enableSubmit: enableSubmit })
    }

    handleRadioButtonChecked = (fieldName, value) => {
        let typeData = _.cloneDeep(this.state.submitData);
        if (!_.isEmpty(typeData[fieldName])) {
            if (typeData[fieldName] === value) {
                return true;
            }
        }
        return false;
    }

    radioButtonStyle = (fieldName, value) => {
        let typeData = _.cloneDeep(this.state.submitData)
        if (!_.isEmpty(typeData[fieldName])) {
            if (typeData[fieldName] === value) {
                return (cx(styles.RadioButtonContainer, styles.RadioButtonActiveContainer, styles.checkBoxText, styles.smallRadioWidth))
            }
        }
        return (cx(styles.RadioButtonContainer, styles.checkBoxText, styles.smallRadioWidth))
    }

    radioButtonTextStyle = (fieldName, value) => {
        let typeData = _.cloneDeep(this.state.submitData)
        if (!_.isEmpty(typeData[fieldName])) {
            if (typeData[fieldName] === value) {
                return (styles.LabelActive)
            }
        }
        return (styles.LabelDisabled)
    }

    handleSubmitData = () => {
        let result = _.cloneDeep(this.state.submitData);
        result.type = this.props.data.service;
        if (this.props.type === 'reference' && this.state.submitData.isReferenceTrue === 'yes') {
            result.verificationResult = "GREEN"
        }
        else { result.verificationResult = "RED" }
        result.attachments = [];
        result.manualReview = false;

        let submitData = {}
        submitData.result = result;
        let refId = window.location.href.split('=')[1];
        this.props.putRefIdDetails(refId,this.props.type,submitData)

    }


    render() {
        let type = this.props.type;
        return (
            <div className={cx(styles.infoCard, styles.infoContainer)}>
                <div className="d-flex flex-row py-4">
                    <div className="col-3" style={{textAlign:"center"}}>
                        <img 
                            src={sampleDP} 
                            alt="sample dp" className={styles.infoProfilePic} 
                        />
                    </div>
                    <div className="d-flex flex-column col-9">
                        <div><label className={styles.infoHeading}>{this.handleSetName(this.props.data)}</label></div>
                        {type === 'employment' ?
                            <React.Fragment>
                                <div className={styles.infoLineContainer}><img src={securityGuard} alt="" style={{ paddingRight: '0.8rem' }} /><label className={styles.infoSecondHeading}>ex - {this.props.data.employment.designation}&nbsp;@&nbsp;{this.props.data.employment.organisation}</label></div>
                                {this.props.data.employment.employeeId ? <div className={styles.infoLineContainer}><img src={idCardMini} alt="" style={{ paddingRight: '0.8rem' }} /><label className={styles.infoSecondHeading}>emp id {this.props.data.employment.employeeId}</label></div> : null}
                            </React.Fragment>
                            : type === 'education' ?
                                <React.Fragment>
                                    <div className={styles.infoLineContainer}><label className={styles.infoSecondHeading}>{"diploma"} in {"computer science"}</label></div>
                                    <div className={styles.infoLineContainer}><label className={styles.infoSecondHeading}>{"2011"}-{"2013"} batch</label></div>
                                    <div className={styles.infoLineContainer}><img src={downloadCertificate} alt="" style={{ paddingRight: '0.8rem' }} /></div>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <div className={styles.infoLineContainer}><img src={securityGuard} alt="" style={{ paddingRight: '0.8rem' }} /><label className={styles.infoSecondHeading}>{!_.isEmpty(this.state.defaultRole)? this.state.defaultRole +" @ "+this.props.data.orgName: this.props.data.orgName}</label></div>
                                    <div className="mr-auto">
                                        <hr className={cx(styles.bottomLine, "mt-2 mb-0")} style={{ width: '15.75rem' }} />
                                    </div>
                                  {this.state.defaultLocation? <div className={styles.infoLineContainer}><img src={location} alt="" style={{ paddingRight: '0.8rem' }} /><label className={styles.infoSecondHeading}>{this.state.defaultLocation}</label></div> :""}
                                    {/* <div className={styles.infoLineContainer}><img src={phone} alt="" style={{ paddingRight: '0.8rem' }} /><label className={styles.infoSecondHeading}>{this.props.data.reference.mobile}</label></div> */}

                                </React.Fragment>
                        }
                    </div>

                </div>
                {type === 'reference' ?
                    <div className={cx(styles.cardPadding, "pt-0")}>
                        <div className="d-flex flex-column">
                            <label className={styles.verifyLabel}>do you know {this.props.data.fullName} ?</label>
                            <div className="d-flex flex-row mt-3">
                                <div
                                    className={this.radioButtonStyle('isReferenceTrue', 'yes')} onClick={() => this.handleRadioButtonInput('isReferenceTrue', 'yes')}>
                                    <span className={this.radioButtonTextStyle('isReferenceTrue', 'yes')}>{"yes"}</span>
                                    <input className={styles.RadioButton} type='radio' disabled={false} name='isReferenceTrue' value="yes"
                                        onChange={() => this.handleRadioButtonInput('isReferenceTrue', 'yes')} checked={this.handleRadioButtonChecked('isReferenceTrue', 'yes')} />
                                </div>

                                <div
                                    className={cx(this.radioButtonStyle('isReferenceTrue', 'no'), "ml-1")} onClick={() => this.handleRadioButtonInput('isReferenceTrue', 'no')}>
                                    <span className={this.radioButtonTextStyle('isReferenceTrue', 'no')}>{"no"}</span>
                                    <input className={styles.RadioButton} type='radio' disabled={false} name='isReferenceTrue' value="no"
                                        onChange={() => this.handleRadioButtonInput('isReferenceTrue', 'no')} checked={this.handleRadioButtonChecked('isReferenceTrue', 'no')} />

                                </div>

                            </div>
                        </div>
                        <div style={{ marginTop: '2.5rem' }}>
                            <button
                                className={this.state.enableSubmit ? styles.ActiveButton : styles.DisabledButton}
                                onClick={this.handleSubmitData}
                                disabled={!this.state.enableSubmit}
                            >submit</button>
                        </div>
                    </div> : null}

            </div>
        )
    }

}

const mapDispatchToProps = dispatch => {
    return {
        putRefIdDetails: (refId, type, submitData) => dispatch(actions.putRefIdDetails(refId, type, submitData)),
    }
}



export default connect(null, mapDispatchToProps)(InfoCard);
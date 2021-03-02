import React, { Component } from "react";
import cx from 'classnames';
import { connect } from 'react-redux';
import VerifyLink from '../SendLinkTmplt/VerifyLink/VerifyLink';
import styles from './SendLinkTmplt.module.scss';
import { withRouter } from "react-router";
import BPlaceLogo from '../../assets/icons/betterplaceLogo.svg';
import success from '../../assets/icons/largeSuccessTick.svg';
import * as actions from './Store/action';
import _ from 'lodash';


class SendLink extends Component {

    state = {
        refId: '',
        type: '',
        defaultRole:''
    }

    componentDidMount = () => {
        document.getElementsByTagName('body')[0].style = 'min-width:0; min-height: 0;'
        let refId = window.location.href.split('=')[1];
        let a = window.location.href.split('/validate?')[0];

        let type = a.split("/").pop();
        this.setState({ refId: refId, type: type })
        this.props.isRefIdValid(refId, type);
        
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.refIdValidState !== prevProps.refIdValidState && this.props.refIdValidState === "SUCCESS") {
            if (this.props.refIdValid === true) {
                this.props.getRefIdDetails(this.state.refId, this.state.type);
            }
        }

        if(this.props.tagDetailsState!==prevProps.tagDetailsState && this.props.tagDetailsState==="SUCCESS"){
            let defaultRole="";
            if(!_.isEmpty(this.props.tagDetails)){
                _.forEach(this.props.tagDetails, function(value,key){
                    if(value.category==='functional'){
                        defaultRole=value.name
                    }
                   
                })
            }
            this.setState({defaultRole: defaultRole})
        }

        


    }

    componentWillUnmount = () => {
        document.getElementsByTagName('body')[0].style = 'min-width:1024px; min-height: 768px;'
    }

    handleSubmitUserName=()=>{
        let userName = '';
        let refIdDetails = _.cloneDeep(this.props.refIdDetails)
        if(this.state.type==='employment'){
            let refId = window.location.href.split('=')[1];
            if(refId===refIdDetails.hrRefId){ userName = refIdDetails.employment.hrName}
            else if(refId===refIdDetails.managerRefId){ 
                if(!_.isEmpty(refIdDetails.employment.reportingManagerName)){ userName = refIdDetails.employment.reportingManagerName }
                else{ userName = 'manager' } 
            }
        }
        else if(this.state.type==='reference'){ userName = this.props.refIdDetails.reference.name}

        return userName;
    }

    render() {
        let type = this.state.type;
      //  console.log(this.props.refIdDetails);
        
      
        return (
            <div className={cx(styles.Body, 'd-flex justify-content-center ')} style={{maxWidth:"100vw"}}>
                <div className="col px-0 no-gutters d-flex flex-column">
                    <div className={cx(styles.pageHeader, "pl-3")}>
                        <img src={BPlaceLogo} alt='' className={styles.bpssLogo}></img>
                    </div>

                    {this.props.refIdValidState === "SUCCESS" ?
                        this.props.refIdValid === false ?
                            <div className="d-flex flex-column" style={{ height: "100vh", textAlign: 'center' }}>
                                <div className="mt-5">
                                    <label className={styles.SuccessLabel}>your reference ID is expired/invalid. Please check again !</label>
                                </div>
                            </div>

                            :

                            this.props.refIdValid === true && this.props.putRefIdDetailsState === "SUCCESS" ?

                                <div className="d-flex flex-column" style={{ height: "100vh", textAlign: 'center' }}>
                                    <div style={{ marginTop: '152px' }}>
                                        <img src={success} alt="success"></img>
                                    </div>
                                    <div>
                                        <label className={styles.SuccessLabel}> {this.handleSubmitUserName()} your suggestion has been successfully sent !</label>
                                    </div>

                                </div>

                                : ((this.props.putRefIdDetailsState === 'LOADING' || this.props.putRefIdDetailsState === 'INIT') && this.props.getRefIdDetailsState === "SUCCESS") ?


                                    <React.Fragment>
                                        {type === 'education' ?

                                            <div className={cx("d-flex flex-column pt-4 px-3 pb-4", styles.HeadingContainer)}>
                                                <h2 className={styles.Header}>education verification</h2>
                                                <div className="mt-3 mx-auto " style={{ maxWidth: '768px' }} >
                                                    <span className={styles.SubHeading}>hello mr. singh,<br /><span className={styles.SubHeadingBold}>mr. ramesh solanki</span> mentioned he completed <span className={styles.SubHeadingBold}>diploma</span> in computer science at <span className={styles.SubHeadingBold}>ramayan education intitution</span>
                                                        <br />please confirm below information for background verification by <span className={styles.SubHeadingBold}>betterplace</span></span>
                                                </div>

                                            </div>

                                            : type === 'employment' ?
                                                <div className={cx("d-flex flex-column pt-4 px-3 pb-4", styles.HeadingContainer)}>
                                                    <h2 className={styles.Header}>employment verification</h2>
                                                    <div className="mt-3 mx-auto " style={{ maxWidth: '768px' }} >
                                                        <span className={styles.SubHeading}>hello {this.handleSubmitUserName()},<br /><span className={styles.SubHeadingBold}> {this.props.refIdDetails.fullName}</span> mentioned he worked in 
                                                        <span className={styles.SubHeadingBold}> {this.props.refIdDetails.employment.organisation}</span>
                                                        &nbsp;please confirm below information for background verification by <span className={styles.SubHeadingBold}>betterplace</span></span>
                                                    </div>

                                                </div>
                                                :
                                                <div className={cx("d-flex flex-column pt-4 px-3 pb-4", styles.HeadingContainer)}>
                                                    <h2 className={styles.Header}>reference verification</h2>
                                                    <div className="mt-3 mx-auto " style={{ maxWidth: '768px' }} >
                                                        <span className={styles.SubHeading}>hello {this.handleSubmitUserName()},
                                                             you have been mentioned as {this.props.refIdDetails.reference.relationship.toLowerCase()} of  {this.props.refIdDetails.fullName.toLowerCase()} currently working in {this.props.refIdDetails.orgName.toLowerCase()} 
                                                             {_.isEmpty(this.state.defaultRole)?"": " as "+this.state.defaultRole.toLowerCase()}
                                                                .&nbsp;please confirm the information below for background verification by betterplace.</span>
                                                    </div>

                                                </div>}

                                        <VerifyLink
                                            type={this.state.type}
                                            data={this.props.refIdDetails}
                                        />
                                    </React.Fragment>

                                    : null
                        : null}

                </div>


            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        refIdValid: state.verification.refIdValid,
        refIdValidState: state.verification.refIdValidState,
        refIdDetails: state.verification.getRefIdDetails,
        getRefIdDetailsState: state.verification.getRefIdDetailsState,
        putRefIdDetailsState: state.verification.putRefIdDetailsState,
        tagDetails: state.verification.tagDetails,
        tagDetailsState: state.verification.getTagDetailsState

    }
}

const mapDispatchToProps = dispatch => {
    return {
        isRefIdValid: (refId, type) => dispatch(actions.refIdValidity(refId, type)),
        getRefIdDetails: (refId, type) => dispatch(actions.getRefIdDetails(refId, type)),
        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SendLink));
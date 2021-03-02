import React, { Component } from 'react';
import styles from "./EmpDocuments.module.scss";

import _ from 'lodash';
import cx from 'classnames';

import DrivingLicense from './DrivingLicense/DrivingLicense';
import Passport from './Passport/Passport';
import VoterCard from './VoterCard/VoterCard';
import AadhaarCard from './AadhaarCard/Aadhaar';
import PanCard from './PanCard/PanCard';
import VehicleRegistration from './VehicleRegistration/VehicleRegistration';

import { sectionFieldMapping } from '../../Store/fieldMapping';


class EmpDocuments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            documents: [],
            isEdited: false,
            errors: {}
        };
        this._isMounted = false;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.data !== prevProps.data) {
            if (!_.isEmpty(this.props.data)) {
                this.setState({ documents: this.props.data })
            } else {
                this.setState({ documents: [] })
            }
        }

        if (!_.isEqual(prevProps.errors, this.props.errors)) {
            if (!_.isEqual(this.props.errors, this.state.errors)) {
                let updatedErrors = {};
                if (!_.isEmpty(this.props.errors)) {
                    updatedErrors = _.cloneDeep(this.props.errors);
                }
                this.setState({
                    errors: updatedErrors
                });
            }
        }

        // if (!_.isEqual(prevState.documents, this.state.documents) & this.state.isEdited) {
        //     this.props.onChange(this.state.documents)
        // }

        if (!_.isEqual(prevState.errors, this.state.errors)) {
            this.props.onError(this.state.errors);
        }

        if (this.props.isEdited !== prevProps.isEdited) {
            this.setState({ isEdited: this.props.isEdited })
        }
    }

    handleDocumentData = (documents, type) => {
        let returnDoc = {};
        _.forEach(documents, function (doc, index) {
            if (doc.type === type) { returnDoc = doc }
        })
        return returnDoc;
    }

    getDocumentDataFromChild = (data, type) => {
        let updatedDocuments = _.cloneDeep(this.state.documents);
        let noMatch = true;

        let isDataEmpty = this.isEmptyIdCard(data);

        if (!isDataEmpty) {
            _.forEach(updatedDocuments, function (doc, index) {
                if (doc.type === type) { updatedDocuments[index] = data; noMatch = false }
            })

            if (noMatch) {
                updatedDocuments.push(data);
            }
        }else{
            _.remove(updatedDocuments, function(id){
                return id.type===type;
            })
        }
        this.setState({ documents: updatedDocuments, isEdited: true }, ()=> this.props.onChange(this.state.documents))
    }

    isEmptyIdCard = (data) => {
        let isEmpty = true;
        let allFields = {};

        if(data.type==="DL") { allFields = [...sectionFieldMapping['additionalDetails']['governmentIds']['DL']['allFields']]}
        else if(data.type==="RC") { allFields = [...sectionFieldMapping['additionalDetails']['governmentIds']['RC']['allFields']]}
        else if(data.type==="VOTER") { allFields = [...sectionFieldMapping['additionalDetails']['governmentIds']['VOTER']['allFields']]}
        else if(data.type==="AADHAAR") { allFields = [...sectionFieldMapping['additionalDetails']['governmentIds']['AADHAAR']['allFields']]}
        else if(data.type==="PASSPORT") { allFields = [...sectionFieldMapping['additionalDetails']['governmentIds']['PASSPORT']['allFields']]}
        else if(data.type==="PAN") { allFields = [...sectionFieldMapping['additionalDetails']['governmentIds']['PAN']['allFields']]}

        _.forEach(allFields, function(field){
            if(!_.isEmpty(data[field])){
                isEmpty = false
            }
        })

        return isEmpty;

    }

    handleStoreErrorInState = (section, error) => {
        const currentErrors = _.cloneDeep(this.state.errors);
        let updatedErrors = _.cloneDeep(currentErrors);
        if (!_.isEmpty(error)) {
            updatedErrors[section] = error;
        } else {
            updatedErrors = {};
        }
        if (!_.isEqual(updatedErrors, currentErrors)) {
            this.setState({
                errors: updatedErrors
            });
        }
    };

    getBGVData = (documentName) =>{
        let BgvData = null;
        if(!_.isEmpty(this.props.bgvData)){
            if(!_.isEmpty(this.props.bgvData[0])){
                if(!_.isEmpty(this.props.bgvData[0].bgv)){
                    if(!_.isEmpty(this.props.bgvData[0].bgv.idcards)){
                        BgvData = this.props.bgvData[0].bgv.idcards.checks.find(option => option.service === documentName)
                    }
                }
            }
        }
        return BgvData;
    }

    getInProgressStatus = (documentName)=>{
        let progressCheck = false;
        if(!_.isEmpty(this.props.bgvData)){
            if(!_.isEmpty(this.props.bgvData[0])){
                if(!_.isEmpty(this.props.bgvData[0].bgv)){
                    if(!_.isEmpty(this.props.bgvData[0].bgv.idcards)){
                        let BgvData = this.props.bgvData[0].bgv.idcards.checks.find(option => option.service === documentName)
                        if(!_.isEmpty(BgvData)){
                            if(BgvData.status === "inProgress"){
                                progressCheck = true
                            }
                        }
                        
                    }
                }
            }
        }
        return progressCheck;
    }

    getBGVMissingInfo = (documentName) =>{
        let missingInfo ;
        if(!_.isEmpty(this.props.bgvMissingInfo)){
            if(this.props.bgvMissingInfo.hasOwnProperty(documentName)){
                missingInfo = this.props.bgvMissingInfo[documentName][0];
            }
        }
        return missingInfo
    }


    render() {
        return (
            <div className={styles.formLayout} >
                <div className={cx("mb-4", this.props.isActive ? styles.opacityHeadIn : styles.opacityHeadOut)}>

                    <div className={styles.horizontalLineInactive}></div>
                    <span className={styles.formHead}>government ids</span>
                </div>
                <form>

                    <DrivingLicense
                        data={this.handleDocumentData(this.state.documents, "DL")}
                        onChange={this.getDocumentDataFromChild}
                        onError={this.handleStoreErrorInState}
                        isEdited={this.state.isEdited}
                        errors={this.state.errors['DL']}
                        bgvData={this.getBGVData("DL") }
                        isDisabled={this.getInProgressStatus("DL")}
                        bgvMissingInfo={this.getBGVMissingInfo("DL")}
                    />

                    <hr className={styles.HorizontalLine} />

                    <VehicleRegistration
                        data={this.handleDocumentData(this.state.documents, "RC")}
                        onChange={this.getDocumentDataFromChild}
                        onError={this.handleStoreErrorInState}
                        isEdited={this.state.isEdited}
                        errors={this.state.errors['RC']}
                        bgvData={this.getBGVData("RC") }
                        isDisabled={this.getInProgressStatus("RC")}
                        bgvMissingInfo={this.getBGVMissingInfo("RC")}
                    />

                    <hr className={styles.HorizontalLine} />

                    <AadhaarCard
                        data={this.handleDocumentData(this.state.documents, "AADHAAR")}
                        onChange={this.getDocumentDataFromChild}
                        onError={this.handleStoreErrorInState}
                        isEdited={this.state.isEdited}
                        errors={this.state.errors['AADHAAR']}
                        bgvData={this.getBGVData("AADHAAR") }
                        isDisabled={this.getInProgressStatus("AADHAAR")}
                        bgvMissingInfo={this.getBGVMissingInfo("AADHAAR")}
                    />

                    <hr className={styles.HorizontalLine} />
                    <VoterCard
                        data={this.handleDocumentData(this.state.documents, "VOTER")}
                        onChange={this.getDocumentDataFromChild}
                        onError={this.handleStoreErrorInState}
                        isEdited={this.state.isEdited}
                        errors={this.state.errors['VOTER']}
                        bgvData={this.getBGVData("VOTER") }
                        isDisabled={this.getInProgressStatus("VOTER")}
                        bgvMissingInfo={this.getBGVMissingInfo("VOTER")}
                    />

                    <hr className={styles.HorizontalLine} />

                    <PanCard
                        data={this.handleDocumentData(this.state.documents, "PAN")}
                        onChange={this.getDocumentDataFromChild}
                        onError={this.handleStoreErrorInState}
                        isEdited={this.state.isEdited}
                        errors={this.state.errors['PAN']}
                        bgvData={this.getBGVData("PAN") }
                        isDisabled={this.getInProgressStatus("PAN")}
                        bgvMissingInfo={this.getBGVMissingInfo("PAN")}
                    />

                    <hr className={styles.HorizontalLine} />

                    <Passport
                        data={this.handleDocumentData(this.state.documents, "PASSPORT")}
                        onChange={this.getDocumentDataFromChild}
                        onError={this.handleStoreErrorInState}
                        isEdited={this.state.isEdited}
                        errors={this.state.errors['PASSPORT']}
                        bgvData={this.getBGVData("PASSPORT") }
                        isDisabled={this.getInProgressStatus("PASSPORT")}
                        bgvMissingInfo={this.getBGVMissingInfo("PASSPORT")}
                    />

                </form>
            </div>


        )
    }
}

export default EmpDocuments;
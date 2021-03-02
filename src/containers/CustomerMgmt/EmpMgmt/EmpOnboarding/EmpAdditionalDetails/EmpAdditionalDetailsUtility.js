import _ from 'lodash';
import { sectionFieldMapping } from '../Store/fieldMapping';

const changeStatusInSectionProgress = (sectionProgress, subSectionName) => {
    let updatedSectionProgress = _.cloneDeep(sectionProgress);
    updatedSectionProgress[subSectionName] = {
        ...updatedSectionProgress[subSectionName],
        status: 'error'
    }
    return updatedSectionProgress;
}

const addRequiredFieldError = (errors, subSectionName, fields) => {
    const error = {isRequiredField: 'this field is required.'}
    let updatedErrors = _.cloneDeep(errors);
    let subSectionErrors = _.isEmpty(updatedErrors[subSectionName]) ? {} : _.cloneDeep(updatedErrors[subSectionName]);
    _.forEach(fields, function(fieldName){
        subSectionErrors[fieldName] = _.assign({}, subSectionErrors[fieldName], error);
    })
    updatedErrors[subSectionName] = subSectionErrors;
    return updatedErrors;
}

export const checkRequiredFields = (empData, sectionProgress, errors) => {
    let updatedSectionProgress = _.cloneDeep(sectionProgress);
    let updatedErrors = _.cloneDeep(errors);
    const additionalDetailsFields = sectionFieldMapping['additionalDetails'];

    _.forEach(additionalDetailsFields['subSections'], function (subSectionName) {
        switch (subSectionName) {
            case 'contactDetails':
                if(!_.isEmpty(empData['contacts'])){
                    let isRequiredFilled = false;
                    let emptyRequiredFields = [];
                    _.forEach(empData['contacts'], function(contact){
                        if(contact['type'] === 'MOBILE' && contact['isPrimary']){
                            isRequiredFilled = true;
                        }
                    })
                    if(!isRequiredFilled){
                        updatedSectionProgress = changeStatusInSectionProgress(updatedSectionProgress,
                            'contactDetails');
                        emptyRequiredFields.push('primaryMobile')
                        updatedErrors = addRequiredFieldError(updatedErrors, 
                            'contactDetails', emptyRequiredFields);
                    }else if(!_.isEmpty(updatedErrors[subSectionName])){
                        updatedSectionProgress = changeStatusInSectionProgress(updatedSectionProgress,
                            'contactDetails');
                    }else{
                        delete updatedErrors['contactDetails']
                    }
                }else{
                    delete updatedErrors['contactDetails']
                }
                break;
            case 'addresses':
                if(!_.isEmpty(empData['addresses'])){
                    let addressErrors = _.isEmpty(updatedErrors['addresses']) ? {} : updatedErrors['addresses'];
                    _.forEach(empData['addresses'], function(address){
                        let emptyRequiredFields = [];
                        let sectionTypeError = _.isEmpty(addressErrors[address['addressType']]) ? {}: addressErrors[address['addressType']];
                        _.forEach(additionalDetailsFields['addresses']['requiredFields'], function(field){
                            if(_.isEmpty(address[field])){
                                emptyRequiredFields.push(field);
                            }
                        })
                        if(emptyRequiredFields.length > 0){
                            updatedSectionProgress = changeStatusInSectionProgress(updatedSectionProgress,
                                'addresses');
                            addressErrors = addRequiredFieldError(addressErrors, 
                                address['addressType'], emptyRequiredFields);
                        }else if(!_.isEmpty(sectionTypeError)){
                            updatedSectionProgress = changeStatusInSectionProgress(updatedSectionProgress,
                                'addresses');
                        }
                        else{
                            delete addressErrors[address['addressType']]
                        }
                    })
                    if(_.isEmpty(addressErrors)){
                        delete updatedErrors['addresses']
                    }else{
                        updatedErrors['addresses'] = addressErrors;
                    }
                }else{
                    delete updatedErrors['addresses']
                }
                break;
            case 'governmentIds':
                if(!_.isEmpty(empData['documents'])){
                    let docErrors = _.isEmpty(updatedErrors['governmentIds']) ? {} : updatedErrors['governmentIds'];
                    let addedDocuments = [];
                    _.forEach(empData['documents'], function(doc){
                        if(!_.isEmpty(additionalDetailsFields['governmentIds'][doc['type']])){
                            addedDocuments.push(doc['type']);
                            let emptyRequiredFields = [];
                            let sectionTypeError = _.isEmpty(docErrors[doc['type']]) ? {}: docErrors[doc['type']];
                            _.forEach(additionalDetailsFields['governmentIds'][doc['type']]['requiredFields'], function(field){
                                if(_.isEmpty(doc[field])){
                                    emptyRequiredFields.push(field);
                                }
                            })
                            if(emptyRequiredFields.length > 0){
                                updatedSectionProgress = changeStatusInSectionProgress(updatedSectionProgress,
                                    'governmentIds');
                                docErrors = addRequiredFieldError(docErrors, 
                                    doc['type'], emptyRequiredFields);
                            }else if(!_.isEmpty(sectionTypeError)){
                                updatedSectionProgress = changeStatusInSectionProgress(updatedSectionProgress,
                                    'governmentIds');
                            }
                            else{
                                delete docErrors[doc['type']]
                            }
                        }
                    })
                    _.forEach(additionalDetailsFields['governmentIds'], function(doc, docType){
                        if(!_.includes(addedDocuments, docType)) delete docErrors[docType];
                    })
                    if(_.isEmpty(docErrors)){
                        delete updatedErrors['governmentIds']
                    }else{
                        updatedErrors['governmentIds'] = docErrors;
                    }
                }else{
                    delete updatedErrors['governmentIds']
                }
                break;
            case 'familyRefs':
                if(!_.isEmpty(empData['familyRefs'])){
                    let errorObj = _.isEmpty(updatedErrors['familyRefs']) ? {} : updatedErrors['familyRefs'];
                    _.forEach(empData['familyRefs'], function(data , index){
                        let emptyRequiredFields = [];
                        let sectionTypeError = _.isEmpty(errorObj[index]) ? {}: errorObj[index];
                        _.forEach(additionalDetailsFields['familyRefs']['requiredFields'], function(field){
                            if(_.isEmpty(data[field])){
                                emptyRequiredFields.push(field);
                            }
                        })
                        if(emptyRequiredFields.length > 0){
                            updatedSectionProgress = changeStatusInSectionProgress(updatedSectionProgress,
                                'familyRefs');
                            errorObj = addRequiredFieldError(errorObj, 
                                index, emptyRequiredFields);
                        }else if(!_.isEmpty(sectionTypeError)){
                            updatedSectionProgress = changeStatusInSectionProgress(updatedSectionProgress,
                                'familyRefs');
                        }
                        else{
                            delete errorObj[index]
                        }
                    })
                    if(_.isEmpty(errorObj)){
                        delete updatedErrors['familyRefs']
                    }else{
                        updatedErrors['familyRefs'] = errorObj;
                    }
                }else{
                    delete updatedErrors['familyRefs']
                }
                break;
            case 'educationDetails':
                if(!_.isEmpty(empData['educationDetails'])){
                    let errorObj = _.isEmpty(updatedErrors['educationDetails']) ? {} : updatedErrors['educationDetails'];
                    _.forEach(empData['educationDetails'], function(data , index){
                        let emptyRequiredFields = [];
                        let sectionTypeError = _.isEmpty(errorObj[index]) ? {}: errorObj[index];
                        _.forEach(additionalDetailsFields['educationDetails']['requiredFields'], function(field){
                            if(_.isEmpty(data[field])){
                                emptyRequiredFields.push(field);
                            }
                        })
                        if(emptyRequiredFields.length > 0){
                            updatedSectionProgress = changeStatusInSectionProgress(updatedSectionProgress,
                                'educationDetails');
                            errorObj = addRequiredFieldError(errorObj, 
                                index, emptyRequiredFields);
                        }else if(!_.isEmpty(sectionTypeError)){
                            updatedSectionProgress = changeStatusInSectionProgress(updatedSectionProgress,
                                'educationDetails');
                        }
                        else{
                            delete errorObj[index]
                        }
                    })
                    if(_.isEmpty(errorObj)){
                        delete updatedErrors['educationDetails']
                    }else{
                        updatedErrors['educationDetails'] = errorObj;
                    }
                }else{
                    delete updatedErrors['educationDetails']
                }
                break;
            case 'empHistory':
                if(!_.isEmpty(empData['workDetails'])){
                    let errorObj = _.isEmpty(updatedErrors['empHistory']) ? {} : updatedErrors['empHistory'];
                    _.forEach(empData['workDetails'], function(data , index){
                        let emptyRequiredFields = [];
                        let sectionTypeError = _.isEmpty(errorObj[index]) ? {}: errorObj[index];
                        _.forEach(additionalDetailsFields['empHistory']['requiredFields'], function(field){
                            if(_.isEmpty(data[field])){
                                emptyRequiredFields.push(field);
                            }
                        })
                        if(emptyRequiredFields.length > 0){
                            updatedSectionProgress = changeStatusInSectionProgress(updatedSectionProgress,
                                'empHistory');
                            errorObj = addRequiredFieldError(errorObj, 
                                index, emptyRequiredFields);
                        }else if(!_.isEmpty(sectionTypeError)){
                            updatedSectionProgress = changeStatusInSectionProgress(updatedSectionProgress,
                                'empHistory');
                        }
                        else{
                            delete errorObj[index]
                        }
                    })
                    if(_.isEmpty(errorObj)){
                        delete updatedErrors['empHistory']
                    }else{
                        updatedErrors['empHistory'] = errorObj;
                    }
                }else{
                    delete updatedErrors['empHistory']
                }
                break;
            case 'social':
                if(!_.isEmpty(empData['socialNetworks'])){
                    let errorObj = _.isEmpty(updatedErrors['social']) ? {} : updatedErrors['social'];
                    _.forEach(empData['socialNetworks'], function(data , index){
                        let emptyRequiredFields = [];
                        let sectionTypeError = _.isEmpty(errorObj[index]) ? {}: errorObj[index];
                        _.forEach(additionalDetailsFields['social']['requiredFields'], function(field){
                            if(_.isEmpty(data[field])){
                                emptyRequiredFields.push(field);
                            }
                        })
                        if(emptyRequiredFields.length > 0){
                            updatedSectionProgress = changeStatusInSectionProgress(updatedSectionProgress,
                                'social');
                            errorObj = addRequiredFieldError(errorObj, 
                                index, emptyRequiredFields);
                        }else if(!_.isEmpty(sectionTypeError)){
                            updatedSectionProgress = changeStatusInSectionProgress(updatedSectionProgress,
                                'social');
                        }
                        else{
                            delete errorObj[index]
                        }
                    })
                    if(_.isEmpty(errorObj)){
                        delete updatedErrors['social']
                    }else{
                        updatedErrors['social'] = errorObj;
                    }
                }else{
                    delete updatedErrors['social']
                }
                break;
            case 'bankDetails':
                if(!_.isEmpty(empData['bankDetails'])){
                    let emptyRequiredFields = [];
                    _.forEach(additionalDetailsFields['bankDetails']['requiredFields'], function(field){
                        if(_.isEmpty(empData['bankDetails'][0][field])){
                            emptyRequiredFields.push(field);
                        }
                    })
                    if(emptyRequiredFields.length > 0){
                        updatedSectionProgress = changeStatusInSectionProgress(updatedSectionProgress,
                            'bankDetails');
                        updatedErrors = addRequiredFieldError(updatedErrors, 
                            'bankDetails', emptyRequiredFields);
                    }else if(!_.isEmpty(updatedErrors[subSectionName])){
                        updatedSectionProgress = changeStatusInSectionProgress(updatedSectionProgress,
                            'bankDetails');
                    }else{
                        delete updatedErrors['bankDetails']
                    }
                }else{
                    delete updatedErrors['bankDetails']
                }
                break;
            default:
                break;
        }
    })

    return {
        updatedSectionProgress: updatedSectionProgress,
        updatedErrors: updatedErrors
    }
}
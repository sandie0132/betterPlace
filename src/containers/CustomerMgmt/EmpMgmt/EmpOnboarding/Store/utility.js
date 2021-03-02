import _ from 'lodash';
import { sectionFieldMapping } from './fieldMapping';


export const getSectionStatus = (data) => {
    const formData = _.cloneDeep(data);
    const sectionNames = ['basicDetails', 'additionalDetails', 'employeeDetails', 'companyDocuments', 'governmentDocuments'];
    let updatedStatus = {};
    _.forEach(sectionNames, function(section){
        let status = 'todo';
        let subSectionStatus = null;
        let allSectionDone = true;
        switch (section) {
            case 'basicDetails':
                const basicDetailsFields = sectionFieldMapping['basicDetails'];
                let filledFieldsCount = 0;    
                _.forEach(basicDetailsFields['requiredFields'], function(field){
                    if(!_.isEmpty(formData[field])){
                        filledFieldsCount = filledFieldsCount + 1;
                    }
                })
                if(filledFieldsCount === basicDetailsFields['requiredFields'].length){
                    status = 'done';
                }
                break;

            case 'additionalDetails':
                subSectionStatus = getSubSectionProgress('additionalDetails', formData);
                let filledSectionsCount = 0;
                _.forEach(subSectionStatus, function(statusObj){
                    if(statusObj['status'] === 'done'){
                        filledSectionsCount = filledSectionsCount + 1;
                    }
                })
                if(filledSectionsCount === sectionFieldMapping['additionalDetails']['subSections'].length){
                    status = 'done';
                }
                break;

            case 'employeeDetails':
                if(!_.isEmpty(formData['entityType'])){
                    let filledFieldsCount = 0;
                    const empDetailsFields = sectionFieldMapping['employeeDetails'][formData['entityType']];
                    _.forEach(empDetailsFields['requiredFields'], function(field){
                        if(!_.isEmpty(formData[field])){
                            filledFieldsCount = filledFieldsCount + 1;
                        }
                    })
                    if(filledFieldsCount === sectionFieldMapping['employeeDetails'][formData['entityType']]['requiredFields'].length){
                        status = 'done';
                    }
                }
                break;

            case 'companyDocuments':
                subSectionStatus = getSubSectionProgress('companyDocuments', formData);
                if(!_.isEmpty(subSectionStatus)){
                    _.forEach(subSectionStatus, function(statusObj){
                        if(statusObj['status'] !== 'done'){
                            allSectionDone = false;
                        }
                    })
                    if(allSectionDone){
                        status = 'done';
                    }
                }
                break;
            
            case 'governmentDocuments':
                subSectionStatus = getSubSectionProgress('governmentDocuments', formData);
                if(!_.isEmpty(subSectionStatus)){
                    _.forEach(subSectionStatus, function(statusObj){
                        if(statusObj['status'] !== 'done'){
                            allSectionDone = false;
                        }
                    })
                    if(allSectionDone){
                        status = 'done';
                    }
                }
                break;
            default:
                break;
        }
        updatedStatus[section] = {
            'status': status,
            'subSectionStatus': subSectionStatus
        };
    })
    return(updatedStatus);
}

export const getSubSectionProgress = (sectionName, data) => {
    const formData = _.cloneDeep(data);
    let updatedProgress = {};
    switch (sectionName) {
        case 'additionalDetails':
            const additionalDetailsFields = sectionFieldMapping['additionalDetails'];
            _.forEach(additionalDetailsFields['subSections'], function (subSectionName) {
                switch (subSectionName) {
                    case 'contactDetails':
                        let contactStatus = {
                            'total': additionalDetailsFields['contactDetails']['total'],
                            'filled': 0,
                            'status': 'todo'
                        }
                        if (!_.isEmpty(formData['contacts'])) {
                            contactStatus['filled'] = formData['contacts'].length;
                            if(formData['contacts'].length === additionalDetailsFields['contactDetails']['total']){
                                contactStatus['status'] = 'done'
                            }else{
                                contactStatus['status'] = 'inprogress'
                            }
                        }
                        updatedProgress['contactDetails'] = contactStatus;
                        break;
                    
                    case 'addresses':
                        let addressStatus = {
                            'total': additionalDetailsFields['addresses']['total'],
                            'filled': 0,
                            'status': 'todo'
                        }
                        if (!_.isEmpty(formData['addresses'])) {
                            let totalFields = formData['addresses'].length * additionalDetailsFields['addresses']['total'];
                            addressStatus['total'] = totalFields;
                            let filledFieldsCount = 0;
                            _.forEach(formData['addresses'], function(address){
                                _.forEach(additionalDetailsFields['addresses']['allFields'], function(field){
                                    if(!_.isEmpty(address[field])){
                                        filledFieldsCount = filledFieldsCount + 1;
                                    }
                                })
                            })
                            addressStatus['filled'] = filledFieldsCount;
                            if(filledFieldsCount === totalFields){
                                addressStatus['status'] = 'done'
                            }else if(filledFieldsCount === 0){
                                addressStatus['status'] = 'todo'
                            }else{
                                addressStatus['status'] = 'inprogress'
                            }
                        }
                        updatedProgress['addresses'] = addressStatus;
                        break;
                    
                    case 'governmentIds':
                        let governmentIdsStatus = {
                            'total': additionalDetailsFields['governmentIds']['total'],
                            'filled': 0,
                            'status': 'todo'
                        }
                        if (!_.isEmpty(formData['documents'])) {
                            let filledFieldsCount = 0;
                            _.forEach(formData['documents'], function(document){
                                if(!_.isEmpty(additionalDetailsFields['governmentIds'][document['type']]))
                                {
                                    _.forEach(additionalDetailsFields['governmentIds'][document['type']]['allFields'], function(field){
                                        if(!_.isEmpty(document[field])){
                                            filledFieldsCount = filledFieldsCount + 1;
                                        }
                                    })
                                }
                            })
                            governmentIdsStatus['filled'] = filledFieldsCount;
                            if(filledFieldsCount === additionalDetailsFields['governmentIds']['total']){
                                governmentIdsStatus['status'] = 'done'
                            }else if(filledFieldsCount === 0){
                                governmentIdsStatus['status'] = 'todo'
                            }else{
                                governmentIdsStatus['status'] = 'inprogress'
                            }
                        }
                        updatedProgress['governmentIds'] = governmentIdsStatus;
                        break;

                    case 'familyRefs':
                        let familyRefsStatus = {
                            'total': additionalDetailsFields['familyRefs']['total'],
                            'filled': 0,
                            'status': 'todo'
                        }
                        if (!_.isEmpty(formData['familyRefs'])) {
                            let totalFields = formData['familyRefs'].length * additionalDetailsFields['familyRefs']['total'];
                            familyRefsStatus['total'] = totalFields;
                            let filledFieldsCount = 0;
                            _.forEach(formData['familyRefs'], function(data){
                                _.forEach(additionalDetailsFields['familyRefs']['allFields'], function(field){
                                    if(!_.isEmpty(data[field])){
                                        filledFieldsCount = filledFieldsCount + 1;
                                    }
                                })
                            })
                            familyRefsStatus['filled'] = filledFieldsCount;
                            if(filledFieldsCount === totalFields){
                                familyRefsStatus['status'] = 'done'
                            }else if(filledFieldsCount === 0){
                                familyRefsStatus['status'] = 'todo'
                            }else{
                                familyRefsStatus['status'] = 'inprogress'
                            }
                        }
                        updatedProgress['familyRefs'] = familyRefsStatus;
                        break;
                    
                    case 'educationDetails':
                        let educationDetailsStatus = {
                            'total': additionalDetailsFields['educationDetails']['total'],
                            'filled': 0,
                            'status': 'todo'
                        }
                        if (!_.isEmpty(formData['educationDetails'])) {
                            let totalFields = formData['educationDetails'].length * additionalDetailsFields['educationDetails']['total'];
                            educationDetailsStatus['total'] = totalFields;
                            let filledFieldsCount = 0;
                            _.forEach(formData['educationDetails'], function(data){
                                _.forEach(additionalDetailsFields['educationDetails']['allFields'], function(field){
                                    if(!_.isEmpty(data[field])){
                                        filledFieldsCount = filledFieldsCount + 1;
                                    }
                                })
                            })
                            educationDetailsStatus['filled'] = filledFieldsCount;
                            if(filledFieldsCount === totalFields){
                                educationDetailsStatus['status'] = 'done'
                            }else if(filledFieldsCount === 0){
                                educationDetailsStatus['status'] = 'todo'
                            }else{
                                educationDetailsStatus['status'] = 'inprogress'
                            }
                        }
                        updatedProgress['educationDetails'] = educationDetailsStatus;
                        break;
                    
                    case 'empHistory':
                        let empHistoryStatus = {
                            'total': additionalDetailsFields['empHistory']['total'],
                            'filled': 0,
                            'status': 'todo'
                        }
                        if (!_.isEmpty(formData['workDetails'])) {
                            let totalFields = formData['workDetails'].length * additionalDetailsFields['empHistory']['total'];
                            empHistoryStatus['total'] = totalFields;
                            let filledFieldsCount = 0;
                            _.forEach(formData['workDetails'], function(data){
                                _.forEach(additionalDetailsFields['empHistory']['allFields'], function(field){
                                    if(!_.isEmpty(data[field])){
                                        filledFieldsCount = filledFieldsCount + 1;
                                    }
                                })
                            })
                            empHistoryStatus['filled'] = filledFieldsCount;
                            if(filledFieldsCount === totalFields){
                                empHistoryStatus['status'] = 'done'
                            }else if(filledFieldsCount === 0){
                                empHistoryStatus['status'] = 'todo'
                            }else{
                                empHistoryStatus['status'] = 'inprogress'
                            }
                        }
                        updatedProgress['empHistory'] = empHistoryStatus;
                        break;
                    
                    case 'healthDetails':
                        let healthStatus = {
                            'total': additionalDetailsFields['healthDetails']['total'],
                            'filled': 0,
                            'status': 'todo'
                        }
                        if (!_.isEmpty(formData['healthDetails'])) {
                            let filledFieldsCount = 0;
                            _.forEach(additionalDetailsFields['healthDetails']['allFields'], function(field){
                                if(!_.isEmpty(formData['healthDetails'][field])){
                                    filledFieldsCount = filledFieldsCount + 1;
                                }
                            })
                            healthStatus['filled'] = filledFieldsCount;
                            if(filledFieldsCount === additionalDetailsFields['healthDetails']['total']){
                                healthStatus['status'] = 'done'
                            }else if(filledFieldsCount === 0){
                                healthStatus['status'] = 'todo'
                            }else{
                                healthStatus['status'] = 'inprogress'
                            }
                        }
                        updatedProgress['healthDetails'] = healthStatus;
                        break;

                    case 'social':
                        let socialStatus = {
                            'total': additionalDetailsFields['social']['total'],
                            'filled': 0,
                            'status': 'todo'
                        }
                        if (!_.isEmpty(formData['socialNetworks'])) {
                            let totalFields = formData['socialNetworks'].length * additionalDetailsFields['social']['total'];
                            socialStatus['total'] = totalFields;
                            let filledFieldsCount = 0;
                            _.forEach(formData['socialNetworks'], function(data){
                                _.forEach(additionalDetailsFields['social']['allFields'], function(field){
                                    if(!_.isEmpty(data[field])){
                                        filledFieldsCount = filledFieldsCount + 1;
                                    }
                                })
                            })
                            socialStatus['filled'] = filledFieldsCount;
                            if(filledFieldsCount === totalFields){
                                socialStatus['status'] = 'done'
                            }else if(filledFieldsCount === 0){
                                socialStatus['status'] = 'todo'
                            }else{
                                socialStatus['status'] = 'inprogress'
                            }
                        }
                        updatedProgress['social'] = socialStatus;
                        break;
                    
                    case 'skillPref':
                        let skillPrefStatus = {
                            'total': additionalDetailsFields['skillPref']['total'],
                            'filled': 0,
                            'status': 'todo'
                        }
                        let filledFieldsCount = 0;
                        _.forEach(additionalDetailsFields['skillPref']['allFields'], function(field){
                            if(!_.isEmpty(formData[field])){
                                filledFieldsCount = filledFieldsCount + 1;
                            }
                        })
                        skillPrefStatus['filled'] = filledFieldsCount;
                        if(filledFieldsCount === additionalDetailsFields['skillPref']['total']){
                            skillPrefStatus['status'] = 'done'
                        }else if(filledFieldsCount === 0){
                            skillPrefStatus['status'] = 'todo'
                        }else{
                            skillPrefStatus['status'] = 'inprogress'
                        }
                        updatedProgress['skillPref'] = skillPrefStatus;
                        break;

                    case 'bankDetails':
                        let bankDetailsStatus = {
                            'total': additionalDetailsFields['bankDetails']['total'],
                            'filled': 0,
                            'status': 'todo'
                        }
                        if (!_.isEmpty(formData['bankDetails'])) {
                            let filledFieldsCount = 0;
                            _.forEach(additionalDetailsFields['bankDetails']['allFields'], function(field){
                                if(!_.isEmpty(formData['bankDetails'][0][field])){
                                    filledFieldsCount = filledFieldsCount + 1;
                                }
                            })
                            bankDetailsStatus['filled'] = filledFieldsCount;
                            if(filledFieldsCount === additionalDetailsFields['bankDetails']['total']){
                                bankDetailsStatus['status'] = 'done'
                            }else if(filledFieldsCount === 0){
                                bankDetailsStatus['status'] = 'todo'
                            }else{
                                bankDetailsStatus['status'] = 'inprogress'
                            }
                        }
                        updatedProgress['bankDetails'] = bankDetailsStatus;
                        break;

                    case 'otherDetails':
                        let otherDetailsStatus = {
                            'total': additionalDetailsFields['otherDetails']['total'],
                            'filled': 0,
                            'status': 'todo'
                        }
                        let otherfilledFieldsCount = 0;
                        _.forEach(additionalDetailsFields['otherDetails']['allFields'], function(field){
                            if(!_.isEmpty(formData[field])){
                                otherfilledFieldsCount = otherfilledFieldsCount + 1;
                            }
                        })
                        otherDetailsStatus['filled'] = otherfilledFieldsCount;
                        if(otherfilledFieldsCount === additionalDetailsFields['otherDetails']['total']){
                            otherDetailsStatus['status'] = 'done'
                        }else if(otherfilledFieldsCount === 0){
                            otherDetailsStatus['status'] = 'todo'
                        }else{
                            otherDetailsStatus['status'] = 'inprogress'
                        }
                        updatedProgress['otherDetails'] = otherDetailsStatus;
                        break;
                    default:
                        break;
                }
            })
            break;
        
        case 'companyDocuments':
            let signatureStatus = {'status': 'todo'};
            if(!_.isEmpty(formData['signatureUrl'])) signatureStatus['status'] = 'done';
            updatedProgress['digitalSignature'] = signatureStatus;

            if(!_.isEmpty(formData['company_documents'])){
                _.forEach(formData['company_documents'], function(doc){
                    // if(doc['isConfigDocGenerate']){
                    //     updatedProgress[doc['documentType']] = {'status': doc['status']};
                    // }else 
                    if(!_.isEmpty(doc['signedDocumentURLs'])){
                        updatedProgress[doc['documentType']] = {'status': 'done'}
                    }else if (doc['status'] === 'inProgress') {  
                        updatedProgress[doc['documentType']] = {'status': doc['status']};
                    }else{
                        updatedProgress[doc['documentType']] = {'status': 'todo'}
                    }
                })
            }
            break;

        case 'governmentDocuments':
            if(!_.isEmpty(formData['government_documents'])){
                _.forEach(formData['government_documents'], function(doc){
                    if(doc['isConfigDocGenerate']){
                        updatedProgress[doc['documentType']] = {'status': doc['status']};
                    }else if(!_.isEmpty(doc['downloadURL'])){
                        updatedProgress[doc['documentType']] = {'status': 'done'}
                    }else{
                        updatedProgress[doc['documentType']] = {'status': 'todo'}
                    }
                })
            }
            break;
        default:
            break;
    };
    return updatedProgress;
}
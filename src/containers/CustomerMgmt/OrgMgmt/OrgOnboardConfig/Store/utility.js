import _ from 'lodash';

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export const getSectionStatus = (data) => {
    const formData = _.cloneDeep(data);
    const sectionNames = ['selectDocuments', 'governmentDocuments', 'companyDocuments'];
    let updatedStatus = {};
    _.forEach(sectionNames, function (section) {
        let status = 'todo';
        let subSectionStatus = null;
        let allSectionDone = true;
        switch (section) {
            case 'selectDocuments':
                if (!_.isEmpty(formData) && !_.isEmpty(formData.documents)) {
                    status = 'done';
                }
                break;
            case 'companyDocuments':
                if (!_.isEmpty(formData) && !_.isEmpty(formData.documents)) {
                    subSectionStatus = getSubSectionProgress('companyDocuments', formData);
                    _.forEach(subSectionStatus, function (statusObj) {
                        if (statusObj['status'] !== 'done') {
                            allSectionDone = false;
                        }
                    })
                    if (allSectionDone) {
                        status = 'done';
                    }
                }
                break;
            case 'governmentDocuments':
                if (!_.isEmpty(formData) && !_.isEmpty(formData.documents)) {
                    subSectionStatus = getSubSectionProgress('governmentDocuments', formData);
                    _.forEach(subSectionStatus, function (statusObj) {
                        if (statusObj['status'] !== 'done') {
                            allSectionDone = false;
                        }
                    })
                    if (allSectionDone) {
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
    return (updatedStatus);
}

export const getSubSectionProgress = (sectionName, data) => {
    const formData = _.cloneDeep(data);
    let updatedProgress = {};
    switch (sectionName) {
        case 'companyDocuments':
            if (!_.isEmpty(formData) && !_.isEmpty(formData.documents)) {
                _.forEach(formData.documents, function (doc) {
                    if (doc.category === 'COMPANY') {
                        if (doc['isApproved']) {
                            updatedProgress[doc['documentType']] = { 'status': 'done' }
                        } else {
                            updatedProgress[doc['documentType']] = { 'status': 'todo' }
                        }
                    }
                })
            }
            break;
        case 'governmentDocuments':
            if (!_.isEmpty(formData) && !_.isEmpty(formData.documents)) {
                _.forEach(formData.documents, function (doc) {
                    if (doc.category === 'GOVERNMENT') {
                        if (doc['status'] === 'done') {
                            updatedProgress[doc['documentType']] = { 'status': 'done' }
                        } else {
                            updatedProgress[doc['documentType']] = { 'status': 'todo' }
                        }
                    }
                })
            }
            break;
        default:
            break;
    }
    return(updatedProgress)
}
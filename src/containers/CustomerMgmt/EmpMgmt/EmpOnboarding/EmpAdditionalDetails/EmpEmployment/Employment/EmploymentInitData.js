import { sectionFieldMapping } from '../../../Store/fieldMapping';

export const initData = {
    workedFor: null,
    organisation: '',

    hrName: null,
    hrMobile: null,
    hrEmail: null,
    reportingManagerName: null,
    reportingManagerMobile: null,
    reportingManagerEmail: null,

    designation: '',
    employeeId: null,
    joinedFrom: null,
    workedUntil: null,
    salary: null,

    downloadURL: [],
}

export const allFields = [...sectionFieldMapping['additionalDetails']['empHistory']['allFields']]
export const requiredFields = [...sectionFieldMapping['additionalDetails']['empHistory']['requiredFields']]
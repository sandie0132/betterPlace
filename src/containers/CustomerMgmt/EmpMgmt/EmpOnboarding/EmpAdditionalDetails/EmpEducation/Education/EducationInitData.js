import { sectionFieldMapping } from '../../../Store/fieldMapping';

export const initData = {
    educationType: null,
    school_college: '',
    board_university: '',
    course: '',
    from: null,
    to: null,
    cgpa_percentage: null,
    passedYear: null,
    downloadURL: []
}

export const allFields = [...sectionFieldMapping['additionalDetails']['educationDetails']['allFields']]
export const requiredFields = [...sectionFieldMapping['additionalDetails']['educationDetails']['requiredFields']]
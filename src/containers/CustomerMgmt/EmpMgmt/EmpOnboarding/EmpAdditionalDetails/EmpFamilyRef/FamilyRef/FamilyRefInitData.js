import { sectionFieldMapping } from '../../../Store/fieldMapping';

export const initData = {
    relationship: null,
    name: '',
    dob:null,
    mobile:null

}

export const allFields = [...sectionFieldMapping['additionalDetails']['familyRefs']['allFields']]
export const requiredFields = [...sectionFieldMapping['additionalDetails']['familyRefs']['requiredFields']]
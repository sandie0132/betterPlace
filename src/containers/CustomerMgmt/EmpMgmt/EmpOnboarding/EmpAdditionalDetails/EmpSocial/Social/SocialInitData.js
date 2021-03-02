import { sectionFieldMapping } from '../../../Store/fieldMapping';

export const initData = {
    platform: null,
    profileUrl: null
}

export const allFields = [...sectionFieldMapping['additionalDetails']['social']['allFields']]
export const requiredFields = [...sectionFieldMapping['additionalDetails']['social']['requiredFields']]
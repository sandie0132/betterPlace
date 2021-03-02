import { sectionFieldMapping } from '../../../Store/fieldMapping';

export const initData = {
    houseType: null,
    addressLine1: null,
    addressLine2: null,
    landmark: null,
    pincode: null,
    city : null,
    district: null,
    state: null,
    country: null
}

export const allFields = [...sectionFieldMapping['additionalDetails']['addresses']['allFields']]
export const requiredFields = [...sectionFieldMapping['additionalDetails']['addresses']['requiredFields']]
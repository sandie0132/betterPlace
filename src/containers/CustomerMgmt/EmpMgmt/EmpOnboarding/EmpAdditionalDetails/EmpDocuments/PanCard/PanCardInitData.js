import { sectionFieldMapping } from '../../../Store/fieldMapping';

export const initData = {
    type: 'PAN',
    documentNumber: '',
    name: '',
    dob: null,
    fatherName: '',
    issuedOn: null,
    validFrom: null,
    validUpto: null,
    addressLine1: '',
    addressLine2: '',
    pincode: '',
    downloadURL:[]
}

export const requiredFields = [...sectionFieldMapping['additionalDetails']['governmentIds']['PAN']['requiredFields']]
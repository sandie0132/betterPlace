import { sectionFieldMapping } from '../../../Store/fieldMapping';

export const initData = {
    type: 'AADHAAR',
    documentNumber: '',
    name: '',
    dob: null,
    yob: '',
    fatherName: '',
    issuedOn: null,
    validFrom: null,
    validUpto: null,
    addressLine1: '',
    addressLine2: '',
    pincode: '',
    downloadURL:[]
}

export const requiredFields = [...sectionFieldMapping['additionalDetails']['governmentIds']['AADHAAR']['requiredFields']]
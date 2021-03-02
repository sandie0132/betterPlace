import { sectionFieldMapping } from '../../../Store/fieldMapping';

export const initData = {
    type: 'RC',
    documentNumber: '',
    name: '',
    dob: null,
    fatherName: '',
    chassisNumber:'',
    engineNumber:'',
    insuranceUpto: null,
    validUpto: null,
    addressLine1: '',
    addressLine2: '',
    pincode: '',
    downloadURL:[]
}

export const requiredFields = [...sectionFieldMapping['additionalDetails']['governmentIds']['RC']['requiredFields']]
import { sectionFieldMapping } from '../../Store/fieldMapping';

export const empBankDetailsInitData = [{
    holderName:'',
    branchName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    isPrimary:true
}]

export const allFields = [...sectionFieldMapping['additionalDetails']['bankDetails']['allFields']]
export const requiredFields = [...sectionFieldMapping['additionalDetails']['bankDetails']['requiredFields']]
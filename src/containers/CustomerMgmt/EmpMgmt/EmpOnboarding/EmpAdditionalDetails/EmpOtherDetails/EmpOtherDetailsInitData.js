import { sectionFieldMapping } from '../../Store/fieldMapping';

export const empOtherDetailsInitData = {  
    fatherName: '',
    motherName: '',
    maritalStatus: '',
    religion: '',
    nationality: '',
}

export const requiredFields = [...sectionFieldMapping['additionalDetails']['otherDetails']['requiredFields']]
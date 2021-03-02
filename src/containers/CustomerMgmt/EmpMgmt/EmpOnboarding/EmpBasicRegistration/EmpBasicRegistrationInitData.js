import { sectionFieldMapping } from '../Store/fieldMapping';

export const InitData = {
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    gender: '',
    profilePicUrl: '',
    onboardingEntity:{
        isConsentAccepted: false,
        consentUrl: [],
   },

}

//export const RequiredFields = ['firstName', 'lastName','dob','gender'];

export const RequiredFields = [...sectionFieldMapping['basicDetails']['requiredFields']]



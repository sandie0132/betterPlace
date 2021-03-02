import male from '../../../../../../src/assets/icons/male.svg';
import female from '../../../../../../src/assets/icons/female.svg';
import other from '../../../../../../src/assets/icons/other.svg';

let BasicRegistrationFormConfigData = {
    gender: {
        options: [
            { value: 'MALE', label: 'male', icon: male },
            { value: 'FEMALE', label: 'female', icon: female },
            { value: 'OTHER', label: 'other', icon: other },
        ]
    }
}

export default BasicRegistrationFormConfigData;
export const OrgDetailsInitData = {
    uuid: null,
    name: '',
    legalName: '',
    organisationType: '',
    industry: '',
    website: '',
    brandColor: '',
    contactPerson: {
        uuid: null,
        label: '',
        fullName: '',
        designation: '',
        emailAddress: '',
        phoneNumber: '',
        isPrimary: true,
        contactType: ''
    },
    address: {
        uuid: null,
        isPrimary: true,
        label: 'Registered Address',
        addressLine1: '',
        addressLine2: '',
        city: '',
        pincode: '',
        state: '',
        country: ''
    }
}

export const requiredFields = [
    'name', 'legalName', 'organisationType', 'industry',
    'addressLine1', 'city', 'pincode', 'state', 'country',
    'contactType', 'designation', 'fullName', 'phoneNumber', 'emailAddress'
]
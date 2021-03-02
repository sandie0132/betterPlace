export const nameHandler = {
    'pan': 'pan',
    'aadhaar': 'aadhaar',
    'voter-card': 'voter',
    'driving-license': 'dl',
    'rc': 'rc',
    'court': 'crc',
    'police': 'pvc',
    'employment': 'employment',
    'education': 'education',
    'reference': 'reference',
    'health': 'health',
    'globaldb': 'globaldb',
    'postalAddress': 'postal_address',
    'addressReview': 'address_review',
    'physicalAddress': 'physical_address'
}

export const permissionName = {
    'pan': 'PAN:',
    'aadhaar': 'AADHAAR:',
    'voter-card': 'VOTER:',
    'driving-license': 'DL:',
    'rc': 'RC:',
    'court': 'CRC:',
    'police': 'POLICE_VERIFICATION:',
    'employment': 'EMP_CHECK:',
    'education': 'EDU_CHECK:',
    'reference': 'TASK_REF_CHECK:',
    'health': 'HEALTH:',
    'addressReview': "ADDRESS:",
    'physicalAddress': 'PHYSICAL_ADDRESS:',
    'postalAddress': "POSTAL_ADDRESS:",
    "globaldb": "GLOBALDB:"
}

export const options = {
    agencyOptions: [
        { "optionLabel": "select service" },
        { "optionLabel": "fedex" },
        { "optionLabel": "india post" },
        { "optionLabel": "dtdc" }
    ],
    viewOptions: [
        { "optionLabel": "select view type" },
        { "optionLabel": "single task view" },
        { "optionLabel": "excel upload/download" }
    ],
    physicalAgencyOptions: [
        { "optionLabel": "manual review view" },
        { "optionLabel": "task closure view" }
    ],
    taskStatusOptions: [
        { "optionLabel": "in progress" },
        { "optionLabel": "closed" }
    ]
}

export const searchOptions = [
  { optionLabel: 'by profile' },
  { optionLabel: 'by phone number' },
];

export const mobileRegex = /^([+][9][1]|[9][1]|[0]){0,1}([ ]{0,1})([0-9]{1})([0-9]{9})$/;

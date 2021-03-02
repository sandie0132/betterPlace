/* eslint-disable import/prefer-default-export */
export const sectionFieldMapping = {
  basicDetails: {
    requiredFields: ['firstName', 'lastName', 'dob', 'gender'],
  },
  additionalDetails: {
    subSections: ['contactDetails', 'addresses', 'governmentIds', 'familyRefs', 'educationDetails',
      'empHistory', 'healthDetails', 'skillPref', 'social', 'bankDetails', 'otherDetails',
    ],
    contactDetails: {
      total: 4,
      requiredFields: [],
    },
    addresses: {
      total: 9,
      requiredFields: ['addressLine1', 'pincode'],
      allFields: ['houseType', 'addressLine1', 'addressLine2', 'landmark', 'pincode', 'city', 'district', 'state', 'country'],
    },
    governmentIds: {
      total: 11 + 10 + 5 + 8 + 8 + 11,
      DL: {
        total: 11,
        requiredFields: ['documentNumber', 'name'],
        allFields: ['documentNumber', 'name', 'dob', 'fatherName', 'issuedOn', 'validFrom',
          'validUpto', 'addressLine1', 'addressLine2', 'pincode', 'downloadURL'],
      },
      RC: {
        total: 10,
        requiredFields: ['documentNumber', 'name'],
        allFields: ['documentNumber', 'name', 'chassisNumber', 'engineNumber', 'insuranceUpto',
          'validUpto', 'addressLine1', 'addressLine2', 'pincode', 'downloadURL'],
      },
      PAN: {
        total: 5,
        requiredFields: ['documentNumber', 'name'],
        allFields: ['documentNumber', 'name', 'dob', 'fatherName', 'downloadURL'],
      },
      AADHAAR: {
        total: 9,
        requiredFields: ['documentNumber', 'name'],
        allFields: ['documentNumber', 'name', 'dob', 'yob', 'fatherName', 'addressLine1', 'addressLine2', 'pincode', 'downloadURL'],
      },
      VOTER: {
        total: 8,
        requiredFields: ['documentNumber', 'name'],
        allFields: ['documentNumber', 'name', 'dob', 'fatherName', 'addressLine1', 'addressLine2', 'pincode', 'downloadURL'],
      },
      PASSPORT: {
        total: 11,
        requiredFields: ['documentNumber', 'name'],
        allFields: ['documentNumber', 'name', 'dob', 'fatherName', 'issuedOn', 'validFrom',
          'validUpto', 'addressLine1', 'addressLine2', 'pincode', 'downloadURL'],
      },
    },
    familyRefs: {
      total: 4,
      requiredFields: ['relationship', 'name'],
      allFields: ['relationship', 'name', 'dob', 'mobile'],
    },
    educationDetails: {
      total: 9,
      requiredFields: ['course', 'educationType', 'school_college', 'board_university'],
      allFields: ['course', 'educationType', 'school_college', 'board_university', 'from', 'to', 'passedYear',
        'cgpa_percentage', 'downloadURL'],
    },
    empHistory: {
      total: 14,
      requiredFields: ['organisation', 'designation', 'joinedFrom'],
      allFields: ['organisation', 'designation', 'joinedFrom', 'workedFor',
        'hrName', 'hrMobile', 'hrEmail', 'reportingManagerName', 'reportingManagerMobile',
        'reportingManagerEmail', 'employeeId', 'workedUntil', 'salary', 'downloadURL'],
    },
    healthDetails: {
      total: 4,
      requiredFields: [],
      allFields: ['bloodGroup', 'height', 'weight', 'identificationMark'],
    },
    skillPref: {
      total: 3,
      requiredFields: [],
      allFields: ['skills', 'preferences', 'languages'],
    },
    social: {
      total: 2,
      requiredFields: ['platform', 'profileUrl'],
      allFields: ['platform', 'profileUrl'],
    },
    bankDetails: {
      total: 5,
      requiredFields: ['holderName', 'bankName', 'accountNumber', 'ifscCode'],
      allFields: ['bankName', 'accountNumber', 'ifscCode', 'branchName', 'holderName'],
    },
    otherDetails: {
      total: 5,
      requiredFields: [],
      allFields: ['fatherName', 'motherName', 'nationality', 'religion', 'maritalStatus'],
    },
  },
  employeeDetails: {
    EMPLOYEE: {
      requiredFields: ['employeeType', 'status', 'defaultLocation', 'defaultRole'],
    },
    TENANT: {
      requiredFields: ['defaultLocation'],
    },
    BUSINESS_ASSOCIATE: {
      requiredFields: ['status', 'defaultLocation', 'defaultRole'],
    },
    CONTRACTOR: {
      requiredFields: ['status', 'deploymentStartDate', 'deploymentEndDate', 'defaultLocation', 'defaultRole'],
    },
  },
};

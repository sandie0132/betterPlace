

export const InitData = {
  name: '',
  relation: '',
  fatherOrHusbandName: '',
  employeePhoneNumber: null,
  dob: null,
  gender: null,
  maritalStatus: null,
  joiningDate: null,
  esiNumber: '',
  isIpDisabled: false,
  disabilityType: null,
  disabilityFileURL: [],
  isCurrentSameAsPermanent: false,
  isConfigDocGenerate: true,
  addresses: [
    {
      addressType: 'CURRENT_ADDRESS',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      pincode: '',
      mobileNumber: null,
      phoneNumberStdCode: '',
      phoneNumber: '',
      email: null,
      state: null,
      district: null
    },
    {
      addressType: 'PERMANENT_ADDRESS',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      pincode: '',
      mobileNumber: null,
      phoneNumberStdCode: '',
      phoneNumber: '',
      email: null,
      state: null,
      district: null
    }
  ],
  bankDetails: {
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    micrCode: '',
    accountType: null,
    bankAccountFileURL: []
  },
  nominee: {
    name: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    relationshipWithIp: null,
    state: null,
    district: null,
    pincode: '',
    mobileNumber: null,
    phoneNumberStdCode: '',
    phoneNumber: '',
    isFamilyMember: true
  },
  familyMembers: [
    {
      name: '',
      dob: '',
      relationship: null,
      gender: null,
      incomeShouldNotExceed: false,
      isResidingWithEmployee: true,
      state: null,
      district: null
    }
  ],
  medicalInstFamily: {
    state: null,
    district: null,
    type: "DISPENSARY",
    area: null,
    address: ''
  },
  medicalInstIp: {
    state: null,
    district: null,
    type: "DISPENSARY",
    area: null,
    address: ''
  }
}

export const requiredFields = {
  root: ["name", "relation", "fatherOrHusbandName", "employeePhoneNumber", "dob", "gender", "maritalStatus", "joiningDate", "disabilityType"],
  addresses: ["addressLine1", "pincode", "mobileNumber", "state", "district"],
  bankDetails: ["accountNumber", "bankName", "ifscCode", "accountType"],
  nominee: ["name", "addressLine1", "relationshipWithIp", "state", "district", "isFamilyMember"],
  familyMembers: ["name", "dob", "relationship", "gender", "isResidingWithEmployee", "incomeShouldNotExceed","state", "district"],
  medicalInstFamily: ["state", "district", "type", "area"],
  medicalInstIp: ["state", "district", "type", "area"]
}
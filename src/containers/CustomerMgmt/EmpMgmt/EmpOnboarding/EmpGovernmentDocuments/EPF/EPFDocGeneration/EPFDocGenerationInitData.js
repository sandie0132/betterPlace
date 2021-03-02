export const InitData = {
    title: null,
    name: "",
    dob: null,
    gender: null,
    nationality: null,
    maritalStatus: null,
    employeePhoneNumber: null,
    qualification: null,

    relation: null,
    fatherOrHusbandName: "",

    joiningDate: null,
    aadhaarNumber: "",
    uanNumber: "",

    isInternationalWorker: false,
    nameOnPassport: "",
    countryOfOrigin: null,
    passportNumber: null,
    passportValidFrom: null,
    passportValidTill: null,

    isDifferentlyAbled: false,
    disablityType: [],

    isNorthEastMember: false
}

export const requiredFields = [
    "name", "title", "dob", "gender", "nationality", "relation", "fatherOrHusbandName",
    "maritalStatus", "joiningDate", "aadhaarNumber", "countryOfOrigin","nameOnPassport", 
    "passportNumber", "passportValidFrom", "passportValidTill", "disablityType"
]
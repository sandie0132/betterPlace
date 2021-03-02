export const imageInitData = {
    data : [
        {label : "reference photo", type : "reference"},
        {label : "reference ID photo", type : "reference", isOther : true},
        {label : "id card", type : "verification"},
        {label : "house photo", type : "verification"},
        {label : "door number", type : "verification"},
        {label : "street", type : "verification"},
        {label : "landmark", type : "verification"},
        {label : "cross display board", type : "verification"},
        {label : "others", type : "verification", isOther : true}
    ]
} 

export const apiImagesInitData = { 
    data : [
        {label : "candidate photo"},
        {label : "house photo"},
        {label : "door number"},
        {label : "street"},
        {label : "landmark"},
        {label : "cross display board"}
    ]
} 

export const detailsInitData = {
    formData : {
        referenceType : "",
        idType : "",
        name : "",
        mobile : "",
        houseType : "",
        residenceSince : "",
        residenceTill : "",
        duration : "",
        latitude : "",
        longitude : ""
    }
}

export const requiredFields = ['referenceType', 'mobile', 'name'];

export const requiredPhotos = ['house photo', 'door number', 'id card'];

export const data = [
    'EMP_MGMT_HOUSE_TYPE',
    'WORKLOAD_MGMT_AGENCY_TASK_CLOSURE_REFERENCE_TYPE',
    'WORKLOAD_MGMT_AGENCY_TASK_CLOSURE_ID_CARD_TYPE'
]

export const otherPhotos = ["reference ID photo", "others"];

export const referenceFields = ['referenceType', 'mobile', 'name', "idType"];

export const verificationFields = ['houseType', 'residenceSince', 'residenceTill', 'duration', 'latitude', 'longitude'];

export const superAdminHideStatus = ['OPEN', 'PICKED', 'PENDING_RESULTS'];

export const opsHideStatus = ['OPEN', 'PICKED', 'PENDING_RESULTS'];

export const agencyHideStatus = ['OPEN'];
export const agencyReadOnly = ['PENDING_OPS_REVIEW', 'CLOSED'];

export const showReAssignButtonStatus = ['UNASSIGNED', 'OPEN', 'PICKED', 'AWAITING_TO_SEND', 'PENDING_RESULTS', 'PENDING_OPS_REVIEW'];
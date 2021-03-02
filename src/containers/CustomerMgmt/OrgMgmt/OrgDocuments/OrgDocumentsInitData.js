export const InitData = {
    type: '',
    address: '',
    issuedOn: null,
    documentNumber: '',
    downloadURL: [],
    id: '',
    modifiedOn: '',
    name: '',
    organisation: {},
    pincode: '',
    state: '',
    status: null,
    uuid: '',
    validFrom: null,
    validUntil: null,
}

export const requiredFields = ['type', 'documentNumber'];

export const documentTypeOptions = [
    { value: '', label: 'select document' },
    { value: 'PAN', label: 'PAN Card' },
    { value: 'GST', label: 'GST Certificate' },
    { value: 'LLPIN', label: 'LLPIN' },
    { value: 'CIN', label: 'CIN' },
    { value: '1A_REF', label: '1A Refno' },
    { value: 'TAN', label: 'TAN' },
    { value: 'AGREEMENT', label: 'Corporate Agreement' },
    { value: 'CONSENT', label: 'Consent Form' },
]
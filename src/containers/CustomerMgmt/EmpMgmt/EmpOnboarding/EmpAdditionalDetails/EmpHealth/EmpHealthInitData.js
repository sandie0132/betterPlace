export const empHealthConfigData = {
    bloodGroup: {
        options: [
            {value: '', label: 'select blood group'},
            { value: 'O+', label: 'O+' },
            { value: 'O-', label: 'O-' },
            { value: 'A+', label: 'A+' },
            { value: 'A-', label: 'A-' },
            { value: 'B+', label: 'B+' },
            { value: 'B-', label: 'B-' },
            { value: 'AB+', label: 'AB+' },
            { value: 'AB-', label: 'AB-' },
        ]
    },

    weightUnit:{
        options:[
            {value: 'kg', label: 'kilogram'},
            {value: 'lbs', label: 'pound'}
        ]
    },

    heightUnit:{
        options:[
            {value: 'cm', label: 'centimeter'},
            {value: 'ft', label: 'feet'}
        ]
    }
}


export const  empHealthInitData = {
    bloodGroup: null,
    height: "",
    weight: "",
    heightUnit: 'ft',
    weightUnit: 'lbs',
    identificationMark: ""
};
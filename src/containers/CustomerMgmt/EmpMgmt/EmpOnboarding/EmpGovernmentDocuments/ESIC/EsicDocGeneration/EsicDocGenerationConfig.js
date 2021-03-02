let EsicDocGenerationFormConfigData = {
    relation: {
        options: [
            { value: 'FATHER', label: 'father' },
            { value: 'HUSBAND', label: 'husband' },
        ]
    },
    esicType:{
        options:[
            {value: "DISPENSARY",label:"dispensary"},
            {value: "IMP",label:"IMP"},
            {value: "MEUD",label:"mEUD"}
        ]
    },
    booleanChoice:{
        options:[
            { value: true, label: "yes"},
            { value: false, label: 'no'},
        ]
    }

}

export default EsicDocGenerationFormConfigData;
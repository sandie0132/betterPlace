const handleNullOrBlank = (object) => {
    let modifiedObject = {
        ...object
    };
    for(let fieldName in modifiedObject){
        if(modifiedObject[fieldName] === null){
            modifiedObject[fieldName] = ''
        }
        else if(modifiedObject[fieldName] === ''){
            modifiedObject[fieldName] = null
        }
    }
    return(modifiedObject);
};

export default handleNullOrBlank;
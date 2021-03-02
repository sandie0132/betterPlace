export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export const insertItemInArray = (array, newItem) => {
    let newArray = array.slice()
    newArray.splice(array.length+1, 0, newItem)
    return newArray
}

export const removeItemsInArray = (array, targetIndex) => {
    return array.filter((item, index) => index <= targetIndex)
}
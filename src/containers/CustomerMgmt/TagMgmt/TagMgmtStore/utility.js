export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export const updateArrayItem = (array, targetIndex, updatedValue) => {
    return array.map((item, index) => {
        if (index !== targetIndex) {
            return item
        }
        return {
            ...item,
            ...updatedValue
        }
    })
}

export const insertItemInArray = (array, newItem) => {
    let newArray = array.slice()
    newArray.splice(array.length+1, 0, newItem)
    return newArray
}

export const removeItemsInArray = (array, targetIndex) => {
    return array.filter((item, index) => index <= targetIndex)
}
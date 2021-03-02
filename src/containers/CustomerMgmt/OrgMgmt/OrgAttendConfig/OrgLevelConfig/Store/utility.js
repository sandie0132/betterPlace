/* eslint-disable arrow-body-style */
/* eslint-disable import/prefer-default-export */
export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties,
  };
};

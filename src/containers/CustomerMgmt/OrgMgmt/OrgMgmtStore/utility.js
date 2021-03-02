/* eslint-disable import/prefer-default-export */
export const updateObject = (oldObject, updatedProperties) => ({
  ...oldObject,
  ...updatedProperties,
});

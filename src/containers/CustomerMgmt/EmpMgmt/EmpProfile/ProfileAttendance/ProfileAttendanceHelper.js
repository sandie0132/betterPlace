/* eslint-disable import/prefer-default-export */
export const hexToRgbA = (hex, opacity) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  if (opacity) {
    return `rgba(${r},${g},${b},${opacity})`;
  }
  return `rgb(${r},${g},${b})`;
};

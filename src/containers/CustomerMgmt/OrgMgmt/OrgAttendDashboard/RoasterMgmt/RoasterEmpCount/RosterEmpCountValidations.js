import { isEmpty } from 'lodash';

export const validation = {
  count: {
    validCount: (value) => isEmpty(value) || /^[0-9]*$/.test(value),
  },
};

export const message = {
  count: {
    validCount: 'enter a valid number',
  },
};

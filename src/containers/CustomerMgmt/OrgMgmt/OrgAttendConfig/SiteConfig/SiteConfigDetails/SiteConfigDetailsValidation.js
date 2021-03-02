import _ from 'lodash';

export const validation = {
  radius: {
    validRadius: (value) => _.isEmpty(value) || /^\d+$/.test(value),
  },
};

export const message = {
  radius: {
    validRadius: 'enter valid number',
  },
};

export const requiredFields = ['siteId', 'address'];

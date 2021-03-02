import _ from 'lodash';

export const validation = {
    googleLink: {
        maxLength: value => _.isEmpty(value) || (value.length < 256)
    }
};

export const message = {
    googleLink: {
        maxLength: 'maximum characters allowed are 256.'
    }
};
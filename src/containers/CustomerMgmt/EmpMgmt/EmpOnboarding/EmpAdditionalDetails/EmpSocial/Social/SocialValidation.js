import _ from 'lodash';

export const validation = {
    profileUrl: {
        validUrl:  value  => _.isEmpty(value) ||  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)+?([a-z0-9]+[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(value)
    }
};

export const message = {
    profileUrl: {
        validUrl: 'enter a valid URL.'
    }
};
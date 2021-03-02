/* eslint-disable import/prefer-default-export */
export const InitData = {
  shiftName: '',
  startTime: {
    hours: '',
    minutes: '',
    period: 'AM',
  },
  endTime: {
    hours: '',
    minutes: '',
    period: 'AM',
  },
  pValue: {
    hours: '',
    minutes: '',
  },
  hValue: {
    hours: '',
    minutes: '',
  },
  timeTolerance: {
    minutes: '',
  },
  isForcedLogoutEnabled: false,
  siteIds: [],
};

export const requireFields = ['shiftName', 'startTime', 'endTime'];

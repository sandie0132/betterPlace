/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import { isEmpty, isEqual } from 'lodash';
import get from 'lodash/get';
import { getTagInfo } from '../../HolidayConfig/Store/action';
import { getAttendanceConfig } from '../../Store/action';
import {
  POST_LEAVE_CONFIG,
  POST_LEAVE_CONFIG_ERR,
  POST_LEAVE_CONFIG_LOADING,
  RESET_LEAVE_CONFIG,
  GET_LEAVE_CONFIG,
  GET_LEAVE_CONFIG_LOADING,
  POST_COMPOFF,
  GET_SUGGESTED_LEAVES,
  CONFIG_ERROR,
  UPDATE_LOCAL,
} from './actionTypes';

const ATTENDANCE_URL = process.env.REACT_APP_BGV_ATTENDANCE_CONFIG_URL;

export const getUrl = (base, clientId, vendorId, otherParams = false) => {
  if (clientId) {
    return otherParams ? `${base}?clientId=${clientId}&${otherParams}` : `${base}?clientId=${clientId}`;
  }
  if (vendorId) {
    return otherParams ? `${base}?vendorId=${vendorId}&${otherParams}` : `${base}?vendorId=${vendorId}`;
  }
  if (otherParams) {
    return `${base}?${otherParams}`;
  }
  return base;
};

export const getTagList = ({ clientId, vendorId }) => (dispatch, getState) => {
  const rState = getState();
  const orgMgmtRState = get(rState, 'orgMgmt', {});
  const { localConfiguredLeaves = [], localCompoffLeaves = [] } = get(orgMgmtRState, 'orgAttendConfig.leaveConfig', {});
  let tagArr = [];
  localConfiguredLeaves.forEach((ele) => {
    if (!isEmpty(ele.includeTags)) {
      tagArr = [...tagArr, ...ele.includeTags];
    }
    if (!isEmpty(ele.excludeTags)) {
      tagArr = [...tagArr, ...ele.excludeTags];
    }
  });
  localCompoffLeaves.forEach((ele) => {
    if (!isEmpty(ele.includeTags)) {
      tagArr = [...tagArr, ...ele.includeTags];
    }
    if (!isEmpty(ele.excludeTags)) {
      tagArr = [...tagArr, ...ele.excludeTags];
    }
  });
  if (tagArr.length) dispatch(getTagInfo(tagArr, clientId || vendorId));
};

export const postLeaveConfig = ({
  formdata, history, url, isLocal, clientId, vendorId,
}) => (dispatch, getState) => {
  dispatch({
    type: POST_LEAVE_CONFIG_LOADING,
  });
  try {
    const rState = getState();
    const orgMgmtRState = get(rState, 'orgMgmt', {});
    const { localConfiguredLeaves = [], localSuggestedLeaves = [] } = get(orgMgmtRState, 'orgAttendConfig.leaveConfig', {});
    if (!isLocal) {
      if (localConfiguredLeaves.findIndex((leave) => leave.leaveName === formdata.leaveName) > -1) {
        const error = 'Leave already configured';
        throw error;
      }
      localConfiguredLeaves.push({
        ...formdata,
      });
    } else {
      const editedIndex = localConfiguredLeaves.findIndex((leave) => leave.leaveName === formdata.leaveName);
      if (editedIndex > -1) localConfiguredLeaves[editedIndex] = { ...formdata };
    }
    const localSuggested = localSuggestedLeaves.filter((leave) => leave.leaveName !== formdata.leaveName.toLowerCase());
    dispatch(getTagList({ clientId, vendorId }));
    dispatch({
      type: POST_LEAVE_CONFIG,
      data: { localConfiguredLeaves, localSuggested },
    });
    history.push(url);
  } catch (error) {
    dispatch({
      type: POST_LEAVE_CONFIG_ERR,
      error,
    });
  }
};

export const postCompoff = ({
  formdata, history, url, isLocal, index, clientId, vendorId,
}) => (dispatch, getState) => {
  dispatch({
    type: POST_LEAVE_CONFIG_LOADING,
  });
  try {
    const rState = getState();
    const orgMgmtRState = get(rState, 'orgMgmt', {});
    const { localCompoffLeaves = [] } = get(orgMgmtRState, 'orgAttendConfig.leaveConfig', {});
    if (!isLocal) {
      if (localCompoffLeaves.findIndex((leave) => {
        const leaveData = { ...leave };
        delete leaveData.uuid;
        return isEqual(leaveData, formdata);
      }) > -1) {
        const error = 'compoff with these values already exists';
        throw error;
      }

      localCompoffLeaves.push({ ...formdata });
    } else if (index > -1) localCompoffLeaves[index] = { ...formdata };
    dispatch(getTagList({ clientId, vendorId }));
    dispatch({
      type: POST_COMPOFF,
      data: { localCompoffLeaves },
    });
    history.push(url);
  } catch (error) {
    dispatch({
      type: POST_LEAVE_CONFIG_ERR,
      error,
    });
  }
};

export const updateLocalState = ({
  value, tagIds, orgId, clientId, vendorId,
}) => (dispatch, getState) => {
  const orgMgmtRState = get(getState(), 'orgMgmt', {});
  const {
    allLeaves, localSuggestedLeavesCopy,
  } = get(orgMgmtRState, 'orgAttendConfig.leaveConfig', {});
  let currentLeaves = [];
  if (tagIds) {
    const url = getUrl(`${ATTENDANCE_URL}/org/${orgId}/leave-config/${value}`, clientId, vendorId, `tags=${tagIds}`);
    dispatch({
      type: GET_LEAVE_CONFIG_LOADING,
    });
    axios.get(url).then((res) => {
      currentLeaves = get(res, 'data.leaves', []);
      const configuredLeaves = currentLeaves.filter((leave) => leave.category === 'LEAVE');
      const compoffLeaves = currentLeaves.filter((leave) => leave.category === 'COMP_OFF');
      const suggestedLeaves = localSuggestedLeavesCopy.filter((suggested) => configuredLeaves.findIndex((configured) => configured.leaveName.toLowerCase() === suggested.leaveName) === -1);
      dispatch({
        type: UPDATE_LOCAL,
        data: {
          configuredLeaves,
          compoffLeaves,
          suggestedLeaves,
        },
      });
    }).catch((error) => {
      const errMsg = get(error, 'response.data.errorMessage', error.message);
      dispatch({
        type: CONFIG_ERROR,
        error: errMsg,
      });
    });
  } else {
    currentLeaves = get(allLeaves.filter((leave) => leave._id === value)[0], 'leaves', []);
    const configuredLeaves = currentLeaves.filter((leave) => leave.category === 'LEAVE');
    const compoffLeaves = currentLeaves.filter((leave) => leave.category === 'COMP_OFF');
    const suggestedLeaves = localSuggestedLeavesCopy.filter((suggested) => configuredLeaves.findIndex((configured) => configured.leaveName.toLowerCase() === suggested.leaveName) === -1);
    dispatch({
      type: UPDATE_LOCAL,
      data: {
        configuredLeaves,
        compoffLeaves,
        suggestedLeaves,
      },
    });
  }
};

export const getSuggestedLeaves = ({ orgId, clientId, vendorId }) => (dispatch) => {
  const url = getUrl(`${ATTENDANCE_URL}/org/${orgId}/suggested-leaves`, clientId, vendorId);
  axios.get(url).then((res) => {
    dispatch({
      type: GET_SUGGESTED_LEAVES,
      data: res.data.suggestedLeaves,
    });
  }).catch((error) => {
    const errMsg = get(error, 'response.data.errorMessage', error.message);
    dispatch({
      type: CONFIG_ERROR,
      error: errMsg,
    });
  });
};

export const resetLocalState = () => (dispatch) => {
  dispatch({
    type: RESET_LEAVE_CONFIG,
  });
};

export const getAllLeaves = ({
  orgId, updateId, notification, clientId, vendorId,
}) => (dispatch) => {
  const url = getUrl(`${ATTENDANCE_URL}/org/${orgId}/leave-config`, clientId, vendorId);
  dispatch({
    type: GET_LEAVE_CONFIG_LOADING,
  });
  axios.get(url).then((response) => {
    if (response.status === 200 || response.status === 201) {
      dispatch({
        type: GET_LEAVE_CONFIG,
        data: { res: response.data, notification, orgId },
      });
      let tagArr = [];
      get(response, 'data', []).forEach((ele) => {
        get(ele, 'leaves', []).forEach((leave) => {
          if (!isEmpty(leave.includeTags)) {
            tagArr = [...tagArr, ...leave.includeTags];
          }
          if (!isEmpty(leave.excludeTags)) {
            tagArr = [...tagArr, ...leave.excludeTags];
          }
        });
      });
      if (tagArr.length) dispatch(getTagInfo(tagArr, clientId || vendorId));
      if (updateId) {
        dispatch(updateLocalState({ value: updateId }));
      }
    }
  }).catch((error) => {
    const errMsg = get(error, 'response.data.errorMessage', error.message);
    dispatch({
      type: CONFIG_ERROR,
      error: errMsg,
    });
  });
};

export const submitLeaves = ({
  orgId, saveAs, startDate, endDate, leaves, leaveCycleId, clientId, vendorId,
}) => (dispatch) => {
  dispatch({
    type: GET_LEAVE_CONFIG_LOADING,
  });
  if (leaveCycleId !== 'new leave cycle') {
    const url = getUrl(`${ATTENDANCE_URL}/org/${orgId}/leave-config/${leaveCycleId}`, clientId, vendorId, `saveAs=${saveAs}`);
    axios.put(url, { startDate, endDate, leaves }).then(() => {
      const notification = {
        message: 'leave cycle updated',
        timeout: 5000,
        type: 'success',
      };
      dispatch(getAllLeaves({
        orgId, updateId: leaveCycleId, notification, clientId, vendorId,
      }));
      dispatch(getAttendanceConfig(orgId, {
        clientId,
        vendorId,
      }));
    }).catch((error) => {
      const errMsg = get(error, 'response.data.errorMessage', error.message);
      dispatch({
        type: CONFIG_ERROR,
        error: errMsg,
      });
    });
  } else {
    const url = getUrl(`${ATTENDANCE_URL}/org/${orgId}/leave-config`, clientId, vendorId, `saveAs=${saveAs}`);
    dispatch({
      type: GET_LEAVE_CONFIG_LOADING,
    });
    axios.post(url, { startDate, endDate, leaves }).then(() => {
      const notification = {
        message: saveAs === 'DRAFT' ? 'leave cycle created as draft' : 'leave cycle created as policy',
        timeout: 5000,
        type: 'success',
      };
      dispatch(getAllLeaves({
        orgId, type: 'create', notification, clientId, vendorId,
      }));
      dispatch(resetLocalState());
    }).catch((error) => {
      const errMsg = get(error, 'response.data.errorMessage', error.message);
      dispatch({
        type: CONFIG_ERROR,
        error: errMsg,
      });
    });
  }
};

export const deleteLeaveCycle = ({
  leaveCycleId, orgId, clientId, vendorId,
}) => (dispatch) => {
  const url = getUrl(`${ATTENDANCE_URL}/org/${orgId}/leave-config/${leaveCycleId}`, clientId, vendorId);
  axios.delete(url).then(() => {
    const notification = {
      message: 'leave cycle deleted',
      timeout: 5000,
      type: 'success',
    };
    dispatch(getAllLeaves({
      orgId, notification, clientId, vendorId,
    }));
    dispatch(getAttendanceConfig(orgId, { clientId, vendorId }));
  }).catch((error) => {
    const errMsg = get(error, 'response.data.errorMessage', error.message);
    dispatch({
      type: CONFIG_ERROR,
      error: errMsg,
    });
  });
};

export const clearError = () => (dispatch) => {
  dispatch({
    type: POST_LEAVE_CONFIG_ERR,
    error: false,
  });
};

export const clearNotification = () => (dispatch) => {
  dispatch({
    type: CONFIG_ERROR,
    error: false,
  });
};

export const notificationUpdate = ({ msg }) => (dispatch) => {
  dispatch({
    type: CONFIG_ERROR,
    error: msg,
  });
};

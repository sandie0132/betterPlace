/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import get from 'lodash/get';
import {
  GET_EMP_COUNT,
  EMP_PIC,
  EMP_SHIFT,
  GET_EMPLOYEE,
  LOADING, ROASTER_ERROR,
  VENDOR_LIST,
  POST_EMP_COUNT,
  GET_EXPECTED_EMP_COUNT,
  DELETE_EXPECTED_COUNT,
  GET_TAG_INFO_ROSTER,
  GET_HOLIDAYS,
  EMP_LEAVES,
} from './actionTypes';

const ATTENDANCE_URL = process.env.REACT_APP_BGV_ATTENDANCE_CONFIG_URL;
const CUSTOMER_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

export const getTotalExpectedEmpCount = ({
  orgId, siteId, startDate, endDate, loading, tagId, key, vendorId,
}) => (dispatch) => {
  dispatch({
    type: LOADING,
    data: loading || 'empCount',
  });
  let url = `${ATTENDANCE_URL}/org/${orgId}/site/${siteId}/expected-emp-count?startDate=${startDate}&endDate=${endDate}`;
  if (tagId) { url = `${url}&function=${tagId}`; }
  if (vendorId) { url = `${url}&vendorId=${vendorId}`; }
  if (key) { url += `&key=${key}`; }
  axios.get(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: GET_EMP_COUNT,
          data: response.data,
          key: loading || 'empCount',
        });
      }
    }).catch((err) => {
      const errMsg = get(err, 'response.data.errorMessage', err.message);
      dispatch({
        type: ROASTER_ERROR,
        error: errMsg,
        key: loading || 'empCount',
      });
    });
};

export const getEmployee = ({
  orgId, siteId, startDate, endDate, key, tagId, loading, vendorId,
}) => (dispatch) => {
  dispatch({
    type: LOADING,
    data: loading || 'employee',
  });
  let url = `${ATTENDANCE_URL}/org/${orgId}/site/${siteId}/employee?startDate=${startDate}&endDate=${endDate}`;
  if (tagId) { url = `${url}&function=${tagId}`; }
  if (vendorId) { url = `${url}&vendorId=${vendorId}`; }
  if (key) { url += `&key=${key}`; }
  axios.get(url).then((res) => {
    dispatch({
      type: GET_EMPLOYEE,
      data: res.data,
      key: loading || 'employee',
    });
    dispatch(getTotalExpectedEmpCount({
      orgId,
      siteId,
      startDate,
      endDate,
      loading,
      tagId,
      key,
      vendorId,
    }));
  }).catch((err) => {
    const errMsg = get(err, 'response.data.errorMessage', err.message);
    dispatch({
      type: ROASTER_ERROR,
      error: errMsg,
      key: loading || 'employee',
    });
  });
};

// get tag name Action Dispatch
export const getTagInfo = (tagIdList) => (dispatch) => {
  dispatch({
    type: LOADING,
    data: 'tagInfo',
  });
  let url = `${CUSTOMER_MGMT}/tag?`;
  tagIdList.forEach((tagId, index) => {
    if (index === tagIdList.length - 1) url += `tagId=${tagId}`;
    else url = `${url}tagId=${tagId}&`;
  });
  axios.get(url)
    .then((response) => {
      dispatch({
        type: GET_TAG_INFO_ROSTER,
        data: response.data,
        key: 'tagInfo',
      });
    })
    .catch((error) => {
      const errMsg = get(error, 'response.data.errorMessage', error.message);
      dispatch({
        type: ROASTER_ERROR,
        error: errMsg,
        key: 'tagInfo',
      });
    });
};
export const getVendorData = (orgId) => (dispatch) => {
  dispatch({
    type: LOADING,
    data: 'vendorList',
  });
  axios.get(`${CUSTOMER_MGMT}/org/${orgId}/associated-orgs?type=vendor`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: VENDOR_LIST,
          data: response.data,
          key: 'vendorList',
        });
      }
    }).catch((err) => {
      const errMsg = get(err, 'response.data.errorMessage', err.message);
      dispatch({
        type: ROASTER_ERROR,
        error: errMsg,
        key: 'vendorList',
      });
    });
};

export const postExpectedEmpCount = (
  orgId, siteId, payload, startDate, endDate, loading,
) => (dispatch) => {
  dispatch({
    type: LOADING,
    data: 'empCountPost',
  });
  axios.post(`${ATTENDANCE_URL}/org/${orgId}/site/${siteId}/expected-emp-count`, payload)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: POST_EMP_COUNT,
          data: response.data,
          key: 'empCountPost',
        });
        dispatch(getTotalExpectedEmpCount({
          orgId,
          siteId,
          startDate,
          endDate,
          loading,
        }));
      }
    }).catch((err) => {
      const errMsg = get(err, 'response.data.errorMessage', err.message);
      dispatch({
        type: ROASTER_ERROR,
        error: errMsg,
        key: 'empCountPost',
      });
    });
};

export const getExpectedEmpCount = (orgId, siteId, shiftId, empCountId) => (dispatch) => {
  dispatch({
    type: LOADING,
    data: 'expectedEmpCount',
  });
  axios.get(`${ATTENDANCE_URL}/org/${orgId}/site/${siteId}/shift/${shiftId}/expected-emp-count/${empCountId}`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: GET_EXPECTED_EMP_COUNT,
          data: response.data,
          key: 'expectedEmpCount',
        });
      }
    }).catch((err) => {
      const errMsg = get(err, 'response.data.errorMessage', err.message);
      dispatch({
        type: ROASTER_ERROR,
        error: errMsg,
        key: 'expectedEmpCount',
      });
    });
};

export const deleteExpectedEmpCount = ({
  orgId, siteId, startDate, endDate, assignDates, shiftIds,
}) => (dispatch) => {
  dispatch({
    type: LOADING,
    data: 'deleteExpectedCount',
  });
  axios.post(`${ATTENDANCE_URL}/org/${orgId}/site/${siteId}/expected-emp-count/delete`, { assignDates, shiftIds })
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: DELETE_EXPECTED_COUNT,
          data: response.data,
          key: 'deleteExpectedCount',
        });
        dispatch(getTotalExpectedEmpCount({
          orgId,
          siteId,
          startDate,
          endDate,
        }));
      }
    }).catch((err) => {
      const errMsg = get(err, 'response.data.errorMessage', err.message);
      dispatch({
        type: ROASTER_ERROR,
        error: errMsg,
        key: 'deleteExpectedCount',
      });
    });
};

export const updateRoaster = ({
  orgId,
  siteId,
  shiftIds,
  shiftList,
  assignDates,
  type,
  empIds,
  startDate,
  endDate,
  loading,
  weeklyOffList,
  restDayList,
  leaveList,
  isCopy = false,
}) => (dispatch) => {
  const url = `${ATTENDANCE_URL}/org/${orgId}/site/${siteId}/roster/${type}?isCopy=${isCopy}`;
  dispatch({
    type: LOADING,
    data: loading || 'draft',
  });

  axios.post(url, {
    shiftIds, assignDates, empIds, shiftList, restDayList, weeklyOffList, leaveList,
  }).then(() => {
    dispatch(getEmployee({
      orgId, siteId, startDate, endDate, loading,
    }));
  }).catch((err) => {
    const errMsg = get(err, 'response.data.errorMessage', err.message);
    dispatch({
      type: ROASTER_ERROR,
      error: errMsg,
      key: loading || 'draft',
    });
  });
};

export const applyLeave = ({
  orgId,
  siteId,
  empId,
  startDate,
  endDate,
  loading,
  leaveList,
}) => (dispatch) => {
  const url = `${ATTENDANCE_URL}/org/${orgId}/emp/${empId}/site/${siteId}/apply-leave`;
  dispatch({
    type: LOADING,
    data: loading || 'leave',
  });

  axios.post(url, leaveList).then(() => {
    dispatch(getEmployee({
      orgId, siteId, startDate, endDate, loading,
    }));
  }).catch((err) => {
    const errMsg = get(err, 'response.data.errorMessage', err.message);
    dispatch({
      type: ROASTER_ERROR,
      error: errMsg,
      key: loading || 'leave',
    });
  });
};

export const deleteShiftData = ({
  orgId, siteId, empId, date, id, startDate, endDate,
}) => (dispatch) => {
  dispatch({
    type: LOADING,
    data: 'shiftDelete',
  });
  const url = `${ATTENDANCE_URL}/org/${orgId}/emp/${empId}/site/${siteId}/roster/${id}?date=${date}`;

  axios.delete(url).then(() => {
    dispatch(getEmployee({
      orgId, siteId, startDate, endDate,
    }));
  });
};

export const getEmpShiftAndLeaves = ({
  orgId, siteId, empId, date,
}) => (dispatch) => {
  dispatch({
    type: LOADING,
    data: 'draft',
  });
  const url = `${ATTENDANCE_URL}/org/${orgId}/emp/${empId}/site/${siteId}/shift-leave-details?date=${date}`;
  const quotaUrl = `${ATTENDANCE_URL}/org/${orgId}/emp/${empId}/leave-quota`;
  axios.get(url).then((res) => {
    dispatch({
      type: EMP_SHIFT,
      data: get(res, 'data.shifts', []),
    });
  }).catch(() => {
    dispatch({
      type: LOADING,
      data: null,
    });
  });
  axios.get(quotaUrl).then((res) => {
    dispatch({
      type: EMP_LEAVES,
      data: get(res, 'data.leaves', []),
    });
  }).catch(() => {
    dispatch({
      type: LOADING,
      data: null,
    });
  });
};

export const getEmployeeProfilePic = (urls) => (dispatch) => {
  const allPics = urls.map(({ pic = '' }) => {
    if (pic) return axios.get(`${CUSTOMER_MGMT}/${pic}`, { responseType: 'arraybuffer' });
    return '';
  });

  Promise.all(allPics).then((responses) => {
    const empPics = {};
    responses.forEach((response, index) => {
      if (response) {
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const image = URL.createObjectURL(blob);
        empPics[urls[index].uuid] = image;
      }
    });
    dispatch({
      type: EMP_PIC,
      data: empPics,
    });
  });
};

export const getHolidays = ({ orgId, siteId, year }) => (dispatch) => {
  dispatch({
    type: LOADING,
    data: 'holidays',
  });
  const url = `${ATTENDANCE_URL}/org/${orgId}/holiday-config?year=${year}&tags=${siteId}`;
  axios.get(url).then((res) => {
    dispatch({
      type: GET_HOLIDAYS,
      data: {
        [year]: get(res, 'data', []),
      },
    });
  }).catch(() => {
    dispatch({
      type: LOADING,
      data: null,
    });
  });
};

export const clearRoster = ({
  orgId,
  siteId,
  assignDates,
  empIds,
  startDate,
  endDate,
  loading,
}) => (dispatch) => {
  const url = `${ATTENDANCE_URL}/org/${orgId}/site/${siteId}/roster/clear`;
  dispatch({
    type: LOADING,
    data: loading || 'draft',
  });
  axios.post(url, {
    assignDates, empIds,
  }).then(() => {
    dispatch(getEmployee({
      orgId, siteId, startDate, endDate, loading,
    }));
  }).catch(() => {
    dispatch({
      type: LOADING,
      data: 'close',
    });
  });
};

export const clearError = ({ key }) => (dispatch) => {
  dispatch({
    type: ROASTER_ERROR,
    error: null,
    key,
  });
};

import {
  ADD_EMPLOYEE_FILE,
  EDIT_USER_ERRORS,
  EDIT_USER_LOADING,
  EDIT_USER_PHOTO_LOADING, EMPLOYEE_FILES_ERRORS,
  IS_STAFF,
  REMOVE_EMPLOYEE, REMOVE_EMPLOYEE_FILE,
  REMOVE_USER_ERRORS,
  SET_EMPLOYEE,
  SET_EMPLOYEE_FILES,
  SET_EMPLOYEES,
  SET_USER,
  SUCCESSFUL_EDIT_USER
} from "./actionTypes";
import axios from 'axios';
import {retryRequest} from "../service/utils";
import {setPasswordModal} from "./modals";

export const successfulEditUser = (userId) => {
  return {
    type: SUCCESSFUL_EDIT_USER,
    payload: userId
  };
};

export const editUserErrors = (errors = {}) => {
  return {
    type: EDIT_USER_ERRORS,
    payload: errors
  };
};

export const removeUserErrors = () => {
  return {
    type: REMOVE_USER_ERRORS
  }
};

export const editUserLoading = (bool = false) => {
  return {
    type: EDIT_USER_LOADING,
    payload: bool
  };
};

export const editUserPhotoLoading = (bool = false) => {
  return {
    type: EDIT_USER_PHOTO_LOADING,
    payload: bool
  };
};

export const setUser = (user = null) => {
  return {
    type: SET_USER,
    payload: user
  };
};

export const setEmployees = (employees = null) => {
  return {
    type: SET_EMPLOYEES,
    payload: employees
  };
};

export const setEmployee = (employees = null) => {
  return {
    type: SET_EMPLOYEE,
    payload: employees
  };
};

export const setEmployeeFiles = (employeeFiles = null) => {
  return {
    type: SET_EMPLOYEE_FILES,
    payload: employeeFiles
  }
};

export const removeEmployee = (employeeId = null) => {
  return {
    type: REMOVE_EMPLOYEE,
    payload: employeeId
  };
};

export const isStaff = (bool = false) => {
  return {
    type: IS_STAFF,
    payload: bool
  }
};

export const disableEmployee = (employeeId) => {
  return (dispatch) => {
    axios.delete(`/api/v1/employee/${employeeId}`)
      .then(res => {
        dispatch(removeEmployee(res.data));
      })
  }
};

export const getEmployees = () => {
  return (dispatch) => {
    axios.get('/api/v1/employee')
      .then(res => {
        dispatch(setEmployees(res.data));
      })
      .catch(retryRequest(getEmployees, dispatch)())
  }
};

export const getEmployee = (employeeId, needsLoader = false) => {
  return (dispatch) => {
    dispatch(editUserErrors({}));
    needsLoader && dispatch(setEmployee({}));
    axios.get(`/api/v1/employee/${employeeId}`)
      .then(res => {
        dispatch(setEmployee(res.data));
      })
      .catch(retryRequest(getEmployees, dispatch)())
  }
};

export const employeeFilesErrors = (errors = {}) => {
  return {
    type: EMPLOYEE_FILES_ERRORS,
    payload: errors
  };
};

export const getEmployeeFiles = (employeeId) => {
  return (dispatch) => {
    dispatch(editUserErrors({}));
    axios.get(`/api/v1/employee/${employeeId}/files`)
      .then(res => {
        dispatch(setEmployeeFiles(res.data));
      })
      // .catch(retryRequest(getEmployeeFiles, dispatch)(employeeId))
  }
};

export const addEmployeeFile = (file = {}) => ({
  type: ADD_EMPLOYEE_FILE,
  payload: file
});

export const createEmployeeFile = (employeeId, data) => {
  return (dispatch) => {
    dispatch(employeeFilesErrors({}));
    let formData = new FormData();
    formData.append('file', data.file);
    formData.append('groupId', data.group);
    formData.append('comment', data.comment);
    axios.post(`/api/v1/employee/${employeeId}/files`, formData)
      .then(res => {
        dispatch(addEmployeeFile(res.data));
      })
      .catch(errors => {
        dispatch(employeeFilesErrors((errors.response && errors.response.data.errors) || {non_field_errors: [errors.message]}));
      })
  }
};

export const removeEmployeeFile = (employeeFileId) => ({
  type: REMOVE_EMPLOYEE_FILE,
  payload: employeeFileId
});

export const deleteEmployeeFile = (employeeFileId) => {
  return (dispatch) => {
    axios.delete(`/api/v1/employee/file/${employeeFileId}`)
      .then(({data: {id: employeeFileId}}) => {
        dispatch(removeEmployeeFile(employeeFileId))
      })
  }
};

export const getUser = () => {
  return (dispatch) => {
    dispatch(editUserErrors({}));
    axios.get('/api/v1/me')
      .then(res => {
        dispatch(isStaff(res.data.isStaff));
        dispatch(setUser(res.data));
      })
      .catch(retryRequest(getUser, dispatch)())
  }
};

export const updateUserPhoto = (employeeId, data, currentUserId) => {
  return (dispatch) => {
    dispatch(editUserPhotoLoading(true));
    dispatch(editUserErrors({}));
    let formData = new FormData();
    formData.append('image', data.image);
    axios.patch(`/api/v1/employee/${employeeId}`, formData)
      .then(res => {
        dispatch(removeUserErrors());
        dispatch(setEmployee(res.data));
        if (currentUserId === employeeId) dispatch(setUser(res.data));
      })
      .catch(errors => {
        dispatch(editUserErrors((errors.response && errors.response.data.errors) || {non_field_errors: [errors.message]}));
      })
      .finally(() => dispatch(editUserPhotoLoading(false)))
  }
};

export const updateUser = (employeeId, data, currentUserId) => {
  return (dispatch) => {
    dispatch(editUserLoading(true));
    dispatch(editUserErrors({}));
    axios.patch(`/api/v1/employee/${employeeId}`, data)
      .then(res => {
        dispatch(removeUserErrors());
        dispatch(successfulEditUser(res.data.id));
        dispatch(setEmployee(res.data));
        dispatch(setPasswordModal(false));
        if (currentUserId === employeeId) dispatch(setUser(res.data));
      })
      .catch(errors => {
        dispatch(editUserErrors((errors.response && errors.response.data.errors) || {non_field_errors: [errors.message]}));
      })
      .finally(() => dispatch(editUserLoading(false)))
  }
};

export const changePassword = (password) => (dispatch) => {
  dispatch(editUserLoading(true));
  dispatch(editUserErrors({}));
  axios.put(`/api/v1/me`, password)
    .then(() => {
      dispatch(removeUserErrors());
      dispatch(setPasswordModal(false));
    })
    .catch(errors => {
      dispatch(editUserErrors((errors.response && errors.response.data.errors) || {non_field_errors: [errors.message]}));
    })
    .finally(() => dispatch(editUserLoading(false)))
};
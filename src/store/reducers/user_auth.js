import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegun } from "./api";

import httpService from "../../utils/httpService";

const slice = createSlice({
  name: "user_auth",

  initialState: {
    user_info: {},
    is_authenticated: false,
    last_verified: null,
    access: "",
    refresh: "",
    keep_me_logged_in: false,
    loading: false,
    error: null,
  },

  reducers: {
    user_auth_requested: (user_auth, action) => {
      user_auth.loading = true;
    },

    user_auth_success: (user_auth, action) => {
      user_auth.access = action.payload.access;
      user_auth.refresh = action.payload.refresh;
      user_auth.is_authenticated = true;
      user_auth.loading = false;
      user_auth.error = null;

      localStorage.setItem("access", JSON.stringify(action.payload.access));
      localStorage.setItem("refresh", JSON.stringify(action.payload.refresh));
    },

    user_auth_failed: (user_auth, action) => {
      user_auth.access = null;
      user_auth.refresh = null;
      user_auth.is_authenticated = false;
      user_auth.error = action.payload;
      user_auth.loading = false;

      user_auth.successSignUp && delete user_auth.successSignUp;

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user_info");
    },

    auth_verification_success: (user_auth, action) => {
      user_auth.is_authenticated = true;
      user_auth.last_verified = Date.now();
    },

    auth_verification_failed: (user_auth, action) => {
      user_auth.is_authenticated = false;
      user_auth.last_verified = null;
    },

    user_info_received: (user_auth, action) => {
      user_auth.user_info = action.payload;
      user_auth.loading = false;

      localStorage.setItem("user_info", JSON.stringify(action.payload));
    },

    user_signed_up: (user_auth, action) => {
      user_auth.is_authenticated = false;
      user_auth.successSignUp = true;
      user_auth.user_info = action.payload;
      user_auth.loading = false;

      localStorage.setItem("user_info", JSON.stringify(action.payload));
    },

    user_update_requested: (user_auth, action) => {
      user_auth.loading = true;
    },

    user_updated: (user_auth, action) => {
      user_auth.user_info = action.payload;
      user_auth.loading = false;
      user_auth.error = null;

      localStorage.setItem("user_info", JSON.stringify(action.payload));
    },

    user_update_failed: (user_auth, action) => {
      user_auth.loading = false;
      user_auth.error = action.payload;
    },

    email_change_requested: (user_auth, action) => {
      user_auth.loading = true;
    },

    email_changed: (user_auth, action) => {
      user_auth.emailChangeSuccess = true;
      user_auth.loading = false;

      localStorage.removeItem("user_info");
    },

    email_change_failed: (user_auth, action) => {
      user_auth.error = action.payload;
      user_auth.loading = false;
    },

    password_change_requested: (user_auth, action) => {
      user_auth.loading = true;
    },

    password_changed: (user_auth, action) => {
      user_auth.passwordChangeSuccess = true;
      user_auth.loading = false;
    },

    password_change_failed: (user_auth, action) => {
      user_auth.error = action.payload;
      user_auth.loading = false;
    },

    account_deletion_requested: (user_auth, action) => {
      user_auth.loading = true;
    },

    account_deleted: (user_auth, action) => {
      user_auth.user_info = {};
      user_auth.is_authenticated = false;
      user_auth.access = null;
      user_auth.refresh = null;
      user_auth.error = null;
      user_auth.loading = false;

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user_info");
    },

    account_deletion_failed: (user_auth, action) => {
      user_auth.loading = false;
      user_auth.error = action.payload;
    },

    password_reset_requested: (user_auth, action) => {
      user_auth.loading = true;
    },

    password_reset_request_success: (user_auth, action) => {
      user_auth.loading = false;
      user_auth.successPasswordResetRequest = true;
    },

    password_reset: (user_auth, action) => {
      user_auth.loading = false;
      user_auth.successPasswordReset = true;
    },

    password_reset_failed: (user_auth, action) => {
      user_auth.loading = false;
      user_auth.error = action.payload;
    },

    user_logged_out: (user_auth, action) => {
      user_auth.user_info = {};
      user_auth.is_authenticated = false;
      user_auth.access = null;
      user_auth.refresh = null;
      user_auth.error = null;

      user_auth.successSignUp && delete user_auth.successSignUp;
      user_auth.successPasswordResetRequest &&
        delete user_auth.successPasswordResetRequest;
      user_auth.successPasswordReset && delete user_auth.successPasswordReset;

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user_info");
    },

    error_cleared: (user_auth, action) => {
      user_auth.error = null;
      // user_auth.successSignUp && delete user_auth.successSignUp;
      user_auth.successPasswordResetRequest &&
        delete user_auth.successPasswordResetRequest;
      user_auth.successPasswordReset && delete user_auth.successPasswordReset;
      user_auth.emailChangeSuccess && delete user_auth.emailChangeSuccess;
      user_auth.passwordChangeSuccess && delete user_auth.passwordChangeSuccess;
    },
  },
});

const {
  user_auth_requested,
  user_auth_success,
  user_auth_failed,
  auth_verification_success,
  auth_verification_failed,
  user_info_received,
  user_signed_up,
  user_update_requested,
  user_updated,
  user_update_failed,
  email_change_requested,
  email_changed,
  email_change_failed,
  password_change_requested,
  password_changed,
  password_change_failed,
  account_deletion_requested,
  account_deleted,
  account_deletion_failed,
  password_reset_requested,
  password_reset_request_success,
  password_reset_failed,
  password_reset,
  user_logged_out,
  error_cleared,
} = slice.actions;
export default slice.reducer;

const headers = {
  "Content-Type": "application/json",
};

export const refrestToken = () => async (dispatch) => {
  const refresh = JSON.parse(localStorage.getItem("refresh"));

  if (refresh) {
    const data = { refresh };

    try {
      const response = await httpService.post(
        "/api/auth/jwt/refresh/",
        data,
        headers
      );

      localStorage.setItem("access", JSON.stringify(response.data.access));
      dispatch({ type: "Token Refreshed" });
    } catch (error) {
      dispatch({ type: "Token Refresh Failed", payload: error.response.data });
    }
  } else {
    dispatch({
      type: "Token Refresh Failed",
      payload: "No refresh token found",
    });
  }
};

export const checkAuthentication = () => async (dispatch, getState) => {
  const access = JSON.parse(localStorage.getItem("access"));

  const { lastVerified } = getState().users.user_auth;
  const diffInMinutes = (Date.now() - lastVerified) / (1000 * 60);

  if (diffInMinutes < 10) return;

  if (access) {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const data = { token: access };

    try {
      const response = await httpService.post(
        "/api/auth/jwt/verify/",
        data,
        headers
      );

      if (response.data.code !== "token_not_valid") {
        await dispatch(auth_verification_success());
      }
    } catch (error) {
      dispatch(auth_verification_failed());
      dispatch(logout());
    }
  } else {
    dispatch(auth_verification_failed());
  }
};

export const loadUserInfo = () => async (dispatch, getState) => {
  const access = JSON.parse(localStorage.getItem("access"));
  const localStorageUser = JSON.parse(localStorage.getItem("user_info"));

  const { isAuthenticated, user_info } = getState().users.user_auth;

  if (access && isAuthenticated && user_info?.is_active && localStorageUser?.id)
    return;

  if (access) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
      Accept: "application/json",
    };

    await dispatch(
      apiCallBegun({
        url: "/api/auth/users/me/",
        method: "GET",
        headers,
        onSuccess: user_info_received.type,
      })
    );
  }
};

export const login = (email, password) => async (dispatch) => {
  const body = { email, password };

  await dispatch(
    apiCallBegun({
      url: "/api/users/login/",
      method: "POST",
      data: body,
      headers,
      onStart: user_auth_requested.type,
      onSuccess: user_auth_success.type,
      onError: user_auth_failed.type,
    })
  );

  dispatch(loadUserInfo());
};

export const signup =
  (first_name, last_name, email, password) => async (dispatch) => {
    const body = {
      first_name,
      last_name,
      email,
      password,
      re_password: password,
    };

    await dispatch(
      apiCallBegun({
        url: "/api/auth/users/",
        method: "POST",
        data: body,
        headers,
        onStart: user_auth_requested.type,
        onSuccess: user_signed_up.type,
        onError: user_auth_failed.type,
      })
    );
  };

export const activateAccount = (uid, token) => async (dispatch) => {
  const body = { uid, token };

  await dispatch(
    apiCallBegun({
      url: "/api/users/activate/",
      method: "POST",
      data: body,
      headers,
      onStart: user_auth_requested.type,
      onSuccess: user_auth_success.type,
      onError: user_auth_failed.type,
    })
  );

  dispatch(loadUserInfo());
};

export const resendActivationLink = (email) => async (dispatch) => {
  const body = { email };

  try {
    await httpService.post("/api/auth/users/resend_activation/", body, headers);
    dispatch({ type: "Activation Link Sent" });
  } catch (error) {
    dispatch({ type: "Activation Link Failed" });
  }
};

export const changeEmail =
  (new_email, current_password) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `JWT ${JSON.parse(localStorage.getItem("access"))}`,
    };

    const body = { new_email, re_new_email: new_email, current_password };

    await dispatch(
      apiCallBegun({
        url: "/api/auth/users/set_email/",
        method: "POST",
        data: body,
        headers,
        onStart: email_change_requested.type,
        onSuccess: email_changed.type,
        onError: email_change_failed.type,
      })
    );

    dispatch(loadUserInfo());
  };

export const changePassword =
  (new_password, current_password) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `JWT ${JSON.parse(localStorage.getItem("access"))}`,
    };

    const body = {
      new_password,
      re_new_password: new_password,
      current_password,
    };

    await dispatch(
      apiCallBegun({
        url: "/api/auth/users/set_password/",
        method: "POST",
        data: body,
        headers,
        onStart: password_change_requested.type,
        onSuccess: password_changed.type,
        onError: password_change_failed.type,
      })
    );
  };

export const requestPasswordReset = (email) => async (dispatch) => {
  const body = { email };

  await dispatch(
    apiCallBegun({
      url: "/api/users/reset-password/",
      method: "POST",
      data: body,
      headers,
      onStart: password_reset_requested.type,
      onSuccess: password_reset_request_success.type,
      onError: password_reset_failed.type,
    })
  );
};

export const resetPassword = (uid, token, new_password) => async (dispatch) => {
  const body = { uid, token, new_password, re_new_password: new_password };

  await dispatch(
    apiCallBegun({
      url: "/api/auth/users/reset_password_confirm/",
      method: "POST",
      data: body,
      headers,
      onStart: password_reset_requested.type,
      onSuccess: password_reset.type,
      onError: password_reset_failed.type,
    })
  );
};

export const updateProfile =
  (first_name, last_name, gender, dob) => async (dispatch) => {
    const access = JSON.parse(localStorage.getItem("access"));

    if (access) {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `JWT ${access}`,
      };

      const body = { first_name, last_name, gender, dob };

      await dispatch(
        apiCallBegun({
          url: "/api/users/update-profile/",
          method: "PUT",
          data: body,
          headers,
          onStart: user_update_requested.type,
          onSuccess: user_updated.type,
          onError: user_update_failed.type,
        })
      );

      dispatch(loadUserInfo());
    }
  };

export const deleteAccount = (password) => async (dispatch) => {
  const access = JSON.parse(localStorage.getItem("access"));

  if (access) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
    };

    const body = { current_password: password };

    await dispatch(
      apiCallBegun({
        url: "/api/auth/users/me/",
        method: "DELETE",
        data: body,
        headers,
        onStart: account_deletion_requested.type,
        onSuccess: account_deleted.type,
        onError: account_deletion_failed.type,
      })
    );
  }
};

export const logout = () => (dispatch) => {
  dispatch(user_logged_out());
  //   dispatch(resetUserOrders());
  //   dispatch(resetUserList());
};

export const clearError = () => (dispatch) => {
  dispatch({ type: error_cleared.type });
};

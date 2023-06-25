import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegun } from "./api";

const slice = createSlice({
  name: "user_profile_update",
  initialState: {
    user_info: {},
    loading: false,
    success: false,
    error: null,
  },

  reducers: {
    profile_update_requested: (profile, action) => {
      profile.loading = true;
    },

    profile_update_success: (profile, action) => {
      profile.user_info = action.payload;
      profile.loading = false;
      profile.success = true;
      localStorage.setItem("user_info", JSON.stringify(action.payload));
    },

    profile_update_requestFailed: (profile, action) => {
      profile.error = action.payload;
      profile.loading = false;
    },

    profile_update_resetted: (profile, action) => {
      profile.user_info = {};
    },
  },
});

const {
  profile_update_requested,
  profile_update_success,
  profile_update_requestFailed,
  profile_update_resetted,
} = slice.actions;
export default slice.reducer;

export const updateUserProfile = (user) => (dispatch) => {
  const token = JSON.parse(localStorage.getItem("access"));

  const headers = {
    "Content-Type": "application/json",
    Authorization: `JWT ${token}`,
  };

  dispatch(
    apiCallBegun({
      url: "/api/users/profile/update/",
      method: "put",
      data: user,
      headers,
      onStart: profile_update_requested.type,
      onSuccess: profile_update_success.type,
      onError: profile_update_requestFailed.type,
    })
  );
};

export const resetProfileUpdate = () => (dispatch) => {
  dispatch({ type: profile_update_resetted.type });
};

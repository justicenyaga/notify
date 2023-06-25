import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegun } from "./api";

const slice = createSlice({
  name: "user_details",

  initialState: {
    user: {},
    loading: false,
    error: null,
  },

  reducers: {
    user_details_requested: (user_details, action) => {
      user_details.loading = true;
    },

    user_details_received: (user_details, action) => {
      user_details.user = action.payload;
      user_details.loading = false;
    },

    user_details_requestFailed: (user_details, action) => {
      user_details.error = action.payload;
      user_details.loading = false;
    },

    user_details_cleared: (user_details, action) => {
      user_details.user = {};
      user_details.error = null;
    },
  },
});

const {
  user_details_requested,
  user_details_received,
  user_details_requestFailed,
  user_details_cleared,
} = slice.actions;
export default slice.reducer;

export const getUserDetails = (id) => (dispatch) => {
  const token = JSON.parse(localStorage.getItem("access"));

  const headers = {
    "Content-Type": "application/json",
    Authorization: `JWT ${token}`,
  };

  dispatch(
    apiCallBegun({
      url: `/api/users/${id}/`,
      method: "get",
      headers,
      onStart: user_details_requested.type,
      onSuccess: user_details_received.type,
      onError: user_details_requestFailed.type,
    })
  );
};

export const clearUserDetails = () => (dispatch) => {
  dispatch({ type: user_details_cleared.type });
};

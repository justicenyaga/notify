import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import reducer from "./reducer";
import api from "./middlewares/api";

const userInfoFromLocalStorage = localStorage.getItem("user_info")
  ? JSON.parse(localStorage.getItem("user_info"))
  : {};

const initialState = {
  users: {
    user_auth: { user_info: userInfoFromLocalStorage },
  },
};

export default function () {
  return configureStore({
    reducer,
    preloadedState: initialState,
    middleware: [...getDefaultMiddleware(), api],
  });
}

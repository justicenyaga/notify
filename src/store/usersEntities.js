import { combineReducers } from "redux";
import userAuthReducer from "./reducers/user_auth";

export default combineReducers({
  user_auth: userAuthReducer,
});

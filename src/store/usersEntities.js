import { combineReducers } from "redux";
import userAuthReducer from "./reducers/user_auth";
import userProfileUpdateReducer from "./reducers/user_profile_update";

export default combineReducers({
  user_auth: userAuthReducer,
  user_profile_update: userProfileUpdateReducer,
});

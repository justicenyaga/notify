import { combineReducers } from "redux";
import userAuthReducer from "./reducers/user_auth";
import userProfileUpdateReducer from "./reducers/user_profile_update";
import userDetailsReducer from "./reducers/user_details";

export default combineReducers({
  user_auth: userAuthReducer,
  user_profile_update: userProfileUpdateReducer,
  user_details: userDetailsReducer,
});

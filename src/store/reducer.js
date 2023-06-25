import { combineReducers } from "redux";
import usersEntities from "./usersEntities";

export default combineReducers({
  users: usersEntities,
});

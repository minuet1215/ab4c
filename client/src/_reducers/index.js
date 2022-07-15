// import { combineReducers } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import user from "./user_reducer";
import room from "./room_reducer";

const rootReducer = combineReducers({
  user,
  room,
});

export default rootReducer;

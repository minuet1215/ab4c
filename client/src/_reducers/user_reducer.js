import { LOGIN_USER, REGISTER_USER, AUTH_USER, IS_USER } from "../_actions/types";

export default function user(state = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload };
    case REGISTER_USER:
      return { ...state, registerSuccess: action.payload };
    case AUTH_USER:
      return { ...state, userData: action.payload };
    case IS_USER:
      return { ...state, isUser : action.payload};
    default:
      return state;
  }
}

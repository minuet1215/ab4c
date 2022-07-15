import { ENTER_ROOM } from "../_actions/types";

export default function room(state = {}, action) {
  switch (action.type) {
    case ENTER_ROOM:
      return { ...state, enterRoomSuccess: action.payload };
    default:
      return state;
  }
}

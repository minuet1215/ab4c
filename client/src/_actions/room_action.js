import axios from "axios";
import { ENTER_ROOM } from "./types";

export function enterRoom(dataToSubmit) {
  const request = axios
    .post("/api/rooms/enter", dataToSubmit)
    .then((response) => response.data);

  return {
    type: ENTER_ROOM,
    payload: request,
  };
}

import axios from "axios";

export function loginUser(dataToSubmit) {
  const request = axios.post("/api/user/login", body).then((response) => {
    response.data;
  });

  return { type: "LOGIN_USER", payload: request };
}

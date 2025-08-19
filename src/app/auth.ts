// client/auth.ts
import { client } from "../client/client.gen";

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;

  client.setConfig({
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (token) {
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
  }
};

export const clearAuthToken = () => {
  setAuthToken(null);
};

export const getAuthToken = () => authToken;

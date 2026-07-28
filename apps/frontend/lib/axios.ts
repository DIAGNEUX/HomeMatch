import axios from "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuthRedirect?: boolean;
  }

  export interface InternalAxiosRequestConfig {
    skipAuthRedirect?: boolean;
  }
}

const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (!baseURL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuthRedirect) {
      if (typeof window === "undefined") {
        return Promise.reject(error);
      }

      localStorage.removeItem("access_token");

      const path = window.location.pathname || "";

      if (path.startsWith("/homematch")) {
        window.location.href = "/homematch/login";
      } else if (path.startsWith("/agency")) {
        window.location.href = "/agency-access/login";
      } else {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// api.get("/auth/me");
import axios from "axios";


const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (!baseURL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem("access_token");

        // If we're on the admin area, go to admin login, otherwise public login
        const path = window.location.pathname || "";
        if (path.startsWith("/homematch")) {
          window.location.href = "/homematch/login";
        } else {
          window.location.href = "/login";
        }
    }

    return Promise.reject(error);
  }
);

// api.get("/auth/me")
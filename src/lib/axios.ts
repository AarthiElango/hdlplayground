import { useAuthStore } from "@/store/auth";
import axios from "axios";
import { toast } from "sonner";

// --- Global loader handler callbacks ---
let showLoaderCallback: (() => void) | null = null;
let hideLoaderCallback: (() => void) | null = null;

export const registerLoaderHandlers = (
  showFn: () => void,
  hideFn: () => void
) => {
  showLoaderCallback = showFn;
  hideLoaderCallback = hideFn;
};


const API_URL = import.meta.env.VITE_API_URL
// --- Create Axios instance ---
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Request Interceptor ---
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Show loader unless noLoader flag is passed
    const noLoader =
      (config as any).noLoader === true ||
      config.headers?.["X-No-Loader"] === "true";

    if (!noLoader) {
      showLoaderCallback && showLoaderCallback();
    }

    return config;
  },
  (error: any) => {
    hideLoaderCallback && hideLoaderCallback();
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
api.interceptors.response.use(
  (response: any) => {
    hideLoaderCallback && hideLoaderCallback();
    if(response.data.message){
      toast.success(response.data.message);
    }
    return response;
  },
  (error: any) => {
    hideLoaderCallback && hideLoaderCallback();

    let message = "Something went wrong.";

    const data = error.response?.data;
    if (data?.jwt) {
      useAuthStore.getState().logout;
      localStorage.clear();
      console.log('logout called')
      window.location.reload();
      return;
    }
    if (data) {
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        message = data.errors.join(", ");
      } else if (typeof data.error === "string") {
        message = data.error;
      } else if (typeof data.message === "string") {
        message = data.message;
      }
    }

    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;

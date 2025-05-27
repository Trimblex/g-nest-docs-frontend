import axios, { InternalAxiosRequestConfig } from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 80000,
});

export default instance;

let requestQueue: InternalAxiosRequestConfig<any>[] = [];

const addRequestQueue = (config: InternalAxiosRequestConfig<any>) => {
  requestQueue.push(config);
};

const removeRequestQueue = (config: InternalAxiosRequestConfig<any>) => {
  requestQueue = requestQueue.filter(
    (item: InternalAxiosRequestConfig<any>) => item !== config
  );
};

const isRepeatRequest = (config: InternalAxiosRequestConfig<any>) => {
  return requestQueue.includes(config);
};

instance.interceptors.request.use(
  (config) => {
    if (isRepeatRequest(config)) {
      return Promise.reject(new Error("请勿重复提交"));
    }
    addRequestQueue(config);

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    removeRequestQueue(response.config);
    return response.data;
  },
  (error) => {
    removeRequestQueue(error.config);
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log("请重新登录");
          break;
        case 404:
          console.log("请求的资源不存在");
          break;
        default:
          console.log("服务器错误");
      }
    }
    return Promise.reject(error);
  }
);

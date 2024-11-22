import Axios, { AxiosResponse } from "axios";
import { IJsonResponse } from "./types";

export const axios = Axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  withCredentials: true,
});

export const colors = {
  primary: "#6d28d9",
};

axios.interceptors.response.use((res: AxiosResponse<IJsonResponse>) => {
  const url = window.location.href.split("/");
  if (res.data.status === 401 && url.includes("home"))
    window.location.replace("/login");
  return res;
});

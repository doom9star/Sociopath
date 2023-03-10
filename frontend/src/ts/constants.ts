import Axios, { AxiosResponse } from "axios";
import { IJsonResponse } from "./types";

export const serverURL = "http://localhost:5000";
export const axios = Axios.create({
  baseURL: serverURL,
  withCredentials: true,
});

axios.interceptors.response.use((res: AxiosResponse<IJsonResponse>) => {
  const url = window.location.href.split("/");
  if (res.data.status === 401 && url.includes("home"))
    window.location.replace("/login");
  else return res;
});

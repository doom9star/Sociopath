import { AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { axios } from "../ts/constants";
import { FeedType, IJsonResponse, IPost, WorldPostType } from "../ts/types";

export function useFeed<TData = IPost[]>(
  pid: string,
  type: FeedType,
  wpt?: WorldPostType
) {
  const options = useQuery(wpt ? [pid, type, wpt] : [pid, type], async () => {
    const { data }: AxiosResponse<IJsonResponse<TData>> = await axios.get(
      `/api/post/${pid}/${type}/${wpt}`
    );
    return data.body;
  });

  return options;
}

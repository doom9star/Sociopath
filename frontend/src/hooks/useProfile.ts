import { axios } from "../ts/constants";
import { IProfile } from "../ts/types";
import { IJsonResponse } from "../ts/types";
import { useQuery } from "react-query";

export function useProfile(pid: string) {
  const options = useQuery([pid, "profile"], async () => {
    const { data } = await axios.get<IJsonResponse<IProfile>>(
      `/api/profile/${pid}`
    );
    return data.body;
  });

  return options;
}

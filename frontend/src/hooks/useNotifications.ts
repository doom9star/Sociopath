import { useQuery } from "react-query";
import { axios } from "../ts/constants";
import { IJsonResponse, INotification } from "../ts/types";

export function useNotifications() {
  const options = useQuery("notifications", async () => {
    const { data } = await axios.get<IJsonResponse<INotification[]>>(
      `/api/misc/notifications`
    );
    return data.body;
  });

  return options;
}

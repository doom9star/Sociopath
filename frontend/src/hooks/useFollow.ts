import { useMutation, UseMutationResult, useQueryClient } from "react-query";
import { axios } from "../ts/constants";
import { IJsonResponse, IProfile } from "../ts/types";
import produce from "immer";

interface IVariables {
  value: 1 | -1;
  pid: string;
}

type TFn = (
  onSuccess?: (data: IVariables) => void
) => UseMutationResult<IVariables, unknown, IVariables, unknown>;

export const useFollow: TFn = (onSuccess?: (data: IVariables) => void) => {
  const client = useQueryClient();
  const options = useMutation(
    "follow",
    async ({ pid, value }: IVariables) => {
      const { data } = await axios.put<IJsonResponse<IVariables>>(
        `/api/profile/follow/${pid}/${value}`
      );
      return data.body;
    },
    {
      onSuccess: (body) => {
        client.setQueryData(["me", "profile"], (old: any) => ({
          ...old,
          following: old.following + body.value,
        }));
        client.refetchQueries(["me", "protected"]);
        if (client.getQueryData([body.pid, "profile"])) {
          client.setQueryData<IProfile>([body.pid, "profile"], (old) =>
            produce(old!, (draft) => {
              draft.followers = draft.followers + body.value;
              draft.isFollowing = !draft.isFollowing;
            })
          );
        }
        onSuccess && onSuccess(body);
      },
    }
  );
  return options;
};
